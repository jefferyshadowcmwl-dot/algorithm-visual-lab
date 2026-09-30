#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
deploy_github.py —— 把本站点部署到 GitHub（走 API，不依赖 github.com 主域）。

为什么不用 `git push`：
    这台机器上 **github.com 主域被拦**（连续探 5 次全超时；`gh auth login` 打的
    `login/oauth/access_token` 与 `login/device` 两个端点也全超时），
    但 `api.github.com` 稳定可达 —— 于是改走 REST API：
    建仓库 → 用 Git Data API 一次性提交全部文件 → 开启 Pages。
    git 的 push 通道留给你到能访问 github.com 的网络时再用（remote 会自动配好）。

用法：
    python deploy_github.py <token 文件路径> [--repo 名字]

    token 文件里**只放那一串 token**（别带引号、别带别的字）。
    需要的是 classic token 且勾了 **repo** 权限（细粒度 token 请给 Contents: read+write、
    Pages: read+write、Administration: read+write）。

安全约定：
    * 脚本**绝不打印 token**（只打印它的长度与所属账号）；
    * token 只放在请求头里，不写进任何文件、不配进 git config；
    * 跑完请删掉 token 文件（脚本会提醒；加 --shred 则自动删）。
"""

import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

API = "https://api.github.com"
UA = "algorithm-visual-lab-deploy"
SKIP_DIRS = {".git", "__pycache__", ".idea"}
SKIP_SUFFIX = (".pyc", ".stackdump")


def call(method, path, token, data=None, tries=4, quiet=False):
    """调 API，返回 (状态码, 响应体 dict)。网络抖动时自动重试（指数退避）。"""
    body = json.dumps(data).encode("utf-8") if data is not None else None
    last = None
    for k in range(tries):
        req = urllib.request.Request(API + path, data=body, method=method)
        req.add_header("Authorization", "Bearer " + token)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", UA)
        if body is not None:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                raw = resp.read()
                return resp.status, (json.loads(raw) if raw else {})
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                payload = json.loads(raw) if raw else {}
            except ValueError:
                payload = {"message": raw[:200].decode("utf-8", "replace")}
            # 4xx 是我们的错（权限/参数），不重试；5xx / 429 才重试
            if e.code < 500 and e.code != 429:
                return e.code, payload
            last = (e.code, payload)
        except Exception as e:                       # 网络层抖动
            last = (0, {"message": "%s: %s" % (type(e).__name__, e)})
        if not quiet:
            print("    · 第 %d 次失败（%s），%.1fs 后重试" % (k + 1, last[1].get("message", "")[:60], 2 ** k), flush=True)
        time.sleep(2 ** k)
    return last


def walk_files(root):
    """遍历要上传的文件。

    【安全】额外挡一层"像密钥的文件"：万一你把 token 存到了仓库目录里，
    绝不能顺手把它传上公开仓库（知识库《资源改名与引用失效》那条的同类教训：
    "隐私文件即使页面不引用，git add . 照样推上公开仓库"）。
    """
    suspicious = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            low = fn.lower()
            if fn.endswith(SKIP_SUFFIX):
                continue
            if (low.startswith("token") or low.endswith((".token", ".key", ".pem", ".env"))
                    or "secret" in low or "credential" in low):
                suspicious.append(os.path.relpath(os.path.join(dirpath, fn), root))
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace("\\", "/")
            yield rel, full
    if suspicious:
        print("[!] 注意：以下文件看着像密钥，已**跳过不上传**：", flush=True)
        for s in suspicious:
            print("      " + s, flush=True)


def preflight(login, repo, token):
    """部署前把"缺什么权限"一次性问清楚，别等传完 29 个文件才失败。"""
    print("\n— 预检 —", flush=True)
    code, info = call("GET", "/repos/%s/%s" % (login, repo), token)
    print("  [1] 读仓库            HTTP %s  %s" % (code, info.get("message", "")), flush=True)
    if code != 200:
        print("      → 仓库还不存在，或这个 token 访问不到它。", flush=True)
        print("        请去浏览器建一个**空的公开仓库**（https://github.com/new）：", flush=True)
        print("          名字 = %s ；选 Public ；**不要**勾 Add README / .gitignore / license" % repo, flush=True)
        print("        并确认 token 的 Repository access 里包含它（fine-grained token 要显式添加）", flush=True)
        return False
    code, blob = call("POST", "/repos/%s/%s/git/blobs" % (login, repo), token,
                      {"content": base64.b64encode(b"preflight").decode("ascii"),
                       "encoding": "base64"}, quiet=True)
    print("  [2] 写文件 Contents:write  HTTP %s  %s"
          % (code, blob.get("message", "")[:70]))
    if code == 409:
        print("      → 权限没问题（409「Git Repository is empty」是空仓库的怪脾气：", flush=True)
        print("        Git Data API 在空仓库上不能用，脚本会先用 Contents API 种一个初始提交）", flush=True)
    elif code not in (200, 201):
        print("      → 需要 repo 的 **Contents: Read and write** 权限", flush=True)
    code, pg = call("GET", "/repos/%s/%s/pages" % (login, repo), token, quiet=True)
    print("  [3] 读 Pages          HTTP %s  %s"
          % (code, str(pg.get("status") or pg.get("message", ""))[:70]))
    print("  （[3] 返回 404 只是「还没开启」，正常；若报权限不足，就得有 Pages: Read and write）", flush=True)
    return code in (200, 404)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__, flush=True)
        return 2
    token_path = args[0]
    repo = "algorithm-visual-lab"
    if "--repo" in sys.argv:
        repo = sys.argv[sys.argv.index("--repo") + 1]
    shred = "--shred" in sys.argv
    only_preflight = "--preflight" in sys.argv

    if not os.path.isfile(token_path):
        print("[!] 找不到 token 文件：" + token_path, flush=True)
        return 2
    token = open(token_path, encoding="utf-8").read().strip()
    if not token or " " in token or len(token) < 20:
        print("[!] token 文件内容不像 token（长度 %d）。里面应当**只有**那一串字符。" % len(token), flush=True)
        return 2
    print("token：%d 字符（不打印内容）" % len(token), flush=True)

    root = os.path.dirname(os.path.abspath(__file__))

    # 1) 我是谁
    code, me = call("GET", "/user", token)
    if code != 200:
        print("[!] 认证失败 HTTP %s：%s" % (code, me.get("message")), flush=True)
        print("    常见原因：token 过期 / 权限不够（classic 需要勾 repo）", flush=True)
        return 1
    login = me["login"]
    print("账号：" + login, flush=True)

    if only_preflight:
        ok = preflight(login, repo, token)
        return 0 if ok else 1

    # 2) 仓库（不存在就建）
    code, info = call("GET", "/repos/%s/%s" % (login, repo), token)
    if code == 200:
        print("仓库已存在：" + info["html_url"], flush=True)
    elif code == 404:
        code, info = call("POST", "/user/repos", token, {
            "name": repo,
            "description": "10 道经典算法题：详细题解 + 可交互动画 + 可复制的去注释源码",
            "homepage": "https://%s.github.io/%s/" % (login, repo),
            "private": False, "has_issues": True, "has_wiki": False,
            "has_projects": False})
        if code not in (200, 201):
            print("[!] 建仓库失败 HTTP %s：%s" % (code, info.get("message")), flush=True)
            # fine-grained token 建不了仓库 —— 这不是脚本的问题，把该做的动作说清楚
            print("    fine-grained token **没有创建仓库的权限**（这是 GitHub 的限制）。", flush=True)
            print("    请在浏览器里建一个**空的公开仓库**再重跑本脚本：", flush=True)
            print("      https://github.com/new  →  名字 %s  →  Public  →  不勾任何初始化文件" % repo, flush=True)
            print("    并确认 token 的 Repository access 包含它（可事后在 token 设置里 Add repository）。", flush=True)
            print("    或改用 classic token（勾 repo 权限）—— 那个能一键建仓库 + 开 Pages。", flush=True)
            return 1
        print("已创建公开仓库：" + info["html_url"], flush=True)
    else:
        print("[!] 查询仓库失败 HTTP %s：%s" % (code, info.get("message")), flush=True)
        return 1

    # 3) 先确认有一个父提交（空仓库要先种一个，否则 Git Data API 返回 409）
    code, refinfo = call("GET", "/repos/%s/%s/git/ref/heads/main" % (login, repo), token)
    if code == 200:
        base_sha = refinfo["object"]["sha"]
        print("基于已有 main 提交：%s" % base_sha[:10], flush=True)
    else:
        seed = base64.b64encode(
            "# algorithm-visual-lab\n\n（初始提交，随后由部署脚本覆盖）\n"
            .encode("utf-8")).decode("ascii")
        code, s = call("PUT", "/repos/%s/%s/contents/README.md" % (login, repo), token,
                       {"message": "chore: 初始化仓库", "content": seed, "branch": "main"})
        if code not in (200, 201):
            print("[!] 初始化空仓库失败 HTTP %s：%s" % (code, s.get("message")), flush=True)
            return 1
        base_sha = s["commit"]["sha"]
        print("空仓库已初始化（种下首个提交 %s）" % base_sha[:10], flush=True)

    # 4) 全部文件 -> blobs（base64）
    files = list(walk_files(root))
    print("待上传 %d 个文件…" % len(files), flush=True)
    tree, total = [], 0
    for idx, (rel, full) in enumerate(files, 1):
        raw = open(full, "rb").read()
        total += len(raw)
        code, blob = call("POST", "/repos/%s/%s/git/blobs" % (login, repo), token,
                          {"content": base64.b64encode(raw).decode("ascii"),
                           "encoding": "base64"}, quiet=True)
        if code not in (200, 201):
            print("[!] 上传 %s 失败 HTTP %s：%s" % (rel, code, blob.get("message")), flush=True)
            return 1
        tree.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        # 每 5 个报一次进度：几十个文件的循环里，否则外面完全看不到动静（本轮实测干等过）
        if idx % 5 == 0 or idx == len(files):
            print("  已上传 %d/%d 个文件（%.1f KB）" % (idx, len(files), total / 1024.0), flush=True)
    print("  已上传 %.1f KB" % (total / 1024.0), flush=True)

    # 4) tree -> commit -> ref（一次性提交，语义与本地那次 commit 一致）
    code, tr = call("POST", "/repos/%s/%s/git/trees" % (login, repo), token, {"tree": tree})
    if code not in (200, 201):
        print("[!] 建 tree 失败：%s" % tr.get("message"), flush=True)
        return 1
    # 提交信息**取本地最新那条 commit**，别在这里写死 ——
    # 早先写死了一句"站点：10 道算法题的详解…"，结果线上两次部署（wiki、
    # 深色动画）的提交信息都是同一句，与内容不符（实测发现）。
    try:
        msg = subprocess.check_output(["git", "log", "-1", "--pretty=%B"],
                                      cwd=root, stderr=subprocess.DEVNULL)
        msg = msg.decode("utf-8", "replace").strip()
    except Exception:
        msg = ""
    if not msg:
        msg = "站点内容更新（经 API 上传，本机 github.com 被拦）"
    msg += "\n\n（本机 github.com 走不通，经 api.github.com 上传；见 README 的部署说明）"
    code, commit = call("POST", "/repos/%s/%s/git/commits" % (login, repo), token,
                        {"message": msg, "tree": tr["sha"], "parents": [base_sha]})
    if code not in (200, 201):
        print("[!] 建 commit 失败：%s" % commit.get("message"), flush=True)
        return 1
    code, ref = call("POST", "/repos/%s/%s/git/refs" % (login, repo), token,
                     {"ref": "refs/heads/main", "sha": commit["sha"]})
    if code not in (200, 201):
        # 分支已存在 -> 强制指过去（重复部署时）
        code, ref = call("PATCH", "/repos/%s/%s/git/refs/heads/main" % (login, repo),
                         token, {"sha": commit["sha"], "force": True})
    if code not in (200, 201):
        print("[!] 建分支失败：%s" % ref.get("message"), flush=True)
        return 1
    print("已提交到 main：" + commit["sha"][:10], flush=True)

    # 5) 开启 Pages
    code, pg = call("POST", "/repos/%s/%s/pages" % (login, repo), token,
                    {"source": {"branch": "main", "path": "/"}})
    if code in (200, 201):
        print("已开启 GitHub Pages", flush=True)
    elif code == 409:                                  # 已开启过 -> 更新源
        code, pg = call("PUT", "/repos/%s/%s/pages" % (login, repo), token,
                        {"source": {"branch": "main", "path": "/"}})
        print("Pages 早已开启，已更新源" if code in (200, 204) else
              "[!] 更新 Pages 源失败：%s" % pg.get("message"))
    else:
        print("[!] 开启 Pages 失败 HTTP %s：%s" % (code, pg.get("message")), flush=True)
        print("    （你的 token 可能缺少 Pages 权限；也可去 Settings → Pages 手动开一次）", flush=True)

    url = "https://%s.github.io/%s/" % (login, repo)
    print("\n仓库：" + info["html_url"], flush=True)
    print("站点：" + url, flush=True)

    # 6) 等 Pages 构建（首次通常 30~90 秒）
    print("\n等 Pages 构建…（api.github.com 可达，github.io 也可达，所以这里能验）", flush=True)
    for k in range(20):
        time.sleep(8)
        code, st = call("GET", "/repos/%s/%s/pages" % (login, repo), token, quiet=True)
        status = st.get("status") if code == 200 else "?"
        print("  [%2d] Pages 状态：%s" % (k + 1, status), flush=True)
        if status == "built":
            break

    print("\n请自行在浏览器里打开站点确认：%s" % url, flush=True)
    if shred:
        os.remove(token_path)
        print("（已按 --shred 删除 token 文件：%s）" % token_path, flush=True)
    else:
        print("提醒：请自行删除 token 文件 %s（或下次加 --shred 让它自动删）" % token_path, flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
