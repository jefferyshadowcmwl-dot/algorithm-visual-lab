# -*- coding: utf-8 -*-
"""
wiki_data.py —— 站点的「知识实体」数据（手写，构建时被 build_site.py 读取）。

三张表：
  CATEGORIES  分类（把 10 道题按主线算法归类）
  CONCEPTS    概念（每条都有：定义 + 要点 + 关联题目**反链** + 相关概念）
              概念之间的 `see` 互指 + 题目 → 概念 → 题目的跳转，就是「互相联动」的骨架。
  SNIPPETS    可复用代码片段（每条列出用到它的题目）

约定：`problems` 里写题目 slug，必须与 build_site.py 的 PROBLEMS 表一致；
      build_site.py 会**反向核对**（概念里列了某题，那题的详解正文里应当出现它的关键词），
      对不上就在 verify_site.py 里报出来 —— 免得这里的反链和正文各说各话。
"""

# ---------------------------------------------------------------- 分类
CATEGORIES = [
    ("greedy", "贪心", "每一步都做当前最优的选择，并证明它不会后悔。",
     ["cross-river", "cards", "merge-fruit", "interval-cover", "horse-race"]),
    ("dp", "动态规划", "把大问题拆成重叠子问题，存表复用；关键是状态定义与转移方向。",
     ["triangle", "lcs", "knapsack"]),
    ("dsu", "并查集", "维护「谁和谁是一伙的」：路径压缩 + 按大小合并。",
     ["components"]),
    ("number-theory", "数论", "在模运算里做文章：能不造大数就不造，只留余数。",
     ["repunit", "mod11"]),
    ("two-pointers", "排序 + 双指针", "先排序把无序变有序，再用单调性把 O(n²) 降到 O(n)。",
     ["min-diff"]),
    ("combinatorics", "组合数学", "数方案数：卡特兰数、递推、以及「小规模预处理 + 查询 O(1)」。",
     ["catalan", "tickets"]),
]

