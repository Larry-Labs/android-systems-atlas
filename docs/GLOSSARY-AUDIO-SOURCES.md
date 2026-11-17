# 音频术语内容：来源与核验边界

日期：2026-11-08。范围：`site/glossary-audio.js` 中 alsa、asoc、dma、dai、dapm、dac、codec、i2s、dsp、fmq、pcm 共11项。本站中英文解释和小图为原创教学重述，不是官方引文。模块只导出 `termEntries`；保留原词条元数据由主模块负责。

## 本轮直接读取的官方资料

以下 URL 本轮用网页研究工具读取正文或相关段落；不以搜索摘要代替正文。Linux 文档用于通用机制，不宣称对应某个 Android 内核版本。

| 来源 | 支持的条目与内容 | 限制 |
| --- | --- | --- |
| [Writing an ALSA Driver](https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html) | ALSA 的 PCM 参数、缓冲、启停和位置/period 通知；DMA 进度处理 | 重点为 PCI 驱动写作；未把 PCI 拓扑移植为所有 SoC 路径 |
| [ASoC overview](https://docs.kernel.org/sound/soc/overview.html) | ASoC 组件复用、SoC/Codec/Machine 的组织关系，DAPM 目标 | 职责模型不是驱动文件清单或样本流水线 |
| [Platform driver](https://docs.kernel.org/sound/soc/platform.html) | SoC DAI 配置、DMA 及 DSP 驱动职责、前端 PCM | 不主张所有角色必须由独立文件或芯片承担 |
| [Machine driver](https://docs.kernel.org/sound/soc/machine.html) | 组件绑定、DAI link 和板级连接 | 简图不是全部多端点连接模型 |
| [Codec driver](https://docs.kernel.org/sound/soc/codec.html) | Codec DAI 能力、寄存器控制、音频控制；I²C/SPI 与样本接口的职责区别 | 文档的 codec 组件类别比转换芯片宽；不声称每个组件都有相同转换功能 |
| [Digital Audio Interface](https://docs.kernel.org/sound/soc/dai.html) | DAI 范畴、I²S 数据与同步配置、时钟提供方并非固定 | 不采用页面的历史接口枚举作为当前穷尽列表；不引入引脚数或电气时序 |
| [DAPM](https://docs.kernel.org/sound/soc/dapm.html) | 根据流/混音器状态与功能块路由图作电源决策；DAC、功放等角色分开 | 控制图不表示 PCM 通过 DAPM；不承诺某个设备的完整供电顺序 |
| [Dynamic PCM](https://docs.kernel.org/sound/soc/dpcm.html) | PCM 经 DSP 路由到数字端点、前后端模型 | 用于说明可选路径，不能证明某高通 Android BSP 的实现 |
| [DMAengine client API](https://docs.kernel.org/driver-api/dmaengine/client.html) | 驱动配置、缓冲/传输准备、外设 DMA、循环传输及回调 | 图中驱动是抽象角色，省略 DMA 客户端与控制器驱动分工；不暗示回调一定直接运行在硬中断中 |
| [AOSP Audio](https://source.android.com/docs/core/audio) | HAL 与内核驱动边界、ALSA 是可选后端 | 页面含旧进程与接口描述，仅使用 driver-agnostic 后端结论 |
| [AOSP Audio terminology](https://source.android.com/docs/core/audio/terminology) | 样本/帧、PCM、DAC、DSP 的概念；Codec 语境 | 不引用历史 mediaserver/C HAL 描述来证明当前拓扑 |
| [AOSP Data formats](https://source.android.com/docs/core/audio/data_formats) | PCM 与压缩格式不同；位宽、容器与数值表示影响样本解释 | 聚焦常用线性 PCM，未展开布局、所有变体或媒体解码链 |
| [AOSP USB digital audio](https://source.android.com/docs/core/audio/usb) | USB 数字音频到外设 DAC，说明转换不必在手机内部 | 不把历史 USB 类别/Android 版本说明当成当前完整支持矩阵 |
| [AIDL FMQ](https://source.android.com/docs/core/architecture/aidl/fmq) | 跨进程共享队列、消息布局、通过接口传递描述符 | 不用通用 FMQ 文档单独证明 Audio HAL 三队列或硬件零拷贝 |

## 复用的当前任务证据

已阅读 [AUDIO-DRIVER-VERIFICATION.md](AUDIO-DRIVER-VERIFICATION.md) 与 [AUDIO-SOURCE-VERIFICATION.md](AUDIO-SOURCE-VERIFICATION.md)。前者的直接 DMA / I²S 教学边界与本轮官方文档复读相符。没有新增高通芯片或 BSP 结论，也未重新核验该文中的 Linux v6.12 高通源码。

FMQ 的音频专用语义复用后者已记录的固定标签检查，不声称本分工再次读取了固定标签源码：

- [StreamDescriptor.aidl — android-17.0.0_r1](https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl)：command、reply、audio.fmq，状态与消费量。本模块以此作为词条的音频协议来源。
- [StreamHalAidl.cpp — android-17.0.0_r1](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/media/libaudiohal/impl/StreamHalAidl.cpp)：现有记录已核对非 MMAP 输出的 transfer/sendCommand；本条不复述完整调用顺序。

FMQ 小图有四个可视节点：“命令／响应 FMQ”明确代表两条独立队列，与“数据 FMQ”合计三条。控制和响应使用不同方向/类型，不将队列视为新增处理层。范围限定为非 MMAP PCM 输出，省略完整状态机与异步回调。消费量不等于扬声器呈现量。

## 小图的教学边界

- ALSA、ASoC、DAI、PCM 使用 `relation` 表示非定向职责/组成/表示关系，不暗示运行时流水线。
- DAPM 是电源控制图；其他数据图均在图注和 scope 中限定场景。
- DMA 保留内存缓冲→DMA 引擎→音频控制器；驱动→引擎为配置，引擎→驱动为抽象进度。不是所有 DSP/外设路径，也不证明端到端零拷贝。
- DAC/Codec 功能块不等于独立芯片数量；I²S 不固定时钟提供方；DSP 输入可为 PCM，不能据此称为压缩卸载。
- 每条三组问答用于解释机制与误区，不增加练习、测验或产品兼容承诺。

## 实际检查

已通过 Node ES-module 导入与一次性结构断言：11个指定 ID、39个节点、33条连线；中英字段非空；每条恰好3问；中文定义2句且55–110字符；note 不超过65字符；图为3–5节点、3列×2行且格位唯一；英文标题不超过22字符、副标题不超过27字符、边标签不超过20字符；端点存在、边类型有效；节点中心之间的直线不经过第三个节点；来源 URL 均可解析且为 HTTPS。

以上直线检查只验证数据模型，不等于最终 SVG 路由或标签排版检查。渲染器、原 glossary.js、CSS 与测试文件由主任务维护，本分工未修改；没有浏览器排版/交互验收、Android 编译、实机测量或厂商固件验证。全部22项的合并与页面验证仍由主任务完成。
