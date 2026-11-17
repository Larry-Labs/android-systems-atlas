# 大框预览说明

日期：2026-11-08。
目标仓库：https://github.com/Larry-Labs/android-systems-atlas

## 本轮范围

用户要求先做大框供审阅。本版实现信息架构、视觉方向与基本阅读交互，不以完整教材交付。

- 架构全景：五组职责关系的交互图、进程/通信说明、图谱放大。
- 按领域学习：18 个领域，按系统基础、硬件与体验、平台工程分组；可用中英文与术语筛选。
- 音频示范：概念 PCM 路径、逐节点解释、Android 13/14+ Audio HAL 接口变化、通用播放与 AAOS 多区域音频比较。
- 其他领域：真实可访问的目录预览，显著标明正文和图解尚未编写。
- 平台与重大变化：区分 Android 版本、设备形态、厂商实现三个维度，展示栏目组织方式。
- 高通专题：整体映射与公开资源入口，不把公开 Linux 文档写成 Android BSP 支持证明。
- 资料与阅读说明：官方来源、重写重绘原则、当前版本范围。
- 中英文切换、语言偏好本地保存、主题与滚动位置保留；语言存储不可用时不影响阅读。
- 术语解释：独立双语术语表、12 个首批词条、全站搜索、正文虚线术语原位弹窗、官方来源和相关领域入口。
- 搜索对话框与键盘 `/` 快捷键；Escape 关闭对话框及手机目录。

## 运行

不需要 npm 安装或构建，使用浏览器原生 ES modules：

```sh
cd /Users/xugao/Project/android-systems-atlas
python3 -m http.server 4173 --bind 127.0.0.1 --directory site
```

访问 http://127.0.0.1:4173 。只服务 site 目录，历史材料和迁入清单不在网页服务根目录内。HTML 需要 HTTP 服务，不能依赖双击 file:// 运行 ES modules。

## 文件结构

- site/index.html：页面骨架与对话框。
- site/styles.css：浅色图谱视觉、响应式布局与可访问状态。
- site/data.js：中英领域目录、架构图节点及来源。
- site/glossary.js：双语术语定义、全称、易混淆边界与官方来源。
- site/app.js：页面渲染、hash 路由、交互、搜索与语言切换。
- tests/browser-smoke.py：真实浏览器烟雾检查，依赖已安装的 agent-browser。
- artifacts/：本地截图与检查结果，不属于发布站点，也不纳入Git；下文证据路径仅供本地查阅。

## 本版边界

正式教材仍以编写时核实的最新正式 Android 为基线。本版的通用架构和音频差异只是示范，不宣称所有领域已经适配最新版本；精确 release tag 和完整版本矩阵未定。

本轮未导入第三方网站代码，也未复制历史原型进入运行目录。历史材料仍在 references。没有登录、题库、练习、积分或学习进度功能。

已只读检查目标 GitHub 仓库：当前存在 README.md 和 assets/readme-banner.svg。其说明包含旧的单语和自测目标，后续提交时应按当前需求更新；本轮没有初始化本地 Git、提交或推送，也没有改动远端文件。

## 示范依据与核验范围