# ---------------------------------------------------------------- 概念
# id, 标题, 一句话定义, 正文（含要点列表）, 关联题目 slug, 相关概念 id
CONCEPTS = [
    ("eof", "多组数据 · EOF 结束",
     "题面不说有几组，就一直读到文件结尾（readline 返回空串）为止。",
     ["最常见的一种输入形态。判据是「确实 AC 过的代码」里写的 `while (cin >> n)` / "
      "`while (scanf(...) != EOF)`。",
      "本仓库踩过最贵的一课：题面写「若干组」、而找到的参考代码只读一组，于是误判成单组 → 多组数据只回一个答案 → 必 WA。",
      "配套的读法统一用 `readline()` 逐行读（不用 `read()`：终端里要等到 EOF 才返回，看起来像卡死）。"],
     ["cards", "knapsack", "components", "min-diff", "catalan", "merge-fruit",
      "interval-cover", "horse-race", "tickets"], []),
    ("sentinel", "哨兵结束（N=0）",
     "读到某个特定值（常见是 0）就停，而不是读到文件结尾。",
     ["数字三角形用 `H=0` 结束；均分纸牌的 `N=0` 则是**非法数据**（会被 0 除）。",
      "⚠️ 同一本习题集里三种结束方式都出现过：**EOF / 哨兵 / 给定组数**。做题前先确定是哪一种，"
      "不要拿上一题的习惯套下一题。"],
     ["triangle"], ["eof", "t-cases"]),
    ("t-cases", "给定 T 组",
     "第 1 行先给组数 T，随后读满 T 组就停。",
     ["长这样：`3` 后面跟 3 组数据；输出通常每组一行。",
      "⚠️ 别和 LCS 混：LCS 也是 T 组，但它**每组输出 2 行**（先 `Case i` 再答案）—— 行数必须逐题核对。",
      "收尾若想检查「有没有多余数据」，**只能查缓冲区、绝不能再 readline()**：终端里那会一直等你敲键盘。"
      "（`11的余数` 先确立的做法，`n 个 1` 是踩过一次才改过来的。）"],
     ["lcs", "repunit", "mod11"], ["eof", "sentinel", "batch-output"]),
    ("blank-line", "图与图之间空一行",
     "排版用的空行不是语法，读入时应当被当成不存在。",
     ["连通分支数的多个图之间空了一行。token 化的读取器天然吞掉空行（空行 `split()` 后是空列表，循环会继续读下一行）。",
      "反例：退回「按行硬读」（`readline()` 读 n e、再 `readline()` 读 e 行边）就会撞上空行 —— `int()` 直接 ValueError。"],
     ["components"], ["reader"]),
    ("reader", "统一的输入读取器",
     "一个逐行取 token 的小函数，终端 / PyCharm / OJ 三种环境都对。",
     ["做法：`readline()` 逐行读 → `line.split()` 拆 token 入缓冲 → 缓冲空时再读下一行。",
      "⚠️ 取 token 必须用「反序入栈 + `pop()`」：`buf.pop(0)` 每次 memmove 整个列表，"
      "几十万 token 挤在同一行时读取退化成 O(k²)（实测 10 万条边挤一行：28.8 秒 vs 0.147 秒）。",
      "⚠️ 不要用 `sys.stdin.read()`，也不要用 `isatty()` 分流 —— PyCharm 的运行窗口 stdin 不是真 tty，会踩空。"],
     ["cards", "triangle", "lcs", "knapsack", "components", "min-diff", "repunit", "mod11",
      "catalan", "cross-river", "merge-fruit", "interval-cover", "horse-race", "tickets"],
     ["eof", "tail-newline"]),
    ("batch-output", "攒完一起输出",
     "T 组题读满 T 组、全部算完之后，一次性把答案打出来。",
     ["好处一：终端里输入与输出不再交错，读起来清爽。",
      "好处二：中途遇到坏数据直接 return，**stdout 一个字节都没写过** —— 不会出现「前几组答案已打出去、后面才报错」的半截输出。",
      '行尾换行照旧要补（`"\n.join(out) + "\n`），等价于 `cout << ans << endl`。"'],
     ["repunit", "mod11"], ["t-cases", "tail-newline"]),
    ("tail-newline", "行尾换行与 stdout 纯净",
     "每组输出一行、行尾必须有换行；错误信息一律走 stderr。",
     ['`sys.stdout.write("\n.join(out))` 最后一行没有换行，与 `cout << ans << endl` 差一个字节 ——"'
      "严格逐字节比对的 OJ 直接判 WA。",
      "错误/提示必须打到 stderr 并带 `[!]` 前缀；stdout 只留答案。"],
     ["cards", "triangle", "lcs", "knapsack", "components", "min-diff", "repunit", "mod11",
      "catalan", "cross-river", "merge-fruit", "interval-cover", "horse-race", "tickets"],
     ["reader", "batch-output"]),
    ("no-bigint", "别把大数真造出来",
     "上千位的数不要真的构造，只留它除以 m 的余数。",
     ['n 个 1 的答案可达 9972 位：造出来又慢又占地方；而 `int("1" * n)` 还会撞上'
      "**Python 3.11+ 的 4300 位 int↔str 转换限制**，直接抛 ValueError。",
      "修法：逐位累乘 `v = v * 10 + 1` 构造（不经过字符串），或者干脆只维护余数。",
      "11 的余数同理：80 位的数在 C 里 `long long` 装不下，只能按字符串逐位处理。"],
     ["repunit", "mod11", "tickets"], ["mod-9m", "loop-bound"]),
    ("mod-9m", "模 9m，不是模 m",
     "把 A_n = 11…1 的整除判据写对，需要同乘 9 把分母消掉。",
     ["`A_n = (10^n − 1) / 9`，所以 `A_n ≡ 0 (mod m)` 等价于 `10^n ≡ 1 (mod 9m)`。",
      "写成模 m 会错：m=3 时 `ord_3(10)=1` 会答 1，而 A_1=1 根本不被 3 整除，正解是 **3**（111=3×37）；"
      "m=9 同理，正解是 **9**。",
      "这条是本仓库的锚定用例（`1/3 → 3`、`1/9 → 9`），专门钉死「漏掉那个 9」的实现。"],
     ["repunit"], ["no-bigint", "minimality"]),
    ("minimality", "最小性要全局核",
     "「求最小的 k」这类题，「只比前一项」是局部检查，验不出最小。",
     ["反例：m=3、n=6 时 A_6 能被 3 整除、A_5 不能，可真正的最小值是 **3**。只比 A_{n-1} 会对着错答案报 OK。",
      "正解：从 1 一路核到 n，记下**第一个**能整除的位置，要求它等于 n。",
      "这是「恒真/装饰性断言」的一族：看着在检查，其实永远打不掉任何变异。"],
     ["repunit"], ["mutation-testing"]),
    ("negative-pile", "方案可执行性（负数堆）",
     "详细版给出的操作步骤必须物理上真能做出来。",
     ["均分纸牌：`piles[i+1] -= amount` 会把下一堆扣成**负数** —— 数学上是差额记账，实际搬不出来。",
      "样例 `9 8 17 6` 恰好每步右边都够，把 bug 藏了很久；锚定用例 `3 / 0 0 9` 一测就露。",
      "修法：先按 i 递减搬运所有**向左**的流，再按 i 递增搬运所有**向右**的流。"],
     ["cards"], ["mutation-testing"]),
    ("reverse-capacity", "容量维必须倒序",
     "0/1 背包里容量维正序遍历，等于允许同一件物品反复拿 —— 那是完全背包。",
     ["`for j in range(cap, w-1, -1)`：倒序保证 `dp[j-w]` 读到的还是「上一件物品处理完」的值。",
      "锚定：`v=[5], w=[3], c=10` 必须是 **5**；正序会得 15。",
      "顺带记：0 初始化只适用于「容量不超过 c」；若问「恰好装满 c」，必须用 -inf 初始化。"],
     ["knapsack"], ["mutation-testing"]),
    ("priority-queue", "小根堆 / 优先队列",
     "每次都能 O(log n) 取出最小值的数据结构，把「反复取最小」从 O(n²) 压到 O(n log n)。",
     ["合并果子每轮都要取当前**最小的两堆**：朴素做法每轮扫一遍是 O(n²)，换成小根堆就是 O(n log n)。",
      "堆不是排序数组 —— 用一个数组存完全二叉树，只保证「父 ≤ 子」。建堆可以一次线性做完："
      "从最后一个非叶结点往前逐个下沉。",
      "⚠️ **升序数组本身满足堆序**，所以「建堆那一步坏掉」这个错在排序过的测试数据上完全暴露不出来 —— "
      "必须用乱序数据测，或者直接对拍堆结构本身（本仓库的合并果子就是被变异测试 D4 逼出这条的）。",
      "贪心为什么对（交换论证）：总耗费 = Σ(每堆重量 × 它在哈夫曼树里的深度)。"
      "若最优树里最深的两个叶子不是最小的两堆，把它们对调只会更优 —— 矛盾。"],
     ["merge-fruit"], ["reader", "mutation-testing"]),
    ("self-loop", "自环与重边不减分支数",
     "并查集里，只有两端点**本来不同支**的边才会让分支数减 1。",
     ["自环 `(1,1)`、重边、成环这几种边都是「白扫」的：find 出来同一个根，直接跳过。",
      "锚定：`2 1 / 1 1` 必须输出 **2**（写成「每扫一条边分支数就减 1」会得 1）。",
      "另一条锚定更隐蔽：`3 1 / 1 2` 必须输出 **2** —— 孤立顶点自己算一支，别只数「出现在边里的顶点」。"],
     ["components"], []),
    ("out-of-range", "越界宁可中止也不错答",
     "输入不合法时，宁可停止输出，也不能把伪答案打进 stdout。",
     ["典型翻车：越界时写 `continue`，后面的数字会被当成下一个 N，于是把**伪答案**打进 stdout。",
      "修法：打 `[!]` 到 stderr 后 `return`（中止），绝不错答。",
      "另外：读到一半 EOF 时，已经算出来的那几组答案该保留就保留（逐组输出的题）——"
      "或者像 n 个 1 那样「攒完一起输出」，此时 stdout 还是干净的。"],
     ["cards", "triangle", "lcs", "knapsack", "components", "min-diff", "repunit", "mod11",
      "catalan", "cross-river", "merge-fruit", "interval-cover", "horse-race", "tickets"],
     ["tail-newline"]),
    ("negative-value", "dp 不能用 0 初始化",
     "数据里可能有负数时，用 0 当初始值会污染答案。",
     ["数字三角形的数字可能是负的：锚定 `1 / -7 / 0` 必须输出 **-7**；若 dp 用 0 初始化会得 0。",
      "凡「求最大/最小」且值域含负数的 DP，初始值要取 -inf / +inf 或直接用真实数据初始化。"],
     ["triangle"], []),
    ("index-independent", "下标互相独立",
     "两个数组各取一个元素时，i 与 j 未必要求相同。",
     ["最小差：求 `|A[i] − B[j]|` 最小，i、j 各自独立。锚定 `A=[1,100,101] B=[100,101,200]` 应为 **0**；"
      "若误以为要「同下标比」，会得 1。",
      "另一处细节：比的是绝对值 —— 锚定 `A=[-20] B=[4]` 应为 **24**，直接比差会得 −24。"],
     ["min-diff"], ["two-pointers"]),
    ("two-pointers", "排序 + 双指针单调性",
     "先排序，再用「某个元素已经没机会了」来安全地丢掉它。",
     ["最小差：A、B 各自升序后 i=j=0，比较 `A[i]−B[j]`：小于 0 就推 i、大于 0 就推 j，每步恰好推一个 → 最多 2n 步。",
      "为什么敢丢：B 升序 ⇒ 对方往后只会更大，配当前这个偏小的元素只会越差越远。"],
     ["min-diff"], ["index-independent"]),
    ("loop-bound", "循环要有上界",
     "「求最小的 k 使 …」这类题，循环必须能证明一定终止。",
     ["n 个 1：`gcd(m,10)=1` ⇒ 10 在模 9m 的乘法群里有阶，`n = ord_{9m}(10)` 必存在且整除 φ(9m) ≤ 9m ——"
      "所以上界取 `9m+2` 是**可证安全**的，同时也兜住了「数据不合法时死循环」。"],
     ["repunit"], ["mod-9m"]),
    ("small-preprocess", "小规模预处理 + 查询 O(1)",
     "多组查询同一张小表时，先把表算好，每组只查表。",
     ["车厢调度：先把 Cat(0..18) 一次算好（O(MAXN)），每组查询直接查表 O(1)。",
      "n ≤ 18 时 `Cat(18)=477638700`，32 位整数装得下。"],
     ["catalan"], []),
    ("mutation-testing", "变异测试：给断言做体检",
     "把代码**故意改回错的**，验证脚本必须报错 —— 打不掉任何变异的断言等于没写。",
     ["做法：每次只改一处（锚点文本替换）→ 跑验证脚本 → 必须 FAIL → 立刻还原 → 最后再跑一遍确认仍全绿。",
      "⚠️ 判「抓到」不能只看返回码：验证脚本**自己崩了**也是非零 —— 那属于伪阳性，要求输出里有明确的 FAIL 标记。",
      "本仓库实例：把读取器改回 `pop(0)`、把「最小性」改成只比前一项、把详细版 `main()` 一开头抛异常 ——"
      "这些变异都被断言抓到了；而「恒真式断言」（如 `Σ|C_i| == n`）四种坏实现全 OK，一测就露馅。"],
     ["components", "min-diff", "repunit"], ["adversarial-audit", "minimality"]),
    ("adversarial-audit", "独立对抗审计",
     "写完让**另一个 agent 去证伪**，而不是自己再审一遍 —— 自己审自己会漏。",
     ["给审计方的要求要写死：只读、可以跑代码造变异体、「没有真问题就明说没有」、禁止「应该没问题」这类措辞。",
      "实测战果：某次审计抓出 10 个问题（含 1 个真 bug + 2 个潜伏 bug），作者自审两轮都没发现；"
      "另一轮抓出 1 个高严重度缺陷（读取器 O(k²），28.8 秒 vs 0.147 秒）。"],
     ["components", "min-diff", "repunit"], ["mutation-testing"]),
    ("swap-match", "错位匹配 · 主动输一场",
     "两侧各有 n 个元素配对出赛，目标不是「每场都赢」而是「总收益最大」，必要时主动输掉一场。",
     ["田忌赛马：双方各 n 匹马，目标 `100 × (胜 − 负)`，赢 3 输 1 比赢 1 输 0 更划算。",
      "**下驷对上驷**：自己最快的都比不过对方最快时，牺牲一匹最慢的去消耗对方王牌，"
      "把好马留给后面的场次。",
      "**四指针贪心**：`a_lo/a_hi` 与 `b_lo/b_hi` 圈住未出场的马，每轮按四个分支决定谁上场，"
      "每轮双方各少一匹 → 正好 n 轮 O(1)。",
      "**交换论证**：任取最优解，若它没照这一支配，就把两匹马的对手对调，证明对调不会变差 ——"
      "单调性 `s(x,·)` 随对手变慢不减、`s(·,y)` 随自己变快不减。",
      "锚定用例：`1 2 3 vs 1 2 3 → 100`（同等级也要错位）、`2 2 2 vs 2 2 2 → 0`（平局支不是输）。"],
     ["horse-race"], ["mutation-testing"]),
    ("composite-mod", "模数是合数时除法不能换逆元",
     "100007 这类合数模数下，`C(2n,n)/(n+1)` 那个除法必须用精确整数做完，**不能**换成乘逆元取模。",
     ["`pow(n+1, -1, MOD)` 只在 `gcd(n+1, MOD) = 1` 时存在；否则直接抛 ValueError，或悄悄算出错值。",
      "足球赛票 `MOD = 100007 = 97 × 1031` 是合数，`n+1 = 97` 与它不互素的 n 有 10 个："
      "{96, 193, 290, 387, 484, 581, 678, 775, 872, 969} —— 试到 n=96 就崩。",
      "**正解**：`Cat(k) = Cat(k-1) × (4k−2) // (k+1)` 全程精确整数，最后一步才取模。"
      "Cat(1000) 只有 598 位，远低于 4300 位 `int↔str` 限制，撑得住。",
      "**「同族题不等于同题」**：车厢调度也是卡特兰数，但 n≤18 且不取模，"
      "照抄写法过来就是错的。"],
     ["tickets"], ["no-bigint", "small-preprocess"]),
    ("sample-mismatch", "题面正文与样例输出矛盾",
     "题面说一种口径，样例输出是另一种口径 —— 先算两套、用样例反推、再做开关让两种都能切。",
     ["单位区间覆盖：正文写「单位区间 [x, x+1]」，输出段却写「覆盖这 n 个**点**」，"
      "按正文算样例得 6，按「点」口径算样例得 3 —— 而样例输出就是 3。",
      "**判题格式从实证反推，绝不从题面猜**（铁律 2）。",
      "两个口径只差两处 ±1 → 做**显式开关**（`MODEL = 'point'` / `'interval'`），"
      "默认按 OJ 实测口径，并把「题面矛盾」写到文档显式说明。",
      "**改默认之后所有派生计算都要跟着切**（陷阱 40）：详细版的方案长度、"
      "验证脚本的对拍期望、变异测试的两条分支都必须同步；只切一处必然在某条链上露馅。"],
     ["interval-cover"], ["mutation-testing"]),
]
# 说明：上面 CONCEPTS 的 problems 里，"全部题目"那种长列表是为了让概念页的反链完整 ——
# 像 reader / tail-newline / out-of-range 这三条，10 题都适用。
# 说明：上面 CONCEPTS 的 problems 里，"全部题目"那种长列表是为了让概念页的反链完整 ——
# 像 reader / tail-newline / out-of-range 这三条，10 题都适用。

