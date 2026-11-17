# 平台术语：来源、原创表达与验证边界

核对日期：2026-11-08。交付仅为 `site/glossary-platform.js` 与本文件；覆盖 aosp、hal、aidl、hidl、binder、ipc、jni、art、audiotrack、audioflinger、aaos 共 11 项。模块只导出 `termEntries`，不修改原有 ID、名称、领域或弃用元数据；由主任务合并。

中英文定义、问答和图均为本站原创概括，不是官方引文。短释义回答对象、位置和作用；完整解释补充关系、三个关键问题与范围。关系线用于组成、接口及构建关联，不表示运行时方向；只有标为 data/control/reply 的边有方向语义。

## 本轮实际读取的官方资料

通过网页研究工具打开正文并定位相关章节；JNI、AudioTrack 和应用 AIDL 指南使用 Google 官方 `developer.android.google.cn` 镜像。表中“支持”仅指所列事实，不表示整页每句话均适用于项目版本。

| 来源（实际读取 URL） | 对应术语及支持内容 | 限制 |
|---|---|---|
| [Architecture overview](https://source.android.com/docs/core/architecture) | AOSP 的公开可修改源码基础；框架、系统服务、HAL 与驱动职责 | 不据此恢复固定串行调用链或具体产品软件清单 |
| [AOSP FAQ](https://source.android.com/docs/setup/about/faqs) | 修改平台源码与通过 Android 兼容性计划是不同事项 | 不解释许可法律细节，不保证设备认证结果 |
| [HAL overview](https://source.android.com/docs/core/architecture/hal) | HAL 接口/实现分工；binderized 与受限制的 same-process HAL | HIDL 年份与专页存在差异，见下文 |
| [AIDL overview](https://source.android.com/docs/core/architecture/aidl) | 方法/类型、构建生成绑定、Binder 调用；独立更新平台边界的 Stable AIDL 要求 | 未据此声明所有接口都适用同一稳定性要求 |
| [AIDL application-service guide](https://developer.android.google.cn/develop/background-work/services/aidl) | 共同接口、生成代码、服务端仍需方法实现 | 原入口 `/guide/components/aidl` 重定向至此；只用通用机制，不搬用示例应用 |
| [HIDL](https://source.android.com/docs/core/architecture/hidl) | HAL 方法/数据约定；独立编译代码；Android 10 弃用提示；binderized 与 passthrough 的区别 | 弃用不是统一移除日期，不推断全部设备迁移状态 |
| [Binder overview](https://source.android.com/docs/core/architecture/ipc/binder-overview) | 代理、内核驱动、目标进程线程、同步请求/响应 | 三节点图压缩用户态绑定细节，不表示全部 Binder 模式 |
| [Fast Message Queue with AIDL](https://source.android.com/docs/core/architecture/aidl/fmq) | 进程可在建立关系后以共享内存队列通信；IPC 不只有 Binder 调用 | 不作吞吐或零拷贝承诺，不在 IPC 分类图伪造运行链 |
| [JNI tips](https://developer.android.google.cn/ndk/guides/jni-tips) | Java/Kotlin 对应 managed code 与 C/C++ 交互；JavaVM/JNIEnv、进程内线程与原生调用托管方法 | 同进程边界由其运行模型及与 Binder 机制对照得出；JNI 不负责跨进程传输 |
| [ART and Dalvik](https://source.android.com/docs/core/runtime) | 应用和部分系统服务的托管运行时、DEX、垃圾回收 | 不沿用历史编译时机或 GC 性能数字作为当前设备事实 |
| [ART JIT compiler](https://source.android.com/docs/core/runtime/jit-compiler) | 解释执行、JIT、AOT 机制共同存在 | 不承诺每次安装或运行都采用同一策略 |
| [AudioTrack API](https://developer.android.google.cn/reference/android/media/AudioTrack) | write 与播放控制；MODE_STREAM / MODE_STATIC；缓冲/呈现不同；压缩格式、direct 和 offload 支持查询 | 不将类概述里的 PCM 描述读成唯一格式；不把某重载的阻塞描述推广到所有 write；支持查询也不保证即时资源可用 |
| [Audio terminology](https://source.android.com/docs/core/audio/terminology) | AudioFlinger、混音模块、audio policy、AudioTrack 的角色 | 页面仍有 mediaserver、旧 C HAL 等历史表述，本模块不采用这些名称作为当前进程/接口证据 |
| [Audio HAL](https://source.android.com/docs/core/audio/implement) | 系统音频服务、Core HAL 与设备输出的关系；领域迁移有独立版本要求 | 只支撑职责和范围，不展开全部路由控制调用链 |
| [Design for reduced latency](https://source.android.com/docs/core/audio/latency/design) | normal/fast mixer 与音轨协作、混音路径中的处理职责 | 不将旧设计中的轨数、周期和延迟示例写成当前保证 |
| [AAudio and MMAP](https://source.android.com/docs/core/audio/aaudio) | 存在区别于普通 AudioFlinger 混音的数据路径；MMAP 需要实现支持 | 页面含旧 HAL/ION 配置，本模块只据此排除“所有播放都普通混音”的概括，不宣称 AudioTrack 就是 MMAP API |
| [What is Android Automotive?](https://source.android.com/docs/automotive/start/what_automotive) | AAOS 在车载硬件运行、扩展 Android；与 Android Auto、可选 GAS 的区别 | 图限定信息娱乐示例，不扩展未审查的整车安全或 SDV 实现 |
| [Multi-zone audio routing](https://source.android.com/docs/automotive/audio/audio-multizone-routing) | 音区与输出设备、独立音量/焦点、多乘员同时播放及配置依赖 | 不把示例 XML 或车型配置推广为所有 AAOS 默认状态 |

## 需要保留的证据差异

- **HIDL**：专页写 Android 10 起弃用；当前 HAL overview 写 Android 13 起弃用，并说明既有 HIDL HAL 仍受支持。短 note 按本次明确要求保留专页的 `Android 10`，scope 同时披露另一表述。两者都不能证明“从某一年起所有设备上的 HIDL 被删除”。本轮不自行统一官方资料的不同口径。
- **JNI**：保留英文定义中的 `managed code`。图是同进程语言接口关系；若原生代码进一步调用远端服务，IPC 是另一个机制，不能把 JNI 线改成 Binder 线。
- **AudioTrack**：短定义选普通 PCM 供数；问答保留 STREAM/STATIC 和压缩格式条件。缓冲节点是存储角色，不是进程；write 与 play/pause 分别以数据/控制边表达。成功接收不等于扬声器呈现。
- **AudioFlinger**：图明确选择普通 PCM 混音，不能推导所有 direct/offload/MMAP 都经过该图。AAudio MMAP 只作为不同路径的例子，不给所有路径套用同一端点、内核后端或时序。

## 与项目已有核验的关系

已阅读 `AUDIO-SOURCE-VERIFICATION.md`、`AUDIO-DRIVER-VERIFICATION.md`、`SOURCE-REGISTER.md` 和 `CONTENT-BASELINE.md`，沿用其“资料/源码核对不等于设备验证”的边界。它们登记的 Android 固定标签 HAL 三队列、Linux v6.12 和高通上游实现不是本模块新增源码核验；本轮没有重新审计其中 blob、编译 Android 或测试设备。平台术语图也不依赖这些精确实现细节。

读取了根 AGENTS.md 及 REQUIREMENTS、CONTENT-AND-DIAGRAMS、DECISIONS、IMPLEMENTATION-PLAN、GLOSSARY-DESIGN 的相关约束；不修改主任务拥有的渲染器、原始 glossary.js、CSS、测试或计划文档。

## 实际检查与尚待主任务完成的验证

- `node --check site/glossary-platform.js` 通过。
- 临时结构检查通过：精确 11 个 ID；所有文本对均有中英文；每项恰好 3 个问题；每图 3–5 个节点、合法 3×2 网格、唯一节点和单元格；边端点存在、类型合法、没有直线穿过第三个节点中心。
- 中文短定义全部为两句，长度 73–99 字符；note 长度 24–47 字符。英文节点标题不超过 22 字符、副标题不超过 27、边标签不超过 20。
- 来源字段格式、JNI `managed code` 与 HIDL `Android 10` 兼容关键字检查通过。
- 首次临时 Node 结构检查脚本因局部变量遮蔽触发 ReferenceError，未完成检查；随后改用 Python 解析模块的 JSON 对象并执行上述断言，无错误。没有改动项目测试，也没有把失败那次计为通过。
- 当前只完成内容与数据几何检查。主任务仍需合并模块、检查真实渲染的文字/边线重叠、双语桌面和手机、键盘/浮层/完整解释、语言切换及搜索；这里未运行或宣称这些 UI 检查通过。