- [AOSP architecture](https://source.android.com/docs/core/architecture)：职责与进程不应混同；Framework 可位于应用进程，服务跨多个进程。
- [AOSP Audio](https://source.android.com/docs/core/audio)：整体音频组件关系。该概述仍包含历史 mediaserver 术语，不能仅依据该图断言当前进程布局。
- [Audio HAL](https://source.android.com/docs/core/audio/implement)：Android 14 起 AIDL 与新 API 政策，不能推导所有旧 HIDL HAL 立即消失。
- [Multi-zone audio routing](https://source.android.com/docs/automotive/audio/audio-multizone-routing)：AAOS Car Audio Service、区域输出、独立焦点与音量。

以上链接本轮已读取，属于资料核对；未执行 Android 构建或设备实测。普通 PCM 图明确为概念数据路径，省略客户端封装等细节，不覆盖 offload、direct 或 MMAP 路径。

更新（2026-11-08）：已通过Google官方发布说明镜像、AOSP版本表及manifest确认Android17正式发布和 `android-17.0.0_r1` 源码锚点，关闭此前发布状态的核验缺口。具体实现文件仍有访问限制；现有网页没有因此自动升级成全部按17核验的教材。详见 [CONTENT-BASELINE.md](CONTENT-BASELINE.md) 和 [SOURCE-REGISTER.md](SOURCE-REGISTER.md)。

## 视觉优化（2026-11-08）

阅读区改为暖白，导航改为深墨绿，以浅绿选中态和少量琥珀色标识强化层次。增大正文与术语解释字号，调整内容最大宽度、卡片网格、搜索框、图解说明区和手机间距。无新增依赖，未改动技术内容和路由逻辑。

通过应用内浏览器检查：7 个页面 × 中英双语 × 1440/768/390 三种宽度，共42个状态无横向溢出；10项交互检查通过，覆盖术语搜索与弹窗、语言切换、Escape、手机目录、架构图选择及放大、全站搜索和音频节点选择。当前检查会话无浏览器错误日志。此次为针对性视觉回归，未重跑此前84项完整脚本。

结果见 artifacts/visual-validation.json；截图见 artifacts/visual-home-desktop.png 和 artifacts/visual-glossary-desktop.png。样式入口的内容摘要版本同步更新，避免继续使用旧样式。此前本地预览服务已停止，本轮恢复后确认 HTTP 200。

## 入门图与音频交互接入（2026-11-08）

首页保留职责地图，增加用户空间执行边界图（JNI与Binder区分）和PCM场景入口。音频页增加播放全景/Android17 HAL通道双视图、方向与载荷标注、节点/连线详情、控制/数据强调、手动播放/暂停/前后步/重播。语言切换保留视图和步骤并暂停；切换图解范围重置步骤；离页、后台或模态阅读时停止自动推进。新增FMQ术语，总计13条。

HAL视图使用固定Android17标签，已交叉读取关键定义与传输实现，证据见 [AUDIO-SOURCE-VERIFICATION.md](AUDIO-SOURCE-VERIFICATION.md)。补充AIDL配置迁移与AAOS AudioControl/Core HAL区别。通用播放图不等于完整源码时序，不包含完整AudioPolicy控制、应用端缓冲细节、厂商后端或设备实测。

验证结果：

- 24项针对性交互检查通过：默认静态、节点和连线、语言保留步骤、两种图解切换、播放推进与暂停、末步停止、键盘前进、返回方向、重播、减少动态效果、离页定时器清理、FMQ弹窗、Escape与搜索。
- 中英双语 × 1440/768/390三种宽度 × 7页，加HAL图6种状态，共48项布局检查通过，无横向溢出；手机和桌面图解已截图检查。
- 当前浏览器错误日志为空；JavaScript语法检查通过，已有Python检查脚本语法检查通过。
- 本轮没有运行历史agent-browser全量脚本；已按现有导航与13条术语更新其断言，不把历史结果算作本轮结果。
- 本地页面验证记录：`artifacts/learning-validation.json`；截图：`artifacts/audio-hal-interactive.png`。

浏览器验证中一次首页定位匹配到品牌与导航两个链接，已限定导航定位后继续；一次自动完成等待达到工具等待上限，随后读取最终状态确认末步停止。这两项属于检查过程问题，未修改产品行为以规避验证。


## 连续架构首图与悬浮解释（2026-11-08，替代前版布局）

前版独立箭头卡片未满足用户期望，现已撤换：音频页使用一张横纵结合的SVG图，12个组件、16条实际端点连接；音频、控制与响应分别用实线/虚线/点线及文字标注。用户可点节点、点线条或其标签、键盘选择、沿线动画、强调数据/控制、图内放大及滚动。手机保留二维结构，只有图内部横向滚动。

正文术语默认打开非模态浮层：鼠标悬停/键盘聚焦预览、点击固定、移入阅读、Esc/外部点击关闭；提供完整释义与来源入口。语言切换和局部重绘会清理旧锚点。词典页和全站搜索继续保留完整弹窗。

25项针对性检查通过；中英×1440/768/390三种宽度均无整页横向溢出、节点文字未越界、浮层未超视口。浏览器错误日志为空。检查中SVG边的包围盒中心不一定落在线上，因此改为点击可见标签并复验；原失败记录保留，不计入通过数量。DOM接口不支持getBBox时改用实际渲染矩形核验。历史全量脚本本轮未运行。

本地产物：连续图`artifacts/audio-connected.png`、浮层截图`artifacts/term-popover.png`、检查记录`artifacts/connected-map-validation.json`。双语可编辑图稿位于docs/diagrams/；渲染源为site/learning.js。不是完整音频进程拓扑或设备实测。
