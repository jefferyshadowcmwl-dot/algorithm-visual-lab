/* 知识实体（构建时生成）：分类 / 概念 / 代码片段 */
window.AVL_WIKI = {
 "categories": [
  {
   "id": "greedy",
   "name": "贪心",
   "desc": "每一步都做当前最优的选择，并证明它不会后悔。",
   "problems": [
    "cross-river",
    "cards",
    "merge-fruit",
    "interval-cover",
    "horse-race"
   ]
  },
  {
   "id": "dp",
   "name": "动态规划",
   "desc": "把大问题拆成重叠子问题，存表复用；关键是状态定义与转移方向。",
   "problems": [
    "triangle",
    "lcs",
    "knapsack"
   ]
  },
  {
   "id": "dsu",
   "name": "并查集",
   "desc": "维护「谁和谁是一伙的」：路径压缩 + 按大小合并。",
   "problems": [
    "components"
   ]
  },
  {
   "id": "number-theory",
   "name": "数论",
   "desc": "在模运算里做文章：能不造大数就不造，只留余数。",
   "problems": [
    "repunit",
    "mod11"
   ]
  },
  {
   "id": "two-pointers",
   "name": "排序 + 双指针",
   "desc": "先排序把无序变有序，再用单调性把 O(n²) 降到 O(n)。",
   "problems": [
    "min-diff"
   ]
  },
  {
   "id": "combinatorics",
   "name": "组合数学",
   "desc": "数方案数：卡特兰数、递推、以及「小规模预处理 + 查询 O(1)」。",
   "problems": [
    "catalan",
    "tickets"
   ]
  }
 ],
 "concepts": [
  {
   "id": "eof",
   "name": "多组数据 · EOF 结束",
   "def": "题面不说有几组，就一直读到文件结尾（readline 返回空串）为止。",
   "body": [
    "最常见的一种输入形态。判据是「确实 AC 过的代码」里写的 <code>while (cin &gt;&gt; n)</code> / <code>while (scanf(...) != EOF)</code>。",
    "本仓库踩过最贵的一课：题面写「若干组」、而找到的参考代码只读一组，于是误判成单组 → 多组数据只回一个答案 → 必 WA。",
    "配套的读法统一用 <code>readline()</code> 逐行读（不用 <code>read()</code>：终端里要等到 EOF 才返回，看起来像卡死）。"
   ],
   "problems": [
    "cards",
    "knapsack",
    "components",
    "min-diff",
    "catalan",
    "merge-fruit",
    "interval-cover",
    "horse-race",
    "tickets"
   ],
   "see": []
  },
  {
   "id": "sentinel",
   "name": "哨兵结束（N=0）",
   "def": "读到某个特定值（常见是 0）就停，而不是读到文件结尾。",
   "body": [
    "数字三角形用 <code>H=0</code> 结束；均分纸牌的 <code>N=0</code> 则是<strong>非法数据</strong>（会被 0 除）。",
    "⚠️ 同一本习题集里三种结束方式都出现过：<strong>EOF / 哨兵 / 给定组数</strong>。做题前先确定是哪一种，不要拿上一题的习惯套下一题。"
   ],
   "problems": [
    "triangle"
   ],
   "see": [
    "eof",
    "t-cases"
   ]
  },
  {
   "id": "t-cases",
   "name": "给定 T 组",
   "def": "第 1 行先给组数 T，随后读满 T 组就停。",
   "body": [
    "长这样：<code>3</code> 后面跟 3 组数据；输出通常每组一行。",
    "⚠️ 别和 LCS 混：LCS 也是 T 组，但它<strong>每组输出 2 行</strong>（先 <code>Case i</code> 再答案）—— 行数必须逐题核对。",
    "收尾若想检查「有没有多余数据」，<strong>只能查缓冲区、绝不能再 readline()</strong>：终端里那会一直等你敲键盘。（<code>11的余数</code> 先确立的做法，<code>n 个 1</code> 是踩过一次才改过来的。）"
   ],
   "problems": [
    "lcs",
    "repunit",
    "mod11"
   ],
   "see": [
    "eof",
    "sentinel",
    "batch-output"
   ]
  },
  {
   "id": "blank-line",
   "name": "图与图之间空一行",
   "def": "排版用的空行不是语法，读入时应当被当成不存在。",
   "body": [
    "连通分支数的多个图之间空了一行。token 化的读取器天然吞掉空行（空行 <code>split()</code> 后是空列表，循环会继续读下一行）。",
    "反例：退回「按行硬读」（<code>readline()</code> 读 n e、再 <code>readline()</code> 读 e 行边）就会撞上空行 —— <code>int()</code> 直接 ValueError。"
   ],
   "problems": [
    "components"
   ],
   "see": [
    "reader"
   ]
  },
  {
   "id": "reader",
   "name": "统一的输入读取器",
   "def": "一个逐行取 token 的小函数，终端 / PyCharm / OJ 三种环境都对。",
   "body": [
    "做法：<code>readline()</code> 逐行读 → <code>line.split()</code> 拆 token 入缓冲 → 缓冲空时再读下一行。",
    "⚠️ 取 token 必须用「反序入栈 + <code>pop()</code>」：<code>buf.pop(0)</code> 每次 memmove 整个列表，几十万 token 挤在同一行时读取退化成 O(k²)（实测 10 万条边挤一行：28.8 秒 vs 0.147 秒）。",
    "⚠️ 不要用 <code>sys.stdin.read()</code>，也不要用 <code>isatty()</code> 分流 —— PyCharm 的运行窗口 stdin 不是真 tty，会踩空。"
   ],
   "problems": [
    "cards",
    "triangle",
    "lcs",
    "knapsack",
    "components",
    "min-diff",
    "repunit",
    "mod11",
    "catalan",
    "cross-river",
    "merge-fruit",
    "interval-cover",
    "horse-race",
    "tickets"
   ],
   "see": [
    "eof",
    "tail-newline"
   ]
  },
  {
   "id": "batch-output",
   "name": "攒完一起输出",
   "def": "T 组题读满 T 组、全部算完之后，一次性把答案打出来。",
   "body": [
    "好处一：终端里输入与输出不再交错，读起来清爽。",
    "好处二：中途遇到坏数据直接 return，<strong>stdout 一个字节都没写过</strong> —— 不会出现「前几组答案已打出去、后面才报错」的半截输出。",
    "行尾换行照旧要补（<code>\"\n.join(out) + \"\n</code>），等价于 <code>cout &lt;&lt; ans &lt;&lt; endl</code>。\""
   ],
   "problems": [
    "repunit",
    "mod11"
   ],
   "see": [
    "t-cases",
    "tail-newline"
   ]
  },
  {
   "id": "tail-newline",
   "name": "行尾换行与 stdout 纯净",
   "def": "每组输出一行、行尾必须有换行；错误信息一律走 stderr。",
   "body": [
    "<code>sys.stdout.write(\"\n.join(out))</code> 最后一行没有换行，与 <code>cout &lt;&lt; ans &lt;&lt; endl</code> 差一个字节 ——\"严格逐字节比对的 OJ 直接判 WA。",
    "错误/提示必须打到 stderr 并带 <code>[!]</code> 前缀；stdout 只留答案。"
   ],
   "problems": [
    "cards",
    "triangle",
    "lcs",
    "knapsack",
    "components",
    "min-diff",
    "repunit",
    "mod11",
    "catalan",
    "cross-river",
    "merge-fruit",
    "interval-cover",
    "horse-race",
    "tickets"
   ],
   "see": [
    "reader",
    "batch-output"
   ]
  },
  {
   "id": "no-bigint",
   "name": "别把大数真造出来",
   "def": "上千位的数不要真的构造，只留它除以 m 的余数。",
   "body": [
    "n 个 1 的答案可达 9972 位：造出来又慢又占地方；而 <code>int(\"1\" * n)</code> 还会撞上<strong>Python 3.11+ 的 4300 位 int↔str 转换限制</strong>，直接抛 ValueError。",
    "修法：逐位累乘 <code>v = v * 10 + 1</code> 构造（不经过字符串），或者干脆只维护余数。",
    "11 的余数同理：80 位的数在 C 里 <code>long long</code> 装不下，只能按字符串逐位处理。"
   ],
   "problems": [
    "repunit",
    "mod11",
    "tickets"
   ],
   "see": [
    "mod-9m",
    "loop-bound"
   ]
  },
  {
   "id": "mod-9m",
   "name": "模 9m，不是模 m",
   "def": "把 A_n = 11…1 的整除判据写对，需要同乘 9 把分母消掉。",
   "body": [
    "<code>A_n = (10^n − 1) / 9</code>，所以 <code>A_n ≡ 0 (mod m)</code> 等价于 <code>10^n ≡ 1 (mod 9m)</code>。",
    "写成模 m 会错：m=3 时 <code>ord_3(10)=1</code> 会答 1，而 A_1=1 根本不被 3 整除，正解是 <strong>3</strong>（111=3×37）；m=9 同理，正解是 <strong>9</strong>。",
    "这条是本仓库的锚定用例（<code>1/3 → 3</code>、<code>1/9 → 9</code>），专门钉死「漏掉那个 9」的实现。"
   ],
   "problems": [
    "repunit"
   ],
   "see": [
    "no-bigint",
    "minimality"
   ]
  },
  {
   "id": "minimality",
   "name": "最小性要全局核",
   "def": "「求最小的 k」这类题，「只比前一项」是局部检查，验不出最小。",
   "body": [
    "反例：m=3、n=6 时 A_6 能被 3 整除、A_5 不能，可真正的最小值是 <strong>3</strong>。只比 A_{n-1} 会对着错答案报 OK。",
    "正解：从 1 一路核到 n，记下<strong>第一个</strong>能整除的位置，要求它等于 n。",
    "这是「恒真/装饰性断言」的一族：看着在检查，其实永远打不掉任何变异。"
   ],
   "problems": [
    "repunit"
   ],
   "see": [
    "mutation-testing"
   ]
  },
  {
   "id": "negative-pile",
   "name": "方案可执行性（负数堆）",
   "def": "详细版给出的操作步骤必须物理上真能做出来。",
   "body": [
    "均分纸牌：<code>piles[i+1] -= amount</code> 会把下一堆扣成<strong>负数</strong> —— 数学上是差额记账，实际搬不出来。",
    "样例 <code>9 8 17 6</code> 恰好每步右边都够，把 bug 藏了很久；锚定用例 <code>3 / 0 0 9</code> 一测就露。",
    "修法：先按 i 递减搬运所有<strong>向左</strong>的流，再按 i 递增搬运所有<strong>向右</strong>的流。"
   ],
   "problems": [
    "cards"
   ],
   "see": [
    "mutation-testing"
   ]
  },
  {
   "id": "reverse-capacity",
   "name": "容量维必须倒序",
   "def": "0/1 背包里容量维正序遍历，等于允许同一件物品反复拿 —— 那是完全背包。",
   "body": [
    "<code>for j in range(cap, w-1, -1)</code>：倒序保证 <code>dp[j-w]</code> 读到的还是「上一件物品处理完」的值。",
    "锚定：<code>v=[5], w=[3], c=10</code> 必须是 <strong>5</strong>；正序会得 15。",
    "顺带记：0 初始化只适用于「容量不超过 c」；若问「恰好装满 c」，必须用 -inf 初始化。"
   ],
   "problems": [
    "knapsack"
   ],
   "see": [
    "mutation-testing"
   ]
  },
  {
   "id": "priority-queue",
   "name": "小根堆 / 优先队列",
   "def": "每次都能 O(log n) 取出最小值的数据结构，把「反复取最小」从 O(n²) 压到 O(n log n)。",
   "body": [
    "合并果子每轮都要取当前<strong>最小的两堆</strong>：朴素做法每轮扫一遍是 O(n²)，换成小根堆就是 O(n log n)。",
    "堆不是排序数组 —— 用一个数组存完全二叉树，只保证「父 ≤ 子」。建堆可以一次线性做完：从最后一个非叶结点往前逐个下沉。",
    "⚠️ <strong>升序数组本身满足堆序</strong>，所以「建堆那一步坏掉」这个错在排序过的测试数据上完全暴露不出来 —— 必须用乱序数据测，或者直接对拍堆结构本身（本仓库的合并果子就是被变异测试 D4 逼出这条的）。",
    "贪心为什么对（交换论证）：总耗费 = Σ(每堆重量 × 它在哈夫曼树里的深度)。若最优树里最深的两个叶子不是最小的两堆，把它们对调只会更优 —— 矛盾。"
   ],
   "problems": [
    "merge-fruit"
   ],
   "see": [
    "reader",
    "mutation-testing"
   ]
  },
  {
   "id": "self-loop",
   "name": "自环与重边不减分支数",
   "def": "并查集里，只有两端点<strong>本来不同支</strong>的边才会让分支数减 1。",
   "body": [
    "自环 <code>(1,1)</code>、重边、成环这几种边都是「白扫」的：find 出来同一个根，直接跳过。",
    "锚定：<code>2 1 / 1 1</code> 必须输出 <strong>2</strong>（写成「每扫一条边分支数就减 1」会得 1）。",
    "另一条锚定更隐蔽：<code>3 1 / 1 2</code> 必须输出 <strong>2</strong> —— 孤立顶点自己算一支，别只数「出现在边里的顶点」。"
   ],
   "problems": [
    "components"
   ],
   "see": []
  },
  {
   "id": "out-of-range",
   "name": "越界宁可中止也不错答",
   "def": "输入不合法时，宁可停止输出，也不能把伪答案打进 stdout。",
   "body": [
    "典型翻车：越界时写 <code>continue</code>，后面的数字会被当成下一个 N，于是把<strong>伪答案</strong>打进 stdout。",
    "修法：打 <code>[!]</code> 到 stderr 后 <code>return</code>（中止），绝不错答。",
    "另外：读到一半 EOF 时，已经算出来的那几组答案该保留就保留（逐组输出的题）——或者像 n 个 1 那样「攒完一起输出」，此时 stdout 还是干净的。"
   ],
   "problems": [
    "cards",
    "triangle",
    "lcs",
    "knapsack",
    "components",
    "min-diff",
    "repunit",
    "mod11",
    "catalan",
    "cross-river",
    "merge-fruit",
    "interval-cover",
    "horse-race",
    "tickets"
   ],
   "see": [
    "tail-newline"
   ]
  },
  {
   "id": "negative-value",
   "name": "dp 不能用 0 初始化",
   "def": "数据里可能有负数时，用 0 当初始值会污染答案。",
   "body": [
    "数字三角形的数字可能是负的：锚定 <code>1 / -7 / 0</code> 必须输出 <strong>-7</strong>；若 dp 用 0 初始化会得 0。",
    "凡「求最大/最小」且值域含负数的 DP，初始值要取 -inf / +inf 或直接用真实数据初始化。"
   ],
   "problems": [
    "triangle"
   ],
   "see": []
  },
  {
   "id": "index-independent",
   "name": "下标互相独立",
   "def": "两个数组各取一个元素时，i 与 j 未必要求相同。",
   "body": [
    "最小差：求 <code>|A[i] − B[j]|</code> 最小，i、j 各自独立。锚定 <code>A=[1,100,101] B=[100,101,200]</code> 应为 <strong>0</strong>；若误以为要「同下标比」，会得 1。",
    "另一处细节：比的是绝对值 —— 锚定 <code>A=[-20] B=[4]</code> 应为 <strong>24</strong>，直接比差会得 −24。"
   ],
   "problems": [
    "min-diff"
   ],
   "see": [
    "two-pointers"
   ]
  },
  {
   "id": "two-pointers",
   "name": "排序 + 双指针单调性",
   "def": "先排序，再用「某个元素已经没机会了」来安全地丢掉它。",
   "body": [
    "最小差：A、B 各自升序后 i=j=0，比较 <code>A[i]−B[j]</code>：小于 0 就推 i、大于 0 就推 j，每步恰好推一个 → 最多 2n 步。",
    "为什么敢丢：B 升序 ⇒ 对方往后只会更大，配当前这个偏小的元素只会越差越远。"
   ],
   "problems": [
    "min-diff"
   ],
   "see": [
    "index-independent"
   ]
  },
  {
   "id": "loop-bound",
   "name": "循环要有上界",
   "def": "「求最小的 k 使 …」这类题，循环必须能证明一定终止。",
   "body": [
    "n 个 1：<code>gcd(m,10)=1</code> ⇒ 10 在模 9m 的乘法群里有阶，<code>n = ord_{9m}(10)</code> 必存在且整除 φ(9m) ≤ 9m ——所以上界取 <code>9m+2</code> 是<strong>可证安全</strong>的，同时也兜住了「数据不合法时死循环」。"
   ],
   "problems": [
    "repunit"
   ],
   "see": [
    "mod-9m"
   ]
  },
  {
   "id": "small-preprocess",
   "name": "小规模预处理 + 查询 O(1)",
   "def": "多组查询同一张小表时，先把表算好，每组只查表。",
   "body": [
    "车厢调度：先把 Cat(0..18) 一次算好（O(MAXN)），每组查询直接查表 O(1)。",
    "n ≤ 18 时 <code>Cat(18)=477638700</code>，32 位整数装得下。"
   ],
   "problems": [
    "catalan"
   ],
   "see": []
  },
  {
   "id": "mutation-testing",
   "name": "变异测试：给断言做体检",
   "def": "把代码<strong>故意改回错的</strong>，验证脚本必须报错 —— 打不掉任何变异的断言等于没写。",
   "body": [
    "做法：每次只改一处（锚点文本替换）→ 跑验证脚本 → 必须 FAIL → 立刻还原 → 最后再跑一遍确认仍全绿。",
    "⚠️ 判「抓到」不能只看返回码：验证脚本<strong>自己崩了</strong>也是非零 —— 那属于伪阳性，要求输出里有明确的 FAIL 标记。",
    "本仓库实例：把读取器改回 <code>pop(0)</code>、把「最小性」改成只比前一项、把详细版 <code>main()</code> 一开头抛异常 ——这些变异都被断言抓到了；而「恒真式断言」（如 <code>Σ|C_i| == n</code>）四种坏实现全 OK，一测就露馅。"
   ],
   "problems": [
    "components",
    "min-diff",
    "repunit"
   ],
   "see": [
    "adversarial-audit",
    "minimality"
   ]
  },
  {
   "id": "adversarial-audit",
   "name": "独立对抗审计",
   "def": "写完让<strong>另一个 agent 去证伪</strong>，而不是自己再审一遍 —— 自己审自己会漏。",
   "body": [
    "给审计方的要求要写死：只读、可以跑代码造变异体、「没有真问题就明说没有」、禁止「应该没问题」这类措辞。",
    "实测战果：某次审计抓出 10 个问题（含 1 个真 bug + 2 个潜伏 bug），作者自审两轮都没发现；另一轮抓出 1 个高严重度缺陷（读取器 O(k²），28.8 秒 vs 0.147 秒）。"
   ],
   "problems": [
    "components",
    "min-diff",
    "repunit"
   ],
   "see": [
    "mutation-testing"
   ]
  },
  {
   "id": "swap-match",
   "name": "错位匹配 · 主动输一场",
   "def": "两侧各有 n 个元素配对出赛，目标不是「每场都赢」而是「总收益最大」，必要时主动输掉一场。",
   "body": [
    "田忌赛马：双方各 n 匹马，目标 <code>100 × (胜 − 负)</code>，赢 3 输 1 比赢 1 输 0 更划算。",
    "<strong>下驷对上驷</strong>：自己最快的都比不过对方最快时，牺牲一匹最慢的去消耗对方王牌，把好马留给后面的场次。",
    "<strong>四指针贪心</strong>：<code>a_lo/a_hi</code> 与 <code>b_lo/b_hi</code> 圈住未出场的马，每轮按四个分支决定谁上场，每轮双方各少一匹 → 正好 n 轮 O(1)。",
    "<strong>交换论证</strong>：任取最优解，若它没照这一支配，就把两匹马的对手对调，证明对调不会变差 ——单调性 <code>s(x,·)</code> 随对手变慢不减、<code>s(·,y)</code> 随自己变快不减。",
    "锚定用例：<code>1 2 3 vs 1 2 3 → 100</code>（同等级也要错位）、<code>2 2 2 vs 2 2 2 → 0</code>（平局支不是输）。"
   ],
   "problems": [
    "horse-race"
   ],
   "see": [
    "mutation-testing"
   ]
  },
  {
   "id": "composite-mod",
   "name": "模数是合数时除法不能换逆元",
   "def": "100007 这类合数模数下，<code>C(2n,n)/(n+1)</code> 那个除法必须用精确整数做完，<strong>不能</strong>换成乘逆元取模。",
   "body": [
    "<code>pow(n+1, -1, MOD)</code> 只在 <code>gcd(n+1, MOD) = 1</code> 时存在；否则直接抛 ValueError，或悄悄算出错值。",
    "足球赛票 <code>MOD = 100007 = 97 × 1031</code> 是合数，<code>n+1 = 97</code> 与它不互素的 n 有 10 个：{96, 193, 290, 387, 484, 581, 678, 775, 872, 969} —— 试到 n=96 就崩。",
    "<strong>正解</strong>：<code>Cat(k) = Cat(k-1) × (4k−2) // (k+1)</code> 全程精确整数，最后一步才取模。Cat(1000) 只有 598 位，远低于 4300 位 <code>int↔str</code> 限制，撑得住。",
    "<strong>「同族题不等于同题」</strong>：车厢调度也是卡特兰数，但 n≤18 且不取模，照抄写法过来就是错的。"
   ],
   "problems": [
    "tickets"
   ],
   "see": [
    "no-bigint",
    "small-preprocess"
   ]
  },
  {
   "id": "sample-mismatch",
   "name": "题面正文与样例输出矛盾",
   "def": "题面说一种口径，样例输出是另一种口径 —— 先算两套、用样例反推、再做开关让两种都能切。",
   "body": [
    "单位区间覆盖：正文写「单位区间 [x, x+1]」，输出段却写「覆盖这 n 个<strong>点</strong>」，按正文算样例得 6，按「点」口径算样例得 3 —— 而样例输出就是 3。",
    "<strong>判题格式从实证反推，绝不从题面猜</strong>（铁律 2）。",
    "两个口径只差两处 ±1 → 做<strong>显式开关</strong>（<code>MODEL = 'point'</code> / <code>'interval'</code>），默认按 OJ 实测口径，并把「题面矛盾」写到文档显式说明。",
    "<strong>改默认之后所有派生计算都要跟着切</strong>（陷阱 40）：详细版的方案长度、验证脚本的对拍期望、变异测试的两条分支都必须同步；只切一处必然在某条链上露馅。"
   ],
   "problems": [
    "interval-cover"
   ],
   "see": [
    "mutation-testing"
   ]
  }
 ],
 "snippets": [
  {
   "id": "reader",
   "name": "逐行 token 读取器（三种环境通用）",
   "lang": "py",
   "desc": [
    "终端 / PyCharm / OJ 都对的读法。要点：逐行读、缓冲 token、<strong>反序入栈 + pop()</strong> 才是 O(1)；需要「看有没有多余数据」时只交出 <code>has_buffered()</code>，别再去 readline。",
    "为什么不用 <code>sys.stdin.read()</code>：它要读到 EOF 才返回，终端里敲完数据毫无反应，用户以为卡死（本仓库踩过两次）。"
   ],
   "code": "def make_reader():\n    buf = []\n\n    def nxt():\n        while not buf:\n            line = sys.stdin.readline()\n            if not line:                  # EOF / Ctrl+Z\n                return None\n            buf.extend(reversed(line.split()))   # 反序入栈：别写 pop(0)\n        return buf.pop()\n\n    def has_buffered():\n        return len(buf) > 0\n\n    return nxt, has_buffered",
   "problems": [
    "cards",
    "triangle",
    "lcs",
    "knapsack",
    "components",
    "min-diff",
    "repunit",
    "mod11",
    "catalan",
    "cross-river",
    "interval-cover",
    "horse-race",
    "tickets"
   ]
  },
  {
   "id": "eof-loop",
   "name": "EOF 多组主循环骨架",
   "lang": "py",
   "desc": [
    "读到 EOF 自然结束；每组输出一行并立刻 flush。",
    "边界不合法就中止（打 <code>[!]</code> 到 stderr），不要 <code>continue</code> —— 那会把后面的数字当成下一个 N，把伪答案打进 stdout。"
   ],
   "code": "nxt, _ = make_reader()\n\nwhile True:\n    tok = nxt()\n    if tok is None:                  # 正常结束：EOF\n        return\n    n = to_int(tok)\n    if n is None or n < 0:           # 越界宁可中止\n        return\n    ...                              # 读 n 个数据 -> 求解\n    print(ans)                       # 每组一行，行尾带换行\n    sys.stdout.flush()",
   "problems": [
    "cards",
    "knapsack",
    "components",
    "min-diff",
    "catalan",
    "interval-cover",
    "horse-race",
    "tickets"
   ]
  },
  {
   "id": "batch-output",
   "name": "攒完一起输出（T 组题）",
   "lang": "py",
   "desc": [
    "读满 T 组、全部算完之后一次性 write，行尾补一个 <code>\\n</code>。",
    "好处：中途遇到坏数据 return 时 stdout 一个字节都没写过，不会有半截输出。"
   ],
   "code": "answers = []\nfor case in range(1, t + 1):\n    ...                              # 读 + 校验 + 求解\n    answers.append(n)\n\nif answers:\n    out = []\n    for v in answers:\n        out.append(str(v))\n    sys.stdout.write(\"\\n\".join(out) + \"\\n\")   # 行尾换行（铁律 4）\n    sys.stdout.flush()",
   "problems": [
    "repunit",
    "mod11"
   ]
  },
  {
   "id": "strip-comments",
   "name": "用 tokenize 安全去掉注释与文档字符串",
   "lang": "py",
   "desc": [
    "构建本站时用来生成「去注释可复制源码」。<strong>不能用正则</strong>：<code>#</code> 会出现在字符串里、行尾注释的列号也要精确。",
    "文档字符串用 ast 精确定位（模块/函数/类体里的第一条字符串语句）—— 只删它，别删普通字符串。"
   ],
   "code": "import ast, io, tokenize\n\ncut = {}                       # 行号 -> 注释起始列\nfor tok in tokenize.generate_tokens(io.StringIO(src).readline):\n    if tok.type == tokenize.COMMENT:\n        cut[tok.start[0]] = min(cut.get(tok.start[0], 10 ** 9), tok.start[1])\n\ndoc_lines = set()              # 文档字符串占用的行\nfor node in ast.walk(ast.parse(src)):\n    body = getattr(node, \"body\", None)\n    if not body or not isinstance(node, (ast.Module, ast.FunctionDef, ast.ClassDef)):\n        continue\n    first = body[0]\n    if (isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant)\n            and isinstance(first.value.value, str)):\n        for ln in range(first.lineno, (first.end_lineno or first.lineno) + 1):\n            doc_lines.add(ln)",
   "problems": [
    "repunit",
    "min-diff",
    "components"
   ]
  }
 ]
};