# ---------------------------------------------------------------- 代码片段
# id, 标题, 说明, 语言, 代码, 关联题目
SNIPPETS = [
    ("reader", "逐行 token 读取器（三种环境通用）", "py",
     ["终端 / PyCharm / OJ 都对的读法。要点：逐行读、缓冲 token、"
      "**反序入栈 + pop()** 才是 O(1)；需要「看有没有多余数据」时只交出 `has_buffered()`，别再去 readline。",
      "为什么不用 `sys.stdin.read()`：它要读到 EOF 才返回，终端里敲完数据毫无反应，用户以为卡死"
      "（本仓库踩过两次）。"],
     ["def make_reader():",
      "    buf = []",
      "",
      "    def nxt():",
      "        while not buf:",
      "            line = sys.stdin.readline()",
      "            if not line:                  # EOF / Ctrl+Z",
      "                return None",
      "            buf.extend(reversed(line.split()))   # 反序入栈：别写 pop(0)",
      "        return buf.pop()",
      "",
      "    def has_buffered():",
      "        return len(buf) > 0",
      "",
      "    return nxt, has_buffered"],
     ["cards", "triangle", "lcs", "knapsack", "components", "min-diff", "repunit", "mod11",
      "catalan", "cross-river", "interval-cover", "horse-race", "tickets"]),
    ("eof-loop", "EOF 多组主循环骨架", "py",
     ["读到 EOF 自然结束；每组输出一行并立刻 flush。",
      "边界不合法就中止（打 `[!]` 到 stderr），不要 `continue` —— 那会把后面的数字当成下一个 N，"
      "把伪答案打进 stdout。"],
     ["nxt, _ = make_reader()",
      "",
      "while True:",
      "    tok = nxt()",
      "    if tok is None:                  # 正常结束：EOF",
      "        return",
      "    n = to_int(tok)",
      "    if n is None or n < 0:           # 越界宁可中止",
      "        return",
      "    ...                              # 读 n 个数据 -> 求解",
      "    print(ans)                       # 每组一行，行尾带换行",
      "    sys.stdout.flush()"],
     ["cards", "knapsack", "components", "min-diff", "catalan",
      "interval-cover", "horse-race", "tickets"]),
    ("batch-output", "攒完一起输出（T 组题）", "py",
     ["读满 T 组、全部算完之后一次性 write，行尾补一个 `\\n`。",
      "好处：中途遇到坏数据 return 时 stdout 一个字节都没写过，不会有半截输出。"],
     ["answers = []",
      "for case in range(1, t + 1):",
      "    ...                              # 读 + 校验 + 求解",
      "    answers.append(n)",
      "",
      "if answers:",
      "    out = []",
      "    for v in answers:",
      "        out.append(str(v))",
      "    sys.stdout.write(\"\\n\".join(out) + \"\\n\")   # 行尾换行（铁律 4）",
      "    sys.stdout.flush()"],
     ["repunit", "mod11"]),
    ("strip-comments", "用 tokenize 安全去掉注释与文档字符串", "py",
     ["构建本站时用来生成「去注释可复制源码」。**不能用正则**：`#` 会出现在字符串里、"
      "行尾注释的列号也要精确。",
      "文档字符串用 ast 精确定位（模块/函数/类体里的第一条字符串语句）—— 只删它，别删普通字符串。"],
     ["import ast, io, tokenize",
      "",
      "cut = {}                       # 行号 -> 注释起始列",
      "for tok in tokenize.generate_tokens(io.StringIO(src).readline):",
      "    if tok.type == tokenize.COMMENT:",
      "        cut[tok.start[0]] = min(cut.get(tok.start[0], 10 ** 9), tok.start[1])",
      "",
      "doc_lines = set()              # 文档字符串占用的行",
      "for node in ast.walk(ast.parse(src)):",
      "    body = getattr(node, \"body\", None)",
      "    if not body or not isinstance(node, (ast.Module, ast.FunctionDef, ast.ClassDef)):",
      "        continue",
      "    first = body[0]",
      "    if (isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant)",
      "            and isinstance(first.value.value, str)):",
      "        for ln in range(first.lineno, (first.end_lineno or first.lineno) + 1):",
      "            doc_lines.add(ln)"],
     ["repunit", "min-diff", "components"]),
]


# 全题通用概念：这些约定**10 道题的代码里都遵守**，只是正文不一定逐题展开讲。
# 它们的概念页会把全部题目列为关联（这是事实），构建时的"正文核对"会**跳过**它们 ——
# 否则会一直报"正文里找不到关键词"这种假警报（读者通道 vs 代码通道口径不同）。
GLOBAL_CONCEPTS = {"reader", "tail-newline", "out-of-range"}


def by_slug_problems():
    """把概念/片段里用到的 slug 汇总，供构建脚本反向核对。"""
    out = {}
    for c in CONCEPTS:
        for s in c[4]:
            out.setdefault(s, []).append("concept:" + c[0])
    for s in SNIPPETS:
        for slug in s[4]:
            out.setdefault(slug, []).append("snippet:" + s[0])
    return out
