/* 站点数据（构建时生成，别手改） */
window.AVL_DATA = [
 {
  "slug": "cross-river",
  "dir": "过河问题",
  "title": "过河问题",
  "cat": "贪心 + DP",
  "catId": "greedy",
  "cx": "O(n log n)",
  "fmt": "待核",
  "summary": "N 个人一条船、最多载 2 人，求全部过河的最短总时间。",
  "docName": "过河问题详解.md",
  "doc": "<h1>🚣 过河问题（Bridge Crossing Problem）详解</h1>\n<h2 id=\"sec-1\">一、题目描述</h2>\n<p>有 <code>n</code> 个学生参加活动，到了一条河边。渡口只有一艘小船，<strong>每次最多坐 2 人</strong>。 每个人划船速度不同（用分钟表示），<strong>两人同时在船上时，速度由较慢的人决定</strong>。 船需要有人划回来继续运人。问：如何安排过河顺序，使<strong>所有人过河的总时间最少</strong>？</p>\n<h3 id=\"sec-2\">输入格式</h3>\n<pre class=\"code\"><code>4           ← 第一组：人数 n\n1 2 3 4     ← 每个人的划船速度\n4           ← 第二组：人数 n\n1 2 5 10    ← 每个人的划船速度\n...         ← 一直读到 EOF</code></pre>\n<h3 id=\"sec-3\">输出格式</h3>\n<p>对每组数据，输出一个整数——所有人过河的最少分钟数。</p>\n<h3 id=\"sec-4\">样例</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>输出</th></tr></thead><tbody><tr><td><code>4</code>&lt;br&gt;<code>1 2 3 4</code></td><td><code>11</code></td></tr><tr><td><code>4</code>&lt;br&gt;<code>1 2 5 10</code></td><td><code>17</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-5\">二、核心思路：贪心 + 递推</h2>\n<h3 id=\"sec-6\">2.1 关键观察</h3>\n<ol>\n<li><strong>速度慢的人是瓶颈</strong>：他们和谁一起过，船上时间都由他们决定。</li>\n<li><strong>船必须有人划回</strong>：每次送走两人到对岸，必须有 1 人划船返回（除非已经全部完成）。</li>\n<li><strong>最快的两个人作用最大</strong>：他们常常是\"摆渡者\"——负责送人和返回。</li>\n</ol>\n<h3 id=\"sec-7\">2.2 排序</h3>\n<p>把所有学生按速度从小到大排序：</p>\n<pre class=\"code\"><code>a[0] ≤ a[1] ≤ a[2] ≤ ... ≤ a[n-1]\n ↑          ↑\n最快       最慢</code></pre>\n<p>为了减少混乱，下面的 <code>a[0]</code> 就是最快的学生，<code>a[n-1]</code> 是最慢的。</p>\n<h3 id=\"sec-8\">2.3 关键问题：怎样把最慢的两个人（a[n-2] 和 a[n-1]）送到对岸？</h3>\n<p>针对这对\"最慢的难兄难弟\"，有两种经典策略：</p>\n<hr>\n<h3 id=\"sec-9\">策略 A —— 最快者护航（让最慢的先走）</h3>\n<pre class=\"code\"><code>① a[0] 和 a[1] 一起过河（用时 a[1]）\n② a[0] 划船返回（用时 a[0]）\n③ a[n-2] 和 a[n-1] 一起过河（用时 a[n-1]）\n④ a[1] 划船返回（用时 a[1]）\n─────────────────────────────────────\n本轮总耗时 = a[0] + 2·a[1] + a[n-1]</code></pre>\n<p><strong>直觉</strong>：最快的 a[0] 和次快的 a[1] 先到对岸，a[0] 把船划回来，再接 a[n-2]、a[n-1] 这对最慢的过河（慢的人坐船只能接受，反正他们慢），最后 a[1] 划回来继续当下一次的\"摆渡者\"。</p>\n<hr>\n<h3 id=\"sec-10\">策略 B —— 次快者护航</h3>\n<pre class=\"code\"><code>① a[0] 和 a[n-2] 一起过河（用时 a[n-2]）\n② a[0] 划船返回（用时 a[0]）\n③ a[0] 和 a[n-1] 一起过河（用时 a[n-1]）\n④ a[1] 划船返回（用时 a[1]）\n─────────────────────────────────────\n本轮总耗时 = a[0] + a[1] + a[n-2] + a[n-1]</code></pre>\n<p><strong>直觉</strong>：最快的 a[0] 单趟送 a[n-2]，自己回来，再送最慢的 a[n-1]——这样 a[1]（次快）始终在对岸待命。</p>\n<hr>\n<h3 id=\"sec-11\">2.4 取最优 + 递推</h3>\n<p>每轮处理两个最慢的人，比较两种策略的耗时，取较小值，<strong>然后递归处理剩下的前 n-2 个人</strong>。</p>\n<pre class=\"code\"><code>dp[i] = 前 i 个人过河的最少时间\n\n边界：\n  dp[0] = 0\n  dp[1] = a[0]                  # 只有1人\n  dp[2] = a[1]                  # 两人一起过，慢的决定\n  dp[3] = a[0] + a[1] + a[2]    # 特殊：1送3过 + 1返 + 1送2过\n\n递推（i ≥ 4）：\n  dp[i] = min(dp[i-2] + a[0] + 2·a[1] + a[i-1],          # 策略A\n              dp[i-2] + a[0] + a[1] + a[i-2] + a[i-1])    # 策略B\n\n答案 = dp[n]</code></pre>\n<blockquote>⚠️ <strong>为什么 n=3 是特殊情况？</strong> 策略 A、B 的公式都假设\"送走两人后还要让一个人划回来继续运人\"。但 n=3 时送完就不需要再回来了！ 正确最优解：<code>a[0]</code> 送 <code>a[2]</code> 过河（耗时 <code>a[2]</code>）→ <code>a[0]</code> 返回（耗时 <code>a[0]</code>）→ <code>a[0]</code> 送 <code>a[1]</code> 过河（耗时 <code>a[1]</code>），合计 <code>a[0] + a[1] + a[2]</code>。</blockquote>\n<hr>\n<h2 id=\"sec-12\">三、样例详细推演</h2>\n<h3 id=\"sec-13\">样例 1：<code>1 2 3 4</code></h3>\n<p>排序后：<code>[1, 2, 3, 4]</code>（已经有序）</p>\n<p><code>n = 4</code>，需要处理最慢的两人 <code>a[2]=3</code> 和 <code>a[3]=4</code>。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>策略</th><th>计算</th><th>结果</th></tr></thead><tbody><tr><td>A</td><td><code>1 + 2·2 + 4</code></td><td><code>9</code></td></tr><tr><td>B</td><td><code>1 + 2 + 3 + 4</code></td><td><code>10</code></td></tr></tbody></table></div>\n<p>相同，取 A：前 2 人 dp[2] = a[1] = 2。 <strong>总时间 = 2 + 9 = 11 分钟</strong> ✅</p>\n<h4>具体步骤：</h4>\n<pre class=\"code\"><code>① a[0]=1 和 a[1]=2 一起过河 → 用时 2\n② a[0]=1 划回此岸       → 用时 1\n③ a[2]=3 和 a[3]=4 一起过河 → 用时 4\n④ a[1]=2 划回此岸       → 用时 2\n⑤ a[0]=1 和 a[1]=2 一起过河 → 用时 2\n────────────────────────────────────\n合计 = 2+1+4+2+2 = 11 分钟 ✅</code></pre>\n<hr>\n<h3 id=\"sec-14\">样例 2：<code>1 2 5 10</code></h3>\n<p>排序后：<code>[1, 2, 5, 10]</code></p>\n<p><code>n = 4</code>，需要处理最慢的两人 <code>a[2]=5</code> 和 <code>a[3]=10</code>。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>策略</th><th>计算</th><th>结果</th></tr></thead><tbody><tr><td>A</td><td><code>1 + 2·2 + 10</code></td><td><strong><code>15</code></strong></td></tr><tr><td>B</td><td><code>1 + 2 + 5 + 10</code></td><td><code>18</code></td></tr></tbody></table></div>\n<p>A 更优。 <strong>总时间 = 2 + 15 = 17 分钟</strong> ✅</p>\n<h4>具体步骤：</h4>\n<pre class=\"code\"><code>① a[0]=1 和 a[1]=2 一起过河 → 用时 2\n② a[0]=1 划回此岸       → 用时 1\n③ a[2]=5 和 a[3]=10 一起过河 → 用时 10\n④ a[1]=2 划回此岸       → 用时 2\n⑤ a[0]=1 和 a[1]=2 一起过河 → 用时 2\n────────────────────────────────────\n合计 = 2+1+10+2+2 = 17 分钟 ✅</code></pre>\n<p><strong>为什么 A 更优？</strong> 策略 A 用 a[1]=2 当\"摆渡者\"承担返程（用时 2），而策略 B 也要 a[1] 返程（用时 2）， 但 B 多了一次 a[0] 单独返程（用时 1）。在 a[n-2]=5 不算特别慢的情况下，A 略胜。</p>\n<p><strong>什么时候 B 更好？</strong> 理论上当 a[n-2] &lt; a[1] 时 B 胜出，但由于排序后 a[1] ≤ a[n-2]， 实际场景中 <strong>B 永远不会胜出 A</strong>，A 是唯一的最优策略。 B 分支保留仅为算法对称性。</p>\n<hr>\n<h2 id=\"sec-15\">四、代码实现要点</h2>\n<h3 id=\"sec-16\">4.1 时间复杂度</h3>\n<ul>\n<li>排序：O(n log n)</li>\n<li>DP 递推：O(n)</li>\n<li>总体：<strong>O(n log n)</strong>，n &lt; 20 完全没有压力</li>\n</ul>\n<h3 id=\"sec-17\">4.2 状态记录（用于动画回放）</h3>\n<p><code>choice[i]</code> 记录前 i 人过河时最后一轮选的是 A 还是 B，事后<strong>回溯</strong>就能还原每一步操作，生成动画。</p>\n<h3 id=\"sec-18\">4.3 边界条件</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>答案</th><th>说明</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>无人</td></tr><tr><td>1</td><td>a[0]</td><td>单人</td></tr><tr><td>2</td><td>a[1]</td><td>两人一起过，慢的决定</td></tr><tr><td>3</td><td>a[0] + a[1] + a[2]</td><td>1送3过 + 1返 + 1送2过（不需要再返回）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-19\">五、运行方法</h2>\n<pre class=\"code bash\"><code># 方式 1：终端交互（推荐）\npython cross_river.py\n# 然后逐行输入：n、回车、速度序列、回车，立刻看到结果\n\n# 方式 2：标准输入（OJ 提交用）\n# 把数据放入 input.txt\npython cross_river.py &lt; input.txt\n\n# 方式 3：详细步骤版（看每一步）\npython cross_river_detailed.py\n\n# 方式 4：直接打开浏览器看动画\n# 双击 cross_river_animation.html</code></pre>\n<hr>\n<h2 id=\"sec-20\">六、动画演示说明</h2>\n<p>打开 <code>cross_river_animation.html</code>，你可以：</p>\n<ol>\n<li><strong>修改速度序列</strong>：在输入框里输入任意 <code>n &lt; 20</code> 的速度序列（空格分隔），点击\"设置\"。</li>\n<li><strong>控制播放</strong>：</li>\n</ol>\n<ul>\n<li>▶ 播放 / ⏸ 暂停</li>\n<li>◀ 上一步 / 下一步 ▶（用于逐步研究）</li>\n<li>↻ 重置</li>\n<li>速度选择：慢 / 正常 / 快</li>\n</ul>\n<ol>\n<li><strong>可视化要素</strong>：</li>\n</ol>\n<ul>\n<li>🟢 此岸（起点）+ 🔵 河流 + 🟢 对岸（终点）</li>\n<li>每个学生是一个彩色圆圈，上面写着<strong>速度</strong></li>\n<li>船只 🛶 在河上移动，每次只承载 1~2 人</li>\n<li>顶部实时显示<strong>当前步数</strong>、<strong>累计用时</strong>、<strong>剩余总时间</strong></li>\n<li>下方解释当前步骤用了<strong>哪种策略</strong>、<strong>哪些人</strong>参与、<strong>耗时多少</strong></li>\n</ul>\n<p><strong>示例输入</strong>：</p>\n<ul>\n<li><code>1 2 3 4</code> → 看 5 步 11 分钟全过程</li>\n<li><code>1 2 5 10</code> → 看 A 策略胜出的对比</li>\n<li><code>1 2 3 4 5 6 7 8</code> → 看 n=8 时反复使用 A/B 的递推效果</li>\n</ul>\n<hr>\n<h2 id=\"sec-21\">七、举一反三（拓展思考）</h2>\n<h3 id=\"sec-22\">7.1 如果船可以坐 3 人呢？</h3>\n<p>策略空间会爆炸，但基本思想仍是\"慢的尽量在一起，最快的当摆渡者\"，需要更复杂的 DP。</p>\n<h3 id=\"sec-23\">7.2 如果有手电筒/灯笼（POJ 经典过桥问题）？</h3>\n<p>正是本题原型！POJ 2251 / POJ 3404 /《算法导论》思考题 9-1 都是它。</p>\n<h3 id=\"sec-24\">7.3 时间复杂度能否降到 O(n)？</h3>\n<p>n &lt; 20 的排序 O(n log n) 完全够用。如果 n 巨大且速度范围有限，可以用<strong>计数排序</strong>达到 O(n)。</p>\n<h3 id=\"sec-25\">7.4 为什么贪心最优？</h3>\n<p>可以用<strong>交换论证</strong>（exchange argument）证明：任何最优解都能转化为按本算法的方案，且不增加总时间。 或者用数学归纳法：假设前 k-2 人按本算法最优，对第 k-1、k 人选择 min(A, B) 显然局部最优，由 DP 子结构叠加得到全局最优。</p>\n<hr>\n<h2 id=\"sec-26\">八、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件名</th><th>说明</th></tr></thead><tbody><tr><td><code>cross_river.py</code></td><td>极简交互式求解器，终端逐组输入，输出一个数字</td></tr><tr><td><code>cross_river_detailed.py</code></td><td>详细步骤版，输出最少时间 + 每步过程 + Sum check 自校</td></tr><tr><td><code>cross_river_animation.html</code></td><td>浏览器端动画演示（HTML + 原生 JS，零依赖，离线可用）</td></tr><tr><td><code>过河问题详解.md</code></td><td>本说明文档</td></tr></tbody></table></div>\n<p>祝你 AC！🎉</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题目描述",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "输入格式",
    "lvl": 3
   },
   {
    "id": "sec-3",
    "text": "输出格式",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "样例",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "二、核心思路：贪心 + 递推",
    "lvl": 2
   },
   {
    "id": "sec-6",
    "text": "2.1 关键观察",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "2.2 排序",
    "lvl": 3
   },
   {
    "id": "sec-8",
    "text": "2.3 关键问题：怎样把最慢的两个人（a[n-2] 和 a[n-1]）送到对岸？",
    "lvl": 3
   },
   {
    "id": "sec-9",
    "text": "策略 A —— 最快者护航（让最慢的先走）",
    "lvl": 3
   },
   {
    "id": "sec-10",
    "text": "策略 B —— 次快者护航",
    "lvl": 3
   },
   {
    "id": "sec-11",
    "text": "2.4 取最优 + 递推",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "三、样例详细推演",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "样例 1：1 2 3 4",
    "lvl": 3
   },
   {
    "id": "sec-14",
    "text": "样例 2：1 2 5 10",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "四、代码实现要点",
    "lvl": 2
   },
   {
    "id": "sec-16",
    "text": "4.1 时间复杂度",
    "lvl": 3
   },
   {
    "id": "sec-17",
    "text": "4.2 状态记录（用于动画回放）",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "4.3 边界条件",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "五、运行方法",
    "lvl": 2
   },
   {
    "id": "sec-20",
    "text": "六、动画演示说明",
    "lvl": 2
   },
   {
    "id": "sec-21",
    "text": "七、举一反三（拓展思考）",
    "lvl": 2
   },
   {
    "id": "sec-22",
    "text": "7.1 如果船可以坐 3 人呢？",
    "lvl": 3
   },
   {
    "id": "sec-23",
    "text": "7.2 如果有手电筒/灯笼（POJ 经典过桥问题）？",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "7.3 时间复杂度能否降到 O(n)？",
    "lvl": 3
   },
   {
    "id": "sec-25",
    "text": "7.4 为什么贪心最优？",
    "lvl": 3
   },
   {
    "id": "sec-26",
    "text": "八、文件清单",
    "lvl": 2
   }
  ],
  "files": [
   "cross_river.py",
   "cross_river_detailed.py",
   "cross_river.c"
  ],
  "concepts": [
   "out-of-range",
   "reader",
   "tail-newline"
  ],
  "prev": null,
  "next": "cards",
  "related": [
   "cards",
   "horse-race",
   "interval-cover"
  ]
 },
 {
  "slug": "cards",
  "dir": "均分纸牌",
  "title": "均分纸牌",
  "cat": "贪心",
  "catId": "greedy",
  "cx": "O(n)",
  "fmt": "多组 · EOF 结束",
  "summary": "相邻两堆之间搬牌，最少几步能让每堆一样多。",
  "docName": "均分纸牌详解.md",
  "doc": "<h1>均分纸牌详解</h1>\n<blockquote>关键词：贪心、前缀和、相邻传递、方案可执行性（不得出现<a class=\"kw\" href=\"#/k/negative-pile\" title=\"概念：negative-pile\">负数堆</a>）、多组读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a></blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>N 堆纸牌排成一排，第 i 堆有 A_i 张。每次操作可以<strong>在相邻两堆之间</strong>移动任意张牌 （从一堆拿几张放到紧邻的另一堆）。求最少移动几次，能让所有堆的牌数相同。</p>\n<p>题面保证 <code>sum(A) % N == 0</code>，即一定能分匀。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td><strong>多组</strong>。每组两行：第 1 行 <code>N</code>；第 2 行 <code>N</code> 个整数</td></tr><tr><td>结束</td><td><strong>EOF</strong>（读到文件结尾）</td></tr><tr><td>输出</td><td>每组<strong>一行</strong>：最少移动次数</td></tr><tr><td>约束</td><td>1 ≤ N ≤ 100，1 ≤ A_i ≤ 10000，且 sum 是 N 的倍数</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-2\">二、算法：从左往右的贪心</h2>\n<p>记平均值 <code>avg = sum / N</code>，把每堆换成\"多出多少\"：</p>\n<pre class=\"code\"><code>d[i] = A[i] − avg        （正数=多了，负数=少了）</code></pre>\n<p>从左往右扫，维护<strong>前缀缺口</strong> <code>balance</code>：</p>\n<pre class=\"code\"><code>balance = 0\nfor i in 0 .. N-2:\n    balance += d[i]\n    if balance != 0:      # 前 i+1 堆还差（或多）这些牌\n        moves += 1</code></pre>\n<p><strong>为什么一次扫描就够</strong>：牌只能在<strong>相邻</strong>堆之间走，所以\"前 i+1 堆的内部\"与\"右边\"之间， 唯一的通道就是 <code>i</code> 与 <code>i+1</code> 之间那道口子。要补平这段缺口，<code>balance ≠ 0</code> 时<strong>必须</strong> 从这道口子过一次货 —— 一趟就够（一次可以搬任意张），而过少的次数不可能补平。 于是每遇到 <code>balance ≠ 0</code> 计数一次，既充分又必要。</p>\n<p><strong>答案 = 最少移动次数</strong>，与\"谁搬给谁\"无关（那是方案问题，见 §六 陷阱 4）。</p>\n<hr>\n<h2 id=\"sec-3\">三、样例演示</h2>\n<pre class=\"code\"><code>4\n9 8 17 6          sum = 40, avg = 10\nd = [−1, −2, +7, −4]</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>i</th><th>d[i]</th><th>balance</th><th>balance≠0?</th><th>moves</th></tr></thead><tbody><tr><td>0</td><td>−1</td><td>−1</td><td>是</td><td>1</td></tr><tr><td>1</td><td>−2</td><td>−3</td><td>是</td><td>2</td></tr><tr><td>2</td><td>+7</td><td>+4</td><td>是</td><td><strong>3</strong></td></tr></tbody></table></div>\n<p><code>d[3]</code> 不用看 —— 前三堆补平了，最后一堆自然也是平的（因为 sum d[i] = 0）。</p>\n<p><strong>答案 = 3</strong>。</p>\n<hr>\n<h2 id=\"sec-4\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><code>O(N)</code></td><td>一次线性扫描（求 sum 也是一次）</td></tr><tr><td>空间</td><td><code>O(N)</code></td><td>存下这 N 个数；也可边读边算前缀和，降到 <code>O(1)</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-5\">五、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望</th></tr></thead><tbody><tr><td><code>4</code> / <code>9 8 17 6</code></td><td>3</td></tr><tr><td><code>4</code> / <code>1 2 3 6</code></td><td>3</td></tr><tr><td><code>5</code> / <code>1 2 3 4 5</code></td><td>4</td></tr><tr><td><code>3</code> / <code>0 0 9</code></td><td><strong>2</strong> ← 方案可执行性锚定（见 §六）</td></tr></tbody></table></div>\n<p>⚠️ <code>4 / 1 2 5 10</code> 是<strong>非法数据</strong>（sum=18 不能被 4 整除），程序会打 <code>[!]</code> 并跳过， <strong>不要拿它当期望用例</strong>。</p>\n<hr>\n<h2 id=\"sec-6\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>多组 vs 单组误判</strong></td><td>题面写\"有若干组测试数据\"，本地找到的参考代码却只读一组。<strong>判题格式必须从确实 AC 过的代码反推</strong>：真正 AC 的 C++ 写的是 <code>while (cin &gt;&gt; n)</code> → <strong>多组、EOF 结束</strong>。这是本仓库最贵的一课</td></tr><tr><td>2</td><td><strong>末尾换行</strong></td><td><code>sys.stdout.write(\"\\n\".join(out))</code> 最后一行没有换行，与 <code>cout &lt;&lt; ans &lt;&lt; endl</code> 差一个字节，严格比对的 OJ 判 WA。逐组 <code>print()</code> 才对</td></tr><tr><td>3</td><td><strong>N=0 崩溃</strong></td><td><code>sum([]) // 0</code> → ZeroDivisionError。数据里没有 0，但代码不能靠这个活着</td></tr><tr><td>4</td><td><strong>详细版给出负数堆</strong></td><td>步数对，但方案<strong>物理上搬不出来</strong>：<code>piles[i+1] -= amount</code> 会把下一堆扣成负数。样例 <code>9 8 17 6</code> 恰好每步右边都够，把它藏住了；锚定用例 <code>3 / 0 0 9</code> 一测就露 —— 正解是\"堆3→堆2 送 6 张，堆2→堆1 送 3 张\"。<strong>修法</strong>：先按 i 递减搬运所有<strong>向左</strong>的流，再按 i 递增搬运所有<strong>向右</strong>的流（详见 <code>cards_detailed.py</code>）</td></tr><tr><td>5</td><td><strong>终端\"敲完不给输出\"</strong></td><td><code>sys.stdin.read()</code> 要读到 EOF 才返回。统一用 <code>readline()</code> 逐行读（本仓库铁律 1）</td></tr><tr><td>6</td><td><strong>Python 3 独有语法 → CE</strong></td><td>f-string / <code>sys.stdin.buffer</code> / <code>nonlocal</code> / 类型注解，在老 OJ 上直接编译错误 —— 症状与算法毫无关系</td></tr></tbody></table></div>\n<blockquote>⚠️ <strong>本仓库待修</strong>：<code>cards.py</code> 目前仍用 <code>sys.stdin.read().split()</code>（OJ 上能过，但终端里会像卡死）。 其余 9 道题已统一为 <code>make_reader()</code>（<code>readline()</code> 逐行 + 反序入栈取 token）。</blockquote>\n<hr>\n<h2 id=\"sec-7\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>cards.py</code></td><td><strong>OJ 提交用</strong>（贪心，stdout 只输出每组答案）</td></tr><tr><td><code>cards_detailed.py</code></td><td>详细版（逐步余额 + 可执行的搬运方案）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>cards.c</code></td><td>C 实现（⚠️ 本机无编译器，从未编译验证）</td></tr><tr><td><code>cards_animation.html</code></td><td>浏览器动画（逐堆余额 + 搬运流向，支持自定义输入）</td></tr><tr><td><code>verify_cards.py</code></td><td>自动对拍脚本（<strong>BFS 暴力</strong>求最少步数 + 方案合法性与最小性）</td></tr><tr><td><code>参考代码_C.c</code> / <code>参考代码_CPP.cpp</code></td><td>网上找的<strong>已 AC</strong> 实现 —— 当初就是靠它反推出\"多组、EOF\"这个判题格式</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-8\">八、正确性验证（实跑）</h2>\n<pre class=\"code bash\"><code>python verify_cards.py\n# OK: greedy==BFS 302 cases | trace legal 14623 cases | detailed==minimal</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性</td><td><strong>BFS 暴力</strong>搜索最少步数（状态 = 各堆牌数），与贪心对拍 302 组</td><td>0 不一致</td></tr><tr><td>方案可执行性</td><td>详细版给出的每一步都真能做出来：<strong>不得出现负数堆</strong>，14623 组穷举</td><td>0 违规</td></tr><tr><td>详细版与提交版一致</td><td><code>detailed == minimal</code>（步数不许分歧）</td><td>一致</td></tr><tr><td>输出字节</td><td>每组一行、<a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a>带换行、stderr 为空</td><td>通过</td></tr></tbody></table></div>\n<blockquote>验证脚本载入的是<strong>文件本体</strong>（不是算法副本）—— 早期版本自带一份算法拷贝， 改了本体而副本没动也会打印 OK，这条坑已修（本仓库陷阱 10）。</blockquote>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：从左往右的贪心",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "三、样例演示",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-5",
    "text": "五、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-6",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-7",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "八、正确性验证（实跑）",
    "lvl": 2
   }
  ],
  "files": [
   "cards.py",
   "cards_detailed.py",
   "cards.c",
   "verify_cards.py"
  ],
  "concepts": [
   "eof",
   "negative-pile",
   "out-of-range",
   "reader",
   "tail-newline"
  ],
  "prev": "cross-river",
  "next": "triangle",
  "related": [
   "horse-race",
   "interval-cover",
   "merge-fruit"
  ]
 },
 {
  "slug": "triangle",
  "dir": "数字三角形",
  "title": "数字三角形",
  "cat": "动态规划",
  "catId": "dp",
  "cx": "O(H^2)",
  "fmt": "多组 · H=0 哨兵结束",
  "summary": "从顶走到底，每步只能走正下方或右下方，路径和最大。",
  "docName": "数字三角形详解.md",
  "doc": "<h1>数字三角形 详解</h1>\n<blockquote>关键词：动态规划、自底向上、路径最大和、H=0 <a class=\"kw\" href=\"#/k/sentinel\" title=\"概念：sentinel\">哨兵</a></blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给定一个高 H 的数字三角形，第 i 行有 i 个整数。 从<strong>顶部</strong>出发，每一步只能走到<strong>正下方</strong>或<strong>右下方</strong>，直到<strong>底边任意位置</strong>。 求这条路径上数字之和的最大值。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td>多组数据。每组第一行 H，随后 H 行描述三角形；<strong>H=0 表示输入结束</strong></td></tr><tr><td>输出</td><td>每组输出一个最大数字之和（一行）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-2\">二、算法：自底向上 DP</h2>\n<h3 id=\"sec-3\">状态定义</h3>\n<pre class=\"code\"><code>dp[i][j] = 「从第 i 行第 j 列出发、走到底边的最大路径和」</code></pre>\n<h3 id=\"sec-4\">状态转移</h3>\n<pre class=\"code\"><code>dp[i][j] = triangle[i][j] + max( dp[i+1][j] , dp[i+1][j+1] )\n                                 ↑ 正下方      ↑ 右下方</code></pre>\n<h3 id=\"sec-5\">初始与答案</h3>\n<ul>\n<li><strong>初始</strong>：<code>dp[最后一行] = triangle[最后一行]</code>（位置本身就在底边，没有后继）</li>\n<li><strong>答案</strong>：<code>dp[0][0]</code></li>\n</ul>\n<h3 id=\"sec-6\">为什么选自底向上</h3>\n<p>自顶向下要记录「从顶走到 (i,j) 的最大和」，而 (i,j) 可能从<strong>左上</strong>或<strong>右上</strong>两个方向到达：</p>\n<pre class=\"code\"><code>dp[i][j] = tri[i][j] + max(dp[i-1][j-1], dp[i-1][j])</code></pre>\n<p>这样最后还得在<strong>最后一行取最大值</strong>才能得到答案。 自底向上只需一次遍历，答案直接落在 <code>dp[0][0]</code>，更简洁、边界更少。</p>\n<hr>\n<h2 id=\"sec-7\">三、样例演示（H=5）</h2>\n<pre class=\"code\"><code>          7\n        3   8\n      8   1   0\n    2   7   4   4\n  4   5   2   6   5</code></pre>\n<p>自底向上逐层累加（每格 = 自身 + 下方两格中较大的那个）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>层级</th><th>该行 dp 值</th><th>说明</th></tr></thead><tbody><tr><td>第 5 行</td><td><code>4  5  2  6  5</code></td><td>最后一行，初始值</td></tr><tr><td>第 4 行</td><td><code>7  12  10  10</code></td><td>由第 5 行推得</td></tr><tr><td>第 3 行</td><td><code>20  13  10</code></td><td>由第 4 行推得</td></tr><tr><td>第 2 行</td><td><code>23  21</code></td><td>由第 3 行推得</td></tr><tr><td>第 1 行</td><td><code>30</code></td><td>由第 2 行推得 → <strong>答案</strong></td></tr></tbody></table></div>\n<p>最优路径：<code>7 → 3 → 8 → 7 → 5 = 30</code></p>\n<hr>\n<h2 id=\"sec-8\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><code>O(H²)</code></td><td>每个节点恰好计算一次</td></tr><tr><td>空间</td><td><code>O(H)</code></td><td><strong>一维 dp 滚动</strong>，不需要二维表</td></tr></tbody></table></div>\n<p><strong>空间优化要点</strong>：算第 i 行时只用到第 i+1 行的 <code>dp[j]</code> 和 <code>dp[j+1]</code>， 所以一维数组从下往上<strong>原地覆盖</strong>即可，无需保存整个 DP 表。</p>\n<p>（详细版为了能回溯最优路径，额外保留了二维表；提交版用一维。）</p>\n<hr>\n<h2 id=\"sec-9\">五、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>H=0 是哨兵，不是 EOF</strong></td><td>题面明确\"H=0 表示输入结束\"，读到时必须 <code>break</code> 而不是 <code>continue</code></td></tr><tr><td>2</td><td><strong>第 i 行只有 i+1 个数</strong></td><td>读入时列循环是 <code>range(i+1)</code>，<strong>不是</strong> <code>range(H)</code></td></tr><tr><td>3</td><td><strong>数字可能是<a class=\"kw\" href=\"#/k/negative-value\" title=\"概念：negative-value\">负数</a></strong></td><td>不能用 <code>0</code> 初始化 dp，必须用真实的最后一行，否则负数输入会算错</td></tr><tr><td>4</td><td><strong>每组输出一行、<a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a>带换行</strong></td><td>对齐 <code>cout &lt;&lt; ans &lt;&lt; endl</code>，详见知识库《输入输出统一规范》</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-10\">六、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>triangle.py</code></td><td><strong>OJ 提交用</strong>（极简，stdout 只输出答案）</td></tr><tr><td><code>triangle_detailed.py</code></td><td>详细版（三角形 + 逐层 DP + 最优路径 + Sum check）</td></tr><tr><td><code>triangle.c</code></td><td>C 实现（<code>long long</code> 防溢出，一维数组存三角形）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">七、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th></tr></thead><tbody><tr><td><code>5 / 7 / 3 8 / 8 1 0 / 2 7 4 4 / 4 5 2 6 5 / 0</code></td><td><code>30</code></td></tr><tr><td><code>4 / 6 / 2 1 / 4 3 4 / 1 2 3 4 / 0</code></td><td><code>15</code></td></tr><tr><td><code>1 / 42 / 0</code></td><td><code>42</code></td></tr><tr><td><code>1 / -7 / 0</code></td><td><code>-7</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">八、正确性验证</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性</td><td>500 组随机三角形（<strong>含负数</strong>，H ≤ 9）与<strong>暴力枚举所有路径</strong>对拍</td><td><strong>0 不一致</strong></td></tr><tr><td>详细版自洽</td><td>Sum check：回溯路径的节点和必须等于 <code>dp[0][0]</code></td><td>样例两次均 OK</td></tr><tr><td>输出格式</td><td><code>od -c</code> 检查字节</td><td><code>30\\r\\n15\\r\\n</code>，末尾有换行</td></tr><tr><td>stdout 纯净</td><td>stderr 分离检查</td><td>完全为空</td></tr></tbody></table></div>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：自底向上 DP",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "状态定义",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "状态转移",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "初始与答案",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "为什么选自底向上",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "三、样例演示（H=5）",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "五、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "七、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "八、正确性验证",
    "lvl": 2
   }
  ],
  "files": [
   "triangle.py",
   "triangle_detailed.py",
   "triangle.c"
  ],
  "concepts": [
   "negative-value",
   "out-of-range",
   "reader",
   "sentinel",
   "tail-newline"
  ],
  "prev": "cards",
  "next": "lcs",
  "related": [
   "knapsack",
   "lcs",
   "cards"
  ]
 },
 {
  "slug": "lcs",
  "dir": "最长公共子序列",
  "title": "最长公共子序列",
  "cat": "动态规划",
  "catId": "dp",
  "cx": "O(mn)",
  "fmt": "给定 T 组",
  "summary": "两个序列的最长公共子序列长度（不要求连续）。",
  "docName": "最长公共子序列详解.md",
  "doc": "<h1>最长公共子序列（LCS）详解</h1>\n<blockquote>关键词：动态规划、二维 DP、滚动数组、子序列回溯、Case 编号输出</blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给定两个序列 X（长度 m）和 Y（长度 n），求它们的<strong>最长公共子序列（LCS）的长度</strong>。</p>\n<blockquote><strong>子序列</strong>：从原序列中删掉若干元素后剩下的，<strong>不要求连续</strong>， 但要保持原有先后顺序。例如 <code>B C B A</code> 是 <code>A B C B D A B</code> 的子序列。</blockquote>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td>第 1 行 <code>T</code>（组数，0&lt;T≤10）；随后每组 3 行：<code>m n</code> / 序列 X / 序列 Y</td></tr><tr><td>约束</td><td>0 &lt; m, n &lt; 50；元素由字母、数字等构成，空格分隔</td></tr><tr><td>输出</td><td>每组 <strong>2 行</strong>：先 <code>Case i</code>（i 从 1 开始），再长度</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-2\">二、算法：二维 DP</h2>\n<h3 id=\"sec-3\">状态定义</h3>\n<pre class=\"code\"><code>dp[i][j] = 「X 的前 i 个元素」与「Y 的前 j 个元素」的 LCS 长度</code></pre>\n<h3 id=\"sec-4\">状态转移</h3>\n<pre class=\"code\"><code>若 x[i-1] == y[j-1] :\n      dp[i][j] = dp[i-1][j-1] + 1        ← 这个字符可以接在公共子序列末尾\n否则 :\n      dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n                 ↑ X 的第 i 个用不上   ↑ Y 的第 j 个用不上</code></pre>\n<h3 id=\"sec-5\">初始与答案</h3>\n<ul>\n<li><strong>初始</strong>：<code>dp[0][*] = dp[*][0] = 0</code>（空序列与任何序列的 LCS 都是空）</li>\n<li><strong>答案</strong>：<code>dp[m][n]</code></li>\n</ul>\n<hr>\n<h2 id=\"sec-6\">三、样例演示（第 1 组）</h2>\n<pre class=\"code\"><code>X = A B C B D A B        Y = B D C A B A</code></pre>\n<p>DP 表（行 = X 的前缀，列 = Y 的前缀）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th></th><th>ε</th><th>B</th><th>D</th><th>C</th><th>A</th><th>B</th><th>A</th></tr></thead><tbody><tr><td><strong>ε</strong></td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><strong>A</strong></td><td>0</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td></tr><tr><td><strong>B</strong></td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td>1</td><td><strong>2</strong></td><td>2</td></tr><tr><td><strong>C</strong></td><td>0</td><td>1</td><td>1</td><td><strong>2</strong></td><td>2</td><td>2</td><td>2</td></tr><tr><td><strong>B</strong></td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td><strong>3</strong></td><td>3</td></tr><tr><td><strong>D</strong></td><td>0</td><td>1</td><td><strong>2</strong></td><td>2</td><td>2</td><td>3</td><td>3</td></tr><tr><td><strong>A</strong></td><td>0</td><td>1</td><td>2</td><td>2</td><td><strong>3</strong></td><td>3</td><td><strong>4</strong></td></tr><tr><td><strong>B</strong></td><td>0</td><td>1</td><td>2</td><td>2</td><td>3</td><td><strong>4</strong></td><td>4</td></tr></tbody></table></div>\n<p><strong>答案 = dp[7][6] = 4</strong>，最长公共子序列之一是 <code>B C B A</code>。</p>\n<p><strong>看懂那个 \"+1\" 何时发生</strong>：当 <code>x[i-1] == y[j-1]</code> 时（表里加粗的那些格子）， 说明\"这个字符两边都有\"，于是可以拿它接在 <code>dp[i-1][j-1]</code> 后面，长度 +1。</p>\n<hr>\n<h2 id=\"sec-7\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><code>O(m·n)</code></td><td>每个格子算一次；m,n&lt;50 时最多 2500 次</td></tr><tr><td>空间</td><td><code>O(n)</code></td><td><strong>滚动数组</strong>：算第 i 行只需第 i-1 行</td></tr></tbody></table></div>\n<p><strong>滚动数组写法</strong>（提交版采用）：只保留 <code>prev</code>（上一行）和 <code>cur</code>（当前行）， 算完一行后 <code>prev = cur</code>。详细版为了能打印完整表并回溯子序列，才保留二维。</p>\n<hr>\n<h2 id=\"sec-8\">五、回溯出具体子序列（详细版）</h2>\n<p>从 <code>dp[m][n]</code> 出发往回走：</p>\n<pre class=\"code\"><code>若 x[i-1] == y[j-1]  -&gt;  这个字符属于 LCS，收下，然后 i--, j--\n否则                 -&gt;  往 dp 值大的方向走（上面大就 i--，左边大就 j--）</code></pre>\n<p>走到 <code>i==0</code> 或 <code>j==0</code> 为止，把收下的字符<strong>逆序</strong>即是答案。</p>\n<hr>\n<h2 id=\"sec-9\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>输入格式：先 <a class=\"kw\" href=\"#/k/t-cases\" title=\"概念：t-cases\">T 组</a>数，再 T 组</strong></td><td>与\"读到 EOF 结束\"的写法不同！第 1 行是 T</td></tr><tr><td>2</td><td><strong>输出是每组 2 行</strong></td><td><code>Case i</code> + 长度，<strong>别漏掉 Case 那行</strong>，也别多打空行</td></tr><tr><td>3</td><td><strong><code>Case</code> 的编号从 1 开始</strong>，用输入顺序而非 0</td><td><code>range(1, T+1)</code></td></tr><tr><td>4</td><td><strong>元素未必是单个字符</strong></td><td>题目说\"字母、数字等构成\"，比较时要<strong>整串比</strong>，不能只比首字符</td></tr><tr><td>5</td><td><strong><code>dp</code> 数组要开 (m+1)×(n+1)</strong></td><td>多一圈 0 行/0 列作为边界，避免特判</td></tr><tr><td>6</td><td><strong>输入读取用 <code>readline()</code></strong></td><td>见知识库《输入输出统一规范》，<code>read()</code> 会让终端像卡死</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-10\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>lcs.py</code></td><td><strong>OJ 提交用</strong>（滚动数组，stdout 只输出 <code>Case i</code> + 长度）</td></tr><tr><td><code>lcs_detailed.py</code></td><td>详细版（完整 DP 表 + 回溯子序列 + Sum check）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>lcs.c</code></td><td>C 实现（两行滚动数组，<code>strcmp</code> 整串比较）</td></tr><tr><td><code>lcs_animation.html</code></td><td>浏览器动画（DP 表逐格填充 + 回溯高亮，支持自定义输入）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th></tr></thead><tbody><tr><td><code>2 / 7 6 / A B C B D A B / B D C A B A / 8 9 / b a a b a b a b / a b a b b a b b a</code></td><td><code>Case 1</code> <code>4</code> <code>Case 2</code> <code>6</code></td></tr><tr><td><code>1 / 1 1 / A / A</code></td><td><code>Case 1</code> <code>1</code></td></tr><tr><td><code>1 / 1 1 / A / B</code></td><td><code>Case 1</code> <code>0</code></td></tr><tr><td><code>1 / 3 3 / A B C / X Y Z</code></td><td><code>Case 1</code> <code>0</code></td></tr><tr><td><code>1 / 4 4 / A B C D / A B C D</code></td><td><code>Case 1</code> <code>4</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">九、正确性验证</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性</td><td>400 组随机序列（长度 ≤8）与<strong>暴力枚举 X 所有子序列</strong>对拍</td><td><strong>0 不一致</strong></td></tr><tr><td>详细版自洽</td><td>Sum check：回溯出的子序列长度 == dp[m][n]，且确为 X、Y 的公共子序列</td><td>样例两次均 OK</td></tr><tr><td>三种环境</td><td>管道（OJ）/ 真终端 / PyCharm（isatty=False）</td><td>三种均输出正确</td></tr><tr><td>输出格式</td><td>逐字节检查</td><td><code>Case 1\\r\\n4\\r\\nCase 2\\r\\n6\\r\\n</code></td></tr></tbody></table></div>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：二维 DP",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "状态定义",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "状态转移",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "初始与答案",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "三、样例演示（第 1 组）",
    "lvl": 2
   },
   {
    "id": "sec-7",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "五、回溯出具体子序列（详细版）",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "九、正确性验证",
    "lvl": 2
   }
  ],
  "files": [
   "lcs.py",
   "lcs_detailed.py",
   "lcs.c"
  ],
  "concepts": [
   "out-of-range",
   "reader",
   "t-cases",
   "tail-newline"
  ],
  "prev": "triangle",
  "next": "knapsack",
  "related": [
   "mod11",
   "repunit",
   "knapsack"
  ]
 },
 {
  "slug": "knapsack",
  "dir": "01背包",
  "title": "0/1 背包",
  "cat": "动态规划",
  "catId": "dp",
  "cx": "O(nc)",
  "fmt": "多组 · EOF 结束",
  "summary": "每件物品要么整件拿走要么不拿，容量有限，价值最大。",
  "docName": "01背包详解.md",
  "doc": "<h1>0/1 背包详解</h1>\n<blockquote>关键词：动态规划、二维 DP、一维滚动数组、容量<a class=\"kw\" href=\"#/k/reverse-capacity\" title=\"概念：reverse-capacity\">倒序</a>、方案回溯、多组数据读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a></blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给定 <code>n</code> 件物品，第 <code>i</code> 件重量 <code>w_i</code>、价值 <code>v_i</code>；背包容量上限 <code>c</code>。 从这 <code>n</code> 件里选若干件放入背包，要求<strong>总重量不超过 <code>c</code></strong>，且<strong>总价值最大</strong>（并给出一组方案）。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td><strong>多组数据，读到文件结束（EOF）</strong>；每组 3 行：<code>n c</code> / <code>n</code> 个价值 / <code>n</code> 个重量</td></tr><tr><td>约束</td><td><code>n ≤ 50</code>，<code>c ≤ 500</code>，组数不超过 20</td></tr><tr><td>输出</td><td>每组 <strong>2 行</strong>：先 <code>Case i</code>（i 从 1 开始），再最大价值</td></tr></tbody></table></div>\n<p><strong>为什么叫 0/1</strong>：每件物品只有两种状态 —— <strong>整件拿走（1）</strong>或<strong>不拿（0）</strong>，不能只拿一部分。 （如果可以切成任意大小装，\"部分背包\"就该用贪心按单位价值排序了。）</p>\n<hr>\n<h2 id=\"sec-2\">二、算法：二维 DP</h2>\n<h3 id=\"sec-3\">状态定义</h3>\n<pre class=\"code\"><code>dp[i][j] = 只考虑前 i 件物品、背包容量上限为 j 时，能取得的最大总价值</code></pre>\n<h3 id=\"sec-4\">状态转移</h3>\n<pre class=\"code\"><code>dp[i][j] = max( dp[i-1][j] ,                  ← 不选第 i 件\n                dp[i-1][j-w_i] + v_i )         ← 选第 i 件（前提 j ≥ w_i）\n                └─ 腾出 w_i 的容量，剩下的容量留给前 i-1 件</code></pre>\n<p>两个来源<strong>恰好对应\"这件要还是不要\"</strong>，取大的就是\"最有利的选择\"。</p>\n<h3 id=\"sec-5\">初始与答案</h3>\n<ul>\n<li><strong>初始</strong>：<code>dp[0][*] = 0</code>（一件都不放，价值只能是 0）</li>\n<li><strong>答案</strong>：<code>dp[n][c]</code>（右下角）</li>\n</ul>\n<h3 id=\"sec-6\">为什么 <code>0</code> 初始化是对的（和数字三角形不一样！）</h3>\n<p>数字三角形那道题<strong>不能</strong>用 0 初始化 dp（有负数时会算错），因为那里<strong>必须走完整条路径</strong>、 每一格都会被用上。而背包这里，\"一件都不拿\"本身就是<strong>允许的合法方案</strong>（价值 0）， 所以 0 初始化天然就是\"空集\"这个可行解，取 max 时自然会把空集考虑进去。</p>\n<p>⚠️ <strong>但如果题目改问\"恰好装满容量 c\"</strong>，就必须把 dp 初始化成 <code>-∞</code>（<code>dp[0]=0</code>，其余 <code>-inf</code>）， 否则\"装不满\"会被当成本来价值为 0 的合法解。本题问的是\"<strong>不超过</strong> <code>c</code>\"，所以用 0。</p>\n<hr>\n<h2 id=\"sec-7\">三、样例演示（第 1 组）</h2>\n<pre class=\"code\"><code>n = 3, c = 4        v = [1, 3, 4]        w = [3, 1, 4]</code></pre>\n<p>DP 表（行 = 只考虑前 i 件，列 = 容量上限 j）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th></th><th>j=0</th><th>j=1</th><th>j=2</th><th>j=3</th><th>j=4</th></tr></thead><tbody><tr><td><strong>i=0</strong>（没物品）</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><strong>i=1</strong>（v1,w3）</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td></tr><tr><td><strong>i=2</strong>（v3,w1）</td><td>0</td><td><strong>3</strong></td><td>3</td><td>3</td><td><strong>4</strong></td></tr><tr><td><strong>i=3</strong>（v4,w4）</td><td>0</td><td>3</td><td>3</td><td>3</td><td>4</td></tr></tbody></table></div>\n<p><strong>答案 = dp[3][4] = 4</strong>，方案 = 拿第 1、2 件（重量 3+1=4 ≤ 4，价值 1+3=4）。</p>\n<p>盯几个关键格：</p>\n<ul>\n<li><code>dp[2][2]=3</code>：前两件、容量 2，拿第 2 件（重 1、价 3）比拿第 1 件（重 3、装不下）好。</li>\n<li><code>dp[3][4]=4</code>：第 3 件（重 4、价 4）<strong>装得下</strong>，<code>dp[2][0]+4 = 4</code>；不选它则是 <code>dp[2][4]=4</code>。</li>\n</ul>\n<p>两边<strong>打平</strong> → 取谁都行，这里按\"不选\"走，所以最终方案里没有第 3 件。</p>\n<blockquote>第 2 组样例 <code>n=5, c=10, v=[6,3,5,4,6], w=[2,2,6,5,4]</code> 答案 <strong>15</strong> （拿第 1、2、5 件：重 2+2+4=8 ≤ 10，价 6+3+6=15）。</blockquote>\n<hr>\n<h2 id=\"sec-8\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>版本</th><th>时间</th><th>空间</th><th>用途</th></tr></thead><tbody><tr><td>二维表</td><td><code>O(n·c)</code></td><td><code>O(n·c)</code></td><td>详细版：要回溯方案，必须留全表</td></tr><tr><td>一维滚动</td><td><code>O(n·c)</code></td><td><code>O(c)</code></td><td><strong>提交版</strong>：只要答案，压掉物品那一维</td></tr></tbody></table></div>\n<p>一维滚动数组的写法（<code>j</code> <strong>必须倒序</strong>）：</p>\n<pre class=\"code\"><code>for 每件物品 (v, w):\n    for j = c down to w:\n        dp[j] = max(dp[j], dp[j-w] + v)</code></pre>\n<p><code>n≤50, c≤500</code> 时内层最多 <code>50 × 501 = 25050</code> 次操作，随便过。</p>\n<hr>\n<h2 id=\"sec-9\">五、回溯出具体方案（详细版）</h2>\n<p>从 <code>dp[n][c]</code> 出发往回走：</p>\n<pre class=\"code\"><code>对 i = n, n-1, ..., 1：\n    若 dp[i][j] != dp[i-1][j]  →  第 i 件一定被选了，收下，容量 j -= w_i\n    若 dp[i][j] == dp[i-1][j]  →  不选它也能拿到同样价值，判它没收，j 不变</code></pre>\n<p><strong>为什么\"不等\"就意味着选了它</strong>：<code>dp[i][j] = max(dp[i-1][j], dp[i-1][j-w_i]+v_i)</code>。 如果不等于 <code>dp[i-1][j]</code>，那它只能是第二个来源 —— 也就是\"选了第 i 件\"。</p>\n<p><strong>打平时为什么判\"没选\"</strong>：打平说明两条路一样好，那么\"不选它\"必定也是最优方案之一， 判定为不选是合法的（不会漏掉\"存在最优解\"这件事）。</p>\n<blockquote>⚠️ 回溯时的 <code>j</code> 是一路<strong>只减不增</strong>的（走到 i 时容量只会因为\"收了这件\"而变小）。 详细版打印的回溯步骤必须保持<strong>走的顺序（i 从 n 递减）</strong>；若为了让物品号好看而倒序输出， <code>j</code> 会出现 \"3 → 4\" 这种回涨，和\"从 j=c 往回走\"这句话自相矛盾。  <strong>两处断言把这种错钉死</strong>：<code>verify_knapsack.py</code> 里 <code>if jb != j: return 错误</code>（每步的起始容量 必须等于上一步留下的容量），以及详细版 Sum check 里的 <code>ok_walk</code>。两条都经过<strong>变异测试</strong>验证 —— 把 <code>steps.reverse()</code> 加回去，它们立刻报 MISMATCH 而不是照样 OK。</blockquote>\n<hr>\n<h2 id=\"sec-10\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>容量维必须倒序</strong></td><td>正序会让 <code>dp[j-w]</code> 读到<strong>已被本物品更新过</strong>的值，等于同一件反复装 → 变成<strong>完全背包</strong>。锚定用例：<code>v=[5], w=[3], c=10</code> 应为 <strong>5</strong>，正序会算出 <strong>15</strong></td></tr><tr><td>2</td><td><strong><code>0</code> 初始化 vs <code>-∞</code> 初始化</strong></td><td>本题问\"不超过 c\"，用 0；若问\"恰好装满 c\"，必须用 <code>-inf</code></td></tr><tr><td>3</td><td><strong><code>w_i &gt; c</code> 的物品</strong></td><td>装不下，等价于跳过。Python 版写 <code>if w &gt; cap: continue</code>；C 版靠 <code>for (j=c; j&gt;=w; --j)</code> 循环体不进</td></tr><tr><td>4</td><td><strong><code>w_i = 0</code> 的物品</strong></td><td>白送价值，容量 0 也能装。倒序/正序都只应算<strong>一次</strong>；动画里要注意\"两个候选格子重合\"的显示</td></tr><tr><td>5</td><td><strong>负重量</strong></td><td>非法数据。Python 版倒序 <code>range(cap, w-1, -1)</code> 会因 <code>w&lt;0</code> 而<strong>下标<a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a></strong>，必须在读取时拦掉；C 版同理（<code>j &gt;= w</code> 恒成立 → 越界读写）</td></tr><tr><td>6</td><td><strong>负数价值</strong></td><td>题目只说\"整数\"。<code>0</code> 初始化天然支持\"宁可一件不放\"，无需特殊处理</td></tr><tr><td>7</td><td><strong>多组数据 = EOF 结束</strong></td><td>题面写\"输入直到文件结束\"，<strong>不是</strong>\"第 1 行 T 组数\"。本仓库四道题出现过三种结束方式（均分=EOF、数字三角形=H=0 哨兵、LCS=T 组数），<strong>不能拿上一题的习惯套</strong></td></tr><tr><td>8</td><td><strong>输出每组 2 行</strong></td><td><code>Case i</code> + 最大价值，别漏 Case 行、也别在组间插空行</td></tr><tr><td>9</td><td><strong>输入读取用 <code>readline()</code></strong></td><td>禁止 <code>read()</code>（终端像卡死）、禁止 <code>isatty()</code> 分流（PyCharm 会踩空）—— 该坑本仓库已踩两次</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>knapsack.py</code></td><td><strong>OJ 提交用</strong>（一维滚动数组，stdout 只输出 <code>Case i</code> + 最大价值）</td></tr><tr><td><code>knapsack_detailed.py</code></td><td>详细版（物品表 + 完整 DP 表 + 逐步回溯 + Sum check + 2^n 暴力对拍）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>knapsack.c</code></td><td>C 实现（一维滚动数组，<code>long long</code> 防溢出，EOF 多组）<strong>—— 本机无编译器，从未编译验证</strong></td></tr><tr><td><code>knapsack_animation.html</code></td><td>浏览器动画（DP 表逐格填充 + 候选高亮 + 回溯染色，支持自定义输入）</td></tr><tr><td><code>verify_knapsack.py</code></td><td>自动对拍脚本（与 2^n 暴力枚举 + 方案可执行性 + 两版一致性）</td></tr><tr><td><code>verify_knapsack_animation.js</code></td><td>动画对拍脚本（<code>node verify_knapsack_animation.js</code>，抽 <code>&lt;script&gt;</code> + DOM stub 实跑）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th></tr></thead><tbody><tr><td><code>3 4 / 1 3 4 / 3 1 4</code></td><td><code>Case 1</code> <code>4</code></td></tr><tr><td><code>5 10 / 6 3 5 4 6 / 2 2 6 5 4</code></td><td><code>Case 2</code> <code>15</code>（两组连起来时）</td></tr><tr><td><code>1 10 / 5 / 3</code></td><td><code>5</code> ← <strong>0/1 锚定</strong>：正序容量会算成 15</td></tr><tr><td><code>1 0 / 5 / 0</code></td><td><code>5</code> ← 零重量物品，容量 0 也装得下</td></tr><tr><td><code>2 1 / -5 3 / 1 1</code></td><td><code>3</code> ← 负数价值，宁可一件不放</td></tr><tr><td><code>1 2 / 9 / 3</code></td><td><code>0</code> ← 装不下</td></tr><tr><td><code>0 5 /（空）/（空）</code></td><td><code>0</code> ← n=0</td></tr><tr><td><code>3 6 / 10 30 20 / 2 4 3</code></td><td><code>40</code> ← <strong>打平锚定</strong>：30+20 重量 4+3=7 装不下，正解是 10+30</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-13\">九、正确性验证</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性</td><td>穷举 <code>n≤3, c≤6, v/w∈[0,3]</code> 全组合 <strong>30583 组</strong> + 随机密集 <strong>3000 组</strong>，与 <code>2^n</code> 枚举所有子集对拍</td><td><strong>0 不一致</strong></td></tr><tr><td>方案可执行性</td><td>回溯方案逐件核对：编号不重不漏、总重 ≤ c、总价 == <code>dp[n][c]</code>，且 dp 表每格独立复算满足递推式</td><td>穷举 <strong>44286 组</strong> + 随机 <strong>600 组</strong> 全通过</td></tr><tr><td>两版一致性</td><td>详细版二维表 <code>dp[n][c]</code> == 提交版一维滚动 <code>knapsack()</code></td><td>全一致</td></tr><tr><td>锚定用例</td><td>0/1 vs 完全背包、零重量、负数价值、装不下、n=0、打平</td><td>11 条全过</td></tr><tr><td>Sum check</td><td>详细版每组自校（总重 ≤ c、总价 == dp、路径合法、2^n 对拍）</td><td>样例两组均 ALL OK</td></tr><tr><td>动画（逻辑层）</td><td><code>node verify_knapsack_animation.js</code>：DP vs 独立暴力 400 组、回溯不变式同批、逐步 <code>render()</code> 不崩、乱序重放可重现、复用判据（含\"只改容量\"\"只改件数\"两侧）、非法输入 8 种、w=0 边界、终态升序</td><td>全通过（脚本随本目录交付，可复跑）</td></tr><tr><td>动画（渲染层）</td><td>headless Chrome 实际渲染截图：初始态 / 计算中 / 回溯中 / 终态，核对布局、候选与来源高亮、物品行染色、解说文案与 dp 表数值</td><td>四态均正确（曾借此抓出一处\"解说声称已排序、实际未排序\"的文案错误）</td></tr><tr><td>断言有效性（变异测试）</td><td>把代码<strong>故意改回错的</strong>，看验证脚本认不认：动画 6 种变异（w=0 漏标 pick、回溯倒排、dp 丢 max、复用判据只看行数、方案不排序、回溯比原始值）、详细版 4 种变异（steps 倒排、dp 末格 +1、回溯谎报空集、关掉暴力对拍）</td><td><strong>6/6 与 4/4 全部被抓</strong>；这轮借此发现原 <code>ok_path</code> 是打不掉任何变异的<strong>装饰性断言</strong>，已替换为可失败的 <code>ok_walk</code></td></tr><tr><td>三环境</td><td>管道（OJ）/ 终端 / <code>isatty=False</code> 可逐行读</td><td>三种均正确</td></tr><tr><td>输出格式</td><td>逐字节检查（<code>cat -A</code>）</td><td><code>Case 1\\r\\n4\\r\\nCase 2\\r\\n15\\r\\n</code>，<strong>stderr 为空</strong></td></tr><tr><td>AST 兼容性</td><td><code>ast</code> 解析调用名，确认无 <code>f-string</code> / <code>.buffer</code> / <code>nonlocal</code> / 类型注解 / <code>input()</code></td><td>通过</td></tr></tbody></table></div>\n<p><strong>两个特殊锚定用例</strong>（防回归，务必保留）：</p>\n<ul>\n<li><code>v=[5], w=[3], c=10</code> → <strong>5</strong>：钉死「容量维倒序」。写成正序（完全背包）会得 15。</li>\n<li><code>3 6 / 10 30 20 / 2 4 3</code> → <strong>40</strong>：钉死「选它/不选它」的大小比较。</li>\n</ul>\n<p>一眼看上去 30+20=50 最大，但它俩重量 4+3=7 已经超了容量 6。</p>\n<hr>\n<h2 id=\"sec-14\">十、C 版本说明</h2>\n<p><code>knapsack.c</code> <strong>本机没有任何 C 编译器（gcc/clang/tcc/cl/zig 全无），从未编译验证过</strong>。 交付时须知悉这一点。要点：</p>\n<ul>\n<li>一维 <code>dp</code> 数组 + 倒序容量循环（<code>for (j = c; j &gt;= w; --j)</code>）</li>\n<li><code>long long</code> 存价值/重量，防溢出；<code>%lld</code> 读写</li>\n<li><code>setvbuf(stdout, NULL, _IONBF, 0)</code> 让每组输出立刻可见</li>\n<li><code>while (scanf(\"%d %d\", &amp;n, &amp;c) == 2)</code> 实现\"多组读到 EOF\"</li>\n<li>负重量必须在读取时拦掉（否则 <code>j &gt;= w</code> 恒成立，<code>dp[j-w]</code> 越界）</li>\n</ul>\n<p><strong>没有编译器时能做到的验证</strong>：把 <code>knapsack.c</code> 的算法<strong>逐行转写成 Python 镜像</strong></p>\n<p>（保留 <code>for (j = c; j &gt;= w; j--)</code> 的循环边界、每轮全量清零、无额外 <code>w &gt; c</code> 短路）， 再与提交版对拍 —— 随机 <strong>20000 组 + 2 个样例全部一致</strong>。</p>\n<blockquote>⚠️ 这只说明 <strong>C 版的算法结构没写错</strong>，<strong>不等于</strong> C 版能编译、能过 OJ。 语法错误、<code>scanf</code> 返回值、平台差异等，仍需在有编译器的机器上 <code>gcc -O2</code> 后实测。</blockquote>\n<hr>\n<h2 id=\"sec-15\">十一、如何复跑验证</h2>\n<pre class=\"code bash\"><code>cd E:/沈云付算法/01背包\n\n# ① 算法对拍：33583 组与 2^n 暴力枚举 + 44886 组方案可执行性 + 两版一致性 + 11 条锚定\npython verify_knapsack.py\n# 期望: OK: mini==brute 30583 exhaustive + 3000 dense cases | trace legal 44286 + 600 cases | detailed==mini | anchors 11\n\n# ② 动画逻辑：node 抽 &lt;script&gt; + DOM stub 实跑\nnode verify_knapsack_animation.js\n# 期望: OK: DP==暴力 400 组 | 回溯不变式同批通过 | ... | 终态升序 + 自校验\n\n# ③ 详细版（看过程 + Sum check）\npython knapsack_detailed.py &lt; input.txt\n\n# ④ 提交版（stdout 必须只有答案、stderr 必须为空）\npython knapsack.py &lt; input.txt 2&gt;/dev/null | od -c</code></pre>\n<p><strong>建议每改一处就跑一遍 ①②</strong>。这两条正是本轮抓到真 bug 的地方：</p>\n<ul>\n<li>① 抓到「回溯 steps 被倒排 → 容量 j 回涨」</li>\n<li>② 抓到「w=0 且 v=0 时整步没有来源高亮」（变异测试补的用例才钉得住）</li>\n<li>变异的做法值得保留：<strong>把代码故意改回错的，看断言认不认</strong>。打不掉任何变异的断言就是装饰品</li>\n</ul>\n<p>—— 本轮的 <code>ok_path</code> 就是这样被揪出来并替换成 <code>ok_walk</code> 的。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：二维 DP",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "状态定义",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "状态转移",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "初始与答案",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "为什么 0 初始化是对的（和数字三角形不一样！）",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "三、样例演示（第 1 组）",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "五、回溯出具体方案（详细版）",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-15",
    "text": "十一、如何复跑验证",
    "lvl": 2
   }
  ],
  "files": [
   "knapsack.py",
   "knapsack_detailed.py",
   "knapsack.c",
   "verify_knapsack.py"
  ],
  "concepts": [
   "eof",
   "out-of-range",
   "reader",
   "reverse-capacity",
   "tail-newline"
  ],
  "prev": "lcs",
  "next": "components",
  "related": [
   "cards",
   "catalan",
   "components"
  ]
 },
 {
  "slug": "components",
  "dir": "连通分支数",
  "title": "连通分支数",
  "cat": "并查集",
  "catId": "dsu",
  "cx": "O(e·α(n))",
  "fmt": "多组 · EOF 结束（图之间空一行）",
  "summary": "数一个无向图被分成几坨，孤立顶点各自算一坨。",
  "docName": "连通分支数详解.md",
  "doc": "<h1>连通分支数详解</h1>\n<blockquote>关键词：并查集、Union-Find、路径压缩、按大小合并、多组数据读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a>、图之间<a class=\"kw\" href=\"#/k/blank-line\" title=\"概念：blank-line\">空一行</a></blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给出一个无向图 G，数出它被分成几个<strong>连通分支</strong>。</p>\n<blockquote><strong>连通分支</strong>：若两个顶点之间存在通路，就说它们连通。把「互相连通」的顶点归成一堆， 每一堆就是一个连通分支，题目要的是堆的个数。 <strong>孤立顶点</strong>（没有任何边碰到它）自己单独算一堆。</blockquote>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td><strong>多个</strong>无向图，<strong>读到文件结束（EOF）</strong>。每个图：第 1 行 <code>n e</code>（顶点数、边数），随后 <code>e</code> 行每行两个端点 <code>a b</code></td></tr><tr><td>约束</td><td>顶点编号 <strong>1-based</strong>（<code>1..n</code>）；两个图之间空一行</td></tr><tr><td>输出</td><td>每个图<strong>一行</strong>，打印该图的连通分支数（<strong>没有 <code>Case i</code> 前缀</strong>）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-2\">二、判题格式是反推出来的（铁律 2）</h2>\n<p>题面文字不足以定格式，必须拿样例对质。三件事逐条确认：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>要确认的事</th><th>结论</th><th>依据</th></tr></thead><tbody><tr><td>多组还是单组？</td><td><strong>多组</strong></td><td>题面写\"有多个无向图数据\"，样例给了 2 个图</td></tr><tr><td>怎么结束？</td><td><strong>EOF</strong></td><td>题面没给组数 T，也没写 <code>0 0</code> 哨兵；样例两个图之间<strong>空一行</strong></td></tr><tr><td>每组输出几行？</td><td><strong>1 行</strong>，只有数字</td><td>样例输出 <code>1</code> / <code>1</code> 两行，没有 <code>Case i</code></td></tr><tr><td>顶点编号从几开始？</td><td><strong>1-based</strong></td><td>样例 2 是 <code>n=5</code> 的图，输出 <strong>1</strong>。若按 0-based 读，顶点 <code>5</code> 就是孤立点，应输出 <strong>2</strong> —— 与样例矛盾</td></tr></tbody></table></div>\n<p><strong>\"图与图之间空一行\"不用写特判。</strong> <code>make_reader()</code> 是按 token 吐数据的： <code>line.split()</code> 对空行返回空列表，<code>while not buf</code> 会继续读下一行，空行被<strong>自动吞掉</strong>。 （反过来说，如果当初图省事写成\"先 <code>readline()</code> 读 n e，再 <code>readline()</code> 读 e 行边\"， 空行就会直接把 <code>int()</code> 打崩 —— 这正是铁律 1、6 要防的那类写法。）</p>\n<p><strong>唯一一处需要人拿主意的地方：<code>n=0</code>。</strong></p>\n<ul>\n<li>解释 A：<strong>0 个顶点的图</strong>，连通分支数 = 0 → 应该输出 <code>0</code></li>\n<li>解释 B：<strong><code>0 0</code> 哨兵</strong>，表示输入结束 → 不输出</li>\n</ul>\n<p>两者互斥，只能选一个。本题选 <strong>B</strong>： 题面既没写哨兵、样例也没有 0；若数据里真有 <code>0 0</code> 哨兵，选 B 正好不多输出一行， 而\"OJ 专门造一个 0 顶点的图并期望输出 0\"是不现实的。 提交版在 <code>n=0</code> 时停住并往 stderr 打一行 <code>[!]</code> 提示（stdout 保持干净）。 <strong>若你手上有 AC 过的参考代码，请照铁律 2 用它的循环写法复核这一处。</strong></p>\n<hr>\n<h2 id=\"sec-3\">三、算法：并查集（Union-Find）</h2>\n<h3 id=\"sec-4\">直觉</h3>\n<p>不要真去搜图，只要盯住一件事：</p>\n<blockquote><strong>一条边 <code>(a, b)</code> 最多只能让分支数减少 1 —— 而且仅当 <code>a</code> 和 <code>b</code> 原本不连通时。</strong></blockquote>\n<p>于是流程极简：</p>\n<pre class=\"code\"><code>分支数 = n                                  ← 一开始每个顶点各成一派\n对每条边 (a, b):\n    ra = find(a);  rb = find(b)\n    若 ra == rb:  什么都不做                  ← 自环 / 重边 / 成环\n    否则:         把两派并起来，分支数 -= 1</code></pre>\n<h3 id=\"sec-5\">不变量与正确性</h3>\n<ul>\n<li><strong>不变量</strong>：处理完任意条边后，<code>当前分支数 = n − 成功合并的次数</code>，</li>\n</ul>\n<p>且每个顶点与其所在派的<strong>代表元（根）</strong>一一对应，\"同根 ⟺ 连通\"。</p>\n<ul>\n<li>初始：无边时 n 个顶点各自独立，分支数 = n，不变量成立。</li>\n<li>归纳：并查集只把<strong>同属一个连通块</strong>的顶点归到同一个根下，因此\"同根 ⟺ 存在通路（由已扫过的边构成）\"。</li>\n</ul>\n<p>扫完全部边后，\"同根\"就等价于\"在原图中连通\"，根的个数即连通分支数。</p>\n<ul>\n<li>孤立顶点从没被任何边碰到，父节点始终指向自己，<strong>天然自成一派，无需特判</strong>。</li>\n</ul>\n<h3 id=\"sec-6\">两个优化（本题都用了）</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>优化</th><th>做法</th><th>作用</th></tr></thead><tbody><tr><td>路径压缩</td><td><code>find</code> 时把沿途节点直接挂到根上</td><td>后续查找近乎 O(1)</td></tr><tr><td>按大小合并</td><td>小树挂到大树上</td><td>树高保持 O(log n)</td></tr></tbody></table></div>\n<p>两者叠加后，每条边的均摊代价是 <strong>O(α(n))</strong>（反阿克曼函数，实际就是常数）。</p>\n<h3 id=\"sec-7\">备选写法：DFS / BFS 染色</h3>\n<p>从每个未访问顶点出发搜一遍，搜完一批就是一支。时间 <code>O(n + e)</code>。 <strong>提交版选并查集</strong>，因为不用建邻接表、不用递归、不用队列，代码最短且天然免疫爆栈。 详细版把 BFS 也实现了一遍，<strong>专门用来和并查集互相印证</strong>（两条独立的路得出同一个数才算放心）。</p>\n<hr>\n<h2 id=\"sec-8\">四、样例演示（手推第 2 个图）</h2>\n<pre class=\"code\"><code>5 8\n1 2  1 3  1 4  1 5  2 3  2 4  3 4  4 5</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>边</th><th>find(a)</th><th>find(b)</th><th>判断</th><th>分支数</th></tr></thead><tbody><tr><td>1: (1,2)</td><td>1</td><td>2</td><td>不同支 → 合并</td><td>5 → 4</td></tr><tr><td>2: (1,3)</td><td>1</td><td>3</td><td>不同支 → 合并</td><td>4 → 3</td></tr><tr><td>3: (1,4)</td><td>1</td><td>4</td><td>不同支 → 合并</td><td>3 → 2</td></tr><tr><td>4: (1,5)</td><td>1</td><td>5</td><td>不同支 → 合并</td><td>2 → 1</td></tr><tr><td>5: (2,3)</td><td>1</td><td>1</td><td><strong>同一支</strong> → 跳过</td><td>1</td></tr><tr><td>6: (2,4)</td><td>1</td><td>1</td><td><strong>同一支</strong> → 跳过</td><td>1</td></tr><tr><td>7: (3,4)</td><td>1</td><td>1</td><td><strong>同一支</strong> → 跳过</td><td>1</td></tr><tr><td>8: (4,5)</td><td>1</td><td>1</td><td><strong>同一支</strong> → 跳过</td><td>1</td></tr></tbody></table></div>\n<p><strong>答案 = 1</strong>（第 1 个图 <code>2 1 / 1 2</code> 也是 1）。注意后 5 条边全是\"白扫\"的： 它们只是把已经连通的两个点又连了一遍，分支数一点没动。</p>\n<hr>\n<h2 id=\"sec-9\">五、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><code>O(e·α(n))</code></td><td>每条边两次 <code>find</code>；α 是反阿克曼函数，实际≈常数</td></tr><tr><td>空间</td><td><code>O(n + e)</code></td><td>并查集本身只占 <code>O(n)</code>（<code>parent</code> / <code>size</code> 两个长度 n+1 的数组）；但 <code>main()</code> 要把 e 条边先读进 <code>edges</code> 列表，所以<strong>整程序</strong>是 <code>O(n + e)</code></td></tr><tr><td>读取</td><td><code>O(总 token 数)</code></td><td><code>make_reader()</code> 取 token 必须 <strong>O(1)</strong> —— 写成 <code>buf.pop(0)</code> 会退化成 O(k²)，见下</td></tr></tbody></table></div>\n<p>实测：20 万顶点的链（199999 条边）一次跑完；<strong>10 万条边全挤在同一行</strong>（专测<a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>是否 O(1)）0.11 秒。 无递归，不存在爆栈风险。</p>\n<hr>\n<h2 id=\"sec-10\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>每扫一条边就减 1</strong></td><td>最典型的错法。<a class=\"kw\" href=\"#/k/self-loop\" title=\"概念：self-loop\">自环</a>、重边、成环都不该减。锚定：<code>2 1 / 1 1</code> 必须输出 <strong>2</strong>（错解得 1）</td></tr><tr><td>2</td><td><strong>漏算孤立顶点</strong></td><td>把\"分支数\"当成\"出现在边里的顶点分成了几堆\"就会漏。锚定：<code>3 1 / 1 2</code> 必须输出 <strong>2</strong></td></tr><tr><td>3</td><td><strong>顶点编号是 1-based</strong></td><td>数组要开 <code>n+1</code>，下标 0 空着不用；从样例反推确认（见第二节）</td></tr><tr><td>4</td><td><strong>图之间空一行</strong></td><td>用 <code>make_reader()</code> 自动吞掉；<strong>别用</strong> <code>readline()</code> + <code>int()</code> 硬读（空行会 ValueError）</td></tr><tr><td>5</td><td><strong><code>n=0</code> 二义性</strong></td><td>0 个顶点的图（答案 0）vs <code>0 0</code> 哨兵（结束）。本题按\"结束\"处理，理由见第二节</td></tr><tr><td>6</td><td><strong>端点<a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a>宁可中止</strong></td><td>不在 <code>1..n</code> 内的端点若放过，会把伪答案打进 stdout（铁律 6）</td></tr><tr><td>7</td><td><strong>Windows 上 <code>print</code> 的换行是 <code>\\r\\n</code></strong></td><td>Python 的 stdout 处于文本模式，往管道写时把 <code>\\n</code> 翻译成 <code>\\r\\n</code>（Linux OJ 上仍是 <code>\\n</code>）。这是平台差异，不是本题的输出问题；判题一般不区分</td></tr><tr><td>8</td><td><strong><code>read()</code> 会让终端像卡死</strong></td><td>一律 <code>readline()</code>（铁律 1，本仓库已踩两次）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>components.py</code></td><td><strong>OJ 提交用</strong>（并查集，stdout 只输出分支数）</td></tr><tr><td><code>components_detailed.py</code></td><td>详细版（邻接表 + 并查集逐边过程 + BFS 复核 + Sum check）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>components.c</code></td><td>C 实现。⚠️ <strong>本机无任何 C 编译器，从未编译验证</strong>；且 <code>scanf</code> 是前缀式解析，对<strong>畸形输入</strong>比 Python 版宽容（可能静默结束而不打 <code>[!]</code>），<strong>合法输入下两者一致</strong>。详见文件头注释</td></tr><tr><td><code>components_animation.html</code></td><td>浏览器动画（SVG 画图 + 并查集合并着色 + 数组表，支持自定义输入、多图可切换，粘贴 OJ 原文即可）</td></tr><tr><td><code>verify_components.py</code></td><td>算法对拍脚本（并查集 vs 邻接矩阵暴力 + 步骤复算 + <strong>分区级</strong>三方对照 + 子进程端到端 + 单行大数据性能）</td></tr><tr><td><code>verify_components_animation.js</code></td><td>动画对拍脚本（node 抽 <code>&lt;script&gt;</code> 配 DOM stub 实跑：锚定 / 随机 / 跳转一致性 / 渲染与几何断言）</td></tr><tr><td><code>连通分支数详解.md</code></td><td>本文档</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th><th>说明</th></tr></thead><tbody><tr><td><code>2 1 / 1 2</code></td><td><code>1</code></td><td>题面样例 1</td></tr><tr><td><code>5 8 / 1 2 / 1 3 / 1 4 / 1 5 / 2 3 / 2 4 / 3 4 / 4 5</code></td><td><code>1</code></td><td>题面样例 2</td></tr><tr><td><code>3 1 / 1 2</code></td><td><code>2</code></td><td><strong>锚定</strong>：顶点 3 孤立，必须单独成支</td></tr><tr><td><code>4 0</code></td><td><code>4</code></td><td><strong>锚定</strong>：一条边都没有 → 4 支</td></tr><tr><td><code>2 1 / 1 1</code></td><td><code>2</code></td><td><strong>锚定</strong>：自环不能让分支数减少</td></tr><tr><td><code>3 3 / 1 2 / 1 2 / 2 1</code></td><td><code>2</code></td><td><strong>锚定</strong>：重边只算一次</td></tr><tr><td><code>1 0</code></td><td><code>1</code></td><td>单个顶点自成一支</td></tr><tr><td><code>6 3 / 1 2 / 2 3 / 4 5</code></td><td><code>3</code></td><td>两块 + 孤立点 6</td></tr><tr><td><code>7 7 / 1 2 / 2 3 / … / 7 1</code></td><td><code>1</code></td><td>一个环</td></tr><tr><td><code>0 0</code></td><td>（无输出）</td><td>按\"输入结束\"处理</td></tr></tbody></table></div>\n<p>多图连排（题面样例原样）应输出 <code>1</code> / <code>1</code> 两行。</p>\n<hr>\n<h2 id=\"sec-13\">九、正确性验证</h2>\n<p>跑过的命令与<strong>实际</strong>输出（不是\"应该没问题\"）：</p>\n<pre class=\"code bash\"><code>python verify_components.py\n# OK: mini==brute 1098 exhaustive + 3000 random + 300 sparse cases | trace faithful |\n#     partition uf==bfs==brute | find_root==simple_find | anchors 12 | subprocess 14/14 |\n#     big chain n=200000 | single-line 1e5 edges 0.11 秒</code></pre>\n<pre class=\"code bash\"><code>node verify_components_animation.js    # 抽 &lt;script&gt; 配 DOM stub 实跑\n# OK: 动画 JS 实跑通过 | 解析 8 个坏输入全拦住 | 锚定 10 | 随机对拍 800 |\n#     渲染元素数量/布局校验 | 重边错开 + 自环成圈</code></pre>\n<pre class=\"code bash\"><code># 渲染层（CSS/布局）node 测不到，用本机 Chrome headless 实拍\n\"/c/Program Files/Google/Chrome/Application/chrome.exe\" --headless=new --disable-gpu \\\n  --hide-scrollbars --virtual-time-budget=3000 --window-size=1280,1100 \\\n  --screenshot=\"C:/Users/lenovo/AppData/Local/Temp/shot.png\" \\\n  \"file:///E:/沈云付算法/连通分支数/components_animation.html\"\n# 想停在中间某步：临时副本注入 &lt;script&gt;pickGraph(1); for (var k=0;k&lt;5;k++) nextStep();&lt;/script&gt;</code></pre>\n<pre class=\"code bash\"><code># 变异测试：把每处修复逐个\"还原成错的\"，看断言是否真会咬（打不掉的断言 = 装饰品）</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>把什么改回错的（精确到改动文本）</th><th>谁抓住</th><th>结果</th></tr></thead><tbody><tr><td>动画 <code>isLone</code>：<code>st.size[r] === 1</code> → <code>r === v</code></td><td>\"同根必须同色\"断言</td><td><strong>FAIL 19 处</strong></td></tr><tr><td>动画几何：<code>clampX/clampY</code> 四个夹边界函数体改成直接 <code>return x/y</code></td><td>几何断言（含全组合扫描）</td><td><strong>FAIL 3 处</strong>（<code>n=9 (1,2)×11</code> → <code>miny:-12</code>、<code>n=30 (1,2)×12</code> → <code>miny:-28</code>）</td></tr><tr><td>动画几何：标号回到 <code>+ ox*0.9</code>（偏移算两遍）</td><td>同上</td><td><strong>FAIL 4 处</strong></td></tr><tr><td>动画几何：自环标号回到顶点上方 <code>cy - 9</code></td><td>同上</td><td><strong>FAIL 2 处</strong></td></tr><tr><td>动画几何：重边间距写死 <code>var step = 11</code></td><td>同上（斜对角重边）</td><td><strong>FAIL 2 处</strong>（<code>miny: -80</code>）</td></tr><tr><td>动画解说：<code>pr.sra/pr.srb</code> → <code>st.size[...]</code>（用合并<strong>后</strong>的大小）</td><td>\"必须讲合并前两支大小\"断言</td><td><strong>FAIL 3 处</strong></td></tr><tr><td>读取器：<code>reversed(...)</code>+<code>pop()</code> → <code>pop(0)</code></td><td>单行 10 万边的性能用例</td><td><strong>FAIL</strong>（23.2 秒 &gt; 10 秒）</td></tr><tr><td>读取器：只去掉 <code>reversed</code>（仍用 <code>pop()</code>）</td><td>子进程端到端 14 例</td><td><strong>FAIL 8 处</strong>（stdout 全空）</td></tr><tr><td>详细版：<code>\"attached\": attached,</code> → <code>\"attached\": a,</code>（记成边的第一个端点）</td><td>步骤复算（<code>kept == attached</code>）</td><td><strong>FAIL 4269 处</strong>（本行数字为上述精确改动的实测值；复审用<strong>相近但不同</strong>的变异体得到 4125 —— 计数随变异体写法变化，但\"步骤复算抓得极狠\"这个结论与具体数字无关）</td></tr></tbody></table></div>\n<blockquote>真身跑同样这些断言 <strong>全绿</strong>。<strong>新加的断言，第一次就该用变异体验证它会咬</strong> —— 否则它跟没写一样（本仓库陷阱 20/26）。</blockquote>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法正确性</td><td>n≤4 <strong>穷举所有可能的边集</strong>（含自环、重边）+ 3000 组随机图 + 300 组稀疏图，与<strong>邻接矩阵暴力</strong>（反复扩散标记，不含并查集）对拍</td><td><strong>0 不一致</strong></td></tr><tr><td>详细版自洽</td><td>每一步合并都\"从头复算\"：记录的根 == 复算的根、<code>kept/attached</code> 恰为那两个根、<code>n − merges == comps</code></td><td>全部通过</td></tr><tr><td><code>find_root</code> 正确性</td><td>与不带压缩的朴素 find 逐点比对 + 校验压缩后确实挂到根上</td><td>500 组全过</td></tr><tr><td>三方一致</td><td>提交版并查集 == 详细版 BFS == 暴力</td><td>全部一致</td></tr><tr><td>输出格式</td><td><strong>真起子进程</strong>跑 <code>components.py</code>（管道喂数据 + <code>isatty=False</code>），逐字节比对 stdout</td><td>14/14（含 CRLF、空行、数跨行）</td></tr><tr><td>错误路径</td><td>越界端点 / 非整数 / 读到一半 EOF / 负边数 → stdout 必空，stderr 带 <code>[!]</code></td><td>全部拦住</td></tr><tr><td>AST 语法检查</td><td><code>ast</code> 精确匹配调用名（不用 grep，<code>readline</code> 含 <code>read</code> 会误报）</td><td><code>components.py</code> / <code>components_detailed.py</code> 均 CLEAN，无 f-string / <code>.buffer</code> / <code>nonlocal</code> / 类型注解 / <code>input()</code></td></tr><tr><td>三环境</td><td>① 管道（OJ）② <code>isatty=False</code>（PyCharm 特征，实测输出 <code>1\\n1\\n</code>）</td><td>通过。③ 真终端逐行敲入未自动化，但读法只有 <code>readline()</code> 一条路、<strong>无任何 isatty 分支</strong>，与 ② 同码同路</td></tr><tr><td>边界规模</td><td>20 万顶点链</td><td>一次跑完，答案 1</td></tr><tr><td>动画交互</td><td>断言 <code>look</code>/<code>act</code> 步根表<strong>恰高亮当前边的两个端点</strong>，<code>init</code>/<code>done</code> 步零高亮</td><td>8 条边逐个验，全部通过</td></tr><tr><td><strong>动画渲染层</strong></td><td>Chrome headless 实拍（node 测不到 CSS/布局）</td><td><strong>抓到 1 个 node 抓不到的 bug</strong>：<code>isLone</code> 判据写成 <code>r === v</code>，导致<strong>代表元被涂成灰色</strong>、而它的同伴是彩色，\"同根同色\"当场破功（图 2 末步：顶点 1 灰、顶点 2 绿）。已改成按<strong>分支大小</strong>判 <code>st.size[r] === 1</code></td></tr><tr><td>该 bug 的回归断言</td><td>造变异体（把修复换回 <code>r === v</code>）再跑</td><td>变异体 <strong>FAIL 19 处</strong>、真身 OK —— 证明这条断言确实会咬，不是摆设</td></tr><tr><td><strong>分区级对照</strong></td><td>并查集分区 == BFS 分区 == 暴力分区（<strong>逐组逐点</strong>比，不是只比分支个数）</td><td>4410 次调用（1098 穷举 + 3000 随机 + 300 稀疏 + 12 锚定）全部一致</td></tr><tr><td><strong>读取器性能</strong></td><td>10 万条边<strong>全挤在一行</strong>，走完整 <code>main()</code>（从 stdin 喂真数据）</td><td><strong>0.11 秒</strong>；把读取器还原成 <code>pop(0)</code> 后同一用例 <strong>23.2 秒</strong> → 会被抓住</td></tr><tr><td><strong>独立对抗<a class=\"kw\" href=\"#/k/adversarial-audit\" title=\"概念：adversarial-audit\">审计</a>（两轮）</strong></td><td>spawn 独立 subagent（只读 + 可跑代码，要求\"证伪而非复述\"）</td><td>第一轮抓出 <strong>1 高 4 中 5 低</strong>（另 1 条为提示性说明）；第二轮又抓出 <strong>2 必修 + 4 低</strong>。全部处理，详见 九.1 / 九.2</td></tr></tbody></table></div>\n<h3 id=\"sec-14\">九.1 独立审计发现了什么，怎么处理的</h3>\n<p>审计是<strong>对抗性</strong>的（要求它证伪，并声明\"没有真问题就说没有\"）。逐条处理如下：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>严重度</th><th>问题</th><th>处理</th></tr></thead><tbody><tr><td><strong>高</strong></td><td><code>make_reader()</code> 用 <code>buf.pop(0)</code>，几十万 token 挤一行时 O(k²)（实测 10 万条边 <strong>28.8 秒</strong>）</td><td>✅ 改成 <code>buf.extend(reversed(...))</code> + <code>pop()</code>；<strong>并补了走完整 <code>main()</code> 的单行大数据用例</strong>（原先的性能测试直接调 <code>count_components</code>，<strong>绕开了读取器</strong>，所以这个坑在验证体系里结构上看不见）</td></tr><tr><td>中</td><td>详细版 Sum check ① `Σ\\</td><td>C_i\\</td><td>== n` <strong>恒真</strong>（<a class=\"kw\" href=\"#/k/mutation-testing\" title=\"概念：mutation-testing\">变异测试</a>：四种坏 BFS 它全 OK）</td><td>✅ 换成<strong>分区级</strong>对照「并查集分区 == BFS 分区（逐组逐点）」；② 标注为\"自洽性展示\"；④ 保留但注明它只有较弱的分辨力（能抓\"组被并得过大、内部边不够\"），不再假装它和 ② 等价</td></tr><tr><td>中</td><td><code>verify_components.py</code> 有 4 条结构性恒真断言</td><td>✅ 标注说明 + 新增<strong>分区级三方对照</strong>（能打掉\"个数对但分组错\"的变异）</td></tr><tr><td>中</td><td>动画合并解说把<strong>合并后</strong>的两支大小当合并前的讲（\"分别有 2 个和 1 个\"，真相是 1 和 1）</td><td>✅ <code>stateAt</code> 里连 <code>sra/srb</code> 一起快照；补\"必须讲合并前大小\"的断言，变异体 FAIL 3 处</td></tr><tr><td>中</td><td>文档 §九 引用了<strong>不存在</strong>的 <code>components_anim_test.js</code>（命令不可复跑）</td><td>✅ 收编为正式交付物 <code>verify_components_animation.js</code></td></tr><tr><td>低</td><td>动画 done 步有一段<strong>死代码</strong>（逐组检查算完就被无条件覆盖，等于没查）</td><td>✅ 改成 <code>ok = ... &amp;&amp; okInner</code> 串起来。⚠️ 但 <code>okInner</code> 本身<strong>结构上恒真</strong>（BFS 的组必然连通），它只是<strong>展示项</strong>、不可为假 —— 第二轮复审据此指出，已在代码里如实标注，并说明真正承重的是 <code>groups.length === comps</code> 与 <code>N - merges === comps</code></td></tr><tr><td>低</td><td>n=30 自环顶出画布上沿、60 条重边散到 viewBox 外</td><td>✅ 第一轮：自环 <code>cy</code> 夹边界 + 重边间距随重数收缩。⚠️ <strong>第二轮复审证明只修了一半</strong>：文字标号仍会越界（偏移被算了 1.9 倍）、夹边界没考虑\"离画布还剩多少余量\"，而我的断言<strong>漏了 <code>&lt;text&gt;</code> 且用例是手挑的</strong> → 已改为按画布余量夹住线条与文字，断言纳入 <code>&lt;text&gt;</code> 并改成<strong>全组合抽样扫描（1590 组）</strong></td></tr><tr><td>低</td><td><code>parseGraphs</code> 一处出错就丢弃<strong>已解析成功的图</strong>；且 <code>n=0</code> 语义与 py/c 相反</td><td>✅ 出错也保留已解析的图并提示\"只载入了前 N 个\"；<code>n=0</code> 与 OJ 版统一按\"输入结束\"处理并给出 note。⚠️ 第二轮复审又抓到：<strong><code>n=0</code> 的 note 在\"一张图都没解析出来\"时被当成 error 播报</strong>（红色\"输入有问题\"），且画布沉默地留着上一次的图 → 已改为先判 note 再判 error，并把\"画布仍是上一次的图\"说明白</td></tr><tr><td>低</td><td>C 版 <code>scanf</code> 前缀式解析在畸形输入上与 Python 版 stdout 不同；<code>(size_t)(n+1)</code> 在 <code>n=INT_MAX</code> 时有符号溢出 UB</td><td>✅ 加上限校验、改 <code>(size_t)n + 1</code>；<strong>畸形输入的宽容度差异如实写进文件头注释</strong>（本机无编译器，改成 fgets+strtol 无从验证，反而更危险）</td></tr><tr><td>低</td><td>复杂度口径不一（<code>O(n)</code> vs <code>O(n+e)</code>）</td><td>✅ 统一为：并查集本身 <code>O(n)</code>、整程序 <code>O(n+e)</code>（e 条边要先存下来）</td></tr></tbody></table></div>\n<p><strong>审计方另用自建探针证伪的怀疑</strong>（那些探针未随交付，故这里只列结论、不引具体计数）： <code>check_graph</code> 没有\"自己验证自己\"（真值来自独立暴力实现）、<code>stateAt</code> 支持任意跳转且与顺序播放逐字段一致、 坏输入全被拦下、stdout 在多种输入形状下都纯净、12 条锚定全部命中、 两个 <code>.py</code> 的 AST 均 CLEAN、20 万顶点链不会让并查集退化成链。</p>\n<h3 id=\"sec-15\">九.2 第二轮复审（针对本轮修复本身）</h3>\n<p>第一轮修复有\"修得不够干净\"的地方，第二轮专门查这个，抓出 2 必修 + 4 低：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>严重度</th><th>问题</th><th>处理</th></tr></thead><tbody><tr><td>中</td><td><strong>几何只修了形状、没修文字</strong>：标号把偏移算了 1.9 倍（<code>(sx+ex)/2</code> 已含偏移，又加 <code>ox*0.9</code>）；夹边界只限了偏移量，没限\"离画布还有多少余量\"，靠近圆环顶部的弦仍出界（<code>n=9 (1,2)×11</code> → <code>y1=-11.85</code>）</td><td>✅ 标号改为沿法向轻推 5px（不再叠偏移）；所有线条端点与文字按画布余量夹住</td></tr><tr><td>中</td><td><strong>我的几何断言有已被反证的覆盖盲区</strong>：<code>svgBounds</code> 只解析 <code>&lt;circle&gt;/&lt;line&gt;</code>（漏 <code>&lt;text&gt;</code>），用例还是<strong>手挑的 10 条</strong> —— 复审用全组合扫描一次找出 5878 处形状越界</td><td>✅ 断言纳入 <code>&lt;text&gt;</code> 估计盒；改为<strong>全组合抽样扫描</strong>（12 种 n × 抽样点对 × 10 种重数 = 1590 组），并保留复审实测出界的那几组做定点回归</td></tr><tr><td>中</td><td>文档里\"FAIL 4269 处\"<strong>复审复现不出</strong>（它试了 41 个变异体，最大 4125）；同页\"1 高 4 中 6 低\"与 10 行表格、\"12 类证伪\"与 7 条正文都对不上</td><td>✅ 数字改成<strong>精确改动 + 实测值</strong>并注明\"计数随变异体写法变化\"；条目数与正文对齐</td></tr><tr><td>低</td><td><code>n=0</code> 的 note 被 UI 当成 error 播报；解析全失败时画布沉默地留着上一次的图</td><td>✅ 先判 note 再判 error；把\"画布仍是上一次的图\"说明白</td></tr><tr><td>低</td><td><code>&amp;&amp; okInner</code> 把\"死代码\"治成了\"不可为假的合取项\"（删掉它断言照样 OK）</td><td>✅ 如实标注为展示项（见上表）</td></tr><tr><td>低</td><td>C 版：<code>n &gt; 1e8</code> 拒绝这条差异没写进文件头；<code>return 0/1</code> 不统一</td><td>✅ 文件头补齐差异清单；统一为 <strong>0 = 正常结束 / 1 = 数据有问题</strong></td></tr></tbody></table></div>\n<p><strong>第二轮被证伪的怀疑</strong>（说明它同样查过）：<code>reversed(...)+pop()</code> 会错位（19 种手造输入 + 300 轮模糊测试， token 序列与 <code>pop(0)</code> 参照逐字节相同）、性能用例咬不动（真身 0.11–0.13s / 变异体 32.5s）、 新版 ① 仍无分辨力（造\"组数不变但分组对调\"的变异体后，<strong>只有 ① 报警</strong>，②③④⑤ 全 OK）、 <code>uf_partition_from_steps</code> 有 bug、verify 的统计数字夸大、<code>check_graph</code> 自己验证自己、 新解说数字不对（重放 400 个随机图的 1305 个合并步，0 处不符）、文档/CLAUDE.md 的变异计数是编的、 参考用例与 AST 有问题。</p>\n<hr>\n<h2 id=\"sec-16\">十、给下一题的提醒</h2>\n<p>本题踩到的三件事，本仓库之前没记录过，值得记住：</p>\n<ol>\n<li><strong>\"空行分隔\"不是特例</strong> —— <code>make_reader()</code> 的 token 读法天然兼容，前提是<strong>别退回按行硬读</strong>。</li>\n<li><strong><code>n=0</code> 的二义性必须显式决策</strong> —— 凡是\"第一行是规模数字\"的多组题，都要问一句</li>\n</ol>\n<p>\"这个 0 是数据还是哨兵\"，并用 <code>[!]</code> 把选择写在 stderr 里让人看得见。</p>\n<ol>\n<li><strong>Windows 上 stdout 是 <code>\\r\\n</code></strong> —— 本地逐字节比对会看到 <code>\\r\\n</code>，别以为是自己多打了回车；</li>\n</ol>\n<p>Linux OJ 上是 <code>\\n</code>。</p>\n<ol>\n<li><strong>\"同根同色\"这类视觉不变量要写成判据，不能靠眼睛</strong> —— 本轮 <code>isLone = (r === v)</code></li>\n</ol>\n<p>把代表元涂成了灰色（它的根恰好就是它自己），node 的元素数量断言完全测不出来， 是 Chrome 实拍看图才发现的。教训：<strong>判\"孤立\"要看\"这一支有几个顶点\"，不是\"根是不是自己\"</strong>； 发现后立刻补一条\"同根必须同色\"的断言，并用变异体证明它会咬。</p>\n<ol>\n<li><strong>性能用例要打真实入口，别只测函数</strong> —— 本轮最大的坑（读取器 <code>pop(0)</code> 的 O(k²)）</li>\n</ol>\n<p>之所以一直没被发现，是因为原来的性能测试<strong>直接调 <code>count_components(n, edges)</code></strong>， 把 <code>make_reader()</code> 整条路径跳过了；而\"数跨行\"的用例数据太小、显不出来。 <strong>凡是\"性能/边界\"用例，都要从 stdin 喂真数据走完整 <code>main()</code></strong> —— 否则 IO 层、解析层的退化永远进不了视野。</p>\n<ol>\n<li><strong>恒真式断言比没有断言更危险</strong> —— 它会让人产生\"这里已经检查过了\"的错觉。</li>\n</ol>\n<p>本轮详细版 ①、对拍脚本里 4 条都属于这类（变异测试：四种坏实现它们全 OK）。 判据：<strong>能不能构造出一个让这条断言失败的变异体？构造不出来，就别把它当检查</strong> —— 要么换成能失败的，要么明确标注\"这是展示项\"。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、判题格式是反推出来的（铁律 2）",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "三、算法：并查集（Union-Find）",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "直觉",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "不变量与正确性",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "两个优化（本题都用了）",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "备选写法：DFS / BFS 染色",
    "lvl": 3
   },
   {
    "id": "sec-8",
    "text": "四、样例演示（手推第 2 个图）",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "五、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "九.1 独立审计发现了什么，怎么处理的",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "九.2 第二轮复审（针对本轮修复本身）",
    "lvl": 3
   },
   {
    "id": "sec-16",
    "text": "十、给下一题的提醒",
    "lvl": 2
   }
  ],
  "files": [
   "components.py",
   "components_detailed.py",
   "components.c",
   "verify_components.py"
  ],
  "concepts": [
   "adversarial-audit",
   "blank-line",
   "eof",
   "mutation-testing",
   "out-of-range",
   "reader",
   "self-loop",
   "tail-newline"
  ],
  "prev": "knapsack",
  "next": "min-diff",
  "related": [
   "min-diff",
   "repunit",
   "cards"
  ]
 },
 {
  "slug": "min-diff",
  "dir": "最小差",
  "title": "最小差",
  "cat": "排序 + 双指针",
  "catId": "two-pointers",
  "cx": "O(n log n)",
  "fmt": "多组 · EOF 结束",
  "summary": "两个数组各取一个元素，使差的绝对值最小，要求 O(n log n)。",
  "docName": "最小差详解.md",
  "doc": "<h1>最小差详解</h1>\n<blockquote>关键词：排序、<a class=\"kw\" href=\"#/k/two-pointers\" title=\"概念：two-pointers\">双指针</a>、O(n log n)、两数组各取一个、多组数据读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a></blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给定两个<strong>长度都是 <code>n</code></strong> 的整数数组 <code>A</code>、<code>B</code>，各取一个元素 <code>A[i]</code>、<code>B[j]</code>， 使二者<strong>差的绝对值</strong> <code>|A[i] − B[j]|</code> 最小。要求时间复杂度 <strong>O(n log n)</strong>。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td>多组数据，每组 3 行：<code>n</code> / A 的 <code>n</code> 个整数 / B 的 <code>n</code> 个整数</td></tr><tr><td>约束</td><td><code>n ≤ 10000</code>；多组，<strong>读到文件结束（EOF）</strong></td></tr><tr><td>输出</td><td>每组一行，最小差</td></tr></tbody></table></div>\n<h3 id=\"sec-2\">从样例反推出的两条关键语义（题面没写清，必须靠样例钉死）</h3>\n<p>样例：<code>n=4</code>，<code>A = 3 4 6 7</code>，<code>B = 2 3 8 9</code> → 输出 <strong>0</strong>。</p>\n<ul>\n<li><strong><code>i</code> 和 <code>j</code> 互相独立</strong>，不要求同下标。</li>\n</ul>\n<p>A 里的 <code>3</code>（第 1 个）配 B 里的 <code>3</code>（第 2 个）得 0，正因如此才可能是 0。</p>\n<blockquote>反例锚定：<code>A = 1 100 101</code>，<code>B = 100 101 200</code>，若误以为要\"同下标比\"， <code>|1−100|, |100−101|, |101−200|</code> 的最小值是 <strong>1</strong>；而正确答案是 <strong>0</strong>（100 配 100）。</blockquote>\n<ul>\n<li><strong>比的是绝对值</strong>，不是\"<code>A[i] − B[j]</code> 的最小值\"。</li>\n</ul>\n<p>若按后者，<code>3 − 9 = −6</code> 才是最小，而样例给的是 0。</p>\n<hr>\n<h2 id=\"sec-3\">二、算法：排序 + 双指针</h2>\n<p>两两配对是 <code>O(n²)</code>（<code>n=10000</code> 时 1 亿对），题目要求 <code>O(n log n)</code>，所以：</p>\n<pre class=\"code\"><code>1. A、B 各自升序排序                        —— O(n log n)\n2. 双指针 i = j = 0，从最小端开始：\n        d = A[i] − B[j]\n        d &lt; 0  →  i++      （A[i] 偏小）\n        d &gt; 0  →  j++      （B[j] 偏小）\n        d = 0  →  答案是 0，直接收工\n   每步恰好推进一个指针，最多走 2n 步        —— O(n)</code></pre>\n<p><strong>合计 O(n log n)</strong>，满足题目要求。</p>\n<h3 id=\"sec-4\">为什么\"推进偏小的那一方\"不会漏掉最优解</h3>\n<p>设当前 <code>A[i] &lt; B[j]</code>（所以 <code>d &lt; 0</code>）。因为 <strong>B 已经升序</strong>，<code>B[j]</code> 之后的元素只会 <strong>更大</strong>，拿它们去配 <code>A[i]</code> 只会让差<strong>更大</strong> —— 所以 <code>A[i]</code> 这一生最好的搭档就是 此刻的 <code>B[j]</code>。既然已经比过了，<code>A[i]</code> 就可以<strong>安全退役</strong>，把 <code>i</code> 往前推。</p>\n<p>形式化一点：最优配对若为 <code>(A[p], B[q])</code>，只要两个指针还没越过 <code>p</code>、<code>q</code>， 每步推进的正是\"朝目标靠近\"的方向；当某一方先到达目标位置，另一方仍会继续前进， 直到与它<strong>相遇并被比较一次</strong>。所以最优解一定会被撞上，一次不漏。</p>\n<hr>\n<h2 id=\"sec-5\">三、样例演示（题面样例）</h2>\n<pre class=\"code\"><code>n = 4        A = 3 4 6 7        B = 2 3 8 9   （已是升序）</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>步</th><th>i</th><th>j</th><th>A[i]</th><th>B[j]</th><th>差</th><th>迄今最小</th><th>动作</th></tr></thead><tbody><tr><td>1</td><td>1</td><td>1</td><td>3</td><td>2</td><td>1</td><td>1</td><td>d&gt;0 → j++（B[1]=2 偏小，退役）</td></tr><tr><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td><strong>0</strong></td><td><strong>0</strong></td><td>差为 0，已是最优，<strong>收工</strong></td></tr></tbody></table></div>\n<p><strong>答案 = 0</strong>（A 的第 1 个 3 配 B 的第 2 个 3）。</p>\n<p>再看一个需要走完全程的：</p>\n<pre class=\"code\"><code>n = 3        A = 10 20 30        B = 1 2 3</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>步</th><th>i</th><th>j</th><th>A[i]</th><th>B[j]</th><th>差</th><th>迄今最小</th></tr></thead><tbody><tr><td>1</td><td>1</td><td>1</td><td>10</td><td>1</td><td>9</td><td>9</td></tr><tr><td>2</td><td>1</td><td>2</td><td>10</td><td>2</td><td>8</td><td>8</td></tr><tr><td>3</td><td>1</td><td>3</td><td>10</td><td>3</td><td><strong>7</strong></td><td><strong>7</strong></td></tr></tbody></table></div>\n<p>之后 <code>j</code> <a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a>，扫描结束 → <strong>答案 = 7</strong>。</p>\n<hr>\n<h2 id=\"sec-6\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>阶段</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>排序</td><td><code>O(n log n)</code></td><td>两次 <code>sort</code></td></tr><tr><td>双指针</td><td><code>O(n)</code></td><td>每步恰好推进一个指针，最多 <code>2n</code> 步</td></tr><tr><td><strong>合计</strong></td><td><strong><code>O(n log n)</code></strong></td><td>满足题目要求（朴素两两配对是 <code>O(n²)</code>）</td></tr></tbody></table></div>\n<p>空间：<code>O(n)</code>（两个数组本身）。</p>\n<blockquote>⚠️ <strong><code>n ≤ 10000</code> 是本仓库目前最大的数据规模</strong>，<a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>必须写对： 见下面「边界与陷阱」第 1 条，<code>buf.pop(0)</code> 会让读取退化成 <code>O(k²)</code>。</blockquote>\n<hr>\n<h2 id=\"sec-7\">五、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>读取器不能用 <code>buf.pop(0)</code></strong></td><td><code>pop(0)</code> 每次要把整个列表往前挪（memmove），若一行里塞了很多 token（本题 n=10000 时 A 那一行就有 10001 个），读取退化成 <code>O(k²)</code>。<strong>本仓库已有实测</strong>：10 万 token 挤一行时 <code>pop(0)</code> 要 28.8s、正确写法只要 0.147s → 直接 TLE。正解：<code>buf.extend(reversed(line.split()))</code> + <code>buf.pop()</code>（倒两层正好还原顺序，单次 O(1)）</td></tr><tr><td>2</td><td><strong>判题格式：读完 EOF 结束</strong></td><td>题面只说\"有多组测试数据\"、没说怎么结束，样例也只给了一组。按 EOF 实现<strong>同时兼容\"其实只有一组\"</strong>。已排除\"第 1 行是组数 T\"：样例首行 4 若当 T，后面凑不出 4 组（每组要 <code>2n+1</code> 个 token），而 4 当 <code>n</code> 恰好凑齐</td></tr><tr><td>3</td><td><strong><code>n = 0</code> 当作结束标记</strong></td><td>题目未定义 <code>n=0</code> 的答案（没有元素可选）。本仓库数字三角形就是 <code>H=0</code> 哨兵结束。<strong>这个判断不能静默</strong>——按知识库《OJ 踩坑全记录》2.8 的要求写了一行 stderr 备查</td></tr><tr><td>4</td><td><strong>每个元素都是\"绝对值差\"</strong></td><td>直接比 <code>A[i] − B[j]</code> 会在有负数/顺序颠倒时给出负的\"最小差\"（实测：<code>A=[−20]</code>, <code>B=[4]</code> 会算出 −24）</td></tr><tr><td>5</td><td><strong><a class=\"kw\" href=\"#/k/index-independent\" title=\"概念：index-independent\">下标互相独立</a></strong></td><td>不能只比同下标（见第一节的反例锚定）</td></tr><tr><td>6</td><td><strong>大数不溢出</strong></td><td>题目只说\"整数\"。C 版用 <code>long long</code>；锚定用例 <code>A=[−1000000]</code>, <code>B=[1000000]</code> → 答案 <strong>2000000</strong></td></tr><tr><td>7</td><td><strong>多个元素相同时可提前收工</strong></td><td>比到差为 0 就直接返回，别傻跑到指针越界（不影响正确性，但白跑）</td></tr><tr><td>8</td><td><strong>输出只输出数字</strong></td><td>不同题目要求不同：本题<strong>没有</strong> <code>Case i</code> 行（0/1 背包和 LCS 才有）</td></tr><tr><td>9</td><td><strong>读取用 <code>readline()</code></strong></td><td>禁止 <code>read()</code>（终端像卡死）、禁止 <code>isatty()</code> 分流（PyCharm 会踩空），本仓库已踩两次</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-8\">六、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>min_diff.py</code></td><td><strong>OJ 提交用</strong>（排序 + 双指针，stdout 每组一行最小差）</td></tr><tr><td><code>min_diff_detailed.py</code></td><td>详细版（排序前后对比 + 双指针全过程 + Sum check + O(n²) 对拍）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>min_diff.c</code></td><td>C 实现（<code>qsort</code> + 双指针，<code>long long</code> 防溢出）<strong>—— 本机无编译器，从未编译验证</strong></td></tr><tr><td><code>min_diff_animation.html</code></td><td>浏览器动画（两数组 + 双指针移动 + 最优配对高亮，支持自定义输入）</td></tr><tr><td><code>verify_min_diff.py</code></td><td>自动对拍（O(n²) 暴力 + 步数 ≤2n + 端到端 IO + <strong>读取器斜率压测</strong> + 详细版自校输出）</td></tr><tr><td><code>verify_min_diff_animation.js</code></td><td>动画对拍（<code>node verify_min_diff_animation.js</code>）</td></tr><tr><td><code>verify_min_diff_c_mirror.py</code></td><td>C 版逻辑核对（无编译器时：把 C 逐行转写成 Python 对拍）</td></tr><tr><td><code>verify_min_diff_mutations.py</code></td><td><strong><a class=\"kw\" href=\"#/k/mutation-testing\" title=\"概念：mutation-testing\">变异测试</a></strong>：把代码改回错的，验收每条断言是否真有牙齿（<strong>24 个</strong>变异；脚本自带崩溃保护，见第十三节）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-9\">七、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>A</th><th>B</th><th>期望</th><th>说明</th></tr></thead><tbody><tr><td><code>3 4 6 7</code></td><td><code>2 3 8 9</code></td><td><strong>0</strong></td><td>题面样例</td></tr><tr><td><code>1 100 101</code></td><td><code>100 101 200</code></td><td><strong>0</strong></td><td><strong>下标独立锚定</strong>：同下标比会得 1</td></tr><tr><td><code>-1000000</code></td><td><code>1000000</code></td><td><strong>2000000</strong></td><td><strong>大数锚定</strong>：32 位会溢出</td></tr><tr><td><code>10 20 30</code></td><td><code>1 2 3</code></td><td><strong>7</strong></td><td>无交集：必须走完全程</td></tr><tr><td><code>5</code></td><td><code>5</code></td><td><strong>0</strong></td><td>n=1 相等</td></tr><tr><td><code>5</code></td><td><code>7</code></td><td><strong>2</strong></td><td>n=1 不等</td></tr><tr><td><code>-5 5</code></td><td><code>0 0</code></td><td><strong>5</strong></td><td>负数</td></tr><tr><td><code>1 1 1</code></td><td><code>2 2 2</code></td><td><strong>1</strong></td><td>重复元素</td></tr><tr><td><code>7 7 7 7</code></td><td><code>3 9 12 15</code></td><td><strong>2</strong></td><td>最优藏在中间</td></tr></tbody></table></div>\n<p>完整输入写法（多组连写）：</p>\n<pre class=\"code\"><code>4\n3 4 6 7\n2 3 8 9\n3\n10 20 30\n1 2 3</code></pre>\n<p>期望输出：</p>\n<pre class=\"code\"><code>0\n7</code></pre>\n<hr>\n<h2 id=\"sec-10\">八、正确性验证</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性</td><td>小规模穷举 <strong>16000 组</strong> + 随机中等规模 <strong>3000 组</strong>（含负数 / 无交集 / 大量重复 / 数量级悬殊四种分布），与 <code>O(n²)</code> 全配对暴力对拍</td><td><strong>0 不一致</strong></td></tr><tr><td>复杂度达标</td><td>断言双指针步数 <strong>≤ 2n</strong>（每步恰好推一个指针），并在 <code>n=10000</code> 上与独立路径（对每个 a 在排序 B 里二分找最近）复核</td><td>一致</td></tr><tr><td>读取器复杂度</td><td><strong>斜率法</strong>（机器无关）：<strong>交错</strong>测\"读 20001 个 token\"与\"读 80004 个 token\"的耗时，比值取各次 rep 的<strong>中位数</strong>。本机标定 38 次独立试验：正确实现 <strong>3.76~4.52</strong>（小 K 自检档最坏 5.54）、<code>pop(0)</code> 参照物 <strong>11.22~27.95</strong></td><td>阈值 <code>SLOPE_MAX = 8.0</code>，按两侧<strong>最坏值</strong>留 1.44 / 1.40 倍余量；另加 <code>pop(0)</code> 参照物<strong>反向自检</strong> —— 本机若区分不开，断言自己报失效（而不是静默漏报）</td></tr><tr><td>详细版自校</td><td>Sum check 四类断言（自洽 / 护栏 / 正确性），并由验证脚本端到端检查其输出</td><td>小 n 走暴力、大 n 走随机抽样，均 ALL OK</td></tr><tr><td>端到端 IO</td><td>子进程真跑：stdout 逐字节、<strong>stderr 为空</strong>、多组多行、EOF、<code>n=0</code> 哨兵、负数 n、中途截断、非法 token、同行/跨行/CRLF/空行、一行大输入</td><td>提交版 <strong>14 组</strong> + 详细版自校 <strong>3 组</strong> 全过</td></tr><tr><td>动画（逻辑层）</td><td><code>node verify_min_diff_animation.js</code>：双指针 vs 暴力 2000 组、不变式、逐步 <code>render()</code>、乱序重放可重现、复用判据、指针与比较格对齐、比较序号正确、每步标题刷新、9 类非法输入</td><td>全过</td></tr><tr><td>动画（渲染层）</td><td>headless Chrome 实拍：原始序 / 比较中 / 终态，核对指针位置、最优配对描边、文案与数值</td><td>借实拍抓出 3 处错（详见第九节 2/3/4/8 条）</td></tr><tr><td><strong>断言有效性（变异测试）</strong></td><td>把代码<strong>故意改回错的</strong> 26 处（提交版 6 + 详细版 trace 3 + 详细版自校 3 + 动画 14），看验证脚本认不认</td><td><strong>26/26 全部被抓</strong>，四组还原后均仍全绿</td></tr><tr><td>C 版逻辑</td><td>无编译器，用 <code>verify_min_diff_c_mirror.py</code> 把 C <strong>逐行转写</strong>成 Python 对拍：20000 组 + 8 锚定 + n=10000</td><td>全部一致（<strong>≠ 能编译</strong>）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">九、本轮靠验证抓出的问题（都是\"看着像对\"的错）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>问题</th><th>怎么抓到的</th></tr></thead><tbody><tr><td>1</td><td>复核大数组时我用\"合并 A、B 排序后取相邻差\"——相邻两元素<strong>可能都来自 A</strong>，那个差不是合法候选，会低估（实测给出 2，真值 6）</td><td>对拍脚本 FAIL。<strong>先自查测试数据</strong>，错的是复核方法</td></tr><tr><td>2</td><td>指针高亮显示的是\"下一步的位置\"，而解说讲的是\"刚比完的那一对\"，差一格（A 里值全相同时看不出来）</td><td>Chrome 实拍 + 新增对齐断言</td></tr><tr><td>3</td><td>\"当前最优配对\"的金色底<strong>覆盖</strong>了指针底色，两格重合时看不出在比哪两格</td><td>Chrome 实拍</td></tr><tr><td>4</td><td>解说标题\"第 N 次比较\"直接用 <code>stepIdx</code>，没扣掉 intro/sort 两步，<strong>整整差 2</strong></td><td>Chrome 实拍 + 新增序号断言</td></tr><tr><td>5</td><td>动画解说里混入 ASCII 双引号 → 整个 <code>&lt;script&gt;</code> 语法错误、<strong>页面全黑</strong></td><td>node 抽 JS 实跑第一秒报错</td></tr><tr><td>6</td><td>复用判据拿 <code>box.childNodes.length</code>（恒为 2）去比格子数 n，n=2 时假相等</td><td>新增\"换长度必须重建\"断言</td></tr><tr><td>7</td><td>我加的一行\"snap 到当前比较位置\"其实是<strong>冗余代码</strong>（改循环边界为 <code>t &lt; k</code> 已实现）</td><td>变异测试 M1 <strong>打不掉</strong> → 说明它不起作用，删掉后改用循环边界守护</td></tr><tr><td>8</td><td>终态只改了正文、<strong>忘了改解说标题</strong>，导致标题停在\"③ 第 3 次比较\"而正文讲\"扫描结束\"</td><td>Chrome 实拍 + 新增\"每步标题非空、终态必须讲结束\"断言</td></tr></tbody></table></div>\n<p>第 7 条尤其值得记：<strong>一次打不掉的变异，等于告诉你那里有装饰性代码</strong>（陷阱 29）。 第 2/3/4/8 条是同一类：<strong>动画的\"文案与画面\"必须处处同步</strong>，而 node 断言只测数据流、 测不到\"这句话说得对不对\" —— 所以 Chrome 实拍是必需品，不是可选项（陷阱 28）。</p>\n<h3 id=\"sec-12\">独立<a class=\"kw\" href=\"#/k/adversarial-audit\" title=\"概念：adversarial-audit\">审计</a>（另一个 subagent）又抓出的 5 处 —— 已全部修掉</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>问题</th><th>修法</th></tr></thead><tbody><tr><td>9</td><td><strong>读取器断言有约 10% 漏报率</strong>：<code>pop(0)</code> 的耗时分布有低尾（0.11s），会落到 0.15s 绝对阈值下方</td><td>改成<strong>斜率法</strong>（比值不随机器快慢变；且分母偏小正是低尾那侧，会让比值变大、更容易抓到）。实测正确写法 3.7~4.2、<code>pop(0)</code> 11~22，阈值 7。⚠️ <strong>第二轮复验发现阈值 7 仍然会偶发漏报，估计量又改了一次 —— 见第十三节</strong></td></tr><tr><td>10</td><td><strong>多处\"恒真断言\"</strong>：<code>ok_pair</code>/<code>ok_in</code>/<code>ok_walk</code> 在\"只比 a[0] 与 b[0]\"这种坏算法下<strong>照样报 OK</strong> —— 它们只查内部自洽，不查正确性</td><td>保留但<strong>在代码与输出里标清作用域</strong>（<code>[自洽]</code>/<code>[护栏]</code>/<code>[正确性]</code>）；新增 <code>ok_sample</code>（大 n 时随机抽 2000 对，无一对小于答案）；并加\"详细版自校\"隔离变异组证明这三条确实能失败</td></tr><tr><td>11</td><td><strong>大 n 时正确性无人把关</strong>：<code>brute</code> 返回 None 时 <code>ok_brute</code> <strong>自动为真</strong></td><td>补 <code>ok_sample</code> 单边最优性检查，触发条件从\"n 大\"改为\"brute 不可用\"，堵住\"被人为短路即失守\"</td></tr><tr><td>12</td><td><strong>详细版自校从未被自动覆盖</strong>（只有人工目视）</td><td><code>verify_min_diff.py</code> 新增\"阶段 7\"：端到端跑详细版，断言输出含 ALL OK、不含 MISMATCH</td></tr><tr><td>13</td><td><strong>重定向到文件时工具链崩</strong>：GBK 编码下打印 <code>O(n²)</code> 的 <code>²</code> 抛 <code>UnicodeEncodeError</code>（<code>python min_diff_detailed.py &gt; out.txt</code> 直接失败，并且<strong>恰好在需要报\"读取器退化\"这条失败时自己崩</strong>）</td><td>打印语句里的 <code>²</code> 全换 <code>^2</code>（GBK 不能编码的只有 <code>²³¹⇒⇐</code>）；已验证重定向不再崩</td></tr><tr><td>14</td><td>文档计数不实：写\"13 组端到端\"，实际 <code>run()</code> 调用 14 次</td><td>汇总行改为如实分列\"提交版 14 + 详细版自校 3\"，并注明每个数字的来源</td></tr></tbody></table></div>\n<blockquote>审计还指出：<strong>\"只削弱自校验、不改变输出\"的变异</strong>（例如把暴力对拍短路成永远返回 None） 行为级验证原理上抓不到 —— 这类风险不靠变异测试管，靠\"把每条断言的作用域写清楚\"管。 已把这条判断写进 <code>verify_min_diff_mutations.py</code> 的注释，而不是塞一个必然漏掉的变异进去凑数。</blockquote>\n<hr>\n<h2 id=\"sec-13\">十、C 版本说明</h2>\n<p><code>min_diff.c</code> <strong>本机没有任何 C 编译器（gcc/clang/tcc/cl/zig 全无），从未编译验证过</strong>。</p>\n<ul>\n<li><code>qsort</code> 两次排序 + 双指针；<code>best = -1</code> 当\"还没比过\"的哨兵</li>\n<li><code>long long</code> 存数组元素（防溢出），<code>%lld</code> 读写</li>\n<li><code>setvbuf(stdout, NULL, _IONBF, 0)</code> 让每组输出立刻可见</li>\n<li><code>while (scanf(\"%d\", &amp;n) == 1)</code> 实现\"多组读到 EOF\"；<code>n = 0</code> 当结束标记</li>\n<li><code>n &lt; 0</code> 或 <code>n</code> 超上限时打 <code>[!]</code> 到 stderr 后中止（宁可不出结果，也不要把后面的数字当下一组的 n）</li>\n</ul>\n<p><strong>没有编译器时能做到的验证</strong>：把算法<strong>逐行转写成 Python 镜像</strong>（保留 <code>qsort</code>→<code>sorted</code>、 <code>best=-1</code> 哨兵、<code>break</code> 位置），与提交版对拍 —— 随机 <strong>20000 组 + 8 样例 + n=10000 全部一致</strong>。</p>\n<blockquote>⚠️ 这只说明 <strong>算法结构没写错</strong>，<strong>不等于</strong> C 版能编译、能过 OJ。</blockquote>\n<hr>\n<h2 id=\"sec-14\">十一、如何复跑验证</h2>\n<pre class=\"code bash\"><code>cd E:/沈云付算法/最小差\n\n# ① 算法对拍（含斜率法读取器压测、端到端 IO、详细版自校输出）\npython verify_min_diff.py\n# 期望: OK: mini==brute 16000 small + 3000 random cases | pointer steps &lt;= 2n |\n#       detailed==mini | anchors 12 | n=10000 bisect-verified |\n#       reader slope t(4K)/t(K)=x.xx (&lt;8，含 pop(0) 参照物反向自检) | subprocess: 提交版 14 + 详细版自校 3\n\n# ② 动画逻辑\nnode verify_min_diff_animation.js\n# 期望: OK: 双指针==暴力 2000 组 | 不变式 | 逐步 render + 乱序重放一致 | 复用判据(n=2-&gt;5-&gt;2)\n#       | 自定义输入 合法2/非法9 | 终态答案==暴力 | 正文方向一致 N 步 | 箭头绑在指针格子(::after)\n\n# ③ 变异测试（验收\"断言本身有没有牙齿\"）\npython verify_min_diff_mutations.py\n# 期望: OK: 变异捕获率 24/24（提交版 6/6，详细版 trace 3/3，详细版自校 3/3，动画 12/12）\n# ⚠️ 这个脚本会**就地改写**三个交付文件再还原；若被打断，靠 atexit/信号处理 + 临时目录备份救回\n#    （第二轮真实踩过一次：被打断 → P5 变异体留在 min_diff.py 里，见第十三节）\n\n# ④ C 版逻辑（无编译器时的替代验证；只覆盖算法结构）\npython verify_min_diff_c_mirror.py\n\n# ⑤ 详细版（看过程 + Sum check）\npython min_diff_detailed.py &lt; input.txt\n\n# ⑥ 提交版（stdout 必须只有答案、stderr 必须为空）\npython min_diff.py &lt; input.txt 2&gt;/dev/null | od -c</code></pre>\n<p><strong>改一处就跑一遍 ①②③</strong>。③ 是这轮新增的：任何新加的断言，都要能用\"把代码改回错的\" 把它打掉；打不掉的断言就是装饰品（本项目 0/1 背包那题就吃过这个亏）。</p>\n<blockquote>⚠️ 若重定向日志（<code>&gt; log.txt</code> / <code>| tee</code>），请带 <code>PYTHONIOENCODING=utf-8</code>： 本机 locale 是 GBK，打印语句里任何 GBK 编不出的字符都会抛 <code>UnicodeEncodeError</code> （已把 <code>²</code> 全部换成 <code>^2</code>，但写新文案时仍要留意 <code>²³¹⇒⇐</code> 这几个）。</blockquote>\n<hr>\n<h2 id=\"sec-15\">十二、已知未覆盖（诚实声明）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>状态</th></tr></thead><tbody><tr><td><code>min_diff.c</code> 能否编译</td><td><strong>未验证</strong>（本机无编译器）。镜像脚本只证明\"算法结构一致\"，连 C 的读入层都不覆盖</td></tr><tr><td>C 的读入层</td><td><code>scanf</code> 部分消费（<code>3x</code> → 3）与 Python <code>int()</code> 整体拒绝的行为差异，已在 <code>min_diff.c</code> 注释里写明，未做等价性验证</td></tr><tr><td>动画播放链路 <code>togglePlay/tick/changeSpeed</code></td><td><strong>无自动测试</strong>（stub 的 <code>setTimeout</code> 是空壳）。靠 Chrome 实拍确认页面能动，但\"自动播放逐步推进\"没被断言覆盖。⚠️ 补测试前先注意一个隐形坑：stub 里 <code>#playSpeed.value</code> 是 <code>''</code>，<code>changeSpeed()</code> 会 <code>parseInt</code> 出 <strong>NaN</strong></td></tr><tr><td>动画数值范围</td><td>自定义输入限在 ±10^9（超过 JS 的 <code>number</code> 精度会失真）；题目本身未限制数值范围</td></tr><tr><td>\"只削弱自校验\"的变异</td><td>行为级验证原理上抓不到（详见第十一节末的说明）</td></tr><tr><td>⚠️ <strong>答案格同时被标\"已淘汰\"</strong></td><td>终态里\"当前最优配对\"那格会同时带上 <code>dim</code>（划掉）。Chrome 实测：样例2 <code>B=[\"dim\",\"dim\",\"dim ring\"]</code>、样例3 <code>A=[\"dim ring\",...]</code>。<code>.cell.ring</code> 与 <code>.cell.dim</code> 在图例里是互斥语义，叠在一起会让人以为答案格被淘汰了。<strong>本轮知情不修</strong>（改动会牵动终态渲染与既有断言）</td></tr><tr><td>⚠️ <strong>播放中点\"下一步\"不取消挂起的定时器</strong></td><td><code>nextStep()</code> 没调 <code>stopPlay()</code>（<code>prevStep()</code> 调了）。正在播放时手动推进一步，旧的 <code>setTimeout</code> 到期还会再推一步。<strong>本轮知情不修</strong></td></tr><tr><td>⚠️ <strong>改速度对\"已挂起\"的那一步无效</strong></td><td><code>changeSpeed()</code> 只改 <code>duration</code> 变量，已排定的定时器仍按旧延时走，下一拍才生效。<strong>本轮知情不修</strong></td></tr><tr><td>箭头对齐的<strong>像素级</strong>核验</td><td>已由 Chrome <code>getBoundingClientRect</code> + <code>getComputedStyle(el,\"::after\")</code> 实测（<code>left:50%</code> + <code>translateX(-50%)</code> 落在指针格中心），但<strong>没有自动化脚本</strong>守住这一层 —— 每次改样式仍需人工实拍</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-16\">十三、第二轮复验（2026-09-30）：一个事故、三个真缺陷</h2>\n<p>这一轮起因是\"复跑一遍验证确认没坏\"。结果<strong>没跑回全绿</strong> —— 查出 1 起交付物被污染的事故 和 3 个真缺陷。全部记录在此。</p>\n<h3 id=\"sec-17\">13.1 事故：被打断的变异测试把变异体留在了交付文件里 🔴</h3>\n<p><strong>现象</strong>：<code>min_diff.py</code> 第 138~140 行变成了</p>\n<pre class=\"code python\"><code>        if n == 0:\n            print(min_diff([], []))\n            continue</code></pre>\n<p>这不是任何人的正常改动 —— 它<strong>逐字节等于</strong> <code>verify_min_diff_mutations.py</code> 里 P5 变异的替换文本。</p>\n<p><strong>证据链（闭合，不是推测）</strong>：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>证据</th><th>数值</th></tr></thead><tbody><tr><td>会话开始时 <code>ls</code></td><td><code>min_diff.py</code> = <strong>6059</strong> 字节</td></tr><tr><td>出事之后</td><td><strong>5958</strong> 字节（差 <strong>101</strong>）</td></tr><tr><td>P5 的锚点文本 − 替换文本的字节差</td><td><strong>恰好 101</strong> ✅</td></tr><tr><td>变异脚本报 P5 <code>[SKIP] 找不到锚点文本</code></td><td>原文已被变异体顶掉 ✅</td></tr><tr><td><code>verify_min_diff.py</code> 退出码 1</td><td><code>端到端 n=0 哨兵 stdout -&gt; '0\\n-1\\n'</code>（<code>min_diff([], [])</code> 返回 -1）✅</td></tr><tr><td><code>min_diff_detailed.py</code> / <code>_animation.html</code> 字节数</td><td>与会话开头一致（那次中断只走到第 5 个变异）✅</td></tr></tbody></table></div>\n<p><strong>根因</strong>：变异测试是<strong>就地改写交付文件</strong>再靠 <code>finally</code> 还原的；一旦进程被硬性打断， <code>finally</code> 来不及执行，变异体就留在磁盘上。而它<strong>只在 <code>n=0</code> 时行为不同</strong> —— 常规用例完全看不出来，却让后续所有验证都在测一个坏文件。</p>\n<p><strong>修法</strong>（<code>verify_min_diff_mutations.py</code>）三道保险，并<strong>实测过</strong>： ① <code>atexit</code> 还原；② SIGINT/SIGTERM/SIGBREAK 信号处理还原；③ 硬杀（SIGKILL）拦不住 → 把原文件另存到 <code>tempfile.mkdtemp()</code> 并把路径打印出来，供人工救回。 实测：注入变异体 → 触发信号 → 文件写回原样（6059 字节）✅；atexit 路径同样还原 ✅。</p>\n<h3 id=\"sec-18\">13.2 真缺陷：读取器斜率断言<strong>偶发漏报</strong>（变异 P1 时绿时红）🔴</h3>\n<p><strong>现象</strong>：同一个变异 P1（读取器退回 <code>pop(0)</code>），上一轮抓到、下一轮漏掉。</p>\n<p><strong>根因</strong>：旧估计量是\"先把 K 读 5 次取最快，再把 4K 读 5 次取最快\"，两段测量<strong>分开进行</strong>。 若测 K 的那段时间碰上 GC / 机器抖动，<strong>只有分母被抬高</strong>、分子不受影响，比值被压低。 实测 <code>pop(0)</code> 的比值低到 <strong>7.08</strong>，而阈值正是 <strong>7.0</strong> —— 贴着阈值，于是偶发漏报 （这正是第七节记过的\"低尾漏报\"，换了估计量又复发了一次）。</p>\n<p><strong>修法</strong>：① <strong>交错</strong>测（同一次 rep 里先读 K 再读 4K），全局变慢时分子分母一起抬、相互抵消； ② 比值取<strong>各次 rep 的中位数</strong>；③ 阈值按<strong>两侧最坏值</strong>定，不再按中位数； ④ 新增<strong>反向自检</strong>：用一个故意写坏的 <code>pop(0)</code> 参照物跑同一判据，它必须被区分开， 否则断言自己报\"自检失效\"（把\"静默漏报\"变成\"当场报错\"）。</p>\n<p><strong>新估计量的标定</strong>（本机 38 次独立试验，实测值不是估的）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>场景</th><th>最小值</th><th>最大值</th><th>中位数</th></tr></thead><tbody><tr><td>正确实现 K=20001（12 次）</td><td>3.76</td><td>4.52</td><td>4.26</td></tr><tr><td><strong>坏实现 K=20001</strong>（6 次）</td><td><strong>11.22</strong></td><td>26.97</td><td>17.80</td></tr><tr><td><strong>坏实现 K=5001（自检档）</strong>（10 次）</td><td><strong>12.24</strong></td><td>27.95</td><td>19.76</td></tr><tr><td>正确实现 K=5001（10 次）</td><td>3.91</td><td><strong>5.54</strong></td><td>4.18</td></tr></tbody></table></div>\n<p>两侧最坏值 <code>5.54</code> 与 <code>11.22</code> 之间取 <code>SLOPE_MAX = 8.0</code>（各留 1.44 / 1.40 倍余量）。</p>\n<h3 id=\"sec-19\">13.3 真缺陷：动画正文把指针方向<strong>说反了</strong>（教学核心论据）🔴</h3>\n<p><code>runTwoPointer</code> 里 <code>d = A[i] - B[j]</code>，<code>d &lt; 0</code> 时推的是 <strong>i（A 的指针）</strong>； 而解说写的是 <code>var small = cur.d &lt; 0 ? \"B\" : \"A\";</code> —— 说\"B 偏小、推 B 的指针\"，<strong>恒为实际的反面</strong>。 实测样例2 三步全反、样例3 五步全反。</p>\n<p><strong>为什么旧断言抓不到</strong>：5b~5d 只盯\"高亮格子\"\"标题序号\"\"标题刷新\"，<strong>正文一个字都没读</strong>。 对照实验：把这一行改对，旧版断言依然全绿 —— 等于没查。</p>\n<p><strong>修法</strong>：方向改对 + 新增 <strong>5e 断言</strong>（拿 <code>stateAt</code> 推出的真实方向比对正文措辞， 样例 3 组 + 自定义输入 3 组共覆盖 20 个比较步，并断言覆盖步数 ≥8）， 并加变异 <strong>M10</strong>（把方向说反）验收这条断言有牙齿。</p>\n<h3 id=\"sec-20\">13.4 真缺陷：指针箭头与格子<strong>错位</strong>（视觉层）🟠</h3>\n<p>箭头原本是<strong>独立一行</strong>，每槽 <code>.ptr{width:26px}</code> + <code>gap:8px</code> = 34px； 而格子每槽 <code>.cell{min-width:52px;padding:0 10px;border:2px}</code> + <code>gap:8px</code> ≥ 84px。 槽宽不一致 → 索引越大漂移越多。Chrome 实拍量到：格子中心 <code>141/250/360</code>， 箭头中心 <code>103/137/171</code> —— <strong>箭头 2 已经跑到格子 0 下面了</strong>。</p>\n<p><strong>修法</strong>：箭头改成指针格子自己的 <code>::after</code>（<code>.cell</code> 本来就是 <code>position:relative</code>）， 对齐由盒模型天然保证，<strong>结构上不可能再漂移</strong>，也不再需要 JS 逐格同步宽度。 Chrome 实测（8 位负数 + 1 位数的混合输入）：A 行格宽 87px、B 行 55px， 两个箭头各自居中在自己的指针格上 ✅。新增第 8 组断言守住\"结构性选择\" （必须绑在 <code>.cell.cur::after</code>、不许退回定宽槽、不许再出现 <code>#ptrA/#ptrB</code>）， 并加变异 <strong>M11/M12</strong> 验收。</p>\n<h3 id=\"sec-21\">13.5 这轮自己也踩了一个坑（惨痛的对称）</h3>\n<p>给 M10 写变异说明时，我在中文串里夹了 <strong>ASCII 双引号</strong>（<code>\"偏小方\"</code>）—— <code>verify_min_diff_mutations.py</code> 整个文件<strong>语法错误</strong>。这正是本仓库的<strong>陷阱 18</strong> （0/1 背包、n个1 都吃过）。被\"导入模块跑冒烟测试\"当场抓到，改成 <code>「」</code> 即好。 <strong>教训</strong>：中文引用一律用 <code>「」</code>，任何新写的 JS/Python 文件都要先解析一遍再跑。</p>\n<h3 id=\"sec-22\">13.6 复跑清单（本轮全绿）</h3>\n<pre class=\"code\"><code>python verify_min_diff.py              -&gt; OK（reader slope 3.00 &lt; 8，含反向自检）\nnode   verify_min_diff_animation.js    -&gt; OK（正文方向一致 20 步 | 箭头绑在指针格子）\npython verify_min_diff_mutations.py    -&gt; OK（26/26；提交版 6，详细版 trace 3，自校 3，动画 14）\npython verify_min_diff_c_mirror.py     -&gt; OK\nChrome 实拍 + getBoundingClientRect 探针 -&gt; 箭头对位正确、正文方向正确、页面正常渲染</code></pre>\n<blockquote>⚠️ 遗留：13.2 的修复是\"把漏报概率压到实测范围内看不出来\"，<strong>不是数学保证</strong>。 真正的保证来自 6b 的反向自检 —— 本机若区分不开，它会报错而不是放过。</blockquote>\n<h3 id=\"sec-23\">13.7 我自己的修复又引入了一个回归（独立审计抓到）🔴</h3>\n<p>把箭头从\"独立一行\"改成\"格子自己的 <code>::after</code>\"之后，<strong>横向漂移消除了，但换来了纵向被遮</strong>： <code>.row</code> 是 <code>flex-wrap:wrap</code>，箭头挂在指针格下方 19px；一旦折行，下一行的格子按 DOM 顺序 画在它上面。Chrome <code>elementsFromPoint</code> 实测（10 个元素、指针在第 1 格）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>视口内宽</th><th>箭头所在点最上层</th><th>箭头可见</th></tr></thead><tbody><tr><td>1258（不折行）</td><td><code>SPAN.cell.cur.ring</code>（指针格自己）</td><td>✅</td></tr><tr><td><strong>658（折行）</strong></td><td><strong><code>SPAN.cell</code>（下一行的普通格）</strong></td><td>❌ 完全看不见</td></tr></tbody></table></div>\n<p><strong>这个回归我自己测不出来</strong>：我的实拍只覆盖了不折行（1280 宽窗），而 node 断言不建模布局、 更不谈 z-order。是<strong>独立审计</strong>用 <code>elementsFromPoint</code> 沿窗口宽度扫出来的 （它连触发阈值都扫了出来：n=10 时内宽 ≲660px 触发，n=6 ≲470px，n=4 ≲324px 基本碰不到）。</p>\n<p><strong>修法两道保险</strong>：① 指针格 <code>z-index:5</code>；② <code>.row</code> 的 <code>row-gap</code> 从 8px 提到 22px （实测折行后行距 20.7px &gt; 箭头伸出的 19px，箭头根本不压人）。修复后同一探针复测： 折行时最上层恢复为指针格 ✅。并按仓库规矩补了 <strong>8b 断言 + M13/M14 变异</strong> （去掉 z-index、行距退回 8px，两条都必须被抓 —— 实测都抓到了）。</p>\n<blockquote><strong>教训</strong>：换个设计不是消除风险，而是<strong>把风险换了个位置</strong>。 上一版的风险是\"横向漂移\"，新版是\"纵向被遮\"； 而后者偏偏落在\"我的实拍 + 我的断言\"<strong>都覆盖不到</strong>的维度上 —— 只有独立审计换个角度看才露出来。</blockquote>\n<h3 id=\"sec-24\">13.8 本轮已知但不修的项（审计提出，非阻断）</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>说明</th></tr></thead><tbody><tr><td>判据射程：斜率测试只覆盖 <code>make_reader</code></td><td><code>read_all_tokens</code> 直接调 <code>mod.make_reader()</code>，<strong>从不跑 <code>main()</code></strong>。审计构造出\"<code>main()</code> 里换成 O(k²) 读法\"的程序，判据照样全绿（且 6b 自检与主判据<strong>共模</strong>，也照样通过）。属判据固有射程，非本轮引入；覆盖 <code>main()</code> 的只有第 5 阶段那条粗筛（<code>dt &gt; 2.0</code>）</td></tr><tr><td><code>restore_all</code> 的回滚条件</td><td>判据是\"当前内容 ≠ 快照就写回\"。跑完整套（约 2 分钟）后若有人<strong>合法编辑</strong>了这些文件，进程退出时会把它回滚掉。概率低，但结构上存在</td></tr><tr><td>站点副本</td><td><code>E:\\algorithm-visual-lab\\problems\\min-diff\\animation.html</code> 仍是旧版（方向说反 + 箭头漂移都在），需回站点 <code>build_site.py</code> 重建 —— 本轮未做</td></tr><tr><td><code>CLAUDE.md</code> 期望值</td><td>仓库根 <code>CLAUDE.md</code> 里\"21/21（动画 9/9）\"等三处已过时（实为 26/26、动画 14/14）；本轮未改（可能有并行会话在编辑该文件）</td></tr></tbody></table></div>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "从样例反推出的两条关键语义（题面没写清，必须靠样例钉死）",
    "lvl": 3
   },
   {
    "id": "sec-3",
    "text": "二、算法：排序 + 双指针",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "为什么\"推进偏小的那一方\"不会漏掉最优解",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "三、样例演示（题面样例）",
    "lvl": 2
   },
   {
    "id": "sec-6",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-7",
    "text": "五、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "六、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "七、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "八、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "九、本轮靠验证抓出的问题（都是\"看着像对\"的错）",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "独立审计（另一个 subagent）又抓出的 5 处 —— 已全部修掉",
    "lvl": 3
   },
   {
    "id": "sec-13",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "十一、如何复跑验证",
    "lvl": 2
   },
   {
    "id": "sec-15",
    "text": "十二、已知未覆盖（诚实声明）",
    "lvl": 2
   },
   {
    "id": "sec-16",
    "text": "十三、第二轮复验（2026-09-30）：一个事故、三个真缺陷",
    "lvl": 2
   },
   {
    "id": "sec-17",
    "text": "13.1 事故：被打断的变异测试把变异体留在了交付文件里 🔴",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "13.2 真缺陷：读取器斜率断言偶发漏报（变异 P1 时绿时红）🔴",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "13.3 真缺陷：动画正文把指针方向说反了（教学核心论据）🔴",
    "lvl": 3
   },
   {
    "id": "sec-20",
    "text": "13.4 真缺陷：指针箭头与格子错位（视觉层）🟠",
    "lvl": 3
   },
   {
    "id": "sec-21",
    "text": "13.5 这轮自己也踩了一个坑（惨痛的对称）",
    "lvl": 3
   },
   {
    "id": "sec-22",
    "text": "13.6 复跑清单（本轮全绿）",
    "lvl": 3
   },
   {
    "id": "sec-23",
    "text": "13.7 我自己的修复又引入了一个回归（独立审计抓到）🔴",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "13.8 本轮已知但不修的项（审计提出，非阻断）",
    "lvl": 3
   }
  ],
  "files": [
   "min_diff.py",
   "min_diff_detailed.py",
   "min_diff.c",
   "verify_min_diff.py",
   "verify_min_diff_c_mirror.py",
   "verify_min_diff_mutations.py"
  ],
  "concepts": [
   "adversarial-audit",
   "eof",
   "index-independent",
   "mutation-testing",
   "out-of-range",
   "reader",
   "tail-newline",
   "two-pointers"
  ],
  "prev": "components",
  "next": "repunit",
  "related": [
   "components",
   "repunit",
   "cards"
  ]
 },
 {
  "slug": "repunit",
  "dir": "n个1",
  "title": "n 个 1",
  "cat": "数论 · 秦九韶",
  "catId": "number-theory",
  "cx": "O(n)",
  "fmt": "给定 T 组",
  "summary": "求最小的 n，使 11…1（n 个 1）能被 m 整除。",
  "docName": "n个1详解.md",
  "doc": "<h1>n 个 1 详解</h1>\n<blockquote>关键词：秦九韶（Horner）、逐位取余、<a class=\"kw\" href=\"#/k/no-bigint\" title=\"概念：no-bigint\">大数</a>不能真算、乘法阶、<a class=\"kw\" href=\"#/k/t-cases\" title=\"概念：t-cases\">T 组</a>输入、终端不阻塞</blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>给定 m（<code>0 &lt; m &lt; 10000</code> 且 <code>gcd(m, 10) = 1</code>），求<strong>最小</strong>的 n，使</p>\n<pre class=\"code\"><code>A_n = 11…1（n 个 1）     能被 m 整除</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td>第 1 行 <code>T</code>（组数，T&lt;20）；随后 T 个整数 m</td></tr><tr><td>输出</td><td>每个 m <strong>一行</strong>，打印最小的 n（<strong>没有</strong> <code>Case i</code> 前缀）；<strong>读完 T 组、全部算完后<a class=\"kw\" href=\"#/k/batch-output\" title=\"概念：batch-output\">一次性输出</a></strong>（不是边算边打）</td></tr><tr><td>保证</td><td><code>gcd(m,10)=1</code> —— 这一条保证答案一定存在</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-2\">二、判题格式（怎么定下来的）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>要确认的事</th><th>结论</th><th>依据</th></tr></thead><tbody><tr><td>多组还是单组？</td><td><strong>T 组</strong></td><td>题面明写\"第一行是一个整数 T，表示测试数据的组数\"</td></tr><tr><td>怎么结束？</td><td><strong>读完 T 组即止</strong></td><td>不是 EOF、不是哨兵</td></tr><tr><td>每组输出几行？</td><td><strong>1 行</strong>，只有数字</td><td>样例输出 <code>3 / 4 / 816</code> 三行，无 <code>Case i</code></td></tr><tr><td>m 的排列</td><td>每行一个（也可同行）</td><td>token 化读法两种都吃</td></tr><tr><td>什么时候输出？</td><td><strong>攒完一起输出</strong></td><td>题面样例给人的感觉就是\"一起输入、一起输出\"；顺带买到\"中途出错时 stdout 一个字节都没写过\"</td></tr></tbody></table></div>\n<p>⚠️ 同题集的 <strong>LCS 也是\"T 组\"，但它每组要 2 行（先 <code>Case i</code> 再答案）</strong>； 本题每组只有 1 行 —— <strong>逐题核对，不要照抄上一题</strong>。</p>\n<hr>\n<h2 id=\"sec-3\">三、算法：秦九韶逐位取余</h2>\n<h3 id=\"sec-4\">为什么不能真造那个数</h3>\n<p>n 最大能到 <strong>9972</strong>（m = 9981），把 11…1 真造出来是近万位的整数。 C 的 <code>long long</code> 装不下；Python 虽然能装，但：</p>\n<blockquote>⚠️ <strong>Python 3.11+ 默认禁止 <code>int</code> 与 <code>str</code> 互转超过 4300 位</strong>， 所以 <code>int(\"1\" * n)</code> 在 n=9972 时<strong>直接抛 ValueError</strong>（本轮新踩的坑，见 CLAUDE.md 陷阱 32）。</blockquote>\n<h3 id=\"sec-5\">递推（题面提示的\"秦九韶思想\"）</h3>\n<pre class=\"code\"><code>r_0 = 0\nr_n = (10 · r_{n-1} + 1) mod m          ← 相当于\"把下一个 1 添到末尾\"\n第一个 r_n == 0 的那个 n 就是答案</code></pre>\n<p><strong>为什么对</strong>：<code>A_n = 10·A_{n-1} + 1</code>，而对任意整数 x， <code>(10x + 1) mod m = (10·(x mod m) + 1) mod m</code> —— 取模可以<strong>在每一步就做</strong>， 不必等到最后。于是全程只留一个余数，空间 O(1)。</p>\n<h3 id=\"sec-6\">⚠️ 本题最容易想错的地方：模 <a class=\"kw\" href=\"#/k/mod-9m\" title=\"概念：mod-9m\">9m</a>，不是模 m</h3>\n<pre class=\"code\"><code>A_n = (10^n − 1) / 9\nA_n ≡ 0 (mod m)  ⟺  10^n ≡ 1 (mod 9m)        ← 两边同乘 9 才能把分母消掉</code></pre>\n<p><strong>不能</strong>写成\"10^n ≡ 1 (mod m)\"：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>m</th><th>模 m 的错法</th><th>正解</th><th>为什么</th></tr></thead><tbody><tr><td>3</td><td>1</td><td><strong>3</strong></td><td>A_1=1 不被 3 整除；A_3=111=3×37</td></tr><tr><td>9</td><td>1</td><td><strong>9</strong></td><td>A_9 = 111111111（数字和 9）才是 9 的倍数</td></tr></tbody></table></div>\n<p>这两个就是本仓库的<strong>锚定用例</strong>（见 §八）。好在提交版不用显式写 9m —— 逐位取余 <code>r = (10r+1) % m</code> 与它等价。</p>\n<h3 id=\"sec-7\">循环<a class=\"kw\" href=\"#/k/loop-bound\" title=\"概念：loop-bound\">上界</a>为什么取 9m</h3>\n<p><code>gcd(m,10)=1 ⇒ gcd(9m,10)=1</code>，10 在模 9m 的乘法群里，其阶<strong>整除群阶 φ(9m) ≤ 9m</strong>， 所以答案是 <code>n = ord_{9m}(10) ≤ 9m</code>，循环写 <code>while n &lt; 9*m + 2</code> 必然终止 （m&lt;10000 时实测最坏 n = 9972，离上界很远）。上界还兼作<strong>死循环防护</strong>： 万一数据不满足 <code>gcd(m,10)=1</code>（那时解根本不存在），也不会转不出来。</p>\n<h3 id=\"sec-8\">备选：直接算乘法阶（详细版用它做独立核对）</h3>\n<pre class=\"code\"><code>n = φ(9m) 的因子逐个试除：若 10^(n/p) ≡ 1 (mod 9m) 则 n //= p</code></pre>\n<hr>\n<h2 id=\"sec-9\">四、样例演示</h2>\n<h3 id=\"sec-10\">m = 3</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>r = A_n mod 3</th></tr></thead><tbody><tr><td>1</td><td>1</td></tr><tr><td>2</td><td>(10·1+1) mod 3 = 11 mod 3 = 2</td></tr><tr><td><strong>3</strong></td><td>(10·2+1) mod 3 = 21 mod 3 = <strong>0</strong> ← 答案 n = 3（111 = 3×37）</td></tr></tbody></table></div>\n<h3 id=\"sec-11\">m = 1111</h3>\n<p><code>r</code> 依次为 1, 11, 111, <strong>0</strong> → n = <strong>4</strong>（1111 = 1111×1）。</p>\n<h3 id=\"sec-12\">m = 2023</h3>\n<p>要算 <strong>816</strong> 步：<code>r</code> 一路不碰 0，直到第 816 步才第一次变成 0 （这正是动画里\"掐头去尾\"压缩步骤的原因 —— 816 步全画出来没人看得下去）。</p>\n<hr>\n<h2 id=\"sec-13\">五、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><code>O(n)</code> 每组</td><td>每步一次乘法一次取模；n ≤ 9m &lt; 90000，实测最坏 9972 步</td></tr><tr><td>空间</td><td><code>O(1)</code></td><td>全程只留一个余数，<strong>不构造也不存那个巨数</strong></td></tr><tr><td>读取</td><td><code>O(总 token 数)</code></td><td><code>make_reader()</code> 取 token 必须 O(1)（见陷阱 25 的 <code>pop(0)</code> 悬崖）</td></tr></tbody></table></div>\n<p>实测：题面样例 + 19 组最坏数据都在 <strong>0.04 秒</strong>内跑完（含解释器启动）。</p>\n<hr>\n<h2 id=\"sec-14\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong>模 m 而不是模 9m</strong></td><td>本题头号陷阱。锚定：<code>m=3</code> → <strong>3</strong>、<code>m=9</code> → <strong>9</strong>（错法都答 1）</td></tr><tr><td>2</td><td><strong>真想造出那个大数</strong></td><td>n 可达 9972。Python 里 <code>int(\"1\"*n)</code> 会因 3.11+ 的 4300 位限制<strong>直接抛异常</strong></td></tr><tr><td>3</td><td><strong>循环没有上界</strong></td><td><code>gcd(m,10)≠1</code> 时解不存在，没上界就是死循环。上界取 <code>9m+2</code>（可证）</td></tr><tr><td>4</td><td><strong>T 组题收尾又去 <code>readline()</code></strong></td><td>终端里表现为\"答案都打完了程序却不退出\"。<strong>只查缓冲区</strong>别再读（<code>has_buffered()</code>）</td></tr><tr><td>5</td><td><strong>边算边打 → 可能留半截输出</strong></td><td>本题改成\"攒完一起输出\"：中途遇到坏数据就 return，<strong>stdout 一个字节都没写过</strong>。反之若边算边 <code>print</code>，坏数据出现在第 3 组时会留下前两组答案的半截输出（判题上都是 WA，但日志更难读）</td></tr><tr><td>6</td><td><strong>m 超范围就直接中止</strong></td><td>题面说 m&lt;10000。<code>10000 ≤ m ≤ 10^6</code> 只提示、<strong>照样算</strong>（公式成立，不该丢答案）；<code>m &gt; 10^6</code> 才拒绝</td></tr><tr><td>7</td><td><strong>\"<a class=\"kw\" href=\"#/k/minimality\" title=\"概念：minimality\">最小性</a>\"只比 A_{n-1}</strong></td><td>这是<strong>局部</strong>最小，不是最小。反例：m=3、n=6 时 A_6 能被整除、A_5 不能，可 3 才是答案。必须<strong>每位都核</strong></td></tr><tr><td>8</td><td><strong><code>pop(0)</code> 读 token</strong></td><td>O(k²) 悬崖（陷阱 25）。用 <code>reversed()</code> + <code>pop()</code></td></tr><tr><td>9</td><td><strong>打印文本里出现 <code>²</code></strong></td><td>本机 GBK 编不出，会让日志/验证脚本自己崩掉（陷阱 31）。写成 <code>^2</code></td></tr><tr><td>10</td><td><strong>动画解说里混 ASCII 双引号</strong></td><td><code>\"…\"里面\"…\"</code> 会让整个 <code>&lt;script&gt;</code> 语法错误、<strong>页面全黑</strong>（陷阱 18）。中文引用请用 <code>「」</code> —— <strong>本轮又踩了一次</strong>，靠 node 抽 <code>&lt;script&gt;</code> 实跑第一秒抓到</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-15\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>repunit.py</code></td><td><strong>OJ 提交用</strong>（秦九韶逐位取余；读完 T 组后<strong>一次性输出</strong>每组的 n）</td></tr><tr><td><code>repunit_detailed.py</code></td><td>详细版（余数链 + 真大整数核对 + 乘法阶核对）<strong>—— 仅本地学习，勿提交</strong></td></tr><tr><td><code>repunit.c</code></td><td>C 实现。⚠️ <strong>本机无任何 C 编译器，从未编译验证</strong>；<code>scanf</code> 对畸形输入比 Python 宽容，差异已写在文件头</td></tr><tr><td><code>repunit_animation.html</code></td><td>浏览器动画（数字条 + 余数表 + BigInt 真值自校，支持粘贴 OJ 原文、多 m 切换）</td></tr><tr><td><code>verify_repunit.py</code></td><td>算法验证（真大整数穷举 / 乘法阶全范围 / 全局最小性 / 端到端 / 终端不阻塞 / AST / <strong><a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>斜率压测</strong>）</td></tr><tr><td><code>verify_repunit_animation.js</code></td><td>动画验证（node 抽 <code>&lt;script&gt;</code> + DOM stub：独立实现对拍 14 个 m、步数压缩、乱序重放、渲染行数、BigInt 自校）</td></tr><tr><td><code>verify_repunit_mutations.py</code></td><td><strong><a class=\"kw\" href=\"#/k/mutation-testing\" title=\"概念：mutation-testing\">变异测试</a></strong>：23 个变异，要求 23/23 被抓（否则说明断言是装饰品）</td></tr><tr><td><code>verify_repunit_c_mirror.py</code></td><td>C 版逐行转写成 Python 对拍（511 组 + <code>repunit.c</code> 锚点校验 13 条），弥补\"没有编译器\"</td></tr><tr><td><code>n个1详解.md</code></td><td>本文档</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-16\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th><th>说明</th></tr></thead><tbody><tr><td><code>3 / 3 / 1111 / 2023</code></td><td><code>3</code> <code>4</code> <code>816</code></td><td>题面样例</td></tr><tr><td><code>1 / 1</code></td><td><code>1</code></td><td>m=1：1 能被 1 整除</td></tr><tr><td><code>1 / 3</code></td><td><code>3</code></td><td><strong>★ 锚定</strong>：模 m 的错法答 1，正解 3</td></tr><tr><td><code>1 / 9</code></td><td><code>9</code></td><td><strong>★ 锚定</strong>：同上，正解 9</td></tr><tr><td><code>1 / 11</code></td><td><code>2</code></td><td>A_2 = 11</td></tr><tr><td><code>1 / 7</code></td><td><code>6</code></td><td>A_6 = 111111 = 7×15873</td></tr><tr><td><code>1 / 101</code></td><td><code>4</code></td><td>A_4 = 1111 = 101×11</td></tr><tr><td><code>1 / 9981</code></td><td><code>9972</code></td><td>题面范围内<strong>最坏</strong>（循环上界的依据）</td></tr><tr><td><code>0</code></td><td>（无输出）</td><td>T=0</td></tr><tr><td><code>1 / 2</code></td><td>（无输出 + <code>[!]</code>）</td><td>gcd(2,10)≠1，解不存在</td></tr><tr><td><code>1 / 10001</code></td><td><code>%d</code>（提示后照样算）</td><td>超题面范围但不丢答案</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-17\">九、正确性验证（都是实跑的）</h2>\n<pre class=\"code bash\"><code>python verify_repunit.py\n# OK: mini==brute(bigint) 120 exhaustive | mini==ord 4000 full | order minimal |\n#     detailed==mini==bigint 12 probes | detailed-run 2/2 | anchors 12 | subprocess 19/19 |\n#     no-block 0.03 秒 | GBK+AST clean | worst-case 0.03s | reader slope 3.59 (lin~4)\n#     【注意】耗时/slope 是**示例值**，随机器浮动；断言阈值是 slope &lt; 7、最坏规模 &lt; 5 秒\n\nnode verify_repunit_animation.js\n# OK: 解析(含 T 组判别) | computeAll==独立实现 14 个 m（含 2 个无解）|\n#     步数压缩+乱序重放一致 | 渲染行数/高亮/BigInt 自校 | 自定义输入 4 例\n\npython verify_repunit_c_mirror.py\n# OK: C 逐行转写 == repunit.py（511 组：锚定/边界/随机 T 组）；repunit.c 锚点 10 条全在；\n#     已知差异 4 条仍按预期不同\n\npython verify_repunit_mutations.py\n# OK: 变异捕获率 23/23（提交版 11/11，详细版 6/6，动画 6/6）；还原后验证脚本均仍全绿</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法正确性</td><td>①m≤300 与<strong>真大整数</strong>逐位构造对拍（120 组）②<strong>全部</strong> m&lt;10000 与乘法阶算法对拍（4000 组）+ 全局最小性</td><td>0 不一致</td></tr><tr><td>提交版 vs C</td><td>C 逐行转写成 Python（含<strong>字节级</strong> <code>scanf</code> 前缀式语义），锚定/边界/随机 511 组对拍 + C 锚点校验</td><td>除 4 条已写明的差异外完全一致；4 条同属一族：「Python 严格 token vs C 前缀解析」（如 <code>2023abc</code>、<code>1_0</code>、全角 <code>１１</code>，以及 C 不做收尾多余数据检查）</td></tr><tr><td>输出字节</td><td>真起子进程，管道 + <code>isatty=False</code>，19 条用例逐字节比 stdout</td><td>正确场景 stderr 全空</td></tr><tr><td>终端行为</td><td>喂完 T 组<strong>不关 stdin</strong>，进程必须自行退出</td><td>0.03 秒自行退出</td></tr><tr><td>读取器复杂度</td><td>斜率法 t(4K)/t(K)，线性应≈4</td><td>3.55~4.19（<code>pop(0)</code> 变体会飙到 9~14）</td></tr><tr><td>AST</td><td>精确匹配调用名（不用 grep）</td><td>两个 <code>.py</code> 均 CLEAN</td></tr><tr><td>断言有没有牙</td><td>23 个变异（读取器 pop(0) / 起手 r=1 / 循环上界砍小 / 收尾又去 readline / 最小性只比前一项 / 超上限守卫 / BOM / 详细版打印非 GBK 字符 / 详细版 main 抛异常 / 动画高亮消失 …）</td><td><strong>23/23 全被抓</strong>，还原后全绿</td></tr><tr><td>详细版能跑</td><td><strong>真起子进程</strong>跑 <code>repunit_detailed.py</code>（故意把输出编码钉成 gbk，模拟重定向）</td><td>退出码 0、<code>Sum check</code>/<code>ALL OK</code> 齐全、stderr 空（这条是<a class=\"kw\" href=\"#/k/adversarial-audit\" title=\"概念：adversarial-audit\">审计</a>加的：原先只 import 它调函数，<strong>从不跑它的 main</strong>，所以\"打一半崩了\"结构上看不见）</td></tr><tr><td>打印文本能落地</td><td>文件级 GBK 可编码性检查（非 GBK 字符一律不许进 <code>.py</code>）</td><td>5 个 <code>.py</code> 全通（曾因打印一个非 GBK 符号，把详细版 ③ 之后整段打不出来）</td></tr><tr><td>C 转写没跑偏</td><td>从 <code>repunit.c</code> 抠 10 个关键 token 做锚点校验 + <code>M_LIMIT</code> 数值比对</td><td>全在（把 C 里的上界改掉，锚点校验立刻报警）</td></tr><tr><td>动画数字条高亮</td><td>位数 ≤ 16 时恰 1 格高亮；&gt; 16 时 0 格（新添的 1 在省略区）</td><td>通过（原实现该判据恒假、图例却承诺高亮）</td></tr><tr><td>动画渲染层</td><td>Chrome headless 实拍三个状态（初始 / 中间步 / 末步；含 m=3、m=1111、m=2023、m=9981）</td><td>数字条与高亮、余数表命中行与省略行、步骤压缩、BigInt 自校文案均与实跑一致</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-18\">十、给下一题的提醒</h2>\n<ol>\n<li><strong>\"T 组\"题的收尾只许查缓冲区，不许再读一行</strong> —— 否则终端里打完答案不退出。</li>\n</ol>\n<p>本轮是<strong>先写错、再实测发现</strong>的（<code>if nxt() is not None</code>）。 另外，T 组题<strong>攒完一起输出</strong>比边算边打更稳：中途出错时 stdout 干净的，不会有半截输出。</p>\n<ol>\n<li><strong>大数题先问\"要不要真造出来\"</strong> —— 要的话立刻查语言层面的位数限制</li>\n</ol>\n<p>（Python 3.11+ 的 <code>int</code>↔<code>str</code> 4300 位）与 C 的类型宽度。</p>\n<ol>\n<li><strong>\"最小性\"是全局性质</strong> —— 只比 <code>A_{n-1}</code> 是局部检查，<code>m=3, n=6</code> 就是反例；</li>\n</ol>\n<p>凡是\"求最小 k 使 …\"的题，这条都适用。</p>\n<ol>\n<li><strong>校验的期望值要现场算，不要手抄</strong> —— 本轮我把一段被截断的输出里的数字</li>\n</ol>\n<p>当成期望值抄进验证脚本，抄错 4 个（陷阱 19 又犯一次）。</p>\n<ol>\n<li><strong>没有编译器的 C，可用\"逐行转写成 Python\"对拍</strong>（本仓库新约定），</li>\n</ol>\n<p>但必须如实说明：转写覆盖不到编译器才暴露的问题。 两个坑：① 转写要<strong>忠实到语义层</strong>（用 <code>str.isdigit()</code> 模拟 <code>scanf</code> 就不是 C 了 —— C 只认 ASCII 字节）； ② 转写<strong>必须校验 C 原文的锚点</strong>，否则改了 <code>.c</code> 对拍照样 OK（陷阱 10 的新形态）。</p>\n<ol>\n<li><strong>验证脚本要跑被测程序的\"入口\"，不能只 import 它的函数</strong> —— 本轮的详细版 <code>main()</code></li>\n</ol>\n<p>在 GBK 重定向下打一半就崩（打印了一个非 GBK 符号），而验证脚本只调它的函数、<strong>从不跑 main</strong>， 于是全绿放行。补一个\"真起子进程跑一遍 + 断言退出码/关键输出无 Traceback\"的阶段即可覆盖。</p>\n<ol>\n<li><strong>打印文本必须能被目标 locale 编码</strong> —— 本机是 GBK，<code>⟺ ⟹ ² ⚠️(U+FE0F)</code> 都编不出，</li>\n</ol>\n<p>一旦进 print 就抛 <code>UnicodeEncodeError</code>（尤其<strong>恰好在要报失败的时候崩</strong>，日志只剩 traceback）。 最省事的做法：<strong>要求整个 <code>.py</code> 文件都能 GBK 编码</strong>（一条断言搞定，见 <code>verify_repunit.py</code> 的 AST 阶段）。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、判题格式（怎么定下来的）",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "三、算法：秦九韶逐位取余",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "为什么不能真造那个数",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "递推（题面提示的\"秦九韶思想\"）",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "⚠️ 本题最容易想错的地方：模 9m，不是模 m",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "循环上界为什么取 9m",
    "lvl": 3
   },
   {
    "id": "sec-8",
    "text": "备选：直接算乘法阶（详细版用它做独立核对）",
    "lvl": 3
   },
   {
    "id": "sec-9",
    "text": "四、样例演示",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "m = 3",
    "lvl": 3
   },
   {
    "id": "sec-11",
    "text": "m = 1111",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "m = 2023",
    "lvl": 3
   },
   {
    "id": "sec-13",
    "text": "五、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-15",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-16",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-17",
    "text": "九、正确性验证（都是实跑的）",
    "lvl": 2
   },
   {
    "id": "sec-18",
    "text": "十、给下一题的提醒",
    "lvl": 2
   }
  ],
  "files": [
   "repunit.py",
   "repunit_detailed.py",
   "repunit.c",
   "verify_repunit.py",
   "verify_repunit_c_mirror.py",
   "verify_repunit_mutations.py"
  ],
  "concepts": [
   "adversarial-audit",
   "batch-output",
   "loop-bound",
   "minimality",
   "mod-9m",
   "mutation-testing",
   "no-bigint",
   "out-of-range",
   "reader",
   "t-cases",
   "tail-newline"
  ],
  "prev": "min-diff",
  "next": "mod11",
  "related": [
   "mod11",
   "components",
   "min-diff"
  ]
 },
 {
  "slug": "mod11",
  "dir": "11的余数",
  "title": "11 的余数",
  "cat": "数论 · 逐位取模",
  "catId": "number-theory",
  "cx": "O(位数)",
  "fmt": "给定 T 组",
  "summary": "80 位的大数求 mod 11 —— 绝不把它转成整数。",
  "docName": "11的余数详解.md",
  "doc": "<h1>n 被 11 除的余数 详解</h1>\n<blockquote>题目：给定 <a class=\"kw\" href=\"#/k/t-cases\" title=\"概念：t-cases\">T 组</a>数据，每组一个十进制正整数 n（位数可达 80），求 n 被 11 除的余数。</blockquote>\n<hr>\n<h2 id=\"sec-1\">一、题意</h2>\n<ul>\n<li>输入：第 1 行一个整数 <code>T</code>（<code>T &lt; 20</code>）；随后 <code>T</code> 行，每行一个十进制正整数 <code>n</code>，<strong>长度不超过 80</strong>。</li>\n<li>输出：对每种情形，输出 <code>n mod 11</code> 的余数（取值 <code>0..10</code>），每组一行。</li>\n<li>样例：</li>\n</ul>\n<p>``<code> 输入          输出 3             1 78            0 70906         2 781020569876102789 </code>``</p>\n<p>本题的考点只有一句话：<strong>n 有 <a class=\"kw\" href=\"#/k/no-bigint\" title=\"概念：no-bigint\">80 位</a>，但 C 的 <code>long long</code> 只装得下约 19 位十进制</strong>。 所以从输入到计算全程不许把它当整数，必须<strong>按字符串逐位</strong>处理。</p>\n<hr>\n<h2 id=\"sec-2\">二、算法：交替和</h2>\n<h3 id=\"sec-3\">2.1 原理</h3>\n<p>关键只有一个等式：</p>\n<pre class=\"code\"><code>10 = 11 − 1 ≡ −1  (mod 11)</code></pre>\n<p>两边取 k 次方，得到 <code>10^k ≡ (−1)^k (mod 11)</code>。 把 n 按十进制位展开 <code>n = Σ d_k · 10^k</code>（<strong>k 从个位起编号 0</strong>，<code>d_k</code> 是该位数字），逐项取模：</p>\n<pre class=\"code\"><code>n ≡ Σ d_k · (−1)^k   (mod 11)</code></pre>\n<p>看 10 的幂对 11 取余：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>k（从个位起）</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>…</th></tr></thead><tbody><tr><td>位</td><td>个位</td><td>十位</td><td>百位</td><td>千位</td><td>万位</td><td>十万位</td><td>…</td></tr><tr><td><code>10^k mod 11</code></td><td>1</td><td>10</td><td>1</td><td>10</td><td>1</td><td>10</td><td>…</td></tr><tr><td>记作</td><td><strong>+1</strong></td><td><strong>−1</strong></td><td><strong>+1</strong></td><td><strong>−1</strong></td><td><strong>+1</strong></td><td><strong>−1</strong></td><td>…</td></tr></tbody></table></div>\n<p>只有 <code>1</code> 和 <code>−1</code> 两种取值 —— 这就是\"<strong>奇数位之和 − 偶数位之和</strong>\"能被 11 整除这一条老规律的来历。</p>\n<p>于是算法就是：</p>\n<ol>\n<li>令 <code>k = 0</code> 指向个位，<code>plus = minus = 0</code></li>\n<li>从个位往高位扫，<strong>偶数号的位累加进 <code>plus</code>，奇数号的位累加进 <code>minus</code></strong></li>\n<li><code>diff = plus − minus</code>，答案就是 <code>diff mod 11</code></li>\n</ol>\n<blockquote><strong>注意</strong>：<code>diff</code> 可能是负数，必须保证最终余数落在 <code>0..10</code>。 Python 的 <code>%</code> 天然返回非负（<code>−1 % 11 == 10</code>）； <strong>C 和 JavaScript 的 <code>%</code> 返回负值</strong>（<code>−1 % 11 == −1</code>），要手工补正。 这是本题跨语言最容易漏的一步，见「六、边界与陷阱」第 1 条。</blockquote>\n<h3 id=\"sec-4\">2.2 提交版实现要点</h3>\n<pre class=\"code python\"><code>def mod11(s):\n    diff = 0\n    sign = 1                          # 个位（k = 0）取 +\n    for i in range(len(s) - 1, -1, -1):\n        diff += sign * (ord(s[i]) - 48)\n        sign = -sign\n    return diff % 11                  # Python：负 diff 也直接得到 0..10</code></pre>\n<p>全程字符串逐位，没有一次 <code>int(n)</code>。</p>\n<h3 id=\"sec-5\">2.3 与 Horner 法的关系</h3>\n<p>不用 11 的特殊性质也能做：从最高位往低位滚，<code>r = (r * 10 + d) % 11</code>， 每步只保留余数，同样 O(位数)，且对任意模数都成立。</p>\n<p>两法等价但独立，本项目把它们用来<strong>互相校验</strong>（见第五节与 <code>verify_mod11.py</code>）。</p>\n<hr>\n<h2 id=\"sec-6\">三、样例演示</h2>\n<p>以样例第 3 组 <code>n = 781020569876102789</code>（18 位）为例。</p>\n<p>按位从个位起编号：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>k</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th></tr></thead><tbody><tr><td>数字 d</td><td>9</td><td>8</td><td>7</td><td>2</td><td>0</td><td>1</td><td>6</td><td>7</td><td>8</td><td>9</td><td>6</td><td>5</td><td>0</td><td>2</td><td>0</td><td>1</td><td>8</td><td>7</td></tr><tr><td>符号</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td><td>+</td><td>−</td></tr></tbody></table></div>\n<ul>\n<li><code>plus</code>（k 为偶：个位、百位、万位……）= 9+7+0+6+8+6+0+0+8 = <strong>44</strong></li>\n<li><code>minus</code>（k 为奇：十位、千位……）= 8+2+1+7+9+5+2+1+7 = <strong>42</strong></li>\n<li><code>diff = 44 − 42 = 2</code></li>\n<li>答案 <code>2 mod 11 = 2</code> ✓（与样例输出一致）</li>\n</ul>\n<p>另两组：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>plus</th><th>minus</th><th>diff</th><th>答案</th></tr></thead><tbody><tr><td><code>78</code></td><td>8</td><td>7</td><td>1</td><td><strong>1</strong></td></tr><tr><td><code>70906</code></td><td>6+9+7 = 22</td><td>0+0 = 0</td><td>22</td><td><strong>0</strong></td></tr><tr><td><code>781020569876102789</code></td><td>44</td><td>42</td><td>2</td><td><strong>2</strong></td></tr></tbody></table></div>\n<p><code>70906</code> 顺便说明 <code>diff</code> 不必先化到 <code>0..10</code>，直接 <code>diff % 11</code> 即可（<code>22 % 11 = 0</code>）。</p>\n<hr>\n<h2 id=\"sec-7\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>提交版</th><th>说明</th></tr></thead><tbody><tr><td>时间</td><td><strong>O(L)</strong>，L = n 的位数 ≤ 80</td><td>逐位一次加法（或乘法取模）</td></tr><tr><td>空间</td><td><strong>O(1)</strong></td><td>只存累计值，不存各位</td></tr></tbody></table></div>\n<p>对 <code>T &lt; 20</code> 组、每组 80 位，总运算量不到 2000 次，任何语言都瞬间完成。 <strong>真正的限制从来不是速度，而是\"不许转成整数\"</strong>。</p>\n<hr>\n<h2 id=\"sec-8\">五、详细版输出什么（<code>mod11_detailed.py</code>）</h2>\n<p>每组打印四段：</p>\n<ol>\n<li><strong>逐位摊开表</strong> —— 位号 k / 数字 d / 符号 / 该位贡献，按 18 列一块横向铺开</li>\n</ol>\n<p>（80 位的数会打成 5 块，不会挤成一团）</p>\n<ol>\n<li><strong>交替和</strong> —— plus、minus、diff、<code>diff % 11</code> 四步流水</li>\n<li><strong>符号为什么交替</strong> —— 打印 <code>10^k mod 11</code> 的前 12 项：<code>1 10 1 10 …</code></li>\n<li><strong>Sum check 交叉验证</strong> —— 三套独立算法必须给出同一个数：</li>\n</ol>\n<p>``<code> 交替和法        -&gt; 2 Horner 逐位取模 -&gt; 2 Python 大整数   -&gt; 2      (任意精度，仅本地可用) Sum check: 三法一致 -&gt; OK </code>``</p>\n<p>任何一法分歧就打印 <code>MISMATCH</code> 并把 <code>[!]</code> 写进 stderr。 文件末尾再按 OJ 标准格式输出一遍纯答案，便于与提交版逐字比对。</p>\n<hr>\n<h2 id=\"sec-9\">六、边界与陷阱</h2>\n<h3 id=\"sec-10\">1. ★ 负的 diff —— 本题最容易漏的一步</h3>\n<p><code>diff = plus − minus</code> 完全可能是负数。以 <code>n = 10</code> 为例：</p>\n<pre class=\"code\"><code>十位 1 取 −，个位 0 取 +   =&gt;   diff = 0 − 1 = −1</code></pre>\n<ul>\n<li>Python：<code>−1 % 11 == 10</code> ✓ 直接可用</li>\n<li><strong>C / JavaScript：<code>−1 % 11 == −1</code></strong> ✗ 必须 <code>if (r &lt; 0) r += 11;</code> / <code>((x % 11) + 11) % 11</code></li>\n</ul>\n<p>写错的症状是：大部分用例都对，唯独 <code>10</code>、<code>91</code>、<code>100</code> 这类<strong>负 diff</strong> 的输入输出负数（如 <code>-1</code>）或错值（如 <code>abs</code> 写法会得 <code>1</code>）。 本项目的锚定用例就是钉它的：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>diff</th><th>正确输出</th><th>忘补正会输出</th><th><code>abs(diff) % 11</code> 会输出</th></tr></thead><tbody><tr><td><code>10</code></td><td>−1</td><td><strong>10</strong></td><td><code>-1</code></td><td>1</td></tr><tr><td><code>91</code></td><td>−8</td><td><strong>3</strong></td><td><code>-8</code></td><td>8</td></tr></tbody></table></div>\n<h3 id=\"sec-11\">2. 必须按字符串处理，不许转整数</h3>\n<p>80 位远超 <code>long long</code>（约 19 位）与 <code>unsigned long long</code>（约 20 位）。 C 侧若用 <code>strtoll</code> / <code>atoi</code> 会溢出或截断，且<strong>不一定报错</strong> —— 这是最阴的一类 WA。 （仓库陷阱 13 记的 <code>strtoll</code> 宽松解析是同一族问题：<code>12abc</code> 会被悄悄截成 <code>12</code>。）</p>\n<h3 id=\"sec-12\">3. ★ 编号方向：从<strong>个位</strong>起，不是从左起</h3>\n<p><code>10^k</code> 的权重只跟\"离个位多远\"有关。若写成\"按字符串从左往右交替取符号\"，位数一变就全错。 最小锚定：<code>n = 12</code>，正确 <code>1</code>；按从左起取符号会算成 <code>1 − 2 = −1 → 10</code>。 前导零用例 <code>0012</code>（正确 <code>1</code>）同样能抓到这个错。</p>\n<h3 id=\"sec-13\">4. 前导零无害</h3>\n<p>在最高位前面添 <code>0</code>，等于在 <code>diff</code> 上加 <code>±0</code>，余数不变。 <code>0012</code> 与 <code>12</code>、<code>0121</code> 与 <code>121</code> 都必须给出相同答案。</p>\n<h3 id=\"sec-14\">5. 判题格式是\"给定 T 组\"</h3>\n<p>第 1 行是 <code>T</code>，读完 <code>T</code> 组即止 —— <strong>不是</strong>读到 EOF、<strong>不是</strong> N=0 哨兵。 （本仓库四种结束方式都出现过：均分纸牌 = EOF、数字三角形 = H=0 哨兵、 LCS = T 组数、01背包 = EOF。<strong>逐题核对，不要拿上一题的习惯套下一题。</strong>）</p>\n<p>提交版读完 <code>T</code> 组后，若<strong>同一行</strong>还压着没消费的 token，会往 stderr 打 <code>[!]</code> 提示便于人工核对； 它<strong>不会</strong>再去读下一行（理由见陷阱 9）。stdout 始终纯净，不影响判题。</p>\n<h3 id=\"sec-15\">6. stdout 只留答案，且<strong>读完统一输出</strong></h3>\n<p>答案一行一组、<a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a>带换行（对齐 <code>cout &lt;&lt; ans &lt;&lt; endl</code>）； 任何错误一律 <code>print(..., file=sys.stderr)</code> 并带 <code>[!]</code> 前缀。 本题每组只输出<strong>一行</strong>（没有 LCS 那样的 <code>Case i</code> 行）。</p>\n<p><strong>输出时机</strong>：<code>mod11.py</code> / <code>mod11.c</code> 都是<strong>读完所有 T 组后才<a class=\"kw\" href=\"#/k/batch-output\" title=\"概念：batch-output\">一次性输出</a></strong>， 而不是\"读一组打一组\"。原因很实际 —— 在终端里手敲数据时，逐组输出会让答案 和输入一行行穿插：</p>\n<pre class=\"code\"><code>逐组输出（旧）              读完统一输出（现在）\n3                          3\n78                         78\n1        ← 敲完 78 就蹦出   70906\n70906                      781020569876102789\n0        ← 敲完就蹦出       1        ← 4 行输入给完，答案才集中出现\n781020569876102789          0\n2                           2</code></pre>\n<p>两者对 OJ <strong>完全等价</strong>（判题只看 stdout 的内容，不看写出的时机）， 纯粹是本地交互观感。附带好处：中途出错（EOF / 非法 n）时代码会提前 <code>return</code>， 一个字节都写不出去 —— 不存在\"只打了半截答案\"的情况， 所以 <code>verify_mod11.py</code> 里那几条出错用例的 stdout 期望值是<strong>空</strong>。</p>\n<blockquote>注：<code>mod11_detailed.py</code> 保持逐组输出 —— 它的用途就是\"一组一段过程解说\"， 读完再统一打反而看不懂。  另一面：数据没喂够时现在<strong>什么都不输出</strong>（在等剩下的组）。 比如 T=3 却只给了 1 个 n，程序会安静地等第 2 个 —— 这不是卡死， 给完 3 组才会一次性看到 3 行答案。</blockquote>\n<h3 id=\"sec-16\">7. C 侧不要用 <code>scanf(\"%79s\")</code></h3>\n<p>超长 token 会被<strong>静默截断</strong>，截断结果往往还是纯数字，于是算出一个像模像样的错答案。 <code>mod11.c</code> 改用自写的 <code>next_token()</code>，超长时显式报错退出。</p>\n<h3 id=\"sec-17\">8. ★ C 侧的行读取：<code>fgets</code> 会<strong>静默截断</strong>，而且 <code>feof</code> 救不了它</h3>\n<p><strong>症状。</strong> <code>fgets(buf, n, fp)</code> 读满 <code>n-1</code> 个字符就立刻返回，而且<strong>不会告诉你它截断了</strong>。 <code>mod11.c</code> 原先把 <code>line</code> 缓冲定成 104 字节（即最多读 103 字符），而 token 上限是 95 字符。 于是当「token 起始列偏移 ≥ 9 且该行总长 &gt; 103」时，token 在 103 字符处被切断、 切出的片段长度又 &lt; 95，于是被判为\"成功\" —— 静默截断。 实测：<code>1</code> + 换行 + <strong>24 个空格</strong> + 80 个 <code>9</code>，C 版输出 <code>9</code>，真值是 <code>0</code>。 <strong>题面合法的 80 位数字也能触发</strong>，不需要超长输入。</p>\n<p><strong>第一版修法（错的，但值得记下来）。</strong> 仍用 <code>fgets</code>，事后判定 「缓冲区塞满 + 末字符不是换行 + <strong><code>!feof(stdin)</code></strong>」，本意是\"流还没结束就说明被截断了\"。 复核子代理用真实 CRT（<code>ucrtbase.dll</code>）实测推翻了它：</p>\n<blockquote><code>fgets</code> 凑满字符数就立即返回，<strong>那一刻根本没有去探文件尾</strong>，EOF 标志还是 0。 <code>feof</code> 只在\"需要更多字符却读到 0 字节\"时才置位。所以\"缓冲满 + 末字符非换行\"时 <code>!feof</code> <strong>恒为真</strong> —— 注释里声称的那条豁免根本不存在，反倒把「文件最后一行恰好 占满缓冲且没有换行符」这种<strong>合法输入误判成截断</strong>。 （glibc 的 <code>_IO_getline_info</code> 结构同理：n 减到 0 就退出循环、不再探流。）</blockquote>\n<p><strong>这是\"注释说了谎\"的典型：写下的理由听上去合理，却从没被验证过。</strong></p>\n<p><strong>现在的修法。</strong> 干脆不用 <code>fgets</code>，改用 <code>fgetc</code> <strong>逐字符</strong>读行， 读了多少个字符由我们自己数（<code>i</code>），换行 / EOF / 缓冲区满 / NUL 四种情况各走各的分支， 没有猜测空间。顺带封掉另一条更窄的通路：输入含 <code>0x00</code> 时， <code>strlen</code> 数长度会被 NUL 骗过去、token 就在 NUL 处被静默切断 —— 现在遇到 NUL 直接报错退出。</p>\n<p><strong>看不到截断，就永远不会知道答案错了。</strong> 这是本题唯一一处\"能静默给出错值\"的缺陷。</p>\n<h3 id=\"sec-18\">9. ★ 收尾不许再读一次 stdin</h3>\n<p>\"读完 T 组后再取一个 token，看看有没有多余数据、好提示判题格式不对\"是个很自然的念头。 但它在<strong>终端里会阻塞</strong>：<code>readline()</code> / <code>fgets</code> 都在等用户再敲一行， 表现为\"答案已经打完、程序却不结束\"，用户以为卡死（与铁律 1 同族）。</p>\n<p>现在 Python 两版与 C 版都改成<strong>只看缓冲区里是否还压着 token</strong> （<code>has_buffered()</code> / 直接查 <code>cursor</code>），绝不主动再读一次。 代价是\"下一行还有多余数据\"探测不到了 —— 宁可少提示， 也不能让终端里的人对着一个不结束的程序发呆。 （注：<code>最长公共子序列/lcs.py</code> 仍是旧的\"再读一次\"写法，属既有代码，不在本次改动范围内。）</p>\n<hr>\n<h2 id=\"sec-19\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>作用</th></tr></thead><tbody><tr><td><code>mod11.py</code></td><td><strong>OJ 提交版</strong>，stdout 只输出余数，一组一行</td></tr><tr><td><code>mod11_detailed.py</code></td><td>详细版：逐位表 + 三法 Sum check，<strong>仅供本地学习，勿提交</strong></td></tr><tr><td><code>mod11.c</code></td><td>C 实现（<strong>本机无编译器，从未编译验证</strong>，见第十节）</td></tr><tr><td><code>mod11_animation.html</code></td><td>浏览器动画：逐位扫描 + 实时累计 + 文字解说，支持自定义输入</td></tr><tr><td><code>verify_mod11.py</code></td><td>自动对拍 / 自查脚本（穷举 + 随机 + 端到端 stdout + 流式 + 收尾不阻塞 + AST）</td></tr><tr><td><code>verify_animation.js</code></td><td>动画 JS 的实跑验证（<code>node verify_animation.js</code>：抽 <code>&lt;script&gt;</code> + DOM stub + BigInt 裁判）</td></tr><tr><td><code>11的余数详解.md</code></td><td>本文档</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-20\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th><th>说明</th></tr></thead><tbody><tr><td><code>3\\n78\\n70906\\n781020569876102789\\n</code></td><td><code>1\\n0\\n2\\n</code></td><td>题面样例</td></tr><tr><td><code>1\\n10\\n</code></td><td><code>10</code></td><td>★<strong>负 diff 锚定</strong>：diff = −1</td></tr><tr><td><code>1\\n91\\n</code></td><td><code>3</code></td><td>★<strong>负 diff 锚定</strong>：diff = −8</td></tr><tr><td><code>1\\n19\\n</code></td><td><code>8</code></td><td>与 91 镜像（同数字、反奇偶位）</td></tr><tr><td><code>1\\n12\\n</code></td><td><code>1</code></td><td>★<strong>方向锚定</strong>：从左起取符号会得 10</td></tr><tr><td><code>1\\n0012\\n</code></td><td><code>1</code></td><td>★<strong>前导零锚定</strong></td></tr><tr><td><code>2\\n11\\n121\\n</code></td><td><code>0\\n0</code></td><td>11 的倍数（11、11²）</td></tr><tr><td><code>1\\n&lt;80 位全 9&gt;\\n</code></td><td><code>0</code></td><td>★题面最大长度（80 位全 9 的交替和恰为 0）</td></tr><tr><td><code>1\\n1&lt;79 个 0&gt;\\n</code></td><td><code>10</code></td><td>★80 位 10 的幂：diff = −1</td></tr><tr><td><code>0\\n</code></td><td>空</td><td>T = 0</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-21\">九、正确性验证</h2>\n<h3 id=\"sec-22\">9.1 <code>python verify_mod11.py</code></h3>\n<pre class=\"code\"><code>OK: anchors 17 | exhaustive 11110 | random 22240 | detailed 3-way agree 4017 | stdout clean 16 | streaming ok | no-block ok | detailed e2e ok | AST clean (2 files)</code></pre>\n<p>覆盖：</p>\n<ol>\n<li><strong>锚定 17 例</strong> —— 上表全部，外加 <code>is_uint</code> 的接受/拒绝边界</li>\n<li><strong>全穷举 11110 例</strong> —— 1~4 位全部数字（零填充，顺带扫前导零），与 <code>int(n) % 11</code> 逐例对拍</li>\n<li><strong>随机 22240 例</strong> —— 20000 个随机 1~80 位数 + 每长度的全 9 / 10 的幂 / 全 0 + 2000 个 11 的倍数</li>\n<li><strong>详细版三法一致 4017 例</strong> —— 交替和 / Horner / Python 大整数，且与提交版逐例相同</li>\n<li><strong>端到端 stdout 16 例</strong> —— 真起子进程跑 <code>mod11.py</code>：题面样例、CRLF、空行、同行多 token、</li>\n</ol>\n<p>非法输入（不得打<a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">伪答案</a>）、缺数据、同一行多出 token；正常情形断言 <strong>stderr 为空</strong></p>\n<ol>\n<li><strong>流式（终端行为）</strong> —— stdin 喂完第一组<strong>不关闭</strong>，5 秒内必须吐出第一行答案。</li>\n</ol>\n<p>这正是铁律 1 的坑：退回 <code>sys.stdin.read()</code> 就会一直等到 EOF，终端里表现为\"敲完数据毫无反应\"</p>\n<ol>\n<li><strong>收尾不阻塞</strong> —— 喂完 <code>T</code> 组后 stdin 保持打开，进程必须<strong>自己退出</strong>。</li>\n</ol>\n<p>若收尾又去读一次 stdin，终端里就是\"答案已经打完、程序却不结束\"（见陷阱 9）</p>\n<ol>\n<li><strong>详细版端到端</strong> —— 详细版同样要能自行退出，且文件末尾那两行标准格式输出</li>\n</ol>\n<p>必须与提交版逐字一致（刻意不用 <code>communicate()</code>，否则它会替我们把 stdin 关掉， 就测不出\"程序在等 stdin\"这件事了）</p>\n<ol>\n<li><strong>AST 语法检查</strong> —— <code>mod11.py</code> / <code>mod11_detailed.py</code> 不得含 f-string / <code>sys.stdin.buffer</code> /</li>\n</ol>\n<p><code>nonlocal</code> / 类型注解 / 海象 / <code>input()</code>（<strong>用 AST 精确匹配，不用 grep</strong>： <code>readline</code> 含 <code>read</code> 子串会误报）</p>\n<p>被测对象是<strong>真正提交的文件本体</strong>，不是脚本里的副本（避免仓库陷阱 10 的\"验证脚本测副本\"）。</p>\n<h3 id=\"sec-23\">9.2 <code>node verify_animation.js</code>（动画 JS 实跑）</h3>\n<p>把 <code>&lt;script&gt;</code> 抽出、配 minimal DOM stub 执行：</p>\n<pre class=\"code\"><code>OK: animation js - anchors 16 | exhaustive+random 14110 vs BigInt | render/step-through ok | button-state ok | invalid-input clears stage ok | presets ok</code></pre>\n<p>覆盖：锚定 16 例（含 diff 值与步数）、穷举 1~4 位 + 随机 3000 个 80 位以内（用 <strong>BigInt 当裁判</strong>）、 累计值单调性、<code>isValidUint</code> 边界、DOM stub 下 <code>init()</code> 渲染出 18 张卡片且顺序/符号正确、 点「下一步」走完全程后面板终值正确、负 diff 的解说提示、自动播放/重置的按钮文字同步、 非法输入必须清空上一个数的动画、预设按钮的 80 位字符串生成。</p>\n<h3 id=\"sec-24\">9.3 C 版本</h3>\n<p><strong>本机无任何 C 编译器</strong>（<code>gcc</code> / <code>clang</code> / <code>tcc</code> / <code>cl</code> / <code>zig</code> 全无）， <code>mod11.c</code> <strong>从未编译、从未运行验证过</strong>，仅保证与 <code>mod11.py</code> 逐行逻辑对应。 使用前请自行 <code>gcc -O2 -o mod11 mod11.c</code> 并重跑第八节的用例。</p>\n<h3 id=\"sec-25\">9.4 独立审计发现的缺陷（已修）</h3>\n<p>按 CLAUDE.md 要求（跨 ≥3 文件改动必须 spawn 独立 subagent 审计）， 让一个只读 subagent 审了全部交付物。它抓到 4 个真问题，全部已修并补了回归断言：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>位置</th><th>问题</th><th>修法</th></tr></thead><tbody><tr><td><strong>M1</strong></td><td><code>mod11.c</code> 的 token 读取</td><td><code>fgets</code> <strong>静默截断</strong>窗口 → 错答案进 stdout（本轮唯一能静默给出错值的缺陷，详见陷阱 8）</td><td>改为 <code>fgetc</code> 逐字符读行、自己数长度（第一版 <code>!feof</code> 判定经二次复核实测无效，已废弃）</td></tr><tr><td><strong>L1</strong></td><td><code>mod11.py</code> / <code>mod11.c</code> 收尾</td><td>读完 T 组后仍再读一次 stdin，<strong>终端里\"答案打完了、程序却不结束\"</strong></td><td>改为只查缓冲区（<code>has_buffered()</code> / <code>cursor</code>），绝不阻塞</td></tr><tr><td><strong>L2</strong></td><td>动画 <code>reset()</code> / <code>loadNumber()</code></td><td>定时器停了，按钮文字却还停在「暂停」</td><td>复位动作收进 <code>clearTimer()</code></td></tr><tr><td><strong>L3</strong></td><td>动画 <code>loadNumber()</code> 失败分支</td><td>报错后旧结果仍活着，能在报错状态下继续步进上一个数</td><td>新增 <code>clearStage()</code> 彻底清空</td></tr></tbody></table></div>\n<p>C 版因为无法编译验证，额外做了<strong>两轮</strong>独立复核（都是 spawn 的只读子代理：用 Python 逐字符 复刻 C 的读取语义，再与\"按空白切分\"的参照语义对拍）。第一轮确认了 M1，并推翻了我的第一版 修法（<code>!feof</code> 那一条）；第二轮专审 <code>fgetc</code> 版实现，结论是<strong>零静默截断、零越界、零误拒合法输入</strong>， 并确认 <code>(a3)</code> 回归通过 —— 上一版会误拒的「最后一行恰好 103 字符且无换行」现在正确输出 <code>0</code>。 两轮随机对拍合计 13 万余例，分类器专门盯\"静默截断\"（复刻取到的 token 恰是真 token 的真前缀、 却算出了答案）—— <strong>零命中</strong>。</p>\n<blockquote>注意：<code>verify_mod11.py</code> <strong>只覆盖两个 <code>.py</code>，完全不涉及 <code>mod11.c</code></strong>（它没有自动测试）。 C 版唯一验证手段就是上面这种\"用另一种语言复刻其读取语义再对拍\"。</blockquote>\n<p>第二轮复核顺带指出的 4 处，也都已修：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>位置</th><th>问题</th><th>修法</th></tr></thead><tbody><tr><td>N1</td><td><code>mod11.c</code> 注释</td><td>注释仍写\"会再触发一次 <code>fgets</code>\"，代码早已是 <code>fgetc</code> —— 陷阱 4 的 doc↔code 漂移</td><td>改为\"会再读一次 stdin（<code>read_line</code> 里的 <code>fgetc</code> 会等输入）\"</td></tr><tr><td>N2</td><td><code>mod11.c</code> 的 T 解析</td><td>阈值检查放在累加<strong>之前</strong>，末尾刚好顶过阈值的数会漏网（阈值 1000 时的反例是 <code>\"1009\"</code>）</td><td>检查移到累加之后</td></tr><tr><td>N3</td><td><code>mod11.c</code> 报错文案</td><td><code>-1</code>/<code>-2</code>/<code>-3</code> 共用一句话，排障时分不清是行超长、含 NUL 还是 token 超长</td><td>加 <code>why_neg()</code> 分别报出</td></tr><tr><td>N4</td><td><code>verify_mod11.py</code></td><td>子进程输出按 GBK 解码失败时 <code>stderr</code> 变成 <code>None</code>，<code>err.startswith(...)</code> 当场 <code>AttributeError</code> —— 脚本在 GBK 环境里会崩</td><td>四处 <code>subprocess</code> 调用统一显式 <code>encoding=\"utf-8\", errors=\"replace\"</code>，并用 <code>or \"\"</code> 兜底</td></tr></tbody></table></div>\n<p>N4 已用 <code>PYTHONIOENCODING=gbk python verify_mod11.py</code> 复现过崩、修后复跑通过。</p>\n<p>它同时<strong>反证了 <code>verify_mod11.py</code> 的断言不是恒真</strong>：把被测函数换成 4 种错实现做变异测试， 分别被抓到 10602 / 4959 / 9428 处，其中\"C 式负余数\"（<code>math.fmod</code>）被 3 条锚定钉死； 它还独立复现了 9.2 的动画测试规模，确认那些数字不是编造的。</p>\n<blockquote>另有两处<strong>属于测试自身</strong>的问题，不算交付缺陷，一并记下： - <code>computeSteps('12')</code> 的差期望值被手填成 −1（实为 +1）→ 仓库陷阱 19； - 动画的 DOM stub 起初把 <code>innerHTML = ''</code> 当普通属性赋值、没有真的清空子节点， 于是误报 3 条\"没清空\"。  <strong>FAIL 时先自查测试数据与 stub，再动被测代码。</strong></blockquote>\n<hr>\n<h2 id=\"sec-26\">十、C 版本说明</h2>\n<p><code>mod11.c</code> 与 Python 版的<strong>已知差异</strong>：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>Python 版</th><th>C 版</th></tr></thead><tbody><tr><td>负数取模</td><td><code>−1 % 11 == 10</code>，天然非负</td><td><code>−1 % 11 == −1</code>，<strong>必须 <code>if (r &lt; 0) r += 11;</code></strong></td></tr><tr><td>超长输入</td><td>token 多长都保留</td><td>整行超 103 字符 / token 超 95 字符 / 含 NUL 字节，都<strong>报错退出</strong>（绝不截断，见陷阱 8）</td></tr><tr><td>输入读取</td><td><code>readline()</code>（无长度上限）</td><td><code>read_line()</code> 用 <code>fgetc</code> 逐字符读、自己数字符数</td></tr><tr><td>非法输入</td><td><code>[!]</code> 到 stderr 后中止</td><td>同上</td></tr><tr><td>T 的上界</td><td>无（多大的 T 都一路读到 EOF）</td><td><strong>T ≤ 1000</strong>，超出直接报错退出（题面 T &lt; 20，留了 50 倍余量，顺带保证 <code>ans[]</code> 不越界）</td></tr></tbody></table></div>\n<p>两版都做到：<strong>stdout 只留答案、错误带 <code>[!]</code> 前缀、宁可中止也不错答</strong>。</p>\n<hr>\n<h2 id=\"sec-27\">附：一句话记住这题</h2>\n<blockquote>n 的各位从个位起编号，奇数位（个位、百位……）相加、偶数位（十位、千位……）相减， 得到的差再 <code>mod 11</code> 就是答案； <strong>差可能是负的，C 和 JS 里记得再 <code>+11</code>。</strong></blockquote>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：交替和",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "2.1 原理",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "2.2 提交版实现要点",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "2.3 与 Horner 法的关系",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "三、样例演示",
    "lvl": 2
   },
   {
    "id": "sec-7",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "五、详细版输出什么（mod11_detailed.py）",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "1. ★ 负的 diff —— 本题最容易漏的一步",
    "lvl": 3
   },
   {
    "id": "sec-11",
    "text": "2. 必须按字符串处理，不许转整数",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "3. ★ 编号方向：从个位起，不是从左起",
    "lvl": 3
   },
   {
    "id": "sec-13",
    "text": "4. 前导零无害",
    "lvl": 3
   },
   {
    "id": "sec-14",
    "text": "5. 判题格式是\"给定 T 组\"",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "6. stdout 只留答案，且读完统一输出",
    "lvl": 3
   },
   {
    "id": "sec-16",
    "text": "7. C 侧不要用 scanf(\"%79s\")",
    "lvl": 3
   },
   {
    "id": "sec-17",
    "text": "8. ★ C 侧的行读取：fgets 会静默截断，而且 feof 救不了它",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "9. ★ 收尾不许再读一次 stdin",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-20",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-21",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-22",
    "text": "9.1 python verify_mod11.py",
    "lvl": 3
   },
   {
    "id": "sec-23",
    "text": "9.2 node verify_animation.js（动画 JS 实跑）",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "9.3 C 版本",
    "lvl": 3
   },
   {
    "id": "sec-25",
    "text": "9.4 独立审计发现的缺陷（已修）",
    "lvl": 3
   },
   {
    "id": "sec-26",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-27",
    "text": "附：一句话记住这题",
    "lvl": 2
   }
  ],
  "files": [
   "mod11.py",
   "mod11_detailed.py",
   "mod11.c",
   "verify_mod11.py"
  ],
  "concepts": [
   "batch-output",
   "no-bigint",
   "out-of-range",
   "reader",
   "t-cases",
   "tail-newline"
  ],
  "prev": "repunit",
  "next": "catalan",
  "related": [
   "repunit",
   "lcs",
   "tickets"
  ]
 },
 {
  "slug": "catalan",
  "dir": "车厢调度",
  "title": "车厢调度",
  "cat": "组合数学 · Catalan",
  "catId": "combinatorics",
  "cx": "O(1) 每组",
  "fmt": "多组 · EOF 结束",
  "summary": "1..n 依次进站、任意时刻可出站，问出站顺序共有多少种（等价于第 n 个卡特兰数，预处理查表后每组 O(1)）。",
  "docName": "车厢调度详解.md",
  "doc": "<h1>车厢调度（栈的输出序列总数）详解</h1>\n<blockquote>题目：1..n 依次进站，任意时刻可让车头出站，问出站顺序一共有多少种（n ≤ 18）。</blockquote>\n<hr>\n<h2 id=\"sec-1\">一、题意</h2>\n<ul>\n<li>输入：<strong>若干行，每行一个整数 n（1 ≤ n ≤ 18），读到文件结束（<a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a>）</strong>。</li>\n<li>输出：对每个 n 输出<strong>一行</strong>，即可能的输出序列总数（<strong>没有 <code>Case i</code> 前缀</strong>）。</li>\n<li>样例：</li>\n</ul>\n<p>``<code> 输入      输出 2         2 3         5 </code>``</p>\n<p>同一件事的两种说法：把 1..n 依次 push 进栈，随时可以 pop，能得到多少种不同的 pop 序列。</p>\n<blockquote><strong>判题格式（铁律 2）</strong>：题面写「输入有若干行，每行只含一个整数 n」，样例两组之间 <strong>没有任何组数标记</strong> —— 所以是\"多组读到 EOF\"，<strong>不是\"第 1 行 T 组数\"</strong>。 本仓库三种结束方式都出现过（均分纸牌 = EOF、数字三角形 = H=0 哨兵、LCS = T 组数）， 必须逐题从题面与样例确认。本题与 <strong>均分纸牌 / 连通分支数 / 最小差</strong> 同型。</blockquote>\n<hr>\n<h2 id=\"sec-2\">二、算法：卡特兰数</h2>\n<h3 id=\"sec-3\">2.1 为什么是卡特兰数</h3>\n<p>整个调度过程不过是 <strong>n 次 push 和 n 次 pop</strong> 排成了一列操作，唯一的约束是：</p>\n<pre class=\"code\"><code>任何时刻，pop 的次数都不能超过 push 的次数      （栈空就弹不出东西）</code></pre>\n<p>把 push 记作 <code>(</code>、pop 记作 <code>)</code>，上面这条约束就是\"<strong>括号序列必须合法</strong>\"， 而长度为 2n 的合法括号序列数正是第 n 个<strong>卡特兰数</strong>：</p>\n<pre class=\"code\"><code>Cat(n) = C(2n, n) / (n+1)</code></pre>\n<h3 id=\"sec-4\">2.2 三种算法</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>方法</th><th>式子</th><th>说明</th></tr></thead><tbody><tr><td><strong>整数递推</strong>（提交版采用）</td><td><code>Cat(0)=1</code>，<code>Cat(k) = Cat(k-1) * (4k-2) / (k+1)</code></td><td>只用整数乘除，不需要大整数库</td></tr><tr><td>组合数公式</td><td><code>Cat(n) = C(2n, n) / (n+1)</code></td><td>直观，但 C 里中间量会溢出（见陷阱 3）</td></tr><tr><td>动态规划</td><td><code>f[i][j] = f[i-1][j] + f[i][j-1]</code>（<code>j ≤ i</code>）</td><td><code>f[i][j]</code> = 已 push i 个、已 pop j 个的方案数</td></tr></tbody></table></div>\n<p>DP 的转移直接对应题目的两个操作：</p>\n<ul>\n<li><code>f[i-1][j]</code> → 这一步 <strong>push</strong> 第 i 个</li>\n<li><code>f[i][j-1]</code> → 这一步 <strong>pop</strong>（要求 <code>j ≤ i</code>，即栈非空）</li>\n</ul>\n<p>答案是 <code>f[n][n]</code>。这条式子与卡特兰数同源，且每一步都对应一个真实动作 —— 详细版就靠它把过程讲清楚。</p>\n<h3 id=\"sec-5\">2.3 提交版实现</h3>\n<pre class=\"code python\"><code>def catalan_table(limit):\n    cat = [1]                             # Cat(0) = 1\n    for k in range(1, limit + 1):\n        cat.append(cat[k - 1] * (4 * k - 2) // (k + 1))\n    return cat</code></pre>\n<p>预计算 <code>Cat(0..18)</code>，多组输入直接查表，每组 O(1)。 分子一定是 <code>(k+1)</code> 的倍数（数学上保证），所以 <code>//</code> 不会丢精度。</p>\n<h3 id=\"sec-6\">2.4 举几个值</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>…</th><th>18</th></tr></thead><tbody><tr><td><a class=\"kw\" href=\"#/k/small-preprocess\" title=\"概念：small-preprocess\">Cat(</a>n)</td><td>1</td><td>2</td><td>5</td><td>14</td><td>42</td><td>132</td><td>429</td><td>1430</td><td>…</td><td><strong>477638700</strong></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-7\">三、样例演示（n = 3）</h2>\n<p>n=3 时一共 5 种输出序列：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>输出序列</th><th>怎么得到（操作序列）</th></tr></thead><tbody><tr><td><code>1 2 3</code></td><td>push 1, pop 1, push 2, pop 2, push 3, pop 3</td></tr><tr><td><code>1 3 2</code></td><td>push 1, pop 1, push 2, push 3, pop 3, pop 2</td></tr><tr><td><code>2 1 3</code></td><td>push 1, push 2, pop 2, pop 1, push 3, pop 3</td></tr><tr><td><code>2 3 1</code></td><td>push 1, push 2, pop 2, push 3, pop 3, pop 1</td></tr><tr><td><code>3 2 1</code></td><td>push 1, push 2, push 3, pop 3, pop 2, pop 1</td></tr></tbody></table></div>\n<p><strong>为什么 <code>3 1 2</code> 做不到？</strong> 想让 3 第一个出站，就得先把 1、2 压在栈里； 那出完 3 之后栈顶是 2，只能先出 2 —— 得到的是 <code>3 2 1</code>。 这就是\"pop 次数不能超过 push 次数\"这条约束的直观体现。</p>\n<p>DP 表（<code>f[i][j]</code>，行 = 已 push i 个，列 = 已 pop j 个，<code>j &gt; i</code> 是不可能状态）：</p>\n<pre class=\"code\"><code>           j=0   j=1   j=2   j=3\n  i=0        1     --    --    --\n  i=1        1      1    --    --\n  i=2        1      2     2    --\n  i=3        1      3     5     5     &lt;- 答案 f[3][3] = 5</code></pre>\n<hr>\n<h2 id=\"sec-8\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>提交版</th><th>说明</th></tr></thead><tbody><tr><td>预处理</td><td>O(MAXN) = O(18)</td><td>一次算好 Cat(0..18)</td></tr><tr><td>每组</td><td><strong>O(1)</strong></td><td>直接查表</td></tr><tr><td>空间</td><td>O(MAXN)</td><td>一张 19 项的表</td></tr></tbody></table></div>\n<p>即使不预处理、每组现算，也只是 O(n)。</p>\n<hr>\n<h2 id=\"sec-9\">五、详细版输出什么（<code>catalan_detailed.py</code>）</h2>\n<p>每组打四段，并做 <strong>Sum check</strong>：</p>\n<ol>\n<li><strong>暴力枚举</strong>（n ≤ 9）—— 把所有合法 push/pop 序列走一遍，收集真正得到的不同输出序列。</li>\n</ol>\n<p>n ≤ 5（最多 42 种）时把序列一条条列出来</p>\n<ol>\n<li><strong>动态规划</strong> —— 打印 <code>f[i][j]</code> 表（n ≤ 10）并给出 <code>f[n][n]</code></li>\n<li><strong>卡特兰递推</strong> —— 打印 <code>Cat(0..n)</code> 的前若干项</li>\n<li><strong>组合数公式</strong> —— 打印 <code>C(2n,n)</code> 与除以 <code>(n+1)</code> 的结果</li>\n</ol>\n<p>四者必须给出同一个数，否则 stderr 报 <code>MISMATCH</code>。文件末尾按 OJ 标准格式再输一遍纯答案。</p>\n<hr>\n<h2 id=\"sec-10\">六、边界与陷阱</h2>\n<h3 id=\"sec-11\">1. ★ 输入是\"多组读到 EOF\"，不是\"第 1 行 T\"</h3>\n<p>题面没有 T，样例 <code>2 / 3</code> 就是两组数据。 若照抄 LCS 的\"先读 T\"写法，样例第一行 <code>2</code> 会被当成组数，然后只读一组 —— 直接 WA。 （本仓库最贵的一课，见陷阱 14。）</p>\n<h3 id=\"sec-12\">2. ★ 输出每组<strong>一行</strong>，没有 <code>Case i</code> 前缀</h3>\n<p><code>01背包</code> 和 <code>LCS</code> 是每组两行（<code>Case i</code> + 答案），本题<strong>不是</strong>。 照抄它们会多打一行，同样的 WA。与本题同型的是 <code>均分纸牌</code> / <code>连通分支数</code> / <code>最小差</code>。</p>\n<h3 id=\"sec-13\">3. ★ C 里别走组合数路线（中间量溢出 int32）</h3>\n<p><code>Cat(18) = 477638700</code> 本身装得下 32 位 int，但组合数路线要先算 <code>C(36,18) = 9075135300</code> —— <strong>已经超出 int32（约 21.4 亿）</strong>。 所以 C 版全程用 <code>long long</code>，并且直接走整数递推（<code>Cat(k-1) * (4k-2) / (k+1)</code>）， 中间量也不会超。题面提示\"输出数据会很大\"，实际上并没那么大， 但换个 n 更大的题就难说了 —— 用 <code>long long</code> 不亏。</p>\n<h3 id=\"sec-14\">4. <code>//</code> 必须能整除</h3>\n<p><code>Cat(k-1) * (4k-2)</code> 一定是 <code>(k+1)</code> 的倍数（数学结论），所以整数除法不会丢精度。 C 版的 <code>/</code> 对正数就是截断除法，同样成立；但<strong>不能用浮点</strong>（<code>float</code>/<code>double</code> 会有精度问题）。</p>\n<h3 id=\"sec-15\">5. <a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a> n 宁可中止也不错答</h3>\n<p>题面保证 <code>1 ≤ n ≤ 18</code>。若来了 <code>0</code> 或 <code>19</code>，直接打到 stderr 并<strong>中止</strong>， 不要 <code>continue</code> —— 否则它后面的数会被当成下一个 n（陷阱 11）。</p>\n<h3 id=\"sec-16\">6. ★ 输出必须\"敲一组、出一组\"，别攒到最后</h3>\n<p>本题是<strong>读到 EOF 才结束</strong>的格式，这一点直接决定了输出策略：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>做法</th><th>终端 / PyCharm 里的后果</th></tr></thead><tbody><tr><td>攒到读完再一起输出</td><td>不按 Ctrl+Z / Ctrl+D 给出 EOF，<strong>一个答案都看不到</strong> —— 用户会以为程序坏了</td></tr><tr><td><strong>逐组输出</strong>（本实现）</td><td>敲完 <code>3</code> 回车，<strong>立刻</strong>看到 <code>5</code>，心里有底</td></tr><tr><td>逐组的代价</td><td>中途遇到非法输入时，出错之前那几组已经打出去了（\"半截答案\"）</td></tr></tbody></table></div>\n<p>所以 <code>catalan.py</code> 与 <code>catalan.c</code> 都是<strong>逐组 <code>print</code> + <code>flush</code></strong>， 本仓库其它 EOF 题（<code>均分纸牌</code> / <code>01背包</code>）也是这个做法。</p>\n<blockquote><strong>为什么不能照抄 <code>11的余数</code>？</strong> 那题是\"第 1 行 T 组数\"，<strong>读完 T 组会自动结束</strong>， 用户不需要做任何额外操作，那种格式才适合攒起来统一输出。 本题的输入没有边界，攒着输出就等于强迫用户去按 Ctrl+Z 才看得见东西。 —— 这正是本题第一版犯过的错：把上一题的输出策略照搬过来， 结果终端里\"输入了却没有任何输出\"。<strong>格式不同，输出策略就不能照抄。</strong></blockquote>\n<h3 id=\"sec-17\">7. EOF 类题目在终端里要显式结束输入</h3>\n<p>本题读到 EOF 才结束。在终端 / PyCharm 里手敲时，<strong>全部数据敲完后要按 Ctrl+Z（Windows）或 Ctrl+D（Linux）表示输入结束</strong>，程序才会输出答案。 这不是卡死 —— 是题目本身的格式要求（读完所有组才算完）。 用管道跑则天然没有这个问题：<code>python catalan.py &lt; input.txt</code>。</p>\n<h3 id=\"sec-18\">8. ★ 超长数字串必须在 <code>int()</code> 之前拦长度</h3>\n<p>Python 3.11 起，<code>int(\"9\" * 5000)</code> 会直接抛：</p>\n<pre class=\"code\"><code>ValueError: Exceeds the limit (4300 digits) for integer string conversion</code></pre>\n<p>如果只校验\"是不是纯数字\"就把 token 丢给 <code>int()</code>，碰上超长 token 会得到一段 <strong>traceback</strong> —— 既不是 <code>[!]</code> 报错（违反铁律 3），回显给用户也很难看。 所以提交版在 <code>int()</code> 之前先看长度：</p>\n<pre class=\"code python\"><code>if len(tok) &gt; 9:          # 题面 n &lt;= 18 只有 2 位，9 位已是极宽松的上限\n    print(\"[!] n is far out of range [1, 18]: a \" + str(len(tok)) + \"-digit number\",\n          file=sys.stderr)\n    return</code></pre>\n<p>有意思的是 <strong>C 版天然没这个问题</strong>（自写的 <code>parse_ll()</code> 超过 9 位直接拒）， 反倒是 Python 版要专门防一手 —— 高层语言帮忙兜底的另一面， 就是它会替你做一些你没想到的限制。</p>\n<hr>\n<h2 id=\"sec-19\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>作用</th></tr></thead><tbody><tr><td><code>catalan.py</code></td><td><strong>OJ 提交版</strong>，每组输出一行答案</td></tr><tr><td><code>catalan_detailed.py</code></td><td>详细版：暴力 + DP + 递推 + 组合数四法交叉，<strong>仅供本地学习</strong></td></tr><tr><td><code>catalan.c</code></td><td>C 实现（<strong>本机无编译器，从未编译验证</strong>，见第十节）</td></tr><tr><td><code>catalan_animation.html</code></td><td>浏览器动画：三栏演示车厢进出栈，可看全部输出序列</td></tr><tr><td><code>verify_catalan.py</code></td><td>自动对拍 / 自查脚本</td></tr><tr><td><code>verify_animation.js</code></td><td>动画 JS 的 node 实跑验证</td></tr><tr><td><code>车厢调度详解.md</code></td><td>本文档</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-20\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th><th>说明</th></tr></thead><tbody><tr><td><code>2\\n3\\n</code></td><td><code>2\\n5\\n</code></td><td>题面样例</td></tr><tr><td><code>3\\n</code></td><td><code>5</code></td><td>单组</td></tr><tr><td><code>18\\n</code></td><td><code>477638700</code></td><td>题面最大 n</td></tr><tr><td><code>1\\n2\\n3\\n4\\n5\\n</code></td><td><code>1\\n2\\n5\\n14\\n42</code></td><td>连续多组</td></tr><tr><td><code>1 2 3\\n</code></td><td><code>1\\n2\\n5</code></td><td>一行多个 n（宽容解析）</td></tr><tr><td><code>2\\r\\n3\\r\\n</code></td><td><code>2\\n5</code></td><td>CRLF <a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a></td></tr><tr><td><code>2\\n3</code></td><td><code>2\\n5</code></td><td>末行无换行符</td></tr><tr><td>`` （空输入）</td><td>空</td><td>什么都不输出</td></tr><tr><td><code>\\n\\n\\n</code></td><td>空</td><td>全是空行</td></tr><tr><td><code>0\\n</code> / <code>19\\n</code> / <code>999\\n</code></td><td>空（stderr 报错）</td><td>越界 → 中止，绝不错答</td></tr><tr><td><code>abc\\n</code> / <code>-1\\n</code> / <code>1.5\\n</code></td><td>空（stderr 报错）</td><td>非法 → 中止</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-21\">九、正确性验证</h2>\n<h3 id=\"sec-22\">9.1 <code>python verify_catalan.py</code></h3>\n<pre class=\"code\"><code>OK: anchors 18 | brute(ops+perms) 17 | detailed 4-way 24 | stdout clean 22 | streaming output ok | many-cases 4000 | AST clean (2 files)</code></pre>\n<p>覆盖：</p>\n<ol>\n<li><strong>锚定 18 例</strong> —— n=1..18 的卡特兰数写死，并与 <code>C(2n,n)/(n+1)</code>（任意精度独立算）逐项核对</li>\n<li><strong>两条互相独立的暴力</strong>（这是本脚本最要紧的部分）</li>\n</ol>\n<ul>\n<li><strong>暴力一</strong>：枚举所有合法 push/pop 操作序列，收集真正得到的不同输出序列（n ≤ 9）</li>\n<li><strong>暴力二</strong>：枚举 <code>n!</code> 个<strong>输出排列</strong>，逐个用模拟栈检验能不能由 1..n 生成（n ≤ 8）</li>\n<li>一条从\"操作\"出发（n=1..9）、一条从\"输出\"出发（n=1..8；9! = 362880 太重），</li>\n</ul>\n<p>两者与公式值全部吻合</p>\n<ol>\n<li><strong>详细版四法一致</strong> —— 暴力 / DP / 递推 / 组合数与提交版逐例相同；</li>\n</ol>\n<p>另外独立复算了 DP 表的每一格（不信它的构造过程），并逐条检验 <code>enumerate_outputs</code> 产出的序列<strong>确实是 1..n 的排列、且真能由栈生成、无重复</strong></p>\n<ol>\n<li><strong>端到端 stdout 20 例</strong> —— 题面样例、单组、最大 n、空输入、全空行、一行多个 n、</li>\n</ol>\n<p>跨空行、CRLF、末行无换行、非法输入、越界 n；正常情形断言 <strong>stderr 为空</strong>， 出错情形断言 <strong>stdout 全空</strong></p>\n<ol>\n<li><strong>★ 逐组输出</strong>（直接钉死\"输入了却没有输出\"那个坑）—— 逐组喂、逐组验：</li>\n</ol>\n<p>(a) 喂完第 1 组、stdin 不关，就应当<strong>立刻</strong>看到第 1 个答案； (b) 再喂第 2 组，立刻看到第 2 个答案； (c) 关掉 stdin（EOF）后进程才退出，答案一个不多一个不少</p>\n<ol>\n<li><strong>大批量 4000 组</strong> —— 行数与每行内容都要对</li>\n<li><strong>AST 语法检查</strong> —— 不得含 f-string / <code>sys.stdin.buffer</code> / <code>nonlocal</code> /</li>\n</ol>\n<p>类型注解 / 海象 / <code>input()</code>（用 AST 精确匹配，<strong>不用 grep</strong>）</p>\n<p>被测对象是<strong>真正提交的文件本体</strong>，不是脚本里的副本（避免仓库陷阱 10）。</p>\n<h3 id=\"sec-23\">9.2 <code>node verify_animation.js</code></h3>\n<pre class=\"code\"><code>OK: animation js - catalan 0..18 | randomOps legal | simulate consistent | enum/simulate cross-checked | render/step-through ok | button-state ok | invalid-input clears ok</code></pre>\n<p>重点两条交叉验证：</p>\n<ul>\n<li><code>simulate()</code> 一步步模拟出的最终序列，必须能通过 <code>stackGenerable()</code> 的<strong>独立检验</strong>，</li>\n</ul>\n<p>且必须出现在 <code>enumerateSequences()</code> 枚举出的集合里（双向）</p>\n<ul>\n<li>每一步快照的 <code>remainder</code> / <code>stack</code> / <code>out</code> 三个数组必须互相自洽</li>\n</ul>\n<p>—— <code>remainder</code> 尤其容易写错：<strong>本轮写动画时就写错过一次</strong> （原先是事后另算一步的\"待处理序列\"，结果差了一步，把下一个待 push 的编号 记成了 push 之前的值），改成在模拟循环里顺手取走才对。</p>\n<h3 id=\"sec-24\">9.3 C 版本</h3>\n<p><strong>本机无任何 C 编译器</strong>（<code>gcc</code> / <code>clang</code> / <code>tcc</code> / <code>cl</code> / <code>zig</code> 全无）， <code>catalan.c</code> <strong>从未编译、从未运行验证过</strong>，仅保证与 <code>catalan.py</code> 逐行逻辑对应。 使用前请自行 <code>gcc -O2 -o catalan catalan.c</code> 并重跑第八节的用例。</p>\n<h3 id=\"sec-25\">9.4 独立审计发现的缺陷（已修）</h3>\n<p>按 CLAUDE.md 要求（跨 ≥3 文件改动必须 spawn 独立 subagent 审计）， 让一个只读 subagent 审了全部交付物，并做了<strong>变异测试</strong>（把被测函数在内存里换成错实现， 看脚本能不能抓出来）。结论：<code>verify_catalan.py</code> 的断言<strong>不是恒真</strong> —— \"直接返回 n\"、\"返回 2^n\"、\"递推系数写错\"、\"整数除法误写成浮点\"、\"越界 n 用 continue\"、 \"非法 token 用 continue\"、\"多加 Case i 前缀\"、\"丢掉末尾换行\"、\"LCS 式先读 T 组数\" 这 9 类变异<strong>全部被抓</strong>。</p>\n<p>它抓出的真问题：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>位置</th><th>问题</th><th>修法</th></tr></thead><tbody><tr><td><strong>P1</strong></td><td>两版 <code>.py</code> 的 <code>int(tok)</code></td><td><strong>超长数字串抛 <code>ValueError</code>（traceback）</strong>，而不是 <code>[!]</code> 报错，违反铁律 3</td><td><code>int()</code> 之前先拦长度（&gt; 9 位即拒，见陷阱 8）</td></tr><tr><td><strong>P2</strong></td><td>动画解说文案</td><td>\"那 1 一定比 2 先出\"<strong>写反了</strong> —— 正确是\"2 一定比 1 先出\"，写反之后得到的恰恰是它要否定的 <code>312</code></td><td>改正，并与详解 §三 的表述对齐</td></tr><tr><td><strong>P3</strong></td><td>动画 <code>loadN</code></td><td>把输入中的空白<strong>全部删掉</strong>，导致 <code>\"1 2\"</code> 被静默当成 <code>12</code></td><td>只去首尾空白，中间空白交给 <code>isValidN</code> 判非法</td></tr><tr><td>P4</td><td><code>verify_catalan.py</code></td><td>两处敏感度盲区（浮点后再取整、<code>sys.stdin.read()</code>）</td><td><strong>不是交付物缺陷</strong>：管道下无法区分 <code>read</code>/<code>readline</code>；浮点写法在 n≤18 结果恰好精确。属脚本能力边界，已在此注明</td></tr><tr><td>P5</td><td>本篇 §九</td><td>写\"n=1..9 全部吻合\"，实际暴力二只覆盖到 n=8</td><td>已改为\"暴力一到 9、暴力二到 8\"</td></tr><tr><td>P6</td><td>两版注释</td><td>引述\"题面提示输出数据会很大\"在仓库内无法核对</td><td>题面原文确有这句（用户提供的题面），保留</td></tr></tbody></table></div>\n<p>另有两处<strong>信息级观察</strong>也已处理：</p>\n<ul>\n<li><code>catalan.py</code> 里那个恒不触发的 <code>has_buffered()</code> 检查（读到 EOF 时缓冲区必空）<strong>已删除</strong>，</li>\n</ul>\n<p>免得留下\"看着有检查、其实恒假\"的假象；</p>\n<ul>\n<li><code>verify_animation.js</code> 里一条近乎恒真的断言改成了有意义的检查</li>\n</ul>\n<p>（走完后的解说必须点明 <code>Cat(3) = 5</code>）。</p>\n<p>审计同时确认了几件<strong>没出问题</strong>的事（这部分同样重要）： 判题格式确实是 EOF 多组且无 <code>Case</code> 前缀；<code>Cat(18)</code> 用三种独立方法（组合数 / O(n²) DP / Catalan 卷积）复算一致；动画的 <code>stackGenerable</code> 与它自写的贪心判定在 <strong>n≤7 的全部 n! 个排列</strong> 上零不一致；<code>catalan.c</code> 的数组边界与缓冲区算术逐分支推过、无越界无静默截断。</p>\n<hr>\n<h2 id=\"sec-26\">十、C 版本说明</h2>\n<p><code>catalan.c</code> 与 Python 版的<strong>已知差异</strong>：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>Python 版</th><th>C 版</th></tr></thead><tbody><tr><td>token 长度</td><td>多长都保留</td><td>超过 63 字符报错退出（绝不截断）</td></tr><tr><td>整行长度</td><td>无限制</td><td>超过 71 字符报错退出</td></tr><tr><td>数字解析</td><td><code>int()</code> + 纯数字校验</td><td>自写 <code>parse_ll()</code>，只认十进制数字、长度 &gt; 9 位即拒（<strong>不用 <code>strtoll</code></strong>，它会把 <code>12abc</code> 悄悄截成 12）</td></tr><tr><td>输入读取</td><td><code>readline()</code> 逐行</td><td><code>read_line()</code> 用 <code>fgetc</code> <strong>逐字符</strong>读、自己数字符数</td></tr></tbody></table></div>\n<p>两版都做到：<strong>stdout 只留答案、错误带 <code>[!]</code> 前缀、宁可中止也不错答、逐组输出</strong>。</p>\n<blockquote>C 版刻意没用 <code>fgets</code>：它读满缓冲就返回、<strong>且不报告截断</strong>， 事后用 <code>feof</code> 也救不了（<code>fgets</code> 凑满字符数那一刻根本没探文件尾，EOF 标志还是 0）。 这套\"逐字符读 + 自己数长度\"的写法是从 <code>11的余数/mod11.c</code> 沿用过来的， 那边已经过三轮独立复核。</blockquote>\n<hr>\n<h2 id=\"sec-27\">附：一句话记住这题</h2>\n<blockquote>n 次进站、n 次出站排成一列，<strong>任何时刻出站次数不能超过进站次数</strong> —— 满足这个条件的操作序列数就是卡特兰数 <code>Cat(n) = C(2n,n)/(n+1)</code>， 递推写 <code>Cat(k) = Cat(k-1)*(4k-2)/(k+1)</code>，<code>Cat(0)=1</code>。 别忘了本题是<strong>多组读到 EOF</strong>，而且<strong>每组只输出一行、没有 Case 前缀</strong>。</blockquote>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：卡特兰数",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "2.1 为什么是卡特兰数",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "2.2 三种算法",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "2.3 提交版实现",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "2.4 举几个值",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "三、样例演示（n = 3）",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "五、详细版输出什么（catalan_detailed.py）",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "1. ★ 输入是\"多组读到 EOF\"，不是\"第 1 行 T\"",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "2. ★ 输出每组一行，没有 Case i 前缀",
    "lvl": 3
   },
   {
    "id": "sec-13",
    "text": "3. ★ C 里别走组合数路线（中间量溢出 int32）",
    "lvl": 3
   },
   {
    "id": "sec-14",
    "text": "4. // 必须能整除",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "5. 越界 n 宁可中止也不错答",
    "lvl": 3
   },
   {
    "id": "sec-16",
    "text": "6. ★ 输出必须\"敲一组、出一组\"，别攒到最后",
    "lvl": 3
   },
   {
    "id": "sec-17",
    "text": "7. EOF 类题目在终端里要显式结束输入",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "8. ★ 超长数字串必须在 int() 之前拦长度",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-20",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-21",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-22",
    "text": "9.1 python verify_catalan.py",
    "lvl": 3
   },
   {
    "id": "sec-23",
    "text": "9.2 node verify_animation.js",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "9.3 C 版本",
    "lvl": 3
   },
   {
    "id": "sec-25",
    "text": "9.4 独立审计发现的缺陷（已修）",
    "lvl": 3
   },
   {
    "id": "sec-26",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-27",
    "text": "附：一句话记住这题",
    "lvl": 2
   }
  ],
  "files": [
   "catalan.py",
   "catalan_detailed.py",
   "catalan.c",
   "verify_catalan.py"
  ],
  "concepts": [
   "eof",
   "out-of-range",
   "reader",
   "small-preprocess",
   "tail-newline"
  ],
  "prev": "mod11",
  "next": "merge-fruit",
  "related": [
   "tickets",
   "cards",
   "components"
  ]
 },
 {
  "slug": "merge-fruit",
  "dir": "合并果子",
  "title": "合并果子",
  "cat": "贪心 + 小根堆",
  "catId": "greedy",
  "cx": "O(n log n)",
  "fmt": "单组 · 兼容 EOF 多组（n=0 哨兵）",
  "summary": "每次合并任意两堆、耗费 = 两堆之和，求最小总耗费（哈夫曼树）。",
  "docName": "合并果子详解.md",
  "doc": "<h1>合并果子详解</h1>\n<blockquote>关键词：<a class=\"kw\" href=\"#/k/priority-queue\" title=\"概念：priority-queue\">小根堆</a>、贪心、哈夫曼树、带权外部路径长度、交换论证、n 堆合并 n-1 次</blockquote>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>有 <code>n</code> 堆果子，每次可以把<strong>任意两堆</strong>合并成一堆，耗费 = 这两堆重量之和。 合并 <code>n-1</code> 次后只剩一堆，求<strong>最小总耗费</strong>。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td>输入</td><td>第 1 行一个整数 <code>n</code>；第 2 行 <code>n</code> 个整数 <code>ai</code>，空格分隔</td></tr><tr><td>约束</td><td><code>1 ≤ n ≤ 10000</code>，<code>1 ≤ ai ≤ 20000</code>；<strong>答案保证小于 2^31</strong></td></tr><tr><td>输出</td><td>一行，一个整数 —— 最小的体力耗费值</td></tr><tr><td>来源</td><td>NOIP 2004 提高组 / 洛谷 P1090（亦对应 USACO06NOV Fence Repair G）</td></tr></tbody></table></div>\n<p>样例：<code>3</code> / <code>1 2 9</code> → <strong>15</strong>。 （先合 <code>1+2=3</code> 耗费 3，再合 <code>3+9=12</code> 耗费 12，共 15。）</p>\n<h3 id=\"sec-2\">从样例反推出的关键语义</h3>\n<ul>\n<li><strong>可以合并任意两堆</strong>，不是只能合并相邻两堆。</li>\n</ul>\n<p>这一点决定了它不是\"石子合并\"那道题（那道题限相邻、要区间 DP）。 本题的 n=10000 规模 + 只求总值，指向贪心而不是 DP。</p>\n<ul>\n<li><strong>每一堆的重量会在它参与的每一次合并里被重复计入</strong>。</li>\n</ul>\n<p>这是全部直觉的来源：轻的堆应该多合几次，重的堆要少合几次。</p>\n<hr>\n<h2 id=\"sec-3\">二、算法：小根堆贪心（哈夫曼树）</h2>\n<pre class=\"code\"><code>1. 把所有堆放进小根堆                                  —— O(n) 建堆\n2. 重复 n-1 次：\n       取出堆中**最小的两堆** a、b\n       合并成 a+b，耗费记入 total\n       把 a+b 放回堆                                   —— 每次 O(log n)\n3. 输出 total                                          —— 合计 O(n log n)</code></pre>\n<p>提交版直接用标准库 <code>heapq</code>（<code>heapify</code> + <code>heappop</code> + <code>heappush</code>）， 详细版手写了一个 <code>MinHeap</code> 类以展示堆的内部变化。</p>\n<h3 id=\"sec-4\">为什么\"每次取最小的两个\"是对的（交换论证）</h3>\n<p>把合并过程画成一棵二叉树：每次合并产生一个父结点，两个孩子是参与合并的两堆。 于是<strong>每堆果子的重量会乘上\"它在树里的深度\"被计入总耗费</strong>：</p>\n<pre class=\"code\"><code>总耗费 = Σ ai x (第 i 堆在树里的深度)</code></pre>\n<p>这正是这棵二叉树的<strong>带权外部路径长度</strong>。深度越大 = 被重复计入的次数越多， 所以越轻的堆越该待在深处。</p>\n<p>反过来设最优方案里最深的两个叶子不是最小的两堆 —— 把最轻的两堆与它们对调： 更轻的换到更深的位置，总代价只会<strong>变小或不变</strong>，与\"最优\"矛盾。 所以<strong>最深的那两个必然是最轻的两堆</strong>，贪心合并它们一定安全。 （这就是哈夫曼树的经典交换论证，与哈夫曼编码的最优性证明是同一个。）</p>\n<blockquote>注意：这个论证说明的是\"<strong>每次合并当时最小两堆</strong>\"是安全的， 而<strong>不是</strong>\"先排序再依次相邻合并\"（那是另一种错法，见第七节锚定用例）。</blockquote>\n<hr>\n<h2 id=\"sec-5\">三、样例演示</h2>\n<pre class=\"code\"><code>n = 3        piles = [1, 2, 9]</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>步</th><th>堆（升序）</th><th>取最小的两个</th><th>新堆</th><th>本次耗费</th><th>累计耗费</th></tr></thead><tbody><tr><td>1</td><td>1, 2, 9</td><td>1 与 2</td><td>3</td><td>3</td><td>3</td></tr><tr><td>2</td><td>3, 9</td><td>3 与 9</td><td>12</td><td>12</td><td><strong>15</strong></td></tr></tbody></table></div>\n<p><strong>答案 = 15</strong>。</p>\n<p>再看一个能区分贪心与\"排序后链式累加\"的例子：</p>\n<pre class=\"code\"><code>n = 5        piles = [1, 2, 3, 4, 5]</code></pre>\n<div class=\"tablewrap\"><table><thead><tr><th>步</th><th>堆（升序）</th><th>取最小的两个</th><th>新堆</th><th>累计耗费</th></tr></thead><tbody><tr><td>1</td><td>1,2,3,4,5</td><td>1 与 2</td><td>3</td><td>3</td></tr><tr><td>2</td><td>3,3,4,5</td><td>3 与 3</td><td>6</td><td>9</td></tr><tr><td>3</td><td>4,5,6</td><td>4 与 5</td><td>9</td><td>18</td></tr><tr><td>4</td><td>6,9</td><td>6 与 9</td><td>15</td><td><strong>33</strong></td></tr></tbody></table></div>\n<p><strong>答案 = 33</strong>。而\"排序后从头到尾累加\"（<code>1+2=3</code>、<code>3+3=6</code>、<code>6+4=10</code>、<code>10+5=15</code>） 会得到 <strong>34</strong> —— 差 1，但足以判错。这条用例就是用来钉死这种错法的。</p>\n<hr>\n<h2 id=\"sec-6\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>阶段</th><th>复杂度</th><th>说明</th></tr></thead><tbody><tr><td>建堆</td><td><code>O(n)</code></td><td>从最后一个非叶结点往前下沉</td></tr><tr><td>每轮取两个 + 放回一个</td><td><code>O(log n)</code></td><td>共 <code>n-1</code> 轮</td></tr><tr><td><strong>合计</strong></td><td><strong><code>O(n log n)</code></strong></td><td><code>n = 10000</code> 时毫秒级</td></tr></tbody></table></div>\n<p>空间：<code>O(n)</code>（堆数组本身）。</p>\n<hr>\n<h2 id=\"sec-7\">五、判题格式（铁律 2）</h2>\n<h3 id=\"sec-8\">反推过程</h3>\n<p>题面写\"输入包括两行：第一行 n，第二行 n 个整数\" —— 描述的是<strong>单组的形状</strong>。 按本仓库的规矩，判题格式必须从\"确实 AC 过的实现\"反推。</p>\n<p>查证结果：</p>\n<ul>\n<li><strong>洛谷 P1090 原题是单组</strong>：两行，没有 T 组数、没有哨兵。</li>\n<li>但网络上存在<strong>改编版</strong>，形态是「多组数据，以 <code>n=0</code> 结束」。</li>\n</ul>\n<h3 id=\"sec-9\">本仓库的选择：兼容三者的宽容循环</h3>\n<p>因为<strong>单组是\"读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a>\"的子集</strong>，所以实现成\"循环读到 EOF\"是二者的安全超集：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>判法</th><th>本题表现</th></tr></thead><tbody><tr><td>单组</td><td>算完第一组后 <code>nxt()</code> 拿到 <code>None</code>（EOF）→ 自然结束，stdout 只有一行</td></tr><tr><td>EOF 多组</td><td>一路算到 EOF，每组一行</td></tr><tr><td><code>n=0</code> 哨兵多组</td><td>读到 <code>n=0</code> 即停（题面 <code>n ≥ 1</code>，0 不是合法规模）</td></tr></tbody></table></div>\n<p>反过来只做单组，则一旦遇到多组数据必 WA。</p>\n<p><code>n=0</code> 的二义性按本仓库惯例选\"<strong>输入结束</strong>\"，并把这个选择写进 stderr 的 <code>[!]</code> 提示 （不能静默 —— 静默等于下次没人知道这里做过判断）。</p>\n<h3 id=\"sec-10\">每组输出几行</h3>\n<p><strong>一行，只有数字</strong>。本题没有 <code>Case i</code> 前缀（那是 0/1 背包和 LCS 的形态）， 也没有多余空行。<a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a>必须有换行（对齐 C++ 的 <code>cout &lt;&lt; ans &lt;&lt; endl</code>）。</p>\n<hr>\n<h2 id=\"sec-11\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>陷阱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong><code>n = 1</code> 时答案是 0</strong></td><td>只有一堆，不需要任何合并。若写成\"返回那一堆的重量\"就错了。锚定 <code>1 / 5</code> → <strong>0</strong></td></tr><tr><td>2</td><td><strong>不许取最大的两个</strong></td><td><code>1 2 9</code> 取大会得 <code>9+2=11</code>、<code>11+1=12</code>，总 23 ≠ 15</td></tr><tr><td>3</td><td><strong>不许按输入顺序依次合并</strong></td><td><code>9 1 2</code> 顺序合得 <code>10+12=22</code>；正解是 <strong>15</strong></td></tr><tr><td>4</td><td><strong>不许排序后链式累加</strong></td><td><code>1 2 3 4 5</code> 链式得 34；正解是 <strong>33</strong></td></tr><tr><td>5</td><td><strong>新堆必须放回堆里</strong></td><td>忘记 push 回，<code>n=2</code> 时下一次 heappop 直接 IndexError</td></tr><tr><td>6</td><td><strong><code>heapify</code> 不能省</strong></td><td>数组没建成堆就开始 pop，取到的不是最小值。注意：<strong>升序输入本身就是堆序</strong>，所以这个错在排序过的用例上暴露不出来 —— 必须用乱序数据测（本轮变异测试 D4 就是这么发现的）</td></tr><tr><td>7</td><td><strong>累计耗费用 64 位</strong></td><td>题面说答案 &lt; 2^31，但那是<strong>测试数据的保证</strong>，不是数学上界。反例：<code>n=10000</code> 且每堆都是 <code>20000</code> 时，总耗费 = <strong>2672320000 &gt; 2^31</strong>。Python 无此问题；<strong>C 版必须 <code>long long</code></strong></td></tr><tr><td>8</td><td><strong><code>n</code> <a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a>宁可中止也不能错答</strong></td><td>铁律 6：<code>n</code> 决定后面吃掉多少 token，越界若 <code>continue</code>，后面的数字会被当成下一个 <code>n</code>，把伪答案打进 stdout</td></tr><tr><td>9</td><td><strong><code>ai</code> 越界只警告不中止</strong></td><td>与上一条不同：<code>ai</code> 不影响 token 流，且算法对任意非负重量都成立，所以只打 <code>[!]</code> 提示、照常计算</td></tr><tr><td>10</td><td><strong><a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>不能用 <code>buf.pop(0)</code></strong></td><td><code>pop(0)</code> 每次 memmove 整个缓冲，token 挤在同一行时退化 <code>O(k^2)</code>。本仓库实测：10 万 token 一行时 <code>pop(0)</code> 要 28.8 秒、正确写法 0.147 秒 → TLE。正解 <code>buf.extend(reversed(line.split()))</code> + <code>buf.pop()</code></td></tr><tr><td>11</td><td><strong>打印文本必须 GBK 可编</strong></td><td>本机 locale 是 GBK。本轮实际踩到：详细版 docstring 里的 <code>⟺</code>（U+27FA）不在 GBK 中，验证脚本新增的 GBK 可编性检查当场抓出（陷阱 31）。⚠️ <strong>同时纠正我自己的一个误判</strong>：当时我以为是 <code>×</code>（U+00D7）编不出，顺手把它也换成了 <code>x</code>；事后独立审计实测 + 我已复验 —— <strong><code>×</code> 能正常编成 GBK（<code>a1c1</code>）</strong>，真正编不出的只有 <code>⟺ ⇒ ⇔ ² ⚠</code> 这一类。教训：GBK 报错给的是<strong>整条字符串</strong>，别靠猜是哪个字符，<strong>逐字符试编码</strong>才准（本轮就是这么把 <code>⟺</code> 定位出来的）</td></tr><tr><td>12</td><td><strong>中文里不要夹 ASCII 双引号</strong></td><td>动画解说里写成 <code>为什么\"这样\"是对的</code> 会让整个 <code>&lt;script&gt;</code> 语法错误、页面全黑（陷阱 18）。引用一律用 <code>「」</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">七、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望</th><th>说明</th></tr></thead><tbody><tr><td><code>3</code> / <code>1 2 9</code></td><td><strong>15</strong></td><td>题面样例</td></tr><tr><td><code>1</code> / <code>5</code></td><td><strong>0</strong></td><td><strong>n=1 锚定</strong>：不用合并，耗费 0</td></tr><tr><td><code>2</code> / <code>1 1</code></td><td><strong>2</strong></td><td>n=2：唯一一种合并</td></tr><tr><td><code>4</code> / <code>1 1 1 1</code></td><td><strong>8</strong></td><td>全相等</td></tr><tr><td><code>3</code> / <code>3 3 3</code></td><td><strong>15</strong></td><td>全相等 n=3</td></tr><tr><td><code>5</code> / <code>1 2 3 4 5</code></td><td><strong>33</strong></td><td><strong>打掉\"排序后链式累加\"</strong>（那种得 34）</td></tr><tr><td><code>4</code> / <code>4 1 3 2</code></td><td><strong>19</strong></td><td><strong>打掉\"按输入顺序相邻合并\"</strong>（那种得 23）</td></tr><tr><td><code>3</code> / <code>9 1 2</code></td><td><strong>15</strong></td><td><strong>打掉\"按输入顺序依次合并\"</strong>（那种得 22）</td></tr><tr><td><code>3</code> / <code>1 2 9</code></td><td><strong>15</strong></td><td>同时<strong>打掉\"每次取最大的两堆\"</strong>（那种得 23）</td></tr><tr><td><code>3</code> / <code>100 1 1</code></td><td><strong>104</strong></td><td>最小两堆在末尾，不在开头</td></tr><tr><td><code>10</code> / <code>20000</code> x 10</td><td><strong>680000</strong></td><td>同值满量程</td></tr></tbody></table></div>\n<p>完整输入写法（两种判法都能跑）：</p>\n<pre class=\"code\"><code>3\n1 2 9</code></pre>\n<p>期望输出：</p>\n<pre class=\"code\"><code>15</code></pre>\n<p>多组连写（EOF 判法）：</p>\n<pre class=\"code\"><code>3\n1 2 9\n4\n1 1 1 1</code></pre>\n<p>期望输出：</p>\n<pre class=\"code\"><code>15\n8</code></pre>\n<hr>\n<h2 id=\"sec-13\">八、正确性验证</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>验证项</th><th>方法</th><th>结果</th></tr></thead><tbody><tr><td>算法最优性（小规模）</td><td>与<strong>暴力解</strong>对拍：递归枚举\"第一次合并哪两堆\"，按剩余堆的多重集记忆化。这是题目定义的直接翻译，零算法假设</td><td>2500 组（n≤8，四种分布：小值/大量重复/极端悬殊/满量程）<strong>全部一致</strong></td></tr><tr><td>算法最优性（中等规模）</td><td>与<strong>三条独立路径</strong>对拍：① 每轮线性扫两遍找最小两个 <code>O(n^2)</code>；② 排序 + 双队列归并 <code>O(n)</code>；③ <strong>哈夫曼树法</strong>（先搭树再算 <code>Σ 重量 x 深度</code>）</td><td>3000 组（n≤200）<strong>四路一致</strong></td></tr><tr><td>上限规模</td><td><code>n=10000</code> 随机 6 组，三路交叉</td><td>一致</td></tr><tr><td>数值上界</td><td><code>n=10000</code> 全 <code>20000</code></td><td>得 <strong>2672320000</strong>，确实 &gt; 2^31，佐证 C 版必须 <code>long long</code></td></tr><tr><td>结构性性质</td><td>断言答案 <code>&gt;= Σai</code>（仅 n≥2 时；最后一次合并的耗费正好是总和）、<code>n=1</code> 得 0、<code>n=2</code> 等于总和</td><td>300 组全过</td></tr><tr><td>锚定用例</td><td>12 条，每条同时过三条独立路径</td><td>全过</td></tr><tr><td>详细版内部结构</td><td><code>MinHeap</code> 连弹到底的序列与 <code>sorted(arr)</code> 对拍 2000 组（<strong>必须乱序输入</strong>）+ <code>peek</code>/<code>__len__</code> 300 组 + 主流程与提交版 1500 组</td><td>全过</td></tr><tr><td>详细版自校输出</td><td>端到端跑 7 组（含<strong>逆序、乱序</strong>），断言输出含「全部自检: PASS」且不含 FAIL</td><td>全过（⚠️ 但自校内部只有部分断言有牙齿，见第十二节）</td></tr><tr><td>端到端 IO</td><td>子进程真跑：stdout 逐字节、stderr 为空、末尾换行、单组/多组/<code>n=0</code>/<code>n=1</code>/同行/跨行/空行/CRLF/上限值/<code>ai</code> 超限</td><td>合法 <strong>19</strong> 组 + 非法 <strong>6</strong> 组全过</td></tr><tr><td>AST 语法检查</td><td>用 <code>ast</code> 精确匹配调用名（<strong>不用 grep</strong>：<code>readline</code> 含 <code>read</code> 子串会误报）：无 f-string / <code>.buffer</code> / <code>nonlocal</code> / 类型注解 / 海象 / <code>input()</code> / <code>sys.stdin.read()</code></td><td>clean</td></tr><tr><td>输出规范</td><td>AST 断言 <code>sys.stdout.write</code> <strong>恰好一处</strong>且是 <code>\"%d\\n\"</code> 取模；stderr 提示全部以 <code>[!]</code> 开头</td><td>clean</td></tr><tr><td>GBK 可编性</td><td>把两份 <code>.py</code> 的所有字符串字面量逐个试编码</td><td>clean（本轮修掉的是 <code>⟺</code>；<code>×</code> 本来就能编，见第六节 #11）</td></tr><tr><td>读取器复杂度</td><td><strong>斜率法</strong>（机器无关）：同进程内读 <code>K</code> 与 <code>4K</code> 个 token 的耗时之比，线性应约 4</td><td>实测 <strong>3.4~4.4</strong>（阈值 7）；<code>pop(0)</code> 变体 <strong>12~28</strong>，两侧余量充足。具体数值随机器浮动，<strong>断言看的是阈值不看绝对值</strong></td></tr><tr><td>动画（逻辑层）</td><td><code>node verify_merge_fruit_animation.js</code>：贪心 vs 独立实现 800 组、不变式、逐步 <code>render()</code>、乱序重放、树结构、复用判据、自定义输入</td><td>全过</td></tr><tr><td>动画（文案层）</td><td>每步断言解说正文与那一步的画面/数字一致（intro 堆数、pick 两堆重量 + \"下一步才合并\"、merge 新堆/累计/剩余堆数、终态答案/总重量/合并次数）</td><td>全过 —— <strong>这一块是本轮补上的最大盲区</strong>，见第九节 8</td></tr><tr><td>动画（渲染层）</td><td>headless Chrome 实拍：初始 / 选中两堆 / 终态 / n=8 满宽度 / 退化成链</td><td><strong>抓出 1 处真 bug</strong>（见第九节 1、3）</td></tr><tr><td>动画（几何层）</td><td>node 断言：每条连线的<strong>起点</strong>必须是它自己的父结点、<strong>终点</strong>必须是该父结点在数据层里的孩子、<strong>父在子之上</strong>、没有两个结点画在同一坐标（n=5 / 8 / 6 三种树形）</td><td>全过；<strong>并抓出 1 处真 bug</strong>（见第九节 6）</td></tr><tr><td><strong>断言有效性（变异测试）</strong></td><td>把代码<strong>故意改回错的</strong> 29 处（提交版 12 + 详细版 4 + 动画 13），看验证脚本认不认</td><td><strong>29/29 全部被抓</strong>（实跑输出见第十一节）</td></tr><tr><td>C 版逻辑</td><td>无编译器，用 <code>verify_merge_fruit_c_mirror.py</code> 把 C <strong>逐行转写</strong>成 Python 对拍：9 锚定 + 大数 1 条 + 6000 随机 + n=10000</td><td>全部一致（<strong>≠ 能编译</strong>）</td></tr><tr><td><strong>独立审计（另一个 subagent）</strong></td><td>① 自写一份<strong>完全不经过\"合并\"过程</strong>的独立实现（枚举全部 n 叶完全二叉树形状 + 重排不等式算 min Σw·d），先与暴力自证 400 组、再对拍 4021 + 300 组；② 逐条核铁律（AST + 20 组怪输入实跑）；③ <strong>自己构造 25 个变异体</strong>验断言；④ Chrome + <code>getComputedStyle</code> 探针确认状态色真生效（不是陷阱 35 那种被特异性盖掉）；⑤ SVG 文字越界测量</td><td>算法<strong>反例 0</strong>、铁律合规、几何断言有牙齿；<strong>抓出本文件最大盲区</strong>（见第九节 8）。它改坏过三个被测文件，每次都用 md5 断言校验还原，结束时三个 hash 与动手前完全一致</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-14\">九、本轮靠验证抓出的问题（都是\"看着像对\"的错）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>问题</th><th>怎么抓到的</th></tr></thead><tbody><tr><td>1</td><td><strong>动画里被选中的两堆在画面上根本不存在</strong>：一步到位地\"选中即合并\"，两堆在合并后立刻从列表消失，于是解说讲着「当前最小的是 1（琥珀）与 2（蓝）」、屏幕上却找不到这两格。这正是本仓库陷阱 28「文案与画面不同步」</td><td>node 断言「高亮格子数 == 2」报 0。修法：把每次合并拆成 <strong>pick（两堆在场、涂色）→ merge（合掉、新堆出现）</strong> 两步，让每步画面自洽</td></tr><tr><td>2</td><td><strong>变异 D4 打不掉</strong>（把 <code>MinHeap</code> 的建堆循环整段跳过，验证脚本居然全绿）→ 暴露<strong>测试数据盲区</strong>：详细版的端到端用例恰好都是<strong>升序输入</strong>，而升序数组本身满足堆序，建堆跳不跳没区别</td><td>变异测试。修法：补「<code>MinHeap</code> vs <code>heapq</code> 乱序对拍 2000 组」+ 详细版端到端加逆序/乱序用例</td></tr><tr><td>3</td><td><strong>角标与数字重叠</strong>：果堆格子上的 \"堆1\" 压在 \"1\" 上、\"新2\" 压在 \"12\" 上，视觉上一团糊</td><td>Chrome 实拍（node 断言测不到渲染层）</td></tr><tr><td>4</td><td><strong>详细版 docstring 里的 <code>⟺</code> 不是 GBK 字符</strong></td><td>新增的 GBK 可编性检查（AST 取所有字符串字面量逐个试编码），陷阱 31 的复现。⚠️ 当时我连带把 <code>×</code> 也换成了 <code>x</code> —— 事后复验 <strong><code>×</code> 本来就能编</strong>（见第六节 #11）。属于\"顺手多改了一处\"，无害，但它暴露了一个真问题：<strong>报错只给了整条字符串，我当时是靠猜定位字符的</strong>。正解是逐字符试编码</td></tr><tr><td>5</td><td>验证脚本自身三处错误：① <code>buildSteps()</code> 只取返回值没同步全局 <code>steps</code>，导致 <code>stateAt</code> 读的是上一轮步骤；② 锚定 <code>[20000]x10</code> 手算成 440000（实为 680000）、<code>[1,10000,10000]</code> 手算成 30001（实为 30002）；③ 函数名 <code>linear_scan</code> 里混进了西里尔字母</td><td>全是\"断言 FAIL 后先自查测试数据\"抓出来的（陷阱 19）</td></tr><tr><td>6</td><td><strong>哈夫曼树画反了</strong>：坐标函数把「从结点一直往<strong>左</strong>走到叶子的步数」当成深度，可<strong>哈夫曼树是不平衡的</strong>（权重悬殊时退化成链），最左路径未必最深 —— 于是部分结点的 y 变成负数，跟自己的孩子上下颠倒，连线方向反了。原用例 <code>1 2 9</code> / <code>1 2 3 4 5</code> / <code>1 1 1 1</code> 长出来的树都很平衡，恰好绕过了它</td><td>新增的<strong>几何断言</strong>（「父结点的 y 必须小于子结点的 y」）。修法：改用<strong>子树高度</strong>（叶子 = 0，内部结点 = 两个孩子较高者 + 1）从叶子往上递推</td></tr><tr><td>7</td><td>（没有 bug，但值得记）修完后我又实拍了一次 n=8，看到内部结点 <code>12</code> 似乎连到叶子 <code>6</code> 和 <code>3</code>（6+3≠12），<strong>差点报一个假 bug</strong>。用脚本把连线两端坐标反查回结点 id 才确认：那条线连的是「叶子 6」与「内部结点 6」，两者<strong>重量相同</strong>，在图上肉眼根本分不清</td><td>靠脚本反查否掉。<strong>这正是几何断言必须存在的理由</strong> —— 几何关系靠眼睛核，既会看漏（第 6 条）也会看错（本条）</td></tr><tr><td>8</td><td><strong>整个「解说正文」从未被断言过（本轮最大盲区，独立审计抓出）</strong>：验证脚本的 DOM stub 把 <code>innerHTML</code> 的 setter 写成了 <code>set(v) { this._text = ''; this.children = []; }</code> —— <strong>赋进去的内容被整条丢掉</strong>。而动画每一步的解说正文恰恰是用 <code>D.innerHTML = ...</code> 写的，于是 <code>stepDetail.textContent</code> 恒为空串；脚本又只断言了标题 / 状态条那三个字段，<strong>正文里写什么都测不出来</strong> —— 包括耗费、剩余堆数、终态答案。审计构造了 7 个\"只改正文、不动画面\"的变异（例如让终态正文说\"耗费为 5\"而状态条说 0），<strong>7/7 全部漏报</strong>，脚本照打 OK</td><td>独立审计（它另写脚本验证，并逐条做了变异体）。修法：stub 的 setter 改成保留剥标签正文 + 补 12 条正文断言 + 4 个正文变异。<strong>修完复跑：当前正文本身是自洽的（0 处不同步）</strong> —— 所以这是<strong>覆盖缺口</strong>而不是已发生的文案错误；但缺口本身足以让\"文案与画面不同步\"（陷阱 28）这类 bug 一路畅通</td></tr></tbody></table></div>\n<p>第 2 条尤其值得记：<strong>变异打不掉，往往不是断言不够强，而是测试数据有盲区</strong> —— 这次是\"所有用例都是排序过的\"，而排序过的数据恰好绕过了一个常见实现错误。</p>\n<hr>\n<h2 id=\"sec-15\">十、C 版本说明</h2>\n<p><code>merge_fruit.c</code> <strong>本机没有任何 C 编译器（gcc/clang/tcc/cl/zig 全无），从未编译验证过</strong>。</p>\n<p>实现要点：</p>\n<ul>\n<li>手写小根堆（<code>sift_down</code> / <code>sift_up</code> / 线性建堆），与详细版 Python 同构</li>\n<li><strong><code>long long</code> 存总耗费</strong>（第 6 节陷阱 7：极端数据下答案会超过 <code>2^31</code>），<code>%lld</code> 读写</li>\n<li><code>setvbuf(stdout, NULL, _IONBF, 0)</code> 关掉全缓冲，保证每组输出立刻可见</li>\n<li>多组读到 EOF 的写法是：</li>\n</ul>\n<p>``<code>c for (;;) { rc = scanf(\"%d\", &amp;n); if (rc == EOF) break;          /* 正常读完 */ if (rc != 1) { ...; return 1; } /* 读到了非数字 */ ... } </code>`<code> ⚠️ <strong>不能写成 </code>while (scanf(\"%d\", &amp;n) == EOF)<code></strong> —— 那个条件是\"读到 EOF 才进循环\"， 成功读到数字（返回 1）时反而不进循环，正常输入会直接跳过、非法输入会死循环。 两次都容易记混，<strong>看 </code>rc` 的三种取值：EOF / 1 / 0</strong> 才是完整的语义。</p>\n<ul>\n<li><code>n = 0</code> 当结束标记；<code>n</code> 越界或 <code>ai</code> 为负 → 打 <code>[!]</code> 后 <strong><code>return 1</code> 中止</strong></li>\n<li><code>n</code> 越界打 <code>[!]</code> 到 stderr 后 <strong>return 1 中止</strong>（宁可不出结果，也不把后面的数字当下一组的 n）</li>\n<li><code>ai</code> 越界只提示不中止，与 Python 版一致</li>\n</ul>\n<p><strong>没有编译器时能做到的验证</strong>：<code>verify_merge_fruit_c_mirror.py</code> 把算法<strong>逐行转写</strong>成 Python 镜像（保留定长数组、<code>sift</code> 的循环写法、<code>hn &gt; 0</code> 的条件），与提交版对拍 —— 9 条锚定 + 大数 1 条 + 6000 组随机 + <code>n=10000</code> 全部一致。</p>\n<blockquote>⚠️ 这只说明 <strong>算法结构没写错</strong>，<strong>不等于</strong> C 版能编译、能过 OJ。 本题最典型的编译器层面风险就是 <strong><code>int</code> 溢出</strong> —— 而镜像脚本用 Python 的任意精度整数， <strong>永远测不出这个</strong>，只能靠人工确认用了 <code>long long</code>。</blockquote>\n<hr>\n<h2 id=\"sec-16\">十一、如何复跑验证</h2>\n<pre class=\"code bash\"><code>cd E:/沈云付算法/合并果子\n\n# ① 算法对拍（含四路交叉、端到端 IO、AST、GBK、读取器斜率）\npython verify_merge_fruit.py\n# 期望: OK: mini==brute 2500 small + 3000 mid cases | 四路交叉一致 |\n#       anchors 12 | n=10000 6 组 + 全 20000 极值 2672320000 |\n#       subprocess: 合法 IO 19 + 非法 6 | AST clean | GBK clean |\n#       reader slope t(4K)/t(K) = x.xx (阈值 7；pop(0) 变体必须超标) | 一行 vs 逐行一致\n\n# ② 动画逻辑\nnode verify_merge_fruit_animation.js\n\n# ③ 变异测试（验收\"断言本身有没有牙齿\"）\npython verify_merge_fruit_mutations.py\n# 期望: OK: 变异捕获率 29/29（提交版 12/12，详细版 4/4，动画 13/13）；还原后验证脚本均仍全绿\n#       （计数随脚本改动会变，以实跑输出为准）\n\n# ④ C 版逻辑（无编译器时的替代验证；只覆盖算法结构）\npython verify_merge_fruit_c_mirror.py\n\n# ⑤ 详细版（看过程 + Sum check）\npython merge_fruit_detailed.py &lt; input.txt\n\n# ⑥ 提交版（stdout 必须只有答案、stderr 必须为空）\npython merge_fruit.py &lt; input.txt 2&gt;/dev/null | od -c</code></pre>\n<p><strong>改一处就跑一遍 ①②③</strong>。③ 是验收断言的关键：任何新加的断言，都要能用 \"把代码改回错的\"把它打掉；打不掉的断言就是装饰品（陷阱 20/26）， 而打不掉的<strong>变异</strong>则说明那里可能是冗余代码或测试盲区（陷阱 29、本轮第九节第 2 条）。</p>\n<blockquote>⚠️ 若重定向日志（<code>&gt; log.txt</code> / <code>| tee</code>），请带 <code>PYTHONIOENCODING=utf-8</code>： 本机 locale 是 GBK，打印语句里任何 GBK 编不出的字符都会抛 <code>UnicodeEncodeError</code>。</blockquote>\n<hr>\n<h2 id=\"sec-17\">十二、已知未覆盖（诚实声明）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>项</th><th>状态</th></tr></thead><tbody><tr><td><code>merge_fruit.c</code> 能否编译</td><td><strong>未验证</strong>（本机无编译器）。镜像脚本只证明\"算法结构一致\"，连 C 的读入层都不覆盖</td></tr><tr><td>C 的读入层</td><td><code>scanf(\"%lld\")</code> 的前缀式消费（<code>3x</code> → 3）与 Python <code>int()</code> 整体拒绝的行为差异，已在 <code>merge_fruit.c</code> 注释写明，未做等价性验证</td></tr><tr><td>C 的 <code>int</code> 溢出风险</td><td>镜像脚本用 Python 任意精度整数，<strong>结构上测不出</strong>。只能靠人工核对已用 <code>long long</code></td></tr><tr><td>动画播放链路 <code>togglePlay/tick/changeSpeed</code></td><td><strong>无自动测试</strong>（stub 的 <code>setTimeout</code> 是空壳）。靠 Chrome 实拍确认页面能动，但\"自动播放逐步推进\"没被断言覆盖</td></tr><tr><td>动画自定义输入上限</td><td>限 <code>8</code> 堆（<code>MAX_PILES</code>）与 <code>1..20000</code>，为了看清布局；题目本身允许 10000 堆</td></tr><tr><td>单组 vs 多组的最终裁定</td><td>洛谷 P1090 是单组；本仓库实现为\"兼容单组 / EOF 多组 / n=0 哨兵\"的安全超集。⚠️ <strong>\"安全超集\"只对这三种形态成立</strong>：若判题其实是「第 1 行 T 组数」（本仓库 LCS、n 个 1 就是这种），本实现会<strong>静默错答</strong>、而不是多打一行 —— 拿 <code>2 / 3 / 1 2 9 / 4 / 1 1 1 1</code> 试，token 流 <code>2 3 1 2 9 4 1 1 1 1</code> 被读成<strong>四组</strong>（<code>[3,1]</code>→4、<code>[9,4]</code>→13、<code>[1]</code>→0、<code>[1]</code>→0），stdout 打出 <code>4 13 0 0</code>，全程不报错。<strong>判断依据是公开题面 + 改编版形态，没有拿本题的真实 OJ 数据实测</strong></td></tr><tr><td>详细版自校里\"恒真\"的那 4 条</td><td>ok1（合并次数 == n-1）/ ok3（总耗费 == 各步之和）/ ok5（每一步 a ≤ b）/ ok6（新堆 == 两堆之和）<strong>是构造性恒真</strong> —— 两侧的数据都由同几行代码产生，改哪边两边一起改。真正带独立信息的只有 ok2（剩余堆 == Σai，能抓\"丢重量\"）、ok4（与哈夫曼树的独立路径比）、ok7（每步之后堆序仍成立）。独立审计用 7 个\"把自校改成恒真\"的变异验证：<strong>7/7 漏报</strong> —— 这四条在本轮之前从未被验收过</td></tr><tr><td>C 与 Python 的退出码不一致</td><td>Python 版错误分支走 <code>return</code>（进程退出码 0），C 版走 <code>return 1</code>。OJ 通常只看 stdout，但两版行为确实不同，且镜像脚本不覆盖读入层，所以这个差异没有任何断言看住</td></tr><tr><td>动画 <code>nextStep()</code> 在播放中不 <code>stopPlay()</code></td><td>手动点「下一步」时，挂起的 <code>setTimeout</code> 仍会在到点时触发，可能叠加推进一格（独立审计读到、未实测的 UX 瑕疵）</td></tr><tr><td>\"只削弱自校验\"的变异</td><td>若把详细版的自校改得\"恒真但不改变输出\"，行为级验证原理上抓不到。本轮用 D3（树法恒返回 0）覆盖了其中一种，其余不保证</td></tr></tbody></table></div>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "从样例反推出的关键语义",
    "lvl": 3
   },
   {
    "id": "sec-3",
    "text": "二、算法：小根堆贪心（哈夫曼树）",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "为什么\"每次取最小的两个\"是对的（交换论证）",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "三、样例演示",
    "lvl": 2
   },
   {
    "id": "sec-6",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-7",
    "text": "五、判题格式（铁律 2）",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "反推过程",
    "lvl": 3
   },
   {
    "id": "sec-9",
    "text": "本仓库的选择：兼容三者的宽容循环",
    "lvl": 3
   },
   {
    "id": "sec-10",
    "text": "每组输出几行",
    "lvl": 3
   },
   {
    "id": "sec-11",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "七、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "八、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "九、本轮靠验证抓出的问题（都是\"看着像对\"的错）",
    "lvl": 2
   },
   {
    "id": "sec-15",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-16",
    "text": "十一、如何复跑验证",
    "lvl": 2
   },
   {
    "id": "sec-17",
    "text": "十二、已知未覆盖（诚实声明）",
    "lvl": 2
   }
  ],
  "files": [
   "merge_fruit.py",
   "merge_fruit_detailed.py",
   "merge_fruit.c",
   "verify_merge_fruit.py",
   "verify_merge_fruit_c_mirror.py",
   "verify_merge_fruit_mutations.py"
  ],
  "concepts": [
   "eof",
   "out-of-range",
   "priority-queue",
   "reader",
   "tail-newline"
  ],
  "prev": "catalan",
  "next": "interval-cover",
  "related": [
   "cards",
   "horse-race",
   "interval-cover"
  ]
 },
 {
  "slug": "interval-cover",
  "dir": "单位区间覆盖",
  "title": "单位区间覆盖",
  "cat": "贪心",
  "catId": "greedy",
  "cx": "O(n log n)",
  "fmt": "多组 · EOF 结束",
  "summary": "n 个单位区间 [x, x+1]，用至多 m 条线段覆盖，求线段总长最小（题面正文与样例输出矛盾，OJ 判「点」口径）。",
  "docName": "单位区间覆盖详解.md",
  "doc": "<h1>单位区间覆盖详解</h1>\n<blockquote>交付物：<code>interval_cover.py</code>（OJ 提交版）、<code>interval_cover_detailed.py</code>（本地学习版）、 <code>interval_cover.c</code>（C 实现）、<code>interval_cover_animation.html</code>（浏览器动画）、本文档， 外加四份验证脚本（见「十二、如何复跑验证」）。</blockquote>\n<hr>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>x 轴上有 n 个单位区间 <code>[x₁, x₁+1]</code>、<code>[x₂, x₂+1]</code>、…、<code>[xₙ, xₙ+1]</code>， 用<strong>至多 m 条线段</strong>把它们全部盖住。线段可以任意长，求线段总长度的最小值。</p>\n<ul>\n<li>输入：多组数据，每组两行 —— 第一行 <code>n m</code>，第二行 n 个互不相同的整数（各区间左端点）。</li>\n<li>范围：<code>1 &lt;= n &lt;= 1000</code>、<code>1 &lt;= m &lt;= 20</code>。</li>\n<li><a class=\"kw\" href=\"#/k/sample-mismatch\" title=\"概念：sample-mismatch\">样例</a>：<code>6 3</code> / <code>1 2 4 5 -2 6</code> → <strong>3</strong></li>\n</ul>\n<h3 id=\"sec-2\">★ 题面与样例互相矛盾（动手前必须先定下来）</h3>\n<p>这是本题唯一真正棘手的地方，<strong>先解决它再谈算法</strong>。</p>\n<p>把样例的六个单位区间画出来：</p>\n<pre class=\"code\"><code>[-2,-1]        [1,2][2,3]        [4,5][5,6][6,7]</code></pre>\n<p>它们天然连成<strong>三块</strong>。用 3 条线段正好一块一条，总长度是 <code>1 + 2 + 3 = 6</code>。 <strong>按题面正文「单位区间」的算法，这题答案是 6。</strong></p>\n<p>但题面自己给的样例输出是 <strong>3</strong>。3 只在一个完全不同的口径下才成立：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>口径</th><th>跨度（1 条线段）</th><th>空隙</th><th>m=3 时答案</th></tr></thead><tbody><tr><td><strong>点</strong>（题面输出段写的「这 n 个<strong>点</strong>」）</td><td><code>max − min = 6−(−2) = 8</code></td><td><code>x[i+1]−x[i]</code> = 3, 1, 2, 1, 1</td><td><code>8 − 3 − 2 =</code> <strong>3</strong> ✓</td></tr><tr><td>单位区间（题面正文）</td><td><code>max+1 − min = 6+1−(−2) = 9</code></td><td><code>x[i+1]−x[i]−1</code> = 2, 0, 1, 0, 0</td><td><code>9 − 2 − 1 =</code> <strong>6</strong></td></tr></tbody></table></div>\n<p>也就是说：<strong>题面正文说「单位区间」，题面输出段说「点」，样例输出站在「点」那边。</strong></p>\n<p><strong>已实测确认：这组数据 OJ 要的就是 3，也就是判「点」口径</strong>，因此代码默认就用 <code>point</code>。 两个口径只差两处 ±1，开关留着只为方便对照：</p>\n<pre class=\"code python\"><code>MODEL = \"point\"         # OJ 口径；样例这组得 3；m &gt;= n 时答案为 0（默认）\n# MODEL = \"interval\"    # 题面正文字面口径；样例得 6（与样例输出不符，别用这个交）</code></pre>\n<p>C 版对应 <code>#define MODEL_INTERVAL 0</code>；动画页面上有下拉框可实时切换对照。</p>\n<hr>\n<h2 id=\"sec-3\">二、算法：排序 + 贪心「剪最大的空隙」</h2>\n<h3 id=\"sec-4\">从只用 1 条线段想起</h3>\n<p>要把所有单位区间盖住，这条线段最左只能从 <code>min(x)</code> 开始（再往左就浪费了）， 最右必须到 <code>max(x)+1</code>（<code>[x, x+1]</code> 是闭区间，右端点也得盖住）。所以：</p>\n<pre class=\"code\"><code>1 条线段时总长 = max(x) + 1 − min(x)        ← 记作 span</code></pre>\n<h3 id=\"sec-5\">多给一条线段，等于多剪一刀</h3>\n<p>把 span 想成横在数轴上的一根长条。允许 m 条线段，等价于<strong>在这根长条上剪 m−1 刀</strong>， 切成至多 m 段，每段一条线段。每剪一刀就<strong>省掉该处的一段长度</strong>。</p>\n<p>剪在哪儿最划算？剪<strong>最大的空隙</strong>。空隙的定义是相邻两个单位区间之间真正空出来的距离：</p>\n<pre class=\"code\"><code>gap = x[i+1] − x[i] − 1</code></pre>\n<ul>\n<li><code>x[i+1] = x[i] + 1</code> 时两个区间<strong>接壤</strong>（<code>[1,2]</code> 与 <code>[2,3]</code>），<code>gap = 0</code>，剪了不省。</li>\n<li><code>x[i+1] &gt; x[i] + 1</code> 时中间真的空着 <code>gap</code> 那么长。</li>\n</ul>\n<p>于是：</p>\n<pre class=\"code\"><code>答案 = span − Σ(最大的 m−1 个 gap)</code></pre>\n<h3 id=\"sec-6\">为什么贪心一定对（不是「看着像」）</h3>\n<ol>\n<li><strong>目标可加、切点无交互。</strong></li>\n</ol>\n<p><code>总长 = span − Σ(被剪开处的 gap)</code>，其中 <code>span</code> 是常量，与剪法无关。 所以「总长最小」⟺「被剪掉的 gap 之和最大」。 可剪的位置只有 <code>n−1</code> 个，每个位置的 <code>gap</code> 是<strong>固定的非负数</strong>，一刀只切一个位置、 互相不叠加 —— 标准的「可加、无交互」结构，取最大的 <code>m−1</code> 个即为最优。</p>\n<ol>\n<li><strong>交换论证。</strong></li>\n</ol>\n<p>若某个较大的 gap 没被剪、而某个较小的被剪了，把那把刀挪到较大 gap 处， 被剪总量只增不减，总长只会更短 —— 与「已是最优」矛盾。</p>\n<ol>\n<li><strong>分组必须连续（这一步不能省）。</strong></li>\n</ol>\n<p>一条线段覆盖的必然是一段<strong>连续</strong>的区间。若某组跳过了中间的区间： 被跳过的那些要么得由别的线段覆盖（线段重叠，总长不会更短），要么就是没盖住（非法）。 所以最优解一定对应「把排序后的序列切成连续的数段」， 「剪 m−1 刀」这个模型没有漏掉任何最优解。</p>\n<h3 id=\"sec-7\">一维数组原地滚动？不需要</h3>\n<p>本题只需排序 + 取前若干个最大的数，<code>O(n log n)</code>，没有 DP 数组。 （同一道题用 DP 也做得出来：<code>f[i][k]</code> = 前 i 个区间用 k 条线段的最小总长， 复杂度 <code>O(m·n²)</code>。本仓库的<strong>对拍脚本里就用它做第二个独立实现</strong>。）</p>\n<hr>\n<h2 id=\"sec-8\">三、样例演示（题面样例 —— 按 OJ 的「点」口径）</h2>\n<p>输入 <code>6 3</code> / <code>1 2 4 5 -2 6</code>：</p>\n<pre class=\"code\"><code>排序后 x  =  -2   1   2   4   5   6</code></pre>\n<p><strong>第 1 步</strong> 只用 1 条线段：<code>span = max − min = 6 − (−2) = 8</code></p>\n<p><strong>第 2 步</strong> 量空隙（<code>gap = x[i+1] − x[i]</code>）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>位置</th><th>gap</th><th>备注</th></tr></thead><tbody><tr><td>0 \\</td><td>1</td><td><strong>3</strong></td><td></td></tr><tr><td>1 \\</td><td>2</td><td>1</td><td></td></tr><tr><td>2 \\</td><td>3</td><td><strong>2</strong></td><td></td></tr><tr><td>3 \\</td><td>4</td><td>1</td><td></td></tr><tr><td>4 \\</td><td>5</td><td>1</td><td></td></tr></tbody></table></div>\n<p><strong>第 3 步</strong> 最多剪 <code>m−1 = 2</code> 刀，挑最大的两个：<code>3</code> 和 <code>2</code></p>\n<pre class=\"code\"><code>答案 = 8 − (3 + 2) = 3        ← 与题面样例输出一致</code></pre>\n<p><strong>第 4 步</strong> 实际方案（共 3 条线段，要求 &lt;= m = 3）：</p>\n<pre class=\"code\"><code>线段 1: [-2, -2]  长 0   盖住点 -2\n线段 2: [ 1,  2]  长 1   盖住点 1、2\n线段 3: [ 4,  6]  长 2   盖住点 4、5、6\n                   合计 3  ✓ 与公式一致</code></pre>\n<blockquote>注意线段 1 长度为 0 —— 「点」口径下一条线段退化成点是被允许的，这是该口径的正常形态 （<code>m &gt;= n</code> 时答案就是 0：每个点各用一条长度为 0 的线段）。</blockquote>\n<blockquote><strong>对照：若按题面正文的「单位区间」口径</strong> —— <code>span = (6 + 1) − (−2) = 9</code>， 空隙是 <code>x[i+1] − x[i] − 1</code> = 2, 0, 1, 0, 0（接壤处为 0），剪最大的 <code>2</code> 和 <code>1</code>， 得 <code>9 − 3 =</code> <strong>6</strong> —— 与题面样例输出不符。这就是那个矛盾的全貌。</blockquote>\n<p><code>interval_cover_detailed.py</code> 会把这几步原样打印出来（默认就是 OJ 的 point 口径）， 做六条自校，并在最后附上「另一口径的答案」供对照。</p>\n<hr>\n<h2 id=\"sec-9\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th></th><th>时间</th><th>空间</th></tr></thead><tbody><tr><td>排序</td><td><code>O(n log n)</code></td><td><code>O(n)</code></td></tr><tr><td>找前 <code>m−1</code> 个最大空隙</td><td><code>O(n log n)</code>（排序）或 <code>O(n log m)</code>（堆）</td><td><code>O(n)</code></td></tr><tr><td><strong>合计</strong></td><td><strong><code>O(n log n)</code></strong></td><td><code>O(n)</code></td></tr></tbody></table></div>\n<p><code>n &lt;= 1000</code> 时毫秒级。本仓库 <code>n=1000</code> 实测 6 组无压力。</p>\n<hr>\n<h2 id=\"sec-10\">五、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>情况</th><th>处理</th></tr></thead><tbody><tr><td><code>m &gt;= n</code></td><td>一刀一刀剪完所有空隙，答案 = <code>n</code>（每个单位区间各用一条长度 1 的线段）。公式自动成立：<code>k</code> 被夹到 <code>n−1</code>，不用特判</td></tr><tr><td><code>n = 1</code></td><td>没有空隙，答案 = 1（一条长度 1 的线段）</td></tr><tr><td>负坐标</td><td>样例里就有 <code>-2</code>。全程用普通整数运算，<code>long long</code> 起（C 版）</td></tr><tr><td>大坐标</td><td><code>x</code> 可达 ±10⁶ 级，答案到 2×10⁶+1，<strong>C 版必须 <code>long long</code></strong></td></tr><tr><td><code>x</code> 重复</td><td>题面保证互不相同。真重复时（区间模型下 <code>gap</code> 会变成 −1）结果不可信，<strong>打 stderr 提示</strong>但不停</td></tr><tr><td><code>m</code> <a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a></td><td><code>m</code> 不决定 token 流，<strong>只警告不中止</strong>（中止会连累后面的组）</td></tr><tr><td><code>n</code> 越界</td><td><code>n</code> 决定后面还要吃多少 token，<strong>必须中止</strong>（铁律 6）——一旦 <code>continue</code>，后面的数字会被当成下一组的 <code>n</code>，把伪答案打进 stdout</td></tr><tr><td>判题格式</td><td>题面说「多组」，没说怎么结束 → 按<strong>读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a></strong> 实现（与均分纸牌 / 0-1 背包 / 连通分支数 / 最小差 一致）。单组是它的子集，天然兼容</td></tr><tr><td><a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a></td><td><code>readline()</code> 逐行 + <code>reversed()</code> 反序入栈 + <code>pop()</code>。<strong>不写 <code>pop(0)</code></strong>（O(k²) 悬崖，陷阱 25）</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-11\">六、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th><th>是否提交 OJ</th></tr></thead><tbody><tr><td><code>interval_cover.py</code></td><td><strong>极简版</strong>，stdout 只输出答案</td><td>✅ 提交这个</td></tr><tr><td><code>interval_cover_detailed.py</code></td><td>详细版，打印排序/空隙/剪法/方案 + 六条自校</td><td>❌ 仅本地</td></tr><tr><td><code>interval_cover.c</code></td><td>C 实现，<code>long long</code>，手写 getchar 读整数</td><td>可选（<strong>本机无编译器，未编译验证</strong>）</td></tr><tr><td><code>interval_cover_animation.html</code></td><td>浏览器动画，支持自定义输入 + 口径切换</td><td>❌</td></tr><tr><td><code>verify_interval_cover.py</code></td><td>算法对拍 + 方案可执行性 + 端到端 IO + 读取器斜率</td><td>❌</td></tr><tr><td><code>verify_interval_cover_c_mirror.py</code></td><td>把 C <strong>逐行转写</strong>成 Python 后与提交版对拍</td><td>❌</td></tr><tr><td><code>verify_interval_cover_animation.js</code></td><td>node + DOM stub 实跑动画 JS</td><td>❌</td></tr><tr><td><code>verify_interval_cover_mutations.py</code></td><td><strong>变异测试</strong>：22 个变异，要求 22/22 被抓</td><td>❌</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">七、参考测试用例</h2>\n<h3 id=\"sec-13\">point 口径（OJ 实测口径，代码默认）</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望</th><th>钉住的是什么</th></tr></thead><tbody><tr><td><code>6 3</code> / <code>1 2 4 5 -2 6</code></td><td><strong>6</strong></td><td>题面样例（本口径下）</td></tr><tr><td><code>6 1</code> / <code>1 2 4 5 -2 6</code></td><td>9</td><td><code>m=1</code> 不给剪</td></tr><tr><td><code>3 1</code> / <code>1 2 3</code></td><td>3</td><td>三个区间接壤成 <code>[1,4]</code></td></tr><tr><td><code>3 2</code> / <code>1 2 3</code></td><td><strong>3</strong></td><td>★ 接壤处 <code>gap=0</code>，剪了不省；<strong>忘了 <code>−1</code> 的错法会得 2</strong></td></tr><tr><td><code>3 5</code> / <code>1 2 3</code></td><td>3</td><td><code>m &gt;= n</code></td></tr><tr><td><code>1 1</code> / <code>7</code></td><td>1</td><td><code>n = 1</code></td></tr><tr><td><code>1 1</code> / <code>-7</code></td><td>1</td><td>负坐标 + <code>n = 1</code></td></tr><tr><td><code>4 2</code> / <code>1 2 10 11</code></td><td><strong>4</strong></td><td>★ 必须剪<strong>最大</strong>的那个空隙 7；剪错地方会得 11</td></tr><tr><td><code>2 1</code> / <code>-5 5</code></td><td>11</td><td>负坐标</td></tr><tr><td><code>2 2</code> / <code>-5 5</code></td><td>2</td><td>两条线各长 1</td></tr><tr><td><code>4 1</code> / <code>0 1 2 3</code></td><td>4</td><td>从 0 起的接壤链</td></tr><tr><td><code>2 1</code> / <code>-1000000 1000000</code></td><td><strong>2000001</strong></td><td>大数（C 版 <code>long long</code> 的依据）</td></tr></tbody></table></div>\n<h3 id=\"sec-14\">interval 口径（题面正文字面，非默认）</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望</th><th>钉住的是什么</th></tr></thead><tbody><tr><td><code>6 3</code> / <code>1 2 4 5 -2 6</code></td><td><strong>3</strong></td><td>题面给的样例输出</td></tr><tr><td><code>3 2</code> / <code>1 2 3</code></td><td>1</td><td>剪 1 个 <code>gap=1</code></td></tr><tr><td><code>3 3</code> / <code>1 2 3</code></td><td><strong>0</strong></td><td><code>m &gt;= n</code> 时答案为 0</td></tr><tr><td><code>1 1</code> / <code>7</code></td><td><strong>0</strong></td><td><code>n=1</code>，退化为一个点</td></tr><tr><td><code>2 1</code> / <code>-5 5</code></td><td>10</td><td>span = 10</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-15\">八、正确性验证</h2>\n<p><code>interval_cover.py</code> 通过 <code>verify_interval_cover.py</code> 验收，共十一组检查：</p>\n<ol>\n<li><strong>与暴力枚举对拍</strong> —— 枚举所有「切成 g 段连续组」的方式（小 n），<strong>6000 组</strong>（两种口径各 3000）</li>\n<li><strong>与区间 DP 对拍</strong> —— 思路完全不同的独立实现，<strong>800 组</strong>（含 ±10⁶ 大坐标）</li>\n<li><strong>方案可执行性</strong> —— DP 回溯出一份真实分组，逐条核：总长 == 答案、段数 ≤ m、</li>\n</ol>\n<p>每个区间恰好被一条线段盖住、每条线段确实包含组内全部 <code>[xᵢ, xᵢ+1]</code>，<strong>1600 组</strong></p>\n<ol>\n<li><strong>下界/上界</strong> —— interval 口径下答案恒 <code>&gt;= n</code>（并集测度下界，400 组）；</li>\n</ol>\n<p>答案恒 <code>&lt;=</code> 任意可行分组解（400 组）</p>\n<ol>\n<li><strong>大规模</strong> —— <code>n = 1000</code> 六组</li>\n<li><strong>23 条锚定用例</strong></li>\n<li><strong>端到端 subprocess</strong> —— 合法 IO 15 种（含 CRLF / 空行 / 挤一行 / 跨行 / 无末尾换行 / 多组）+ 非法 IO 8 种</li>\n<li><strong>详细版自校</strong> —— 7 个用例，自校全绿且答案与极简版一致</li>\n<li><strong>AST 静态检查</strong> —— 无 f-string / <code>.buffer</code> / <code>nonlocal</code> / 类型注解 / 海象 / <code>input()</code> / <code>sys.stdin.read()</code></li>\n<li><strong>GBK 安全</strong> —— 所有字符串字面量可 GBK 编码（陷阱 31）</li>\n<li><strong>读取器斜率压测</strong> —— 线性约 4，阈值 7；并<strong>实测一个 <code>pop(0)</code> 坏变体</strong>（斜率 12~15）证明阈值有牙齿</li>\n</ol>\n<p>外加 <code>verify_interval_cover_mutations.py</code>：<strong>22 个变异全部被抓</strong>（提交版 15、详细版 3、动画 4）， 还原后主验收脚本仍全绿。</p>\n<hr>\n<h2 id=\"sec-16\">九、本轮靠验证抓出的问题</h2>\n<p><strong>这一节是本项目最值钱的部分</strong> —— 全是「看着像对」但被实跑/实拍揪出来的错。</p>\n<h3 id=\"sec-17\">验证方法本身的错（差点变成假绿灯）</h3>\n<ol>\n<li><strong><code>ast_check</code> 没查 <code>sys.stdin.read()</code>。</strong></li>\n</ol>\n<p>我把「改用 <code>read()</code>」作为变异注入，脚本却全绿通过 —— 因为检查清单里根本没有这一项， 而它恰恰是铁律 1 的头号禁项。补上了（靠 <code>Attribute(attr='read')</code> + <code>value</code> 是 <code>sys.stdin</code> 精确匹配，不会误伤 <code>readline</code>）。</p>\n<ol>\n<li><strong>详细版的「自校」存在盲区 —— 只验账目自洽，不验答案最优。</strong></li>\n</ol>\n<p>把「剪最小的空隙」注入进去后：<code>Σ各段长度 = 5 + 2 + 2 = 9</code> 恰好等于（错误的）答案 9， ① 到 ⑤ 五条自校<strong>全部亮绿灯</strong>，可答案 9 是错的（正确是 6）。 修法：详细版新增第 ⑥ 条 —— 小规模（<code>n &lt;= 12</code>）时<strong>直接枚举所有分组</strong>拿真最优值来对。</p>\n<ol>\n<li><strong>斜率压测的低尾。</strong> <code>K = 20000</code> 时单次测量只有 2 毫秒，调度抖动把比值从 4.16 顶到 <strong>7.29</strong>，</li>\n</ol>\n<p>越过了阈值 7 → 假警报。改成 <code>K = 100000</code> + 取 5 次最小值 + 预热，实测三次为 4.17 / 4.49 / 4.36。 （坏变体故意用小 K，否则 O(k²) 要跑几十秒。）</p>\n<ol>\n<li><strong>变异检测器自己写错了三处</strong>，导致假报「没抓住」：</li>\n</ol>\n<ul>\n<li><code>det_node</code> 里多了一行，把<strong>原始 HTML 又写回变异文件</strong>，变异被自己抹掉了 → 动画 4 条全废；</li>\n<li><code>det_abort_on_bad_n</code> 的测试输入只有 3 个 token，变异版很快撞上「数据不足」再次中止，</li>\n</ul>\n<p>把 <code>continue</code> 的错误盖住了 → 换成长的输入；</p>\n<ul>\n<li>变异脚本第一版把 <code>random.Random(999)</code> 建在循环<strong>内部</strong>，200 次都在测同一组数据。</li>\n</ul>\n<ol>\n<li><strong>同一个坑踩了三次：检查被注释误命中。</strong></li>\n</ol>\n<ul>\n<li>Python：<code>make_reader</code> 的 docstring 里有 <code>⚠</code>，GBK 检查直接抛 <code>UnicodeEncodeError</code></li>\n</ul>\n<p>（陷阱 31 点名的字符）；</p>\n<ul>\n<li>C：注释里写着「不用 <code>strtoll</code>」，朴素子串查找以为代码里真用了 <code>strtoll</code>；</li>\n<li>JS：注释里写着「别把 CSS 变量塞给 fill」，检查以为代码里真用了。</li>\n</ul>\n<p>三次都靠<strong>先把注释剥掉再查</strong>解决（Python 用 <code>ast</code>，C 和 JS 各写了一个注释剥离器）。</p>\n<h3 id=\"sec-18\">代码本身的错（node 测不到，靠 Chrome 实拍发现）</h3>\n<ol>\n<li><strong>副标题里的 <code></strong>至多 m 条线段<strong></code> 原样显示成了两个星号</strong> —— HTML 不解析 Markdown。</li>\n</ol>\n<p>已改成 <code>&lt;b&gt;</code>；并在动画验证脚本里加了断言（只检查真正会被渲染的标记，源码注释不算）。</p>\n<ol>\n<li><strong>账目里渲染成 <code>(6 + 1) − -2</code></strong>，负数没加括号，读起来像连减号。已改成 <code>(6 + 1) − (-2)</code>。</li>\n</ol>\n<h3 id=\"sec-19\">口径切换后暴露的两个问题（复更）</h3>\n<ol>\n<li><strong>详细版的方案长度没跟着口径走。</strong> 默认从 <code>interval</code> 切到 <code>point</code> 后，详细版当场自校报错：</li>\n</ol>\n<p>第 4 步仍按「右端点 = x+1」算线段长度（Σ = 6），而答案按点口径算（3）。 已改成随口径计算，自校 ② 在 point 下改验「点是否被盖住」。 —— 这反过来证明详细版的自校<strong>是活的</strong>：口径一变它就报，不是摆设。</p>\n<ol>\n<li><strong>变异检测器只跑默认口径，另一个分支\"碰不到\"。</strong> 切换默认后，针对 <code>interval</code> 分支的两个</li>\n</ol>\n<p>变异立刻假报「没抓住」—— 分支根本不执行，变异自然无效。已改成<strong>两种口径各跑一遍</strong> （临时翻转 <code>MODEL</code> 常量再跑），两个分支都覆盖到了。 这是「变异打不掉 ≠ 断言没牙齿」的又一成因：<strong>测试路径没走到那条分支</strong>。</p>\n<h3 id=\"sec-20\">一处设计决策</h3>\n<ol>\n<li><strong>题面与样例矛盾的处理。</strong> 没有替用户拍板，而是做成显式开关 + 页面的口径切换 + 文档一整节</li>\n</ol>\n<p>说明；用户实测确认 OJ 判 <code>point</code> 后把默认切了过去，<code>interval</code> 分支保留作对照。</p>\n<hr>\n<h2 id=\"sec-21\">十、C 版本说明</h2>\n<p><code>interval_cover.c</code> 与提交版<strong>逻辑逐行等价</strong>，但：</p>\n<blockquote>⚠️ <strong>本机（Windows）没有装任何 C 编译器</strong> —— <code>gcc</code> / <code>clang</code> / <code>tcc</code> / <code>cl</code> / <code>zig</code> 在 PATH 和常见安装位置都搜过，一个都没有。所以这份 <code>.c</code> <strong>从未被编译验证过</strong>， 提交前请自行编译一次。</blockquote>\n<p>做法上的两个要点：</p>\n<ul>\n<li><strong>手写 <code>getchar()</code> 读整数，不用 <code>strtoll</code>。</strong> <code>strtoll</code> 太宽松：会把 <code>0x1A</code> 解成 0、</li>\n</ul>\n<p>把 <code>12abc</code> 截断成 12（陷阱 13）。手写版遇到非数字就停、并把多读的那个字符 <code>ungetc</code> 放回， 保证 token 被完整消费；它天然跳过空白/换行/CRLF/空行，所以「同行」「跨行」都不用特判。</p>\n<ul>\n<li><strong>全程 <code>long long</code>。</strong> 答案可到 2×10⁶+1 量级，用 <code>int</code> 会溢出。</li>\n</ul>\n<p><code>verify_interval_cover_c_mirror.py</code> 把这份 C <strong>逐行转写成 Python</strong>（连那个手写读取器一起）， 再与提交版对拍：锚定 14 条 + 随机 20000 组 + 畸形输入 12 种 + 非法输入 6 种 + <code>n=1000</code>。 <strong>它只核对逻辑，不核对语法 / 宏展开 / <code>qsort</code> 细节</strong> —— 这些只有真编译器能查。</p>\n<hr>\n<h2 id=\"sec-22\">十一、如何复跑验证</h2>\n<pre class=\"code bash\"><code>cd E:/沈云付算法/单位区间覆盖\nexport PYTHONIOENCODING=utf-8          # 本机 locale 是 GBK，重定向日志时必带\n\n# ① 主验收（算法对拍 / 方案可执行 / 下界 / 锚定 / IO / 详细版 / AST / 读取器斜率）\npython verify_interval_cover.py\n# 期望: OK: 全部通过（暴力枚举 / DP / 方案可执行 / 下界 / 锚定 / subprocess /\n#      详细版 / AST / GBK / 读取器斜率 / 抽样变异）\n\n# ② C 版逻辑核对（无编译器时的替代验证）\npython verify_interval_cover_c_mirror.py\n# 期望: OK: C 逐行转写 == interval_cover.py（锚定 / 随机 20000 组 /\n#      畸形输入 12 种 / 非法输入 6 种 / n=1000）；interval_cover.c 源码锚点全在\n\n# ③ 动画 JS 实跑\nnode verify_interval_cover_animation.js\n# 期望: OK: 动画 JS 实跑通过（解析 / 贪心==暴力 / 步骤同步 / 渲染元素 /\n#      终态答案 / 复用 / 跨口径切换 / 源码卫生）\n\n# ④ 变异测试\npython verify_interval_cover_mutations.py\n# 期望: OK: 变异捕获率 22/22（提交版 15/15，详细版 3/3，动画 4/4）；还原后主验收脚本仍全绿\n\n# ⑤ 详细版（看全过程 + 六条自校）\nprintf '6 3\\n1 2 4 5 -2 6\\n' | python interval_cover_detailed.py\n\n# ⑥ 提交版（stdout 必须只有答案）\nprintf '6 3\\n1 2 4 5 -2 6\\n' | python interval_cover.py      # 默认 point 口径 -&gt; 3\n# 把 MODEL 改成 \"interval\" 再跑 -&gt; 6（题面正文字面口径）</code></pre>\n<h3 id=\"sec-23\">渲染层实拍（node 测不到 CSS / 布局）</h3>\n<pre class=\"code bash\"><code>CHROME=\"/c/Program Files/Google/Chrome/Application/chrome.exe\"\n\"$CHROME\" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=4000 \\\n  --window-size=1280,1120 --screenshot=\"C:/Users/lenovo/AppData/Local/Temp/ic.png\" \\\n  \"file:///E:/沈云付算法/单位区间覆盖/interval_cover_animation.html\"</code></pre>\n<p>想停在终态再截：复制一份临时 HTML，在 <code>&lt;/body&gt;</code> 前注入 <code>&lt;script&gt;setStep(5);&lt;/script&gt;</code> （<code>setStep</code> 是 <code>&lt;script&gt;</code> 里的顶层函数声明，浏览器里就是全局的）。</p>\n<hr>\n<h2 id=\"sec-24\">十二、已知未覆盖（诚实声明）</h2>\n<ul>\n<li><strong><code>.c</code> 从未编译过</strong>（本机无编译器）。逻辑等价性有转写对拍兜底，语法/宏/qsort 细节没有。</li>\n<li><strong>判题格式是推断的</strong>：题面只说「多组」没说结束方式，按 EOF 实现。若 OJ 实为</li>\n</ul>\n<p>「首行是组数 T」或「哨兵结束」，提交版需要小改（本仓库其他题也遇到过三种形态）。</p>\n<ul>\n<li><strong>口径矛盾已有定论</strong>：OJ 判「点」口径（那组样例要 3），代码默认即 <code>point</code>；<code>interval</code> 分支保留作对照。</li>\n<li><strong>动画的 <code>point</code> 口径下坐标轴按 <code>[x, x+1]</code> 画区间</strong>，此时「点」被画成小方块是为了看得见，</li>\n</ul>\n<p>长度数值仍按点口径算 —— 视觉上是示意，数值是准确的。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "★ 题面与样例互相矛盾（动手前必须先定下来）",
    "lvl": 3
   },
   {
    "id": "sec-3",
    "text": "二、算法：排序 + 贪心「剪最大的空隙」",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "从只用 1 条线段想起",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "多给一条线段，等于多剪一刀",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "为什么贪心一定对（不是「看着像」）",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "一维数组原地滚动？不需要",
    "lvl": 3
   },
   {
    "id": "sec-8",
    "text": "三、样例演示（题面样例 —— 按 OJ 的「点」口径）",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "五、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "六、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-12",
    "text": "七、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "point 口径（OJ 实测口径，代码默认）",
    "lvl": 3
   },
   {
    "id": "sec-14",
    "text": "interval 口径（题面正文字面，非默认）",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "八、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-16",
    "text": "九、本轮靠验证抓出的问题",
    "lvl": 2
   },
   {
    "id": "sec-17",
    "text": "验证方法本身的错（差点变成假绿灯）",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "代码本身的错（node 测不到，靠 Chrome 实拍发现）",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "口径切换后暴露的两个问题（复更）",
    "lvl": 3
   },
   {
    "id": "sec-20",
    "text": "一处设计决策",
    "lvl": 3
   },
   {
    "id": "sec-21",
    "text": "十、C 版本说明",
    "lvl": 2
   },
   {
    "id": "sec-22",
    "text": "十一、如何复跑验证",
    "lvl": 2
   },
   {
    "id": "sec-23",
    "text": "渲染层实拍（node 测不到 CSS / 布局）",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "十二、已知未覆盖（诚实声明）",
    "lvl": 2
   }
  ],
  "files": [
   "interval_cover.py",
   "interval_cover_detailed.py",
   "interval_cover.c",
   "verify_interval_cover.py",
   "verify_interval_cover_c_mirror.py",
   "verify_interval_cover_mutations.py"
  ],
  "concepts": [
   "eof",
   "out-of-range",
   "reader",
   "sample-mismatch",
   "tail-newline"
  ],
  "prev": "merge-fruit",
  "next": "horse-race",
  "related": [
   "cards",
   "horse-race",
   "merge-fruit"
  ]
 },
 {
  "slug": "horse-race",
  "dir": "田忌赛马",
  "title": "田忌赛马",
  "cat": "贪心",
  "catId": "greedy",
  "cx": "O(n log n)",
  "fmt": "多组 · EOF 结束（兼容 n=0 哨兵）",
  "summary": "双方各 n 匹马配对出赛，胜 +100 / 负 -100 / 平 0，求最多的银币；排序 + 四指针贪心。",
  "docName": "田忌赛马详解.md",
  "doc": "<h1>田忌赛马详解</h1>\n<blockquote>双方各 n 匹马依次对阵，每场胜方从负方手里拿 100 银币、平局不进出。 田忌知道全部速度并可以任意安排出场顺序，求他最多能赢到多少银币。 算法：<strong>排序 + <a class=\"kw\" href=\"#/k/swap-match\" title=\"概念：swap-match\">四指针</a>贪心</strong>，<code>O(n log n)</code>。</blockquote>\n<hr>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>双方各有 <code>n</code> 匹马，一轮一轮地跑，<strong>每轮各出一匹</strong>，胜负由速度决定（速度大的赢，相等则平）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>结果</th><th>银币变化</th></tr></thead><tbody><tr><td>田忌的马更快</td><td>田忌 <strong>+100</strong></td></tr><tr><td>一样快</td><td><strong>0</strong></td></tr><tr><td>田忌的马更慢</td><td>田忌 <strong>-100</strong></td></tr></tbody></table></div>\n<p>一个场景共跑 <code>n</code> 轮（每匹马恰好出场一次）。田忌知道两边的全部速度，<strong>并且可以任意安排出场顺序</strong>；齐王的出场顺序不受田忌控制 —— 但等价地说，田忌可以自由决定\"自己哪匹马对对方哪匹马\"。</p>\n<p>所以这道题的本质是：<strong>在两侧的马之间找一个配对（完美匹配），让 <code>100 x (胜场 − 负场)</code> 最大。</strong></p>\n<blockquote>注意目标不是\"赢的场数最多\"。赢 3 输 1（+200）比赢 1 输 0（+100）划算， 甚至有时候<strong>主动输一场</strong>才是最优 —— 这正是本题最反直觉、也是四个分支里最能体现智慧的地方。</blockquote>\n<p>样例：</p>\n<pre class=\"code\"><code>3\n3 5 7        田忌的马\n4 6 8        齐王的马\n4\n1 2 7 8\n3 4 5 6\n2\n1 2\n3 4</code></pre>\n<p>输出：</p>\n<pre class=\"code\"><code>100\n0\n-200</code></pre>\n<hr>\n<h2 id=\"sec-2\">二、判题格式：怎么从样例反推出来的（不是从题面猜的）</h2>\n<p>题面只写了\"<strong>有多次比赛场景</strong>，每个比赛场景有 3 行数据描述\"，<strong>没说怎么结束</strong>。 本仓库积累下来的四种收尾形态（<a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a> / <code>N=0</code> 哨兵 / 给定 T 组 / 图之间空一行）里，这题是哪种？逐条排除：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>猜测</th><th>判决</th><th>依据</th></tr></thead><tbody><tr><td>单组</td><td>❌ 排除</td><td>样例给了 <strong>3 个场景</strong>，首尾相连地排在一起</td></tr><tr><td>第一行是 T，随后 T 组</td><td>❌ 排除</td><td>按 T=3 读，需要 <code>1 + 3×3 = 10</code> 行，而样例只有 <strong>9 行</strong>；token 数也对不上（样例 21 个 token，按每组\"1 个 n + n + n\"的读法会在第 3 组之前就<strong>耗尽数据</strong>）。<strong>行数与 token 数双重对不上</strong>，这个读法被样例硬性排除</td></tr><tr><td>读到 <strong>EOF</strong> 结束</td><td>✅ 与样例吻合</td><td>3 个场景依次排开，末尾没有任何多余标记</td></tr><tr><td><code>n = 0</code> 哨兵结束</td><td>✅ 兼容进来</td><td>题面写明 <code>1 &lt;= n &lt;= 100</code>，<strong><code>n = 0</code> 不可能是合法数据</strong>，只可能当哨兵。这道题的原型 POJ 2287「Tian Ji -- The Horse Racing」正是 <code>n = 0</code> 结束</td></tr></tbody></table></div>\n<blockquote>说明：排除\"给定 T 组\"的<strong>决定性依据是行数/token 数对不上</strong>，不是\"第一行后面跟的是马\"这种 措辞上的感觉 —— 后者只是看一眼就觉得不对，前者才是能站住的判据。</blockquote>\n<p>于是实现成<strong>宽容循环</strong>：</p>\n<ul>\n<li>读到 <strong>EOF</strong> → 结束（覆盖\"多组 EOF\"与\"其实只有一组\"两种情形）；</li>\n<li>读到 <strong><code>n = 0</code></strong> → 结束，并往 stderr 打一条 <code>[!]</code> 把选择写到明面上（陷阱 22 的教训：</li>\n</ul>\n<p>两种解释互斥，答题会多打一行、当哨兵会漏答，必须让人看得见）；</p>\n<ul>\n<li><code>n</code> <a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a>（<code>&lt;1</code> 或 <code>&gt;100</code>）→ <strong>中止</strong>，绝不 <code>continue</code></li>\n</ul>\n<p>（铁律 6：<code>n</code> 决定后面还要吃掉多少个数，一旦 <code>continue</code>，后面的数字会被当成下一组的 <code>n</code>，把伪答案打进 stdout）。</p>\n<p><strong>每组输出一行，只有一个整数，没有 <code>Case i</code> 之类的额外行</strong>（题面输出段原文即\"一行输出田忌获得的最多银币数\"）。答案是 <code>100 x (胜 − 负)</code>，可能为负（样例第 3 组就是 <code>-200</code>）。</p>\n<hr>\n<h2 id=\"sec-3\">三、算法：排序 + 四指针贪心</h2>\n<p>把田忌的马记作 <code>a[0] &lt;= a[1] &lt;= ... &lt;= a[n-1]</code>，齐王的马 <code>b[]</code> 同样升序。 用四个指针圈住\"<strong>还没安排的马</strong>\"这两段窗口：</p>\n<pre class=\"code\"><code>a_lo / a_hi  —— 田忌手里最慢的 / 最快的\nb_lo / b_hi  —— 齐王手里最慢的 / 最快的</code></pre>\n<p>每一轮只看<strong>两边最快的马</strong>和<strong>田忌最慢的马</strong>，四个分支里必走其一：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>分支</th><th>条件</th><th>出马</th><th>结果</th></tr></thead><tbody><tr><td><strong>①</strong></td><td><code>a[a_hi] &gt; b[b_hi]</code></td><td>田忌最快 vs 齐王最快</td><td><strong>胜</strong>（+1）</td></tr><tr><td><strong>②</strong></td><td><code>a[a_hi] &lt; b[b_hi]</code></td><td>田忌<strong>最慢</strong> vs 齐王最快</td><td><strong>负</strong>（-1）</td></tr><tr><td><strong>③a</strong></td><td><code>a[a_hi] == b[b_hi]</code> 且 <code>a[a_lo] &gt; b[b_lo]</code></td><td>田忌最慢 vs 齐王最慢</td><td><strong>胜</strong>（+1）</td></tr><tr><td><strong>③b</strong></td><td><code>a[a_hi] == b[b_hi]</code> 且 <code>a[a_lo] &lt;= b[b_lo]</code></td><td>田忌<strong>最慢</strong> vs 齐王最快</td><td><strong>负</strong>（-1）或 <strong>平</strong>（0）</td></tr></tbody></table></div>\n<p>每轮无论走哪一支，<strong>双方各自的可用马都恰好少一匹</strong>（两条窗口等长地缩 1）， 所以循环正好跑 <code>n</code> 轮、每轮 <code>O(1)</code>。</p>\n<p>四个分支的\"人话版\"：</p>\n<ul>\n<li><strong>① 最快对最快，白赚一场。</strong> 田忌最快的那匹连对方最快的都赢得了，照样赢得到对方任何一匹；</li>\n</ul>\n<p>派它去撞对方的王牌最划算 —— 拿到分，还顺手把对方最强的马用掉了。</p>\n<ul>\n<li><strong>② 王牌挡不住，就派最慢的去消耗。</strong> 田忌最快的都输给齐王最快的，</li>\n</ul>\n<p>说明齐王这匹\"王牌\"<strong>无论如何都会赢一场</strong>，派谁去都是丢 100。 既然\"谁去都是输\"，那就派最慢的去，把好马留着对付别人（这就是\"<strong>下驷对上驷</strong>\"）。</p>\n<ul>\n<li><strong>③a 最慢对最慢，还是白赚一场。</strong> 两边最快的打成平手（谁也没占到便宜），</li>\n</ul>\n<p>而田忌最慢的都能赢齐王最慢的 —— 那就让最慢的俩跑，分照拿， 而且<strong>没拿好马去浪费</strong>，把齐王这张\"软柿子\"用掉了。</p>\n<ul>\n<li><strong>③b 拿最慢的去换掉对方的王牌。</strong> 两边最快一样快、田忌最慢的又赢不了齐王最慢的。</li>\n</ul>\n<p>此时田忌最快的那匹只是<strong>等于</strong>齐王最快的 —— 撞上去最多打平，<strong>根本挣不到分</strong>。 既然这张王牌用谁去挡都赚不到，那就拿最不值钱的去挡，把剩下的快马留给后面的场次。 （这一支里的\"平局\"只在剩下的马全部一样快时才会走到，那时怎么配都是平。）</p>\n<h3 id=\"sec-4\">为什么每一支都安全（交换论证）</h3>\n<p>论证的定式（本仓库合并果子、单位区间覆盖两题用的同一套）： <strong>任取一个最优解，如果它没有照这一支来配，就把两匹马的对手对调一下，证明对调之后总收益不会变差。</strong></p>\n<p>记 <code>s(x, y)</code> = 田忌的马 x 对 y 的得分：胜 <code>+1</code> / 平 <code>0</code> / 负 <code>-1</code>。 它有两个单调性：<code>s(x, ·)</code> 随对手变慢<strong>不减</strong>，<code>s(·, y)</code> 随自己变快<strong>不减</strong>。</p>\n<p><strong>① 的论证。</strong> 田忌最快 <code>a_hi</code> 赢得了齐王最快 <code>b_hi</code>，也就赢得到齐王任何一匹。 设最优解里 <code>b_hi</code> 配的是 <code>a[i]</code>，而 <code>a_hi</code> 配的是某个 <code>b[j]</code>。若 <code>i != a_hi</code>，对调两位的对手：</p>\n<pre class=\"code\"><code>原来   a[a_hi] 打 b[j]  、  a[i] 打 b[b_hi]\n现在   a[a_hi] 打 b[b_hi]、  a[i] 打 b[j]</code></pre>\n<p>变化量 = <code>[s(a_hi,b_hi) + s(a_i,b_j)] − [s(a_hi,b_j) + s(a_i,b_hi)]</code> = <code>[1 + s(a_i,b_j)] − [s(a_hi,b_j) + s(a_i,b_hi)]</code>。</p>\n<p>由于 <code>b[j] &lt;= b[b_hi]</code>，右边两项相比左边各自的\"升级版\"都只会更低， 两份\"缩水\"加起来不会超过左边白赚的那 1 分 → 对调不会更差。</p>\n<p><strong>② 的论证。</strong> 齐王最快 <code>b_hi</code> 谁也挡不住（连田忌最快的都输给它，故 <code>a_lo &lt;= a_i &lt; b_hi</code> 时 任何人去打它都是输一场）。设最优解里 <code>b_hi</code> 配 <code>a[i]</code>、<code>a_lo</code> 配 <code>b[j]</code>。对调后：</p>\n<pre class=\"code\"><code>原来   a[i] 打 b[b_hi]（输）、  a[a_lo] 打 b[j]\n现在   a[a_lo] 打 b[b_hi]（同样输）、a[i] 打 b[j]</code></pre>\n<p>输掉的分<strong>一模一样</strong>；而 <code>a[i] &gt;= a[a_lo]</code>，它打 <code>b[j]</code> 至少不会比 <code>a[a_lo]</code> 打 <code>b[j]</code> 差。 → 不会更差。既然\"谁去都是输一场\"，就派最慢的去，好马留给自己人。</p>\n<p><strong>③a 的论证。</strong> 田忌最慢的 <code>a_lo</code> 都赢得了齐王最慢的 <code>b_lo</code>。 设最优解里 <code>a_lo</code> 配 <code>b[j]</code>、<code>b_lo</code> 配的是某匹 <code>a[i]</code>（<code>i != lo</code>）。对调：</p>\n<pre class=\"code\"><code>原来   a[a_lo] 拿 s(a_lo, b[j])、a[i] 拿 +1（因为 a[i] &gt;= a[a_lo] &gt; b[b_lo]）\n现在   a[a_lo] 白拿 +1、        a[i] 拿 s(a_i, b[j]) &gt;= s(a_lo, b[j])</code></pre>\n<p>→ 不会更差。所以总能安排成\"最慢对最慢、稳赚一场\"。</p>\n<p><strong>③b 的论证。</strong> 两边最快一样快（<code>a_hi == b_hi</code>），同时田忌最慢的又赢不了齐王最慢的。 此时 <code>a[a_lo] &lt;= b[b_lo] &lt;= b[b_hi]</code>。拿最不值钱的 <code>a[a_lo]</code> 去撞 <code>b[b_hi]</code>：</p>\n<ul>\n<li>最坏是<strong>输一场</strong>，但换来的是\"手里多留一匹快马\"；</li>\n<li>关键在于 <code>b[b_hi]</code> 由谁去撞都<strong>至多打成平手</strong>（<code>a[a_hi]</code> 只是<strong>等于</strong>它、并不大于它），</li>\n</ul>\n<p>既然挣不到分，就该拿最便宜的兵去换掉它；</p>\n<ul>\n<li>而 <code>s(·, y)</code> 随自己变快不减，所以\"省下来的这匹快马\"留给后面的场次绝不会比它现在去打王牌更亏。</li>\n</ul>\n<p>每一支都能把最优解\"改造\"成照它执行的样子而不变差，把 <code>n</code> 场一路改造下来就得到贪心的方案， 收益仍是最优 —— 归纳成立。</p>\n<hr>\n<h2 id=\"sec-5\">四、样例手推</h2>\n<h3 id=\"sec-6\">第 1 组：田忌 <code>3 5 7</code>，齐王 <code>4 6 8</code> → 输出 <strong>100</strong></h3>\n<p>排序后：<code>a = [3,5,7]</code>，<code>b = [4,6,8]</code>。</p>\n<div class=\"tablewrap\"><table><thead><tr><th>场次</th><th>窗口</th><th>比较</th><th>分支</th><th>出马</th><th>结果</th><th>累计</th></tr></thead><tbody><tr><td>1</td><td>田忌 <code>[3,5,7]</code>、齐王 <code>[4,6,8]</code></td><td><code>7 &lt; 8</code></td><td>②</td><td>田忌最慢 <code>3</code> vs 齐王最快 <code>8</code></td><td>负 -100</td><td>-100</td></tr><tr><td>2</td><td>田忌 <code>[5,7]</code>、齐王 <code>[4,6]</code></td><td><code>7 &gt; 6</code></td><td>①</td><td>田忌最快 <code>7</code> vs 齐王最快 <code>6</code></td><td>胜 +100</td><td>0</td></tr><tr><td>3</td><td>田忌 <code>[5]</code>、齐王 <code>[4]</code></td><td><code>5 &gt; 4</code></td><td>①</td><td><code>5</code> vs <code>4</code></td><td>胜 +100</td><td><strong>100</strong></td></tr></tbody></table></div>\n<p>注意田忌<strong>每一匹都比齐王同等级的马慢</strong>（3&lt;4、5&lt;6、7&lt;8）， 按\"上对上、中对中、下对下\"打会 <strong>0 胜 3 负 = -300</strong>； 错位之后反而 <strong>2 胜 1 负 = +100</strong> —— 这就是\"善用自己的长处去对付对手的短处\"。</p>\n<h3 id=\"sec-7\">第 2 组：田忌 <code>1 2 7 8</code>，齐王 <code>3 4 5 6</code> → 输出 <strong>0</strong></h3>\n<div class=\"tablewrap\"><table><thead><tr><th>场次</th><th>比较</th><th>分支</th><th>出马</th><th>结果</th><th>累计</th></tr></thead><tbody><tr><td>1</td><td><code>8 &gt; 6</code></td><td>①</td><td><code>8</code> vs <code>6</code></td><td>胜 +100</td><td>100</td></tr><tr><td>2</td><td><code>7 &gt; 5</code></td><td>①</td><td><code>7</code> vs <code>5</code></td><td>胜 +100</td><td>200</td></tr><tr><td>3</td><td><code>2 &lt; 4</code></td><td>②</td><td>最慢 <code>1</code> vs 最快 <code>4</code></td><td>负 -100</td><td>100</td></tr><tr><td>4</td><td><code>2 &lt; 3</code></td><td>②</td><td><code>2</code> vs <code>3</code></td><td>负 -100</td><td><strong>0</strong></td></tr></tbody></table></div>\n<h3 id=\"sec-8\">第 3 组：田忌 <code>1 2</code>，齐王 <code>3 4</code> → 输出 <strong>-200</strong></h3>\n<p>两场都输，<strong>必须是 -200 而不是 0</strong>（把\"输\"漏掉不计是本题最常见的记分错法）。</p>\n<hr>\n<h2 id=\"sec-9\">五、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>步骤</th><th>开销</th></tr></thead><tbody><tr><td>排序两侧的马</td><td><code>O(n log n)</code></td></tr><tr><td>四指针扫描（正好 n 轮，每轮 O(1)）</td><td><code>O(n)</code></td></tr><tr><td><strong>合计</strong></td><td><strong><code>O(n log n)</code></strong>，空间 <code>O(n)</code></td></tr></tbody></table></div>\n<p>题面上限 <code>n = 100</code>，规模极小；但用 <code>n!</code> 去枚举全部出场顺序则完全不同量级 （<code>n = 20</code> 就已经跑不完），所以贪心不是\"优化\"，而是唯一的活路。</p>\n<p>数值范围：答案是 <code>100 x (胜 − 负)</code>，<code>|答案| &lt;= 100n &lt;= 10000</code>， <strong><code>int</code> 完全够用</strong>，不需要 <code>long long</code>（与最小差、合并果子那两道题不同 —— 那两题的答案会超 32 位）。</p>\n<hr>\n<h2 id=\"sec-10\">六、边界与陷阱</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>#</th><th>事项</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td><strong><code>n = 0</code> 是数据还是哨兵</strong></td><td>题面保证 <code>n &gt;= 1</code>，所以只能是哨兵。选\"结束\"并把选择写进 stderr 的 <code>[!]</code>（陷阱 22）</td></tr><tr><td>2</td><td><strong>多组 vs 单组</strong></td><td>从样例反推是 EOF 结束；实现成宽容循环，单组只是 EOF 的特例。<strong>别从题面猜</strong>（铁律 2 / 陷阱 14）</td></tr><tr><td>3</td><td><strong><code>n</code> 越界必须中止</strong></td><td><code>continue</code> 会让后面的数字被当成下一组的 <code>n</code>，把伪答案打进 stdout（铁律 6 / 陷阱 11）</td></tr><tr><td>4</td><td><strong>输出没有 <code>Case i</code> 行</strong></td><td>本题每组只输出一个整数。别照抄 0/1 背包、LCS 那两道题的格式</td></tr><tr><td>5</td><td><strong>答案可以是负数</strong></td><td>样例第 3 组就是 <code>-200</code>；打印时别加绝对值、别漏负号</td></tr><tr><td>6</td><td><strong>马的能力值可以相等</strong></td><td>题面没保证互不相同。四个分支都能正确处理；\"全平局\"（③b 的平局支）就是靠它才走得到</td></tr><tr><td>7</td><td><strong><code>n = 1</code></strong></td><td>只剩一匹马，四支退化成\"快就赢、慢就输、一样就平\"，答案 ∈ {100, 0, -100}。不用额外特判</td></tr><tr><td>8</td><td><strong>越界 <code>n</code> 与\"数据不足\"</strong></td><td>读到一半 EOF 要打 <code>[!]</code> 后停，不能静默 return</td></tr><tr><td>9</td><td><strong><a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a>必须带换行</strong></td><td><code>\"%d\\n\"</code> 写法自带（铁律 4）</td></tr><tr><td>10</td><td><strong>★ 每组算完必须立刻写出 + <code>flush()</code></strong></td><td>本题是 <strong>EOF 结束</strong>：终端里敲完最后一行，程序还在等 EOF。\"攒完所有组再一次性写出\"会让屏幕上<strong>一个字符都没有</strong>，用户会以为卡死 —— 症状与铁律 1 那条一模一样，<strong>病根却在\"输出时机\"而不是\"读取时机\"</strong>，只查<a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>永远查不出来。2026-09-30 用户当场抓到的就是这个（详见 §十二.0）</td></tr></tbody></table></div>\n<h3 id=\"sec-11\">本题最典型的四种错法（都被锚定用例钉死）</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>错法</th><th>会错在哪</th><th>钉死它的锚定</th></tr></thead><tbody><tr><td>只做\"同等级对同等级\"</td><td>样例 1 得 <code>-300</code>（正确 <code>100</code>）</td><td><code>[3,5,7] vs [4,6,8] -&gt; 100</code></td></tr><tr><td>双向贪心只写三支（漏掉\"两边最快相等\"的两个子分支）</td><td>直接按最快比会得 <code>0</code></td><td><code>[1,2,5] vs [1,2,5] -&gt; 100</code>、<code>[1,2,3] vs [1,2,3] -&gt; 100</code></td></tr><tr><td>③b 里的\"平局\"当成输</td><td>全平局的局面得 <code>-300</code></td><td><code>[2,2,2] vs [2,2,2] -&gt; 0</code></td></tr><tr><td>记分只算胜场、不算负场</td><td>样例 3 得 <code>0</code></td><td><code>[1,2] vs [3,4] -&gt; -200</code></td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-12\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th><th>是否验收</th></tr></thead><tbody><tr><td><code>horse_race.py</code></td><td><strong>OJ 提交版</strong>（stdout 只输出答案）</td><td>✅</td></tr><tr><td><code>horse_race_detailed.py</code></td><td>详细版：逐场推演 + 六条自校（<strong>仅供本地学习，勿提交</strong>）</td><td>✅</td></tr><tr><td><code>horse_race_animation.html</code></td><td>浏览器动画（自包含单文件、支持自定义输入）</td><td>✅</td></tr><tr><td><code>田忌赛马详解.md</code></td><td>本文档</td><td>✅</td></tr><tr><td><code>verify_horse_race.py</code></td><td>主验证：与暴力 / 独立最优解对拍 + 端到端 + 边界 + AST + 读取器斜率</td><td>✅</td></tr><tr><td><code>verify_horse_race_animation.js</code></td><td>动画验证：node 抽 <code>&lt;script&gt;</code> + DOM stub 实跑</td><td>✅</td></tr><tr><td><code>verify_horse_race_mutations.py</code></td><td>变异测试：45 个变异，要求 45/45 被抓</td><td>✅</td></tr><tr><td><code>horse_race.c</code></td><td>C 实现 —— <strong>可选项</strong>，本机无 C 编译器，<strong>从未编译验证过</strong></td><td>➖</td></tr><tr><td><code>verify_horse_race_c_mirror.py</code></td><td>C 版逻辑核对（把 C 逐行转写成 Python 对拍）</td><td>➖</td></tr></tbody></table></div>\n<blockquote>★ <strong>本项目 2026-09-30 起的语言口径：全部用 Python 实现，C 版不是必需交付物、不参与验收。</strong> 三个 Python 验证脚本全绿即为完成。<code>.c</code> 与 <code>c_mirror</code> 留着只作参考文本，不要求维护。</blockquote>\n<hr>\n<h2 id=\"sec-13\">八、参考测试用例（含锚定）</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望</th><th>钉住的是什么</th></tr></thead><tbody><tr><td><code>3 / 3 5 7 / 4 6 8</code></td><td><code>100</code></td><td>题面样例 1：同等级全输，靠错位赢</td></tr><tr><td><code>4 / 1 2 7 8 / 3 4 5 6</code></td><td><code>0</code></td><td>题面样例 2</td></tr><tr><td><code>2 / 1 2 / 3 4</code></td><td><code>-200</code></td><td>题面样例 3：全输，记分不能漏负</td></tr><tr><td><code>3 / 1 2 3 / 1 2 3</code></td><td><code>100</code></td><td><strong>同样等级也能靠错位赢</strong>（同等级配同等级会得 0）</td></tr><tr><td><code>3 / 1 2 5 / 1 2 5</code></td><td><code>100</code></td><td><strong>两边最快一样快</strong>（③b）：直接同等配对会得 0</td></tr><tr><td><code>3 / 3 4 5 / 1 2 5</code></td><td><code>200</code></td><td><strong>③a</strong>：田忌最慢的赢得了齐王最慢的，必须先赚这场（漏掉得 100）</td></tr><tr><td><code>3 / 2 2 2 / 2 2 2</code></td><td><code>0</code></td><td><strong>全平局</strong>（③b 的平局支）：一律算输会得 -300</td></tr><tr><td><code>1 / 5 / 5</code></td><td><code>0</code></td><td>n=1 平</td></tr><tr><td><code>1 / 5 / 4</code></td><td><code>100</code></td><td>n=1 赢</td></tr><tr><td><code>1 / 4 / 5</code></td><td><code>-100</code></td><td>n=1 输</td></tr><tr><td><code>4 / 1 1 3 3 / 1 1 3 3</code></td><td><code>0</code></td><td>重复值</td></tr><tr><td><code>4 / 7 7 7 7 / 3 9 12 15</code></td><td><code>-200</code></td><td>只有一次赢的机会，必须用对地方</td></tr><tr><td><code>5 / 1 3 5 7 9 / 2 4 6 8 10</code></td><td><code>300</code></td><td>交替压制：牺牲最慢的一匹，其余全赢</td></tr><tr><td><code>4 / 2 2 9 9 / 3 3 8 8</code></td><td><code>0</code></td><td>分块交错</td></tr></tbody></table></div>\n<blockquote>全部 14 条都先用 <code>n!</code> 全排列暴力<strong>实算确认过</strong>（陷阱 19：验证脚本自己的期望值写错， 是本仓库踩过的坑 —— 不许手推）。</blockquote>\n<hr>\n<h2 id=\"sec-14\">九、正确性验证</h2>\n<h3 id=\"sec-15\">主验收（<code>verify_horse_race.py</code>，本机约 12~26 秒）</h3>\n<ul>\n<li><strong>锚定 14 条</strong>：与全排列暴力一致；</li>\n<li><strong>小规模全对拍 31741 组</strong>：n ≤ 4 的<strong>值域穷举</strong>（<code>combinations_with_replacement</code> 全组合）</li>\n</ul>\n<p>+ 30000 组随机（小值域 / 含负数 / 近乎有序 / 无交集四种风格），全部与 <code>n!</code> 全排列暴力一致；</p>\n<ul>\n<li><strong>中规模 3000 组</strong>（n = 7..14）：与 <strong>scipy 指派问题最优解</strong>对拍；</li>\n</ul>\n<p>另抽检 n=7（400 组）/ n=8（80 组）/ n=9（8 组）与全排列暴力对拍； ⚠️ 抢在使用 scipy 之前，先花 2000 组验证\"scipy 算器 == 全排列暴力\" —— 复核工具本身要先被验（陷阱 27）；</p>\n<ul>\n<li><strong>大 n = 100，120 组</strong>：与 scipy 指派最优一致，外加四条<strong>与算法无关的结构性质</strong>：</li>\n</ul>\n<p>① 打乱输入顺序答案不变；② 两边同时平移答案不变； ③ 田忌某匹马变强 / 齐王某匹马变弱，答案不会变小；④ <code>f(A,B) + f(B,A) &gt;= 0</code>（零和下界）；</p>\n<ul>\n<li><strong>端到端</strong>：题面样例逐字节比对 + 6 种排布（紧凑 / 一行一组 / 空行夹杂 / 全部拆成单个 / 无末尾换行 / 组间空行）</li>\n</ul>\n<p>+ 单组 + n=100 + <strong>整组 20001 个 token 挤在一行</strong>，<code>stderr</code> 全程为空；</p>\n<ul>\n<li><strong>非法输入 6 类 + 伪整数拦截</strong>：<code>n</code> 越界（0 / -3 / 101 / 99999，必须中止且 stdout 为空）、<code>n=0</code> 哨兵、</li>\n</ul>\n<p>数据不足、非整数、空输入、前几组合法后面坏掉（已完成的结果必须保留）； 以及 ★「长得像整数但不是」的 token（<code>1_2</code> / 全角 <code>１２</code> / <code>0x10</code> / <code>1.5</code>）必须<strong>拦下</strong>， 而合法的 <code>+5</code> 必须<strong>放行</strong>（见下面 §十二.7）；</p>\n<ul>\n<li><strong>逐组即时输出</strong>：<code>Popen</code> 起子进程，<strong>不放 EOF</strong>、只喂完一组，15 秒内必须拿到那一组的答案</li>\n</ul>\n<p>（第 1 组 <code>100</code>、第 2 组 <code>-200</code>）。这是\"终端里敲完像卡死\"的专用防线（见 §十二.0）；</p>\n<ul>\n<li><strong>读取器两条防线</strong>：</li>\n</ul>\n<p>① <strong>确定性 AST 结构检查</strong> —— 找 <code>pop(0) / insert(0,..) / del buf[0] / buf = buf[1:]</code>， 不受机器负载影响、不会随机误报； ② <strong>斜率中位数</strong> <code>t(4K)/t(K)</code>（反复测 5 个比值取中位）：正常代码实测 <strong>3.92~5.57</strong>（中位 5.03）， <code>pop(0)</code> 坏变体 <strong>11.21~26.41</strong>（中位 17~19）。阈值取 <strong>9</strong>（正常侧 1.79 倍、坏变体侧 1.93 倍余量）。 反向自检用<strong>相对判据</strong>（坏变体中位 &gt; 正常的 1.5 倍），因为机器被别的进程压满时 两侧会一起变慢、比值互相靠近。 ⚠️ 这两条是<strong>踩了两次坑</strong>才定下来的（第一版采样不对称会随机误报；第二版单次比值低尾到 9.35， 真的漏网过一次），详见 §十二.2；</p>\n<ul>\n<li><strong>AST / GBK</strong>：两个源文件均无 f-string / <code>.buffer</code> / <code>nonlocal</code> / 类型注解 / <code>input()</code> / <code>read()</code>，字面量 GBK 安全；</li>\n<li><strong>详细版</strong>：3 组样例答案与提交版一致、六条自校全绿；n=8 时确实跑了全排列复核、n=9 时<strong>明确声明跳过</strong></li>\n</ul>\n<p>且收尾汇总如实写明\"最优性未经检验\"（不把\"没验\"说成\"通过\"）；</p>\n<ul>\n<li><strong>详细版的打印内容</strong>：逐场推演里印的「原第 K 匹」必须<strong>反查得到输入里那匹马</strong></li>\n</ul>\n<p>（且 K 构成 1..n 的排列），窗口行的「慢 / 快」必须真是窗口中那几匹马的最小 / 最大值。 这一层是独立审计逼出来的 —— 六条自校<strong>只管答案</strong>，印错了配对、印反了窗口，它一条都不响（见 §十二.3）。</p>\n<h3 id=\"sec-16\">动画（<code>verify_horse_race_animation.js</code>）</h3>\n<ul>\n<li>贪心 vs 全排列暴力：3000 组小规模 + 260 组大 n（含 n=100），锚定 14 条；</li>\n<li>不变式（<strong>逐分支扫出来的，不是手挑的</strong>）：正好 n 场、两条窗口等长且每场各缩 1、</li>\n</ul>\n<p>双方每匹马恰好出场一次、记录的胜负与能力值一致、<strong>每个分支的指针关系与判定条件都真的成立</strong> （比如标了分支③a 就必须真的 <code>a[a_hi]==b[b_hi]</code> 且 <code>a[a_lo]&gt;b[b_lo]</code>）；</p>\n<ul>\n<li>逐步 <code>render()</code> 不抛异常；<code>stateAt(k)</code> <strong>乱序重放</strong>一致（可任意跳转）；</li>\n<li><strong>高亮的格子 == 本场出马的那两匹</strong>、<strong>「慢/快」标记位置 == 本场开始时的窗口端点</strong>、</li>\n</ul>\n<p><strong>标题里的「第 N 场」真的是第 N 场</strong>（这三条都是本仓库\"画面比解说快一拍\"类事故的专用防线，陷阱 28）；</p>\n<ul>\n<li><strong>CSS 状态类双向互查</strong>：CSS 里写的 <code>.cell.XXX</code> 必须真的会被 <code>render()</code> 用上（否则是死规则），</li>\n</ul>\n<p><code>render()</code> 产出的类必须在 CSS 里有规则（否则状态色静默失效，陷阱 35）；</p>\n<ul>\n<li>★ <strong>画面上看得见的东西全部与内部状态对齐</strong>：出马格的<strong>结果色</strong>、<strong>文字</strong>（<code>胜/负/平 + 第N场</code>）、</li>\n</ul>\n<p><strong>数值</strong>；已出场格文字的<strong>场次号</strong>；<strong>记录表每一格</strong>（表头 + 场次 / 两侧出马 / 结果 / 累计银币）； <strong>解说正文</strong>（分支编号、比较式里的具体数值、该分支的结论句、intro 的目标公式、终态的战绩与算式）； 以及<strong>窗口内部（端点之外）一格标记都不许有</strong>。 这一节是独立审计逼出来的：此前脚本对\"格子上的文字、结果色、记录表内容、解说正文\"<strong>一条断言都没有</strong>， 审计造的 11 个\"只改文字/颜色、不动逻辑\"的变异 <strong>11 个全部漏网</strong>（见 §十二.3）；</p>\n<ul>\n<li>自定义输入：合法 4 组 + 非法 10 类必须报错（含 ±10^9 量级闸门）。</li>\n</ul>\n<h3 id=\"sec-17\">变异测试（<code>verify_horse_race_mutations.py</code>）—— <strong>45/45 全部被抓住</strong></h3>\n<div class=\"tablewrap\"><table><thead><tr><th>组</th><th>条数</th><th>覆盖的错法</th></tr></thead><tbody><tr><td>提交版</td><td>17</td><td>分支②选错马、③a 把平局当赢、③b 平局支被吃掉、忘记排序、排序降序、计分写成 <code>(胜+负)</code>、计分漏掉负场、<code>pop(0)</code>、<strong>去掉逐组 flush（终端里像卡死）</strong>、<strong>整数校验退回裸 <code>int()</code></strong>、<code>sys.stdin.read()</code>、f-string、<code>input()</code>、丢行尾换行、错误走 stdout、<code>n</code> 越界 <code>continue</code>、<code>n=0</code> 不再当哨兵</td></tr><tr><td>详细版</td><td>9</td><td>分支选错马、③a 判据错、③b 平局算输、窗口多缩一格、<strong>自校⑤ 的暴力实现判反</strong>（证明 ⑤ 不是橡皮图章）、<strong>釜底抽薪</strong>（见下）、[审计] <strong>印的「原第 K 匹」全体差一位</strong>、[审计] <strong>出马行两侧位次对调</strong>、[审计] <strong>窗口行慢/快写反</strong></td></tr><tr><td>动画</td><td>19</td><td>分支选错马、③b 平局算输、累计胜负写反、窗口标记画成\"下一轮的窗口\"、本场出马不再高亮、标题场次号用 <code>stepIdx</code>、<strong>加一条死 CSS 规则</strong>、中文串里混进 ASCII 双引号，以及 [审计] 的 11 条\"只改看得见的文字/颜色\"：结果色写反、胜/负文字写反、场次号 +1、记录表两列对调、累计银币改成胜负差、结果列负写成胜、分支①结论句改成\"白输一场\"、分支②左右对调、intro 公式改成 <code>(胜+负)</code>、窗口内部多画标记、角标写成 <code>[q]</code></td></tr></tbody></table></div>\n<p>其中\"<strong>釜底抽薪</strong>\"那条特别值得记：它把<strong>算法改错</strong>，同时把自校 ①-④ 全部改成恒真表达式， 只留下第 ⑤ 条（枚举全部 <code>n!</code> 种配对的独立复核）—— 脚本报出 <code><strong>*</code>，说明</strong>只有 ⑤ 有牙齿**。 这正是陷阱 37 的教训：<code>Σ得分 == 答案</code> 这类等式两边来自同一套计算，它证明的只是\"账目自洽\"，不含最优性。</p>\n<h3 id=\"sec-18\">C 版（<code>verify_horse_race_c_mirror.py</code>）—— <strong>可选项，不参与验收</strong></h3>\n<p>把 <code>horse_race.c</code> 的<strong>算法与读入分支结构</strong>逐行转写成 Python 对拍： 锚定 12 条 + 算法随机 20000 组 + 读入层 10 例 + 模糊 token 流 3000 组 + n=100，全部一致。</p>\n<p>⚠️ <strong>必须诚实说明它的边界</strong>（独立审计逐条实测过）：</p>\n<ul>\n<li><code>KEY_FRAGMENTS</code> 的\"关键片段核对\"只是<strong>很弱的陈旧提示</strong> —— 改 <code>cmp_int</code>、改 <code>MAXN</code>、</li>\n</ul>\n<p>把 <code>bHi--</code> 写成 <code>bHi++</code>、把比较函数的 <code>-1/1</code> 对调，<strong>它一条都发现不了</strong>；</p>\n<ul>\n<li><code>py_main()</code> 是<strong>手抄</strong>提交版 <code>main()</code> 的循环，所以\"读入层 10 例 + 模糊 3000 组\"</li>\n</ul>\n<p>验的是<strong>镜像 vs 镜像</strong>，不是\"镜像 vs 提交版\"（这是有意的：不让镜像去 import 提交版的解析逻辑， 否则提交版改坏了镜像会跟着\"通过\"）；</p>\n<ul>\n<li>它与真 C 的读入语义仍有差异：<code>scanf(\"%d\")</code> 遇 <code>4x</code> 会取走 <code>4</code> 并继续（可能多打一行答案）。</li>\n<li><strong>它证明不了 C 能编译、能过 OJ</strong>，只证明\"结构与已通过验证的 Python 版一致\"。</li>\n</ul>\n<hr>\n<h2 id=\"sec-19\">十、C 版本说明（<strong>可选项 —— 本项目已定\"全部用 Python 实现\"，C 不参与验收</strong>）</h2>\n<blockquote>这一节与 <code>horse_race.c</code>、<code>verify_horse_race_c_mirror.py</code> 都只是<strong>参考文本</strong>。 按项目 2026-09-30 定下的语言口径，新题不必再写 C 版，已有的也不必维护 —— <strong>三个 Python 验证脚本全绿即交付</strong>。下面留着是为了记录当时的做法。</blockquote>\n<p><code>horse_race.c</code> 与提交版算法完全同构：<code>qsort</code> 升序 + 四指针 + 四分支，输出 <code>(win - lose) * 100</code>。</p>\n<ul>\n<li>数值范围 <code>|答案| &lt;= 10000</code>，<strong><code>int</code> 足够</strong>，不需要 <code>long long</code>；</li>\n<li><code>qsort</code> 的比较函数用<strong>比较</strong>而不是减法（减法在极端输入下会溢出）；</li>\n<li>读入层对齐了 Python 版的分支：区分 <code>scanf</code> 的三种返回（<code>1</code> 读到 / <code>0</code> 非数字 / <code>EOF</code>），</li>\n</ul>\n<p><code>n = 0</code> 当哨兵、<code>n</code> 越界中止、读到一半 EOF 打 <code>[!]</code> 后停 —— 都能在 stderr 里看见；</p>\n<ul>\n<li>⚠️ <strong>本机没有任何 C 编译器</strong>（gcc / clang / tcc / cl / zig 全无，整盘搜过），</li>\n</ul>\n<p>这个文件<strong>从未编译验证过</strong>。已知与 Python 版的一处差异：<code>scanf(\"%d\")</code> 遇到 <code>12abc</code> 会取走 <code>12</code>、把 <code>abc</code> 留在缓冲区，而 Python 的 <code>int(\"12abc\")</code> 直接抛错 —— 两者都会\"停\"，但停的位置不同（都是坏数据，不影响判题）。</p>\n<hr>\n<h2 id=\"sec-20\">十一、如何复跑验证</h2>\n<p><strong>验收三件套（全绿即这题做完）</strong>：① 主验证 + ③ 动画验证 + ④ 变异测试。 ②（C 版镜像核对）与 ⑤⑥ 都只是参考。</p>\n<pre class=\"code bash\"><code>cd E:/沈云付算法/田忌赛马\n\n# ① 主验收（对拍 / 端到端 / 边界 / 读取器斜率 / AST / 详细版自校与打印核对）\npython verify_horse_race.py\n# 期望: OK: 锚定 14 条 | 小规模全对拍(值域穷举 + 30000 随机) | 中规模 n=7..9 全排列对拍 |\n#      n=100 结构性质 + scipy 指派最优对拍 | 端到端 6 种排布 + 单组 + 整行挤压 |\n#      非法输入 6 类 + 伪整数拦截(1_2 / 全角) | 逐组即时输出(不放 EOF) |\n#      读取器(斜率中位&lt;9，坏变体&gt;9 + AST 结构检查) | AST/GBK clean |\n#      详细版自校全绿且 n&gt;8 如实声明未跑\n#      不带 PYTHONIOENCODING 直接跑也必须是 OK（脚本自己给子进程钉了 UTF-8）；\n#      想看到中文别乱码再加 PYTHONIOENCODING=utf-8。斜率/耗时随机器浮动，阈值是 slope&lt;9\n\n# ② C 版逻辑核对 —— **可选项，不必跑**（无编译器时的替代验证；只覆盖算法与读入分支结构）\nPYTHONIOENCODING=utf-8 python verify_horse_race_c_mirror.py\n\n# ③ 动画（node 抽 &lt;script&gt; + DOM stub 实跑）\nnode verify_horse_race_animation.js\n# 期望: OK: 贪心==暴力 3000 small + 260 big cases | 锚定 14 条 |\n#      不变式(场数/窗口等长且每场缩1/双射/胜负自洽/分支判据) | 逐步 render + 乱序重放一致 |\n#      高亮==本场出马 + 慢快标记位置 | 标题场次号 | 复用判据 | CSS状态类双向互查 |\n#      画面文字/结果色/记录表/解说正文与内部状态对齐 |\n#      画面文字/结果色/记录表/解说正文与内部状态对齐 |\n#      自定义输入 合法 4 + 非法 10 | 终态银币==暴力 + 记录表行数\n\n# ④ 变异测试（验收\"断言本身有没有牙齿\"）\nPYTHONIOENCODING=utf-8 python verify_horse_race_mutations.py\n# 期望: OK: 变异捕获率 45/45（提交版 17/17，详细版 9/9，动画 19/19）；还原后主验收脚本仍全绿\n# ⚠️ 它会把动画 HTML 临时换成正主再跑 node，跑完还原 —— 别和别的验证脚本并行跑\n\n# ⑤ 详细版（看逐场推演 + 六条自校）\nPYTHONIOENCODING=utf-8 python horse_race_detailed.py  &lt; 输入.txt\n\n# ⑥ 提交版（stdout 必须只有答案、stderr 必须为空）\npython horse_race.py &lt; 输入.txt</code></pre>\n<h3 id=\"sec-21\">渲染层实拍（node 测不到 CSS / 布局）</h3>\n<pre class=\"code bash\"><code>\"/c/Program Files/Google/Chrome/Application/chrome.exe\" --headless=new --disable-gpu \\\n  --hide-scrollbars --virtual-time-budget=3000 --window-size=1280,1200 \\\n  --screenshot=\"C:/Users/lenovo/AppData/Local/Temp/shot.png\" \\\n  \"file:///C:/Users/lenovo/AppData/Local/Temp/贴一份动画副本.html\"</code></pre>\n<p>想让动画停在<strong>第 N 步</strong>再截：复制一份临时 HTML，在 <code>&lt;/body&gt;</code> 前注入 <code>&lt;script&gt;for (var k=0;k&lt;N;k++) nextStep();&lt;/script&gt;</code>。</p>\n<p>⚠️ 两个路径坑：Chrome 的 <code>file://</code> 要写 <code>file:///C:/...</code> 全路径； <strong>别用 <code>/tmp</code></strong> —— Python 眼里的 <code>/tmp</code> 是 <code>C:\\tmp</code>，和 git-bash 的 <code>/tmp</code> 不是同一个地方。</p>\n<hr>\n<h2 id=\"sec-22\">十二、本轮靠验证抓出的问题（都是\"看着像对\"的错）</h2>\n<p>这一轮<strong>算法本身一次都没写错</strong>（四个分支的公式在动手前就先用 120 万组随机 + 1741 组 小值域全枚举对拍确认过），但下面这些全都不是靠\"看代码\"发现的：</p>\n<h3 id=\"sec-23\">0. ★ 用户当场抓到的一个真 bug（最值得记的一条）</h3>\n<p><strong>提交版\"攒完所有组再一次性写出\" → 终端里敲完最后一行，屏幕上零输出。</strong></p>\n<p>用户按题面把样例敲进去，反馈\"<strong>没有任何输出</strong>\"。原因不是算法、也不是读取器：</p>\n<ul>\n<li>读取器是对的（<code>readline()</code> 逐行读 + <code>reversed()/pop()</code>），这一点通过了几万组测试；</li>\n<li>但这个题是 <strong>EOF 结束</strong>的多组题 —— 用户敲完最后一行后，程序还在等下一条输入（等 EOF），</li>\n</ul>\n<p>而输出被我写成了\"攒完所有组、最后一次性 <code>join</code> 写出\"，于是一个字节都没吐出来；</p>\n<ul>\n<li>用户看到的症状是\"<strong>程序没反应 / 像卡死</strong>\"，而这<strong>正是铁律 1 想防的那个症状</strong></li>\n</ul>\n<p>（\"敲完数据毫无反应，用户以为卡死\"）—— 只不过铁律 1 讲的是<strong>读取</strong>时机， 这次翻车在<strong>输出</strong>时机。<strong>只盯着读取器查，是永远查不出来的。</strong></p>\n<p><strong>修法</strong>：改成每组算完立刻 <code>sys.stdout.write(\"%d\\n\" ...)</code> + <code>sys.stdout.flush()</code> （与「单位区间覆盖」同款做法）。详细版也补了 flush —— 否则在 PyCharm 这类<strong>非 tty</strong> 控制台里 （tty 是行缓冲、管道/非 tty 是块缓冲）同样看不到推演过程。</p>\n<p><strong>新增的回归断言</strong>（这条才是关键，光修不补断言等于没修）： 用 <code>Popen</code> + 线程超时读实现 —— <strong>不放 EOF、只喂完一组，15 秒内必须拿到那一组的答案</strong> （第 1 组 <code>100</code>、第 2 组 <code>-200</code>）。再配一条\"<strong>去掉 flush</strong>\"的变异验收它有牙齿。</p>\n<p><strong>教训</strong>：凡\"读满一段才输出\"的设计，先问一句\"<strong>这个题什么时候才算读完</strong>\" —— EOF 型的终点是用户按 Ctrl+Z，而人是不会等的。（已写进项目 CLAUDE.md 的铁律 4 与陷阱 52。）</p>\n<h3 id=\"sec-24\">验证脚本自己的错</h3>\n<ol>\n<li><strong><code>render()</code> 渲染的是全局 <code>stepIdx</code>，不是循环里的 <code>k</code></strong> —— 动画验证脚本第一版忘了推进它，</li>\n</ol>\n<p>于是每一步都在渲染第 0 步，所有\"画面与解说同步\"的断言全在拿错误的对象比较 （报了 112 处失败）。修法：循环体末尾 <code>api.nextStep()</code>。</p>\n<ol>\n<li><strong>朴素正则查\"中文里的 ASCII 引号\"会误报</strong> —— <code>\"④ 全部 \" + n + \" 场结束\"</code> 这种</li>\n</ol>\n<p><strong>相邻的两个字符串字面量</strong>被当成了坏东西。改成真正的迷你词法器： 先按 JS 词法把字符串字面量逐个切出来（跳过注释、处理转义），再看<strong>字面量内容里</strong>是否 既含引号又含汉字。这正是陷阱 38「检查被自己的写法误命中」的又一例。</p>\n<ol>\n<li><strong>中规模用 <code>n!</code> 全排列对拍 4000 组根本跑不完</strong> —— n=9 就是 362880 种，整脚本跑了十几分钟还没完。</li>\n</ol>\n<p>改成\"主力用 scipy 指派问题最优解批量对拍 + 抽检一批全排列暴力去校验那个算器\"。</p>\n<h3 id=\"sec-25\">动画的真错</h3>\n<ol>\n<li><strong>\"是否已排序\"和\"已出场的马\"用了同一个循环边界</strong> —— 走到「排序」那一步时，</li>\n</ol>\n<p>解说在讲\"现在排好序了\"，画面上却还是原序（<code>t &lt; k</code> 不含当前步）。 修法：排序标志用 <code>t &lt;= k</code>，已出场/窗口用 <code>t &lt; k</code>，两个边界分开写。</p>\n<ol>\n<li><strong><code>.cell.pick</code> 是一条从来没被用上的 CSS 规则</strong> —— <code>render()</code> 实际只会产出</li>\n</ol>\n<p><code>won / lost / tied / out</code> 四个状态类，\"本场出马\"那个颜色是给 <code>pick</code> 写的，<strong>永远不生效</strong>； 而图例里还摆着「本场出马」的琥珀色块，<strong>在骗人</strong>。 这是靠 <code>getComputedStyle</code> 探针实拍才发现的（陷阱 29 / 35）。 修法：删掉死规则、把结果色挂到 <code>won/lost/tied</code> 上、图例改写成 「本场出马 · 赢 / 输 / 平」。并<strong>新增一条断言</strong>： CSS 里写的状态类与 <code>render()</code> 产出的状态类必须<strong>互相覆盖</strong>，两边都不许有多余项 —— 这条断言由\"加一条死 CSS 规则\"的变异（29 号）验收它有牙齿。</p>\n<ol>\n<li><strong>\"窗口只剩一匹马\"时动画标的是「慢=快」</strong>，而断言只认「慢」/「快」—— 属于<strong>断言太严的误报</strong>。</li>\n</ol>\n<p>修法：断言接受 <code>慢=快</code> 这一种写法，同时补一条\"窗口外一格标记都不许有\"的断言。</p>\n<h3 id=\"sec-26\">一处设计决策</h3>\n<ol>\n<li><strong><code>n = 0</code> 当\"输入结束\"而不是\"0 个顶点的场景\"</strong> —— 与连通分支数那题同款的二义性。</li>\n</ol>\n<p>本题题面明确 <code>1 &lt;= n &lt;= 100</code>，<code>0</code> 不可能是合法数据，故选\"结束\"， 并把选择写进 stderr 的 <code>[!]</code> 提示，同时<strong>在文档里写明</strong>（陷阱 22）。</p>\n<h3 id=\"sec-27\">独立审计（另一个 subagent）抓出的问题 —— 已全部修掉</h3>\n<p>按仓库硬规矩，跨 ≥3 文件改动 spawn 了一个<strong>对抗性审计</strong>（明确要求它\"默认作者搞错了、 自己动手实跑、能找出反例就是最大成果\"）。它给了 15 条，其中有 2 个真 bug 和一批\"断言空洞\"：</p>\n<p><strong>真 bug（会让\"照文档跑验证\"随机变红）</strong></p>\n<ol>\n<li><strong>验证脚本没给子进程钉编码（陷阱 31 第三次复发）</strong> —— <code>run_py</code> 用 UTF-8 去解子进程的输出，</li>\n</ol>\n<p>可本机控制台是 GBK、子进程照 GBK 写。于是<strong>直接敲 <code>python verify_horse_race.py</code> （不带 <code>PYTHONIOENCODING</code>，也就是用户最可能敲的那条）会假报 5 处失败</strong>， 而且失败信息指向<strong>详细版</strong>（\"详细版应打印 3 组的答案，实得 0\"）—— 详细版其实是对的。 更糟的是：解码出的替换字符 <code>U+FFFD</code> 在 GBK 控制台上<strong>编不出来</strong>， 变异脚本打印子进程输出时直接 <code>UnicodeEncodeError</code> 崩掉。 修法：给子进程 <code>env[\"PYTHONIOENCODING\"]=\"utf-8\"</code>（对齐仓库既有的合并果子写法）， 并给\"打印可能含非 GBK 字符的文本\"套一层兜底。<strong>这次是靠审计实跑 <code>python xxx.py</code> 才暴露的。</strong></p>\n<ol>\n<li><strong>读取器斜率断言随机误报，改完还漏网过一次（同一处连踩三次）</strong> ——</li>\n</ol>\n<p>① 分子只测 1 次、分母测 3 次，<strong>采样不对称</strong>，一次 GC 落在分子上比值就顶过阈值 （审计连跑 8 次实测到 1 次假失败，8.15 &gt; 7）； ② 改成\"两侧各 7 次取最小 + 阈值 8\"后<strong>仍然不行</strong> —— 实测 <code>pop(0)</code> 的<strong>单个比值最低跌到 9.35</strong>， 离阈值只剩 1.17 倍余量，随后跑变异测试时<strong>真的漏网过一次</strong>； ③ 最终改成<strong>反复测 5 个比值取中位数</strong>（正常 3.92~5.57 中位 5.03、坏变体 11.21~26.41 中位 17~19， 阈值 9），反向自检改用<strong>相对判据</strong>（坏变体 &gt; 正常的 1.5 倍：机器被别的进程压满时两侧一起变慢、 比值互相靠近，但\"坏 &gt; 正常\"这个关系仍在）； ④ 再加一条<strong>完全确定性的 AST 结构检查</strong>兜底（<code>pop(0)</code> / <code>insert(0,..)</code> / <code>del buf[0]</code> / <code>buf[1:]</code>， 不受负载影响、不会随机误报）。 <strong>教训：别把正确性押在计时上 —— 计时断言覆盖面可以广，但必须另有一条确定性判据兜底。</strong></p>\n<p><strong>断言空洞（不是代码错，是\"没人守\"）</strong></p>\n<ol>\n<li><strong>动画对\"画面上看得见的文字/颜色\"几乎没有断言</strong> —— 审计在隔离副本里造了 **11 个</li>\n</ol>\n<p>\"只改画面、不动逻辑\"的变异<strong>（结果色写反、胜/负文字写反、场次号 +1、记录表两列对调、 累计银币改成胜负差、结果列负写成胜、分支①结论句改成\"白输一场\"、分支②左右对调、 intro 公式改成 <code>(胜+负)</code>、窗口内部多画标记、角标写成 <code>[q]</code>），每一个都</strong>先确认过 \"确实产生了可观测差异\"<strong>（避免假警报），结果 </strong>11 个全部漏网<strong>。 此前脚本只查\"哪一格被高亮\"\"端点在哪\"，对格子文字、结果色、记录表内容、解说正文 </strong>一条断言都没有**。修法：补 5e/5f 两节断言（结果色、文字、数值、记录表每一格、 解说正文的分支编号/比较式/结论句、窗口内部不许有标记），并把那 11 条变异全部收进变异清单。</p>\n<ol>\n<li><strong>详细版的打印内容同样没人守</strong> —— <code>ori()</code> 少个 <code>+1</code>（\"原第 K 匹\"全体差一位）、</li>\n</ol>\n<p>出马行两侧位次对调、窗口行慢/快写反，<strong>三种改法都不影响答案</strong>， 于是只找 <code><strong>*</code> 的检测器一条都抓不到。修法：新增 <code>detailed_print_violations()</code>，</strong>从输出文本反查输入<strong>（印着\"田忌 3（原第 2 匹）\"， 就要求输入数组第 2 个元素真是 3；印着窗口「慢 3 / 快 7」，就要求 3 与 7 真是 窗口中那几匹马的最小/最大值）。</strong>教训与陷阱 37 同族：六条自校只管\"账目\"与\"最优性\"， 它们照不到\"印出来的东西是不是真的\"。**</p>\n<ol>\n<li><strong>我新写的断言自己成了死代码</strong>（本轮最有趣的一条）—— 记录表那段写成了</li>\n</ol>\n<p><code>if (ok(r !== undefined, ...)) { ...真正的比对... }</code>，可 <code>ok()</code> 这个 helper <strong>不返回布尔值</strong>（返回 <code>undefined</code>），于是 <code>if</code> 恒为假，<strong>整块记录表断言从来没执行过</strong>。 症状：三条\"只改记录表内容\"的变异<strong>照样漏网</strong>，而脚本还在一本正经地报\"缺少这一行\"。 修法：改成两行写清楚（先 <code>ok(...)</code>，再 <code>if (r !== undefined)</code>）， 并让 <code>ok()</code> 返回布尔以防再犯。<strong>这个坑是变异测试 + 审计夹击才暴露的</strong> —— 它说明\"补了断言\"和\"断言真的在跑\"是两件不同的事。</p>\n<p><strong>一处措辞与两处数字（审计核对出来的）</strong></p>\n<ol>\n<li>文档里\"排除给定 T 组\"的依据写成\"第一行后面跟的是 3 个数字\"，偏感觉；</li>\n</ol>\n<p>真正的硬依据是<strong>行数与 token 数对不上</strong>（按 T=3 需要 10 行，样例只有 9 行）。已改写。</p>\n<ol>\n<li>文档的\"耗时 14.3 秒\"与\"斜率 3.96\"是<strong>幸运低尾的单次样本</strong>（审计同机实测 10.8~11.8 秒、</li>\n</ol>\n<p>斜率 3.22~8.15）。已改成区间与中位数。</p>\n<hr>\n<h2 id=\"sec-28\">十三、已知未覆盖（诚实声明）</h2>\n<ol>\n<li><strong>C 版从未编译</strong>（<strong>已按项目口径降级为可选项，不影响交付</strong>）——</li>\n</ol>\n<p>本机没有任何 C 编译器。<code>verify_horse_race_c_mirror.py</code> 只覆盖算法与读入分支的结构， <strong>不覆盖</strong> C 的语法、类型、平台差异，也不证明能过 OJ。</p>\n<ol>\n<li><strong>判题格式的最后一环仍是推断</strong> —— 样例与 EOF 结束吻合，<code>n=0</code> 也兼容了，</li>\n</ol>\n<p>但<strong>没有一份\"确实 AC 过的 C/C++ 代码\"可以反推</strong>（本仓库的均分纸牌就是这么拿到参考实现的）。 若 OJ 实际用的是别的形态（例如真的给定 T 组），提交前需再确认。</p>\n<ol>\n<li><strong>动画的自定义输入限 10 匹以内</strong> —— 是<strong>有意</strong>的（再多就看不清了），不是能力上限；</li>\n</ol>\n<p>提交版与详细版对 <code>n = 100</code> 都验证过。</p>\n<ol>\n<li><strong>动画的数值限 ±10^9</strong> —— JS 的 <code>number</code> 只能精确表示到 2^53，</li>\n</ol>\n<p>再大 <code>parseInt</code> 就开始失真，动画算出来的数跟题目语义就不是一回事了。</p>\n<ol>\n<li><strong><code>scipy</code> 是可选的</strong> —— 没装 scipy 时，主验收脚本会在中大规模退化成\"只用结构性质与</li>\n</ol>\n<p>小规模全排列\"，并在输出里打出 <code>NOTE</code> 说明跳过了什么，<strong>不会假装全绿</strong>。</p>\n<ol>\n<li><strong>C 版镜像的\"关键片段核对\"是很弱的</strong>（详见 §九 末）—— 它只在\"整段被删/大改\"时响，</li>\n</ol>\n<p>改 <code>cmp_int</code>、改 <code>MAXN</code>、把 <code>bHi--</code> 写成 <code>bHi++</code> 这类单行语义改动<strong>一条都发现不了</strong>。 且 <code>py_main()</code> 是手抄的，读入层那部分验的是<strong>镜像 vs 镜像</strong>。 （本项目已定 C 不参与验收，故不再加码。）</p>\n<ol>\n<li><strong>\"画面文字与解说正文\"的断言仍然只能覆盖到\"关键结论句\"这一层</strong> ——</li>\n</ol>\n<p>本轮的 11 条变异是审计<strong>手工设计</strong>的，断言是按它们补齐的； 若换一种改法（比如把解说里某个从句删掉而不动结论句），现有断言仍可能抓不到。 根本原因在于\"自然语言正文\"没有可机检的语义，只能靠\"关键短语还在不在\"来守。</p>\n<ol>\n<li><strong>动画的渲染层（CSS / 布局）只能靠 Chrome 实拍肉眼核</strong> —— node + DOM stub 测不到</li>\n</ol>\n<p>布局、颜色计算、层叠。本轮已用 <code>getComputedStyle</code> 探针核过状态色的<strong>计算值</strong>， 也实拍过 6 张（含 n=6 自定义输入、全平局面），但\"好不好看\"这类判断无法自动化。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、判题格式：怎么从样例反推出来的（不是从题面猜的）",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "三、算法：排序 + 四指针贪心",
    "lvl": 2
   },
   {
    "id": "sec-4",
    "text": "为什么每一支都安全（交换论证）",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "四、样例手推",
    "lvl": 2
   },
   {
    "id": "sec-6",
    "text": "第 1 组：田忌 3 5 7，齐王 4 6 8 → 输出 100",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "第 2 组：田忌 1 2 7 8，齐王 3 4 5 6 → 输出 0",
    "lvl": 3
   },
   {
    "id": "sec-8",
    "text": "第 3 组：田忌 1 2，齐王 3 4 → 输出 -200",
    "lvl": 3
   },
   {
    "id": "sec-9",
    "text": "五、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "本题最典型的四种错法（都被锚定用例钉死）",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-13",
    "text": "八、参考测试用例（含锚定）",
    "lvl": 2
   },
   {
    "id": "sec-14",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-15",
    "text": "主验收（verify_horse_race.py，本机约 12~26 秒）",
    "lvl": 3
   },
   {
    "id": "sec-16",
    "text": "动画（verify_horse_race_animation.js）",
    "lvl": 3
   },
   {
    "id": "sec-17",
    "text": "变异测试（verify_horse_race_mutations.py）—— 45/45 全部被抓住",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "C 版（verify_horse_race_c_mirror.py）—— 可选项，不参与验收",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "十、C 版本说明（可选项 —— 本项目已定\"全部用 Python 实现\"，C 不参与验收）",
    "lvl": 2
   },
   {
    "id": "sec-20",
    "text": "十一、如何复跑验证",
    "lvl": 2
   },
   {
    "id": "sec-21",
    "text": "渲染层实拍（node 测不到 CSS / 布局）",
    "lvl": 3
   },
   {
    "id": "sec-22",
    "text": "十二、本轮靠验证抓出的问题（都是\"看着像对\"的错）",
    "lvl": 2
   },
   {
    "id": "sec-23",
    "text": "0. ★ 用户当场抓到的一个真 bug（最值得记的一条）",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "验证脚本自己的错",
    "lvl": 3
   },
   {
    "id": "sec-25",
    "text": "动画的真错",
    "lvl": 3
   },
   {
    "id": "sec-26",
    "text": "一处设计决策",
    "lvl": 3
   },
   {
    "id": "sec-27",
    "text": "独立审计（另一个 subagent）抓出的问题 —— 已全部修掉",
    "lvl": 3
   },
   {
    "id": "sec-28",
    "text": "十三、已知未覆盖（诚实声明）",
    "lvl": 2
   }
  ],
  "files": [
   "horse_race.py",
   "horse_race_detailed.py",
   "horse_race.c",
   "verify_horse_race.py",
   "verify_horse_race_c_mirror.py",
   "verify_horse_race_mutations.py"
  ],
  "concepts": [
   "eof",
   "out-of-range",
   "reader",
   "swap-match",
   "tail-newline"
  ],
  "prev": "interval-cover",
  "next": "tickets",
  "related": [
   "cards",
   "interval-cover",
   "merge-fruit"
  ]
 },
 {
  "slug": "tickets",
  "dir": "足球赛票",
  "title": "足球赛票",
  "cat": "组合数学 · Catalan",
  "catId": "combinatorics",
  "cx": "O(n) 预处理 + O(1) 查询",
  "fmt": "多组 · EOF 结束",
  "summary": "n 人持 50 元 + n 人持 100 元排队买 50 元票，求「找零永不失败」的排队方式数 % 100007（第 n 个卡特兰数，模数是合数）。",
  "docName": "足球赛票详解.md",
  "doc": "<h1>足球赛票（排队找零方式数）详解</h1>\n<blockquote>题目：每张球票 50 元。2n 个人排队，其中 n 人手持 50 元、n 人手持 100 元， 售票处<strong>一开始没有零钱</strong>。求使「永远找得开」的排队方式数，对 <strong>100007</strong> 取模。 输入每行一个 n（1 ≤ n ≤ 1000），输出每个 n 的答案。样例 <code>3 / 4</code> → <code>5 / 14</code>。 提示：采用秦九韶算法的思想。</blockquote>\n<hr>\n<h2 id=\"sec-1\">一、题意</h2>\n<p>把 2n 个人按<strong>手持面额</strong>排成一个长度为 2n 的序列，每项是「50」或「100」。 售票过程：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>遇到的人</th><th>发生什么</th></tr></thead><tbody><tr><td>手持 50 元</td><td>付正好的钱，不用找 → 零钱箱里的 <strong>50 元张数 +1</strong></td></tr><tr><td>手持 100 元</td><td>要找回 50 元 → 零钱箱里的 <strong>50 元张数 −1</strong>，且<strong>原本必须至少有一张</strong></td></tr></tbody></table></div>\n<p>要求：整个过程零钱箱的 50 元张数<strong>始终 ≥ 0</strong>。求这样的序列有多少条，对 100007 取模。</p>\n<p><strong>数的是「50/100 的类型序列」，不是「互不相同的 2n 个人」。</strong> 这一点由样例钉死：n = 3 时如果把人当个体算，答案会是 <code>5 × 3! × 3! = 180</code>，而题面给的是 <strong>5</strong>。</p>\n<hr>\n<h2 id=\"sec-2\">二、算法：卡特兰数</h2>\n<h3 id=\"sec-3\">2.1 为什么是卡特兰数</h3>\n<p>两种等价看法，随便挑一种理解：</p>\n<p><strong>看法一（括号匹配）</strong>：把「50 元」记作左括号、「100 元」记作右括号。 约束「任意前缀里 50 元的人不少于 100 元的人」正是「任意前缀里左括号不少于右括号」—— 合法括号序列数 = 第 n 个卡特兰数。</p>\n<p><strong>看法二（格路 / Dyck 路径）</strong>：从 (0,0) 走到 (n,n)，每步向右或向上。</p>\n<ul>\n<li>来一个 50 元的人 → 向右走一格（横坐标 = 已收 50 元的人数）</li>\n<li>来一个 100 元的人 → 向上走一格（纵坐标 = 已收 100 元的人数）</li>\n</ul>\n<p>零钱箱里的张数就是 <code>x − y</code>，约束 <code>x ≥ y</code> 正好是「路径不许越过对角线 y = x」。 这样的路径数同样是 <code>Cat(n)</code>。动画里的那张格子图画的就这个。</p>\n<p>两种看法给出的答案是同一个数：</p>\n<pre class=\"code\"><code>Cat(0) = 1\nCat(n) = C(2n, n) / (n+1)                      ← 组合数公式\nCat(k) = Cat(k-1) * (4k - 2) / (k + 1)         ← 整数递推（从 Cat(0)=1 起）</code></pre>\n<h3 id=\"sec-4\">2.2 ★ 本题真正的难点：模数是<a class=\"kw\" href=\"#/k/composite-mod\" title=\"概念：composite-mod\">合数</a></h3>\n<p>题面提示「采用<strong>秦九韶算法的思想</strong>」—— 意思就是<strong>顺着递推一路推下去</strong> （<code>Cat(k)</code> 由 <code>Cat(k-1)</code> 得到），而不是去算 <code>C(2n,n)</code> 那种大组合数。</p>\n<p>这条提示在本题里格外重要，因为：</p>\n<blockquote><strong>100007 = 97 × 1031 是合数。</strong></blockquote>\n<p>于是组合数公式里那个 <code>/ (n+1)</code> <strong>不能</strong>改写成「乘 (n+1) 的模逆元再取模」—— 模逆元只在 <code>gcd(n+1, 100007) = 1</code> 时才存在。而</p>\n<pre class=\"code\"><code>n + 1 与 100007 不互素的 n ∈ {96, 193, 290, 387, 484, 581, 678, 775, 872, 969}</code></pre>\n<p>共 <strong>10 个</strong>（都是 <code>n + 1</code> 为 97 的倍数）。在 n = 96 处， <code>pow(97, -1, 100007)</code> 直接抛 <code>ValueError</code>；换个写法还可能悄悄算出一个错值，更难查。</p>\n<p><strong>正解</strong>：先让除法在<strong>精确整数</strong>里做完，最后一步才取模。</p>\n<pre class=\"code python\"><code>cat = [1]\nfor k in range(1, limit + 1):\n    cat.append(cat[k - 1] * (4 * k - 2) // (k + 1))   # 全程不取模\n# 输出时才 cat[n] % MOD</code></pre>\n<p>这会不会把数字撑爆？不会：<code>Cat(1000)</code> 只有 <strong>598 位十进制</strong>， 远低于 Python 3.11+ 那个 <a class=\"kw\" href=\"#/k/no-bigint\" title=\"概念：no-bigint\">4300 位</a>的 <code>int</code> ↔ <code>str</code> 转换限制， 1000 步递推总共也就几毫秒。</p>\n<blockquote>对照本仓库的 <code>车厢调度</code>：<strong>同一族题</strong>（栈的输出序列数也是卡特兰数）， 但那题 n ≤ 18 且<strong>不取模</strong>，直接输出精确值 —— 所以它的写法照抄过来是错的。 「同族题不等于同题」，这是本仓库反复吃过亏的一条。</blockquote>\n<h3 id=\"sec-5\">2.3 三条可行算法</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>算法</th><th>做法</th><th>特点</th></tr></thead><tbody><tr><td><strong>精确递推</strong>（提交版采用）</td><td><code>Cat(k) = Cat(k-1) * (4k-2) // (k+1)</code>，全程大整数，最后取模</td><td>O(n)、几毫秒、<strong>不受模数是否素数影响</strong></td></tr><tr><td><strong>纯加法 DP</strong></td><td><code>f[i][j] = f[i-1][j] + f[i][j-1]</code>（要求 <code>j ≤ i</code>），全程 <code>mod</code></td><td>O(n²)，<strong>只有加法</strong>，对合数模数天然成立（详细版用来交叉验证）</td></tr><tr><td><strong>组合数公式</strong></td><td><code>C(2n,n) // (n+1)</code>，先精确除再取模</td><td>需要大整数阶乘，<strong>不能</strong>改成乘逆元</td></tr></tbody></table></div>\n<p><code>f[i][j]</code> 的含义：已排 i 个 50 元的人、j 个 100 元的人，且每一步都没找不开的方案数。 <code>j ≤ i</code> 就是「零钱箱不为负」。答案 <code>f[n][n]</code>。</p>\n<h3 id=\"sec-6\">2.4 举几个值</h3>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>12</th></tr></thead><tbody><tr><td>Cat(n)</td><td>1</td><td>2</td><td>5</td><td>14</td><td>42</td><td>132</td><td>429</td><td>1430</td><td>208012</td></tr><tr><td>% 100007</td><td>1</td><td>2</td><td>5</td><td>14</td><td>42</td><td>132</td><td>429</td><td>1430</td><td><strong>7998</strong></td></tr></tbody></table></div>\n<p>取模从 n = 12 开始起作用。再往后：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>n</th><th>96</th><th>100</th><th>500</th><th>999</th><th>1000</th></tr></thead><tbody><tr><td>Cat(n) % 100007</td><td><strong>62370</strong></td><td>64321</td><td>57970</td><td>2062</td><td><strong>17527</strong></td></tr></tbody></table></div>\n<p><code>n = 96</code> 那一格就是上面说的「逆元不存在」的第一例，是本题的<strong>头号锚定用例</strong>。</p>\n<hr>\n<h2 id=\"sec-7\">三、样例演示（n = 3）</h2>\n<p>合法序列共 5 条（<code>5 = Cat(3)</code>，即动画里禁区外那 5 条格路）：</p>\n<pre class=\"code\"><code>50 50 50 100 100 100\n50 50 100 50 100 100\n50 50 100 100 50 100\n50 100 50 50 100 100\n50 100 50 100 50 100</code></pre>\n<p>拿第一条走一遍（零钱箱 = 括号里那个数）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>第几位</th><th>面额</th><th>零钱箱</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td>50</td><td>1</td><td>付正好</td></tr><tr><td>2</td><td>50</td><td>2</td><td></td></tr><tr><td>3</td><td>50</td><td>3</td><td></td></tr><tr><td>4</td><td>100</td><td>2</td><td>找回一张</td></tr><tr><td>5</td><td>100</td><td>1</td><td></td></tr><tr><td>6</td><td>100</td><td>0</td><td>走完恰好为 0</td></tr></tbody></table></div>\n<p><strong>反例</strong>：<code>100 50 50 100 100 50</code> —— 第 1 位就是 100 元，零钱箱是空的，<strong>找不开</strong>， 这条不合法。动画里点「随机试一队」就是在演示这种情形。</p>\n<hr>\n<h2 id=\"sec-8\">四、复杂度</h2>\n<div class=\"tablewrap\"><table><thead><tr><th></th><th>时间</th><th>空间</th></tr></thead><tbody><tr><td>预处理（算 0..1000 的精确递推表）</td><td>O(n)，n = 1000 时约几毫秒</td><td>O(n) 个大整数，最大 598 位</td></tr><tr><td>每个查询</td><td>O(1) 查表 + O(1) 取模</td><td>—</td></tr></tbody></table></div>\n<blockquote>预处理一次、多组查表 —— 因为本题是「读到 <a class=\"kw\" href=\"#/k/eof\" title=\"概念：eof\">EOF</a> 结束」的多组输入， 而且终端里用户要<strong>敲一组看一组</strong>，所以必须在读输入之前就把表备好。</blockquote>\n<hr>\n<h2 id=\"sec-9\">五、详细版输出什么（<code>tickets_detailed.py</code>）</h2>\n<p>每组 n 依次打印：</p>\n<ol>\n<li><strong>暴力枚举</strong> —— 枚举所有 50/100 序列、逐条模拟零钱箱（<strong>直接翻译题面</strong>，</li>\n</ol>\n<p>不依赖任何卡特兰数知识）。n ≤ 10 时执行；n ≤ 4 时连序列一起列出来。</p>\n<ol>\n<li><strong>动态规划</strong> —— <code>f[i][j]</code> 的纯加法转移；n ≤ 10 时打印整张表（<code>j &gt; i</code> 的格子标 <code>--</code>）。</li>\n<li><strong>精确递推</strong> —— <code>Cat(k) = Cat(k-1) * (4k-2) // (k+1)</code>，打印 <code>Cat(n)</code> 的精确值</li>\n</ol>\n<p>（太大时给首尾 + 位数）以及 <code>Cat(n) % 100007</code>。</p>\n<ol>\n<li><strong>组合数公式</strong> —— <code>C(2n,n) // (n+1)</code>。</li>\n<li><strong>Sum check</strong> —— 四法在 <code>mod 100007</code> 下必须一致，否则往 <strong>stderr</strong> 报 <code>MISMATCH</code>。</li>\n</ol>\n<p>文件末尾再按 OJ 标准格式输出一遍纯答案，方便和 <code>tickets.py</code> 逐字比对。</p>\n<p><strong>大整数打印的讲究</strong>：<code>short_num()</code> 先用 <code>bit_length()</code> 估算位数， 超过 4000 位就不转字符串了。原因是 Python 3.11+ 禁止 <code>int</code> ↔ <code>str</code> 转换超过 4300 位， 一旦超了 <code>str()</code> 当场抛异常 —— <strong>连\"我想截断\"的机会都没有</strong>。 所以判断\"能不能转\"这件事本身必须用算术来做，不能靠 <code>str()</code>。</p>\n<hr>\n<h2 id=\"sec-10\">六、边界与陷阱</h2>\n<h3 id=\"sec-11\">1. ★ 判题格式是「多组读到 EOF」，不是「第 1 行 T」，也不是哨兵</h3>\n<p>题面写「输入的每行上有一个非负整数 n」，样例给了两行 <code>3</code>、<code>4</code>，输出两行 <code>5</code>、<code>14</code>：</p>\n<ul>\n<li>不是单组（样例就有两组）</li>\n<li>不是「第 1 行 T」（样例第一行 <code>3</code> 后面跟的是 <code>4</code>，按 T 组读会错位）</li>\n<li>题面没提任何哨兵，所以就是<strong>读到 EOF 结束</strong></li>\n</ul>\n<p>本仓库四种形态都出现过（EOF / N=0 哨兵 / 第 1 行 T 组 / 图与图之间空一行）， <strong>逐题从题面和样例确认，别拿上一题的习惯套这一题</strong>（<code>车厢调度</code> 也是 EOF， 但 <code>n个1</code> 和 <code>LCS</code> 是 T 组 —— 靠名字猜必错）。</p>\n<h3 id=\"sec-12\">2. ★ n = 0 的取舍：题面自己前后矛盾</h3>\n<p>题面输入段写「每行有一个<strong>非负</strong>整数 n」，紧接着括号里又写 <code>(1&lt;=n&lt;=1000)</code>。 两者对 n = 0 的说法相反。</p>\n<p><strong>本题按 <code>1 ≤ n ≤ 1000</code> 处理</strong>：n = 0 或<a class=\"kw\" href=\"#/k/out-of-range\" title=\"概念：out-of-range\">越界</a>一律往 stderr 报 <code>[!]</code> 并中止， stdout 不留多余行。理由：</p>\n<ul>\n<li>括号里的区间是明确给出的判定条件，「非负」是行文松散；</li>\n<li>越界宁可中止也不错答（铁律 6）—— 若 <code>continue</code> 掉，后面的数字会被当成下一个 n，</li>\n</ul>\n<p>把伪答案打进 stdout；</p>\n<ul>\n<li>万一那个 <code>0</code> 其实是「输入结束哨兵」，中止同样是对的：stdout 不会多出任何一行。</li>\n</ul>\n<p><strong>风险提示</strong>：如果 OJ 真的把 n = 0 当数据、且期望 <code>Cat(0) = 1</code>，这里会判错。 这一点无法从题面 conclusively 判定，已在文档里写明取舍。 （同类取舍见 <code>连通分支数</code>：那题的 <code>n=0</code> 二义性选了「当结束」，也写进了 stderr 提示。）</p>\n<h3 id=\"sec-13\">3. ★ 模数是合数，除法不能换逆元</h3>\n<p>见 2.2 节。<code>n = 96</code> 是第一处会崩的地方，锚定用例就在那里。 <strong>这类\"看着能算其实不能算\"的错法最难查</strong>：它在绝大多数 n 上都给出正确答案， 只在 10 个特定的 n 上突然错或崩。</p>\n<h3 id=\"sec-14\">4. ★ 别把 2n 个人当互不相同的个体</h3>\n<p>n = 3 时这样算会得 180，而答案是 5。样例直接钉死了这一点。</p>\n<h3 id=\"sec-15\">5. 越界 n 宁可中止也不错答</h3>\n<pre class=\"code python\"><code>if n &lt; 1 or n &gt; MAXN:\n    print(\"[!] n out of range [1, 1000]: \" + str(n), file=sys.stderr)\n    return</code></pre>\n<h3 id=\"sec-16\">6. ★ 超长数字串必须在 <code>int()</code> 之前拦长度</h3>\n<pre class=\"code python\"><code>if len(tok) &gt; 9:\n    print(\"[!] n is far out of range ...\", file=sys.stderr)\n    return</code></pre>\n<p>Python 3.11+ 对超过 4300 位的数字串转 <code>int</code> 会<strong>直接抛 <code>ValueError</code></strong>（traceback）， 而不是我们要的 <code>[!]</code> 报错（铁律 3）。必须在 <code>int()</code> 之前先拦。</p>\n<h3 id=\"sec-17\">7. ★ 输出必须「敲一组、出一组」，别攒到最后</h3>\n<p>本题是 EOF 结束的格式。如果把答案攒到读完再一起打，那么在终端 / PyCharm 里 只要不按 <code>Ctrl+Z</code>（Windows）/ <code>Ctrl+D</code>（Linux），就<strong>一个答案都看不到</strong> —— 那正是「输入了却没有任何输出」的由来。所以逐组 <code>print</code> + <code>flush</code>。</p>\n<blockquote>对照：<code>n个1</code> 是 T 组题，读完 T 组自动结束，那种格式<strong>才</strong>适合攒起来统一输出。</blockquote>\n<h3 id=\"sec-18\">8. EOF 类题目在终端里要显式结束输入</h3>\n<p>即使逐组输出，程序仍要等到 EOF 才退出。终端里敲完数据请按 <code>Ctrl+Z</code> 再回车（Windows） / <code>Ctrl+D</code>（Linux），或者干脆用管道：<code>python tickets.py &lt; input.txt</code>。</p>\n<h3 id=\"sec-19\">9. <a class=\"kw\" href=\"#/k/reader\" title=\"概念：reader\">读取器</a>取 token 必须 <code>reversed()</code> + <code>pop()</code></h3>\n<pre class=\"code python\"><code>buf.extend(reversed(line.split()))   # 反序入栈\nreturn buf.pop()                     # O(1)</code></pre>\n<p>写成 <code>buf.extend(line.split())</code> + <code>buf.pop(0)</code> 会让每次取队首 memmove 整个列表， 一行里塞很多 token 时退化成 O(k²)（历史陷阱 25：10 万 token 挤一行，28.8 秒 vs 0.147 秒）。</p>\n<hr>\n<h2 id=\"sec-20\">七、文件清单</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>文件</th><th>用途</th></tr></thead><tbody><tr><td><code>tickets.py</code></td><td><strong>OJ 提交版</strong>，stdout 只输出答案</td></tr><tr><td><code>tickets_detailed.py</code></td><td>详细版（四法推导 + Sum check），<strong>仅供本地学习</strong></td></tr><tr><td><code>tickets_animation.html</code></td><td>浏览器动画，支持自定义输入（可一次填多个 n）</td></tr><tr><td><code>verify_tickets.py</code></td><td>主验证：暴力对拍 + 三路独立算法 + 端到端 + 合数模专项 + 读取器斜率</td></tr><tr><td><code>verify_tickets_animation.js</code></td><td>动画验证：node 抽 <code>&lt;script&gt;</code> + DOM stub 实跑</td></tr><tr><td><code>verify_tickets_mutations.py</code></td><td>变异测试：30 个变异，要求 30/30 被抓</td></tr><tr><td><code>足球赛票详解.md</code></td><td>本文档</td></tr></tbody></table></div>\n<p>依据项目新口径（<strong>一切以 Python 为准</strong>），本题<strong>不提供 C 版</strong>： 本机没有任何 C 编译器，写出来只是「逻辑未编译验证」的文本，投入产出比低。</p>\n<hr>\n<h2 id=\"sec-21\">八、参考测试用例</h2>\n<div class=\"tablewrap\"><table><thead><tr><th>输入</th><th>期望输出</th><th>说明</th></tr></thead><tbody><tr><td><code>3\\n4\\n</code></td><td><code>5\\n14</code></td><td>题面样例</td></tr><tr><td><code>1\\n</code></td><td><code>1</code></td><td>最小规模</td></tr><tr><td><code>2\\n</code></td><td><code>2</code></td><td>—</td></tr><tr><td><code>5\\n</code></td><td><code>42</code></td><td>—</td></tr><tr><td><code>8\\n</code></td><td><code>1430</code></td><td>—</td></tr><tr><td><code>12\\n</code></td><td><code>7998</code></td><td>Cat(12)=208012 首次超过模数</td></tr><tr><td><code>96\\n</code></td><td><code>62370</code></td><td>★ 头号锚定：逆元不存在的第一例</td></tr><tr><td><code>1000\\n</code></td><td><code>17527</code></td><td>题面最大 n</td></tr><tr><td><code>1 2 3\\n</code></td><td><code>1\\n2\\n5</code></td><td>一行多个 n（宽容解析）</td></tr><tr><td><code>\\n\\n3\\n\\n\\n4\\n\\n</code></td><td><code>5\\n14</code></td><td>多余空行</td></tr><tr><td><code>3\\r\\n4\\r\\n</code></td><td><code>5\\n14</code></td><td>CRLF <a class=\"kw\" href=\"#/k/tail-newline\" title=\"概念：tail-newline\">行尾</a></td></tr><tr><td><code>3\\n4</code></td><td><code>5\\n14</code></td><td>没有末尾换行</td></tr><tr><td><code>abc\\n</code></td><td>（stdout 空）</td><td>非法输入 → stderr <code>[!]</code></td></tr><tr><td><code>0\\n</code></td><td>（stdout 空）</td><td>越界 → stderr <code>[!]</code></td></tr><tr><td><code>1001\\n</code></td><td>（stdout 空）</td><td>越界 → stderr <code>[!]</code></td></tr><tr><td><code>9…9</code>（5000 位）</td><td>（stdout 空）</td><td>防 <code>int()</code> 抛 ValueError，→ stderr <code>[!]</code></td></tr></tbody></table></div>\n<p><strong>钉死典型错法的锚定用例</strong>（每一条都对应一种真实错法）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>用例</th><th>期望</th><th>打掉的错法</th></tr></thead><tbody><tr><td><code>3</code> → <code>5</code></td><td>5</td><td><strong>不除 (n+1)</strong>（当成 C(2n,n)）会得 20；<strong>区分个体</strong>会得 180</td></tr><tr><td><code>1</code> → <code>1</code></td><td>1</td><td>把「100 元在前」也算进去的错法会得 2</td></tr><tr><td><code>96</code> → <code>62370</code></td><td>62370</td><td><strong>乘逆元取模</strong>的错法在这里直接崩（<code>pow(97,-1,100007)</code> 抛异常）</td></tr><tr><td><code>12</code> → <code>7998</code></td><td>7998</td><td><strong>忘了取模</strong>会输出 208012</td></tr><tr><td><code>1000</code> → <code>17527</code></td><td>17527</td><td>忘了取模 / 上界照抄成 18（车厢调度）都会露馅</td></tr></tbody></table></div>\n<hr>\n<h2 id=\"sec-22\">九、正确性验证</h2>\n<h3 id=\"sec-23\">9.1 <code>python verify_tickets.py</code></h3>\n<pre class=\"code\"><code>OK: anchors 40 | 暴力(题面枚举) 10 | 全表对照 1..1000 三路一致 | 详细版四法 60 |\n    详细版端到端 1 | Sum check 有牙齿(改错必须喊) | 合数模专项 15 | stdout clean 25 |\n    逐组输出 ok | many-cases 4000 | 提交版 一行/多行 = 0.42 (线性约 0.5) |\n    pop(0) 坏变体 = 25.91 (应为十位数) | 阈值 2 | AST clean (2 files)</code></pre>\n<p>（耗时/比值是<strong>示例值</strong>，随机器浮动；断言阈值是 <code>一行/多行 &lt; 2</code>。约 4 秒跑完。）</p>\n<p>覆盖内容：</p>\n<ol>\n<li><strong>锚定 40 条</strong>，每条再用两条独立真值复核</li>\n<li><strong>暴力法</strong>：直接从题面出发枚举所有 50/100 序列（n ≤ 10），</li>\n</ol>\n<p><strong>不依赖任何卡特兰数公式</strong> —— 这是最硬的一条</p>\n<ol>\n<li><strong>全表对照</strong>：n = 1..1000，提交版 vs 纯加法 DP vs 组合数公式，<strong>三条独立路径</strong>全一致</li>\n<li><strong>合数模专项</strong>：验证 <code>100007 = 97 × 1031</code>、那 10 个逆元不存在的 n 确实让逆元法走不通、</li>\n</ol>\n<p>而正解在这 10 个 n 上仍然正确；并反向确认逆元法在 <code>gcd = 1</code> 的 n 上<strong>是</strong>对的 （说明错法是「多数对、少数突然错」，所以更难查）</p>\n<ol>\n<li><strong>端到端</strong>：真起子进程跑 <code>tickets.py</code>，25 个用例，正常情形断言 <strong>stderr 为空</strong></li>\n<li><strong>逐组输出语义</strong>：喂一组看一组 → 关 stdin 后立刻退出，答案不多不少</li>\n<li><strong>大批量</strong>：4000 组，行数与内容全对</li>\n<li><strong>读取器排版检查</strong>：<strong>同样多的 token，铺成一行 vs 铺成多行</strong>，耗时之比。</li>\n</ol>\n<p>线性读取器实测 0.307~0.517（多行还要多付 N 次 <code>readline</code> 调用，所以比值 &lt; 1）； <code>pop(0)</code> 坏变体 13.74~52.33（一行时是 O(k²)，多行时每行缓冲只有 10 个 token、近乎 O(1)）。 阈值 2.0，两侧余量 3.9 倍 / 6.9 倍。同时跑坏变体做<strong>反向自检</strong>，它必须超标</p>\n<ol>\n<li><strong>Sum check 有牙齿</strong>：把详细版的 DP 故意改错（去掉取模），</li>\n</ol>\n<p>详细版<strong>自己的</strong> Sum check 必须往 stderr 报 <code>MISMATCH</code> —— 专门证明那条自校不是装饰品</p>\n<ol>\n<li><strong>打印层反查</strong>：把详细版<strong>打印出来的</strong> DP 表解析回来，与 <code>dp_count</code> 的返回值逐格比对；</li>\n</ol>\n<p>把 <code>[1]</code> 里列出的每条序列喂回\"合法性检查器\"（长度、张数、零钱箱不为负）。 —— 光验内部返回值不够：打印时把 <code>table[i][j]</code> 写成 <code>table[j][i]</code>（整张表转置） 内部值一样是对的，<strong>只有把输出解析回来才抓得到</strong></p>\n<ol>\n<li><strong>AST 语法检查</strong>：扫禁用语法（<strong>不用 grep</strong>：<code>readline</code> 含 <code>read</code> 子串会误报）</li>\n</ol>\n<h3 id=\"sec-24\">9.2 <code>node verify_tickets_animation.js</code></h3>\n<pre class=\"code\"><code>OK: 语法+引号卫生 clean | 答案与独立 BigInt DP/枚举对拍(锚定 10 条 + n&lt;=6 枚举 + n&lt;=120 DP) |\n    合法队恒成立 | 随机队与模拟不变式 | 同 seed 复现 |\n    渲染结构(chip 2n/格子 (n+1)^2/禁区精确) | 图文同步(高亮==cursor-1, 步号==cursor) |\n    解说正文非空 | CSS 双向互查 | 自定义输入 10 例 | 底色+自包含</code></pre>\n<p>重点几条：</p>\n<ul>\n<li><strong>DOM stub 的 <code>innerHTML</code> 会剥标签保留正文</strong>，所以「解说正文」真的被断言到</li>\n</ul>\n<p>（历史陷阱 37：stub 把 <code>innerHTML</code> 吞掉的话，正文写什么都测不出来）</p>\n<ul>\n<li><strong>禁区位置逐格核</strong>：只数禁区格点数是不够的 —— 方阵里 <code>j&gt;i</code> 与 <code>j&lt;i</code> 的格点数</li>\n</ul>\n<p><strong>天然相等</strong>，把判断写反了照样能过总数断言（这条是变异测试 A11 抓出来的）</p>\n<ul>\n<li><strong>底色只核 <code>body</code> 规则本身</strong>：<code>#0f0820</code> 在按钮文字、高亮格文字里也有，</li>\n</ul>\n<p>用 <code>html.indexOf('#0f0820')</code> 全文搜的话，把 body 底色改掉照样命中（变异 A14 抓出来的）</p>\n<ul>\n<li><strong>极端 RNG 钉死生成器契约</strong>：用「永远首选 100 元」这种随机流，</li>\n</ul>\n<p>确定性地验证合法队生成器在任何随机流下都不会产出找不开的队</p>\n<ul>\n<li><strong>用户看得见的文字逐条断言</strong>：答案条正文、右下角大数字、队伍牌子的文字、</li>\n</ul>\n<p>三个统计框、解说正文的分支关键词（50 元必须说「多出」、找不开必须说「找不开」）、 以及「Cat(n) 种」用的是<strong>精确值</strong>而非取模值（n=12 时 208012 vs 7998，一眼可辨）</p>\n<ul>\n<li><strong>路径图核集合而非个数</strong>：<code>on</code> 格点集合必须<strong>等于</strong>真实路径</li>\n</ul>\n<p>（<code><span class=\"ref\">0,0</span> ∪ steps 的 (n50,n100)</code>），且「当前格」必须落在其中 —— 把下标写成 <code>(j,i)</code>（镜像）时格子个数与禁区位置全都不变，只有集合比对抓得到</p>\n<ul>\n<li><strong>图例色块 ↔ 真实状态色一致</strong>：<code>.lg-on/.lg-cur/.lg-bad</code> 的底色必须与</li>\n</ul>\n<p><code>.cell.on/.cell.cur/.cell.bad</code> 逐一对上（否则图例开始骗人）</p>\n<ul>\n<li><strong>告警色必须真的不同</strong>：<code>.cb-val.neg</code> 的颜色必须与 <code>.cb-val</code> 不同 ——</li>\n</ul>\n<p>只断言 className 里有 <code>neg</code> 是不够的，把颜色改成一样的绿照样能过</p>\n<h3 id=\"sec-25\">9.3 <code>python verify_tickets_mutations.py</code></h3>\n<pre class=\"code\"><code>OK: 变异捕获率 39/39（提交版+详细版 17/17，动画 22/22）；还原后验证脚本均仍全绿（约 60 秒）</code></pre>\n<p>开跑前有一道<strong>闸</strong>：先逐条核每个变异的锚点是否恰好命中 1 次；不满足就直接停下报 「文件不是原貌 / 锚点不再唯一」。加这道闸是因为真踩过 —— 上一次变异跑完把 <code>tickets_detailed.py</code> 留在了变异态，下一次跑立刻冒出两个<strong>看着毫不相干</strong>的症状 （主验证报「详细版组合数错」、变异脚本报「某锚点命中 0 次」），很容易误诊成算法坏了。 <strong>在脏树上跑，得到的是噪声而不是结论。</strong></p>\n<p>变异清单（每条都真的能打掉至少一条断言）：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>编号</th><th>变异</th><th>打掉它的断言</th></tr></thead><tbody><tr><td>P1</td><td>去掉取模</td><td>端到端 n=1000 / 锚定 n=12</td></tr><tr><td>P2</td><td>系数 <code>(4k-2) → (4k-6)</code></td><td>锚定 n=1</td></tr><tr><td>P3</td><td>除数 <code>(k+1) → k</code></td><td>锚定 n=1</td></tr><tr><td>P4</td><td>组合数改成<strong>乘逆元取模</strong></td><td>端到端 n=96（崩）</td></tr><tr><td>P5</td><td>递推过程中就取模</td><td>锚定 Cat(12) 精确值</td></tr><tr><td>P6</td><td>去掉 <code>(n+1)</code> 除法</td><td>锚定 n=1</td></tr><tr><td>P7</td><td>上界照抄成 18</td><td>端到端 / 大批量</td></tr><tr><td>P8</td><td><code>n=0</code> 放行</td><td>端到端越界用例</td></tr><tr><td>P9</td><td>读取器退回 <code>pop(0)</code></td><td>读取器斜率（24.51 ≥ 7）</td></tr><tr><td>P10</td><td>删掉长度闸门</td><td>端到端 5000 位用例（出了 traceback）</td></tr><tr><td>P11</td><td><code>is_uint</code> 恒真</td><td>端到端非法输入</td></tr><tr><td>D1</td><td>详细版 DP 忘了取模</td><td>详细版四法比对</td></tr><tr><td>D2</td><td>暴力枚举放宽剪枝（允许透支）</td><td>暴力法 n=1</td></tr><tr><td>D3</td><td>组合数用浮点除</td><td>详细版组合数 Cat(31)</td></tr><tr><td>D4</td><td>DP 松开 <code>j ≤ i</code> 约束</td><td>详细版 DP n=1</td></tr><tr><td>D5</td><td><strong>【釜底抽薪】Sum check 改成恒真</strong></td><td>「Sum check 有牙齿」检查</td></tr><tr><td>A1–A14</td><td>动画：忘取模 / 系数错 / 生成器漏约束 / 面额塞错 / 找不开不停 / 高亮慢一拍 / 步号差一跳 / 零钱箱算错 / 死 CSS 规则 / 无 CSS 的状态类 / 禁区写反 / 正文清空 / 中文夹 ASCII 引号 / 底色改掉</td><td>各自的渲染与文案断言</td></tr><tr><td><strong>M1</strong></td><td>答案条显示 <code>n</code> 而不是答案</td><td>答案条正文断言</td></tr><tr><td><strong>M2</strong></td><td>右下角「答案」大数字显示 <code>n</code></td><td><code>vAns</code> 正文断言</td></tr><tr><td><strong>M3</strong></td><td>队伍牌子面额印反（50 元的写 100）</td><td>chip 文字 == <code>state.seq</code></td></tr><tr><td><strong>M4</strong></td><td>路径图下标 <code>(i,j)</code> 对调（路径镜像到禁区一侧）</td><td><strong>已走过格点集合 == 真实路径</strong></td></tr><tr><td><strong>M5</strong></td><td>图例的「禁区」色块改成和「走过的格点」一样的蓝</td><td>图例色 ↔ 真实状态色一致</td></tr><tr><td><strong>M6</strong></td><td>零钱箱变负的告警色改成正常绿</td><td><code>.cb-val.neg</code> 颜色必须 ≠ <code>.cb-val</code></td></tr><tr><td><strong>M7</strong></td><td>解说与画面说反话（50 元来了说「少掉一张」）</td><td>解说正文的分支关键词</td></tr><tr><td><strong>M8</strong></td><td>详细版打印的 DP 表整体转置</td><td>打印层反查</td></tr><tr><td><strong>M9</strong></td><td>解说里「Cat(n) 种」拿取模值冒充精确值</td><td>n=12 时 208012 vs 7998</td></tr></tbody></table></div>\n<h3 id=\"sec-26\">9.4 独立审计发现的缺陷（已修）</h3>\n<p>审计的做法是「<strong>构造一条抓不到的变异</strong>」反向检验断言 —— 不去读代码猜有没有问题，而是直接改坏代码，看验证脚本响不响。 结果：<strong>交付前那一版的 30 条变异确实条条被抓，但审计另外手工构造的 8 条（M1–M8） 全部漏报</strong>，其中 3 条能让用户直接看到错答案（动画显示错答案、路径图画反、详细版 DP 表转置）。 按本仓库自己的判据，那些断言是<strong>装饰品</strong>。</p>\n<p>另有两处<strong>噪声/装饰</strong>类问题：</p>\n<div class=\"tablewrap\"><table><thead><tr><th>缺陷</th><th>为什么原断言打不掉</th><th>修法</th></tr></thead><tbody><tr><td>禁区只数<strong>格点数</strong></td><td>方阵里 <code>j&gt;i</code> 与 <code>j&lt;i</code> 的格点数<strong>对称相等</strong>，判断写反了总数不变</td><td>改成<strong>逐格核位置</strong>：「格点 (i,j) 当且仅当 j&gt;i 才是禁区」</td></tr><tr><td>底色用 <code>html.indexOf('#0f0820')</code> <strong>全文搜</strong></td><td>该色值在按钮文字、高亮格文字里也有，body 底色改掉照样命中</td><td>改成<strong>只核 <code>body</code> 规则本身</strong></td></tr><tr><td><code>bill</code> 族的双向互查<strong>空转</strong></td><td>该族没有任何修饰类，两个集合都是空集，循环体一次都不执行</td><td>从族列表里去掉，基类存在性单独核</td></tr><tr><td>`indexOf('&lt;svg') &lt; 0 \\</td><td>\\</td><td>indexOf('xmlns') &gt;= 0` <strong>恒真</strong></td><td>本动画压根没有 <code>&lt;svg&gt;</code>，左边永远成立，右边没机会被检查</td><td>换成三条能失败的检查：无 <code>&lt;link&gt;</code> / 无 <code>@import</code> / 无 <code>http(s)</code> 链接</td></tr><tr><td><code>DEMO_MAX</code> 声明了却没用上</td><td>改掉它验证脚本不响</td><td>补两条：<code>n=DEMO_MAX</code> 允许演示、<code>n=DEMO_MAX+1</code> 必须禁用</td></tr><tr><td>读取器那两条中招</td><td>M1–M8 之外还发现：<strong>采样不对称 + 阈值拍脑袋</strong>导致偶发漏报（见下）</td><td>换指标 + 实测分布定阈值</td></tr></tbody></table></div>\n<p><strong>三种成因，配三种修法</strong>（都是历史陷阱 20/26/29/36/37/42/51 的同一族）：</p>\n<ol>\n<li><strong>正文没人守</strong>（M1/M2/M3/M7）—— 只断言\"元素个数\"和\"类名\"，</li>\n</ol>\n<p>用户看得见的<strong>文字</strong>留空。修法：逐条断言正文（含\"精确值 vs 取模值\"这种极易混的）。</p>\n<ol>\n<li><strong>几何只数个数、不核集合</strong>（M4）—— 个数对、位置全错也看不出来。</li>\n</ol>\n<p>修法：把「已走过格点集合」与真实路径<strong>逐点对齐</strong>。</p>\n<ol>\n<li><strong>打印层/渲染层没人守</strong>（M5/M6/M8）—— 内部返回值对了不代表输出对了。</li>\n</ol>\n<p>修法：<strong>从输出反查输入或内部状态</strong>。</p>\n<p><strong>另外还改进了一处指标本身</strong>（这条是作者自己跑出来的，不是审计给的）：</p>\n<p>读取器检查原先用「读 K 与 4K 个 token 的耗时之比」。实测两侧分布<strong>是重叠的</strong> —— 线性 2.81~7.04、<code>pop(0)</code> 9.78~36.09，阈值 8 的两侧余量只有 1.14 / 1.22 倍， 变异 P9 因此<strong>偶发漏报</strong>（同一份代码有时报 24.5、有时 13.9、偶尔掉到阈值以下）。 根因是线性读取只要 <strong>0.6ms</strong>，绝对时间太小，进程里一次 GC 就能把比值从 4.4 抬到 6.2。</p>\n<p>换成「<strong>同样多的 token，铺成一行 vs 铺成多行，耗时之比</strong>」后分布完全分开：</p>\n<div class=\"tablewrap\"><table><thead><tr><th></th><th>实测范围（12 轮）</th></tr></thead><tbody><tr><td>线性读取器</td><td>0.307 ~ 0.517</td></tr><tr><td><code>pop(0)</code> 坏变体</td><td>13.74 ~ 52.33</td></tr></tbody></table></div>\n<p>两侧最近的取值也差 <strong>26.6 倍</strong>。阈值 2.0 → 余量 3.9 倍 / 6.9 倍， 而且 <code>pop(0)</code> 那侧只要几十毫秒（比原来\"读 4 万个 token\"便宜两个数量级，整轮验证从 ~14s 降到 ~4s）。 <strong>通用教训：判据要落在病根上</strong> —— <code>pop(0)</code> 的病根不是\"随规模变慢\"， 而是\"<strong>队列很长时取队首的 memmove</strong>\"，那就该让它读同样多的 token、只改排版。</p>\n<hr>\n<h2 id=\"sec-27\">附：一句话记住这题</h2>\n<p><strong>答案是卡特兰数 <code>Cat(n) = C(2n,n)/(n+1)</code>，但模数 100007 = 97 × 1031 是合数， 除法不能换逆元 —— 所以顺着秦九韶的递推一路推到底、最后才取模。</strong></p>\n<hr>\n<p><strong>相关题目</strong>：<code>车厢调度</code>（同族：栈的输出序列数也是卡特兰数，但那题 n ≤ 18 且不取模）。</p>\n<p><strong>本文涉及的概念</strong>：卡特兰数 · 模合数不能求逆元 · 大整数递推 · 读到 EOF 的多组输入 · 读取器 <code>pop(0)</code> 性能悬崖 · 变异测试 · Dyck 路径。</p>",
  "hasAnim": true,
  "toc": [
   {
    "id": "sec-1",
    "text": "一、题意",
    "lvl": 2
   },
   {
    "id": "sec-2",
    "text": "二、算法：卡特兰数",
    "lvl": 2
   },
   {
    "id": "sec-3",
    "text": "2.1 为什么是卡特兰数",
    "lvl": 3
   },
   {
    "id": "sec-4",
    "text": "2.2 ★ 本题真正的难点：模数是合数",
    "lvl": 3
   },
   {
    "id": "sec-5",
    "text": "2.3 三条可行算法",
    "lvl": 3
   },
   {
    "id": "sec-6",
    "text": "2.4 举几个值",
    "lvl": 3
   },
   {
    "id": "sec-7",
    "text": "三、样例演示（n = 3）",
    "lvl": 2
   },
   {
    "id": "sec-8",
    "text": "四、复杂度",
    "lvl": 2
   },
   {
    "id": "sec-9",
    "text": "五、详细版输出什么（tickets_detailed.py）",
    "lvl": 2
   },
   {
    "id": "sec-10",
    "text": "六、边界与陷阱",
    "lvl": 2
   },
   {
    "id": "sec-11",
    "text": "1. ★ 判题格式是「多组读到 EOF」，不是「第 1 行 T」，也不是哨兵",
    "lvl": 3
   },
   {
    "id": "sec-12",
    "text": "2. ★ n = 0 的取舍：题面自己前后矛盾",
    "lvl": 3
   },
   {
    "id": "sec-13",
    "text": "3. ★ 模数是合数，除法不能换逆元",
    "lvl": 3
   },
   {
    "id": "sec-14",
    "text": "4. ★ 别把 2n 个人当互不相同的个体",
    "lvl": 3
   },
   {
    "id": "sec-15",
    "text": "5. 越界 n 宁可中止也不错答",
    "lvl": 3
   },
   {
    "id": "sec-16",
    "text": "6. ★ 超长数字串必须在 int() 之前拦长度",
    "lvl": 3
   },
   {
    "id": "sec-17",
    "text": "7. ★ 输出必须「敲一组、出一组」，别攒到最后",
    "lvl": 3
   },
   {
    "id": "sec-18",
    "text": "8. EOF 类题目在终端里要显式结束输入",
    "lvl": 3
   },
   {
    "id": "sec-19",
    "text": "9. 读取器取 token 必须 reversed() + pop()",
    "lvl": 3
   },
   {
    "id": "sec-20",
    "text": "七、文件清单",
    "lvl": 2
   },
   {
    "id": "sec-21",
    "text": "八、参考测试用例",
    "lvl": 2
   },
   {
    "id": "sec-22",
    "text": "九、正确性验证",
    "lvl": 2
   },
   {
    "id": "sec-23",
    "text": "9.1 python verify_tickets.py",
    "lvl": 3
   },
   {
    "id": "sec-24",
    "text": "9.2 node verify_tickets_animation.js",
    "lvl": 3
   },
   {
    "id": "sec-25",
    "text": "9.3 python verify_tickets_mutations.py",
    "lvl": 3
   },
   {
    "id": "sec-26",
    "text": "9.4 独立审计发现的缺陷（已修）",
    "lvl": 3
   },
   {
    "id": "sec-27",
    "text": "附：一句话记住这题",
    "lvl": 2
   }
  ],
  "files": [
   "tickets.py",
   "tickets_detailed.py",
   "verify_tickets.py",
   "verify_tickets_mutations.py"
  ],
  "concepts": [
   "composite-mod",
   "eof",
   "no-bigint",
   "out-of-range",
   "reader",
   "tail-newline"
  ],
  "prev": "horse-race",
  "next": null,
  "related": [
   "catalan",
   "cards",
   "components"
  ]
 }
];
