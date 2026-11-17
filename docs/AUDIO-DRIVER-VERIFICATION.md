# 音频驱动段：证据与教学边界

核验日期：2026-11-08。用户要求领域图准确且保留解释机制所必需的细节。本轮扩展连续首图，不将其称为完整音频教材或设备实测。

## 场景选择

上半图沿用已核对的AIDL普通混音场景；下半图明确选择 **ALSA / ASoC非mmap写入 + 直接DMA + I²S + Codec/DAC + 扬声器** 的教学例子。HAL不规定统一内核后端，此图不是任何高通手机的出货拓扑。HAL FMQ、ALSA播放缓冲、硬件实体分别画出，不能合并为同一种队列或进程。

主图保留四类信息：样本存放/搬运、参数及路由配置、软件与硬件边界、进度返回。寄存器地址和完整回调清单不属于当前学习目标。

## 实际读取的依据

| ID | 一手资料 | 支持内容与边界 |
|---|---|---|
| K01 | [AOSP Audio](https://source.android.com/docs/core/audio) | HAL与驱动边界、可选择ALSA及tinyalsa。页面也有历史架构描述，不以其旧进程名证明当前拓扑。 |
| K02 | [Writing an ALSA Driver](https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html) | PCM参数/准备/启停回调、缓冲、播放位置及period进度。文档主要以PCI驱动举例，本图仅使用通用PCM机制，不搬用PCI硬件拓扑。 |
| K03 | [ASoC overview](https://docs.kernel.org/sound/soc/overview.html) | SoC接口、Codec及Machine职责；不是串行数据处理模块列表。 |
| K04 | [Platform driver](https://docs.kernel.org/sound/soc/platform.html) | DMA、DAI及DSP驱动职责；图中将DMA/CPU DAI相关组件合并，不声称源码一定是一个驱动文件。 |
| K05 | [Machine driver](https://docs.kernel.org/sound/soc/machine.html) | 声卡绑定、组件连接、板级控制与时钟。 |
| K06 | [Codec driver](https://docs.kernel.org/sound/soc/codec.html) | 接口配置、寄存器控制、音量/电源；控制接口与PCM数据接口分开。 |
| K07 | [DAPM](https://docs.kernel.org/sound/soc/dapm.html) | 基于活动流/路由的电源管理，以及DAC等功能块；不意味着样本经过DAPM软件处理。 |
| K08 | [Dynamic PCM](https://docs.kernel.org/sound/soc/dpcm.html) | DSP/前后端路由模型，说明直接DMA示例不是唯一拓扑。 |
| K09 | [AOSP USB audio](https://source.android.com/docs/core/audio/usb) | USB外设路径不能照搬板载I²S/Codec例子。 |
| Q01 | [q6asm-dai.c · Linux v6.12](https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm-dai.c) | 主审复读event_handler：写完成更新进度并通知ALSA；调研读取prepare的缓冲映射与PCM配置。 |
| Q02 | [q6routing.c · Linux v6.12](https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c) | 主审复读q6routing_stream_open中的ADM路由映射；不能画成PCM转发盒。 |
| Q03 | [q6apm.c · Linux v6.12](https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c) | 主审复读共享缓冲写请求的地址/长度/句柄与GPR发送及完成回调；不将样本数据等同于控制包。 |

Linux文档是通用机制资料，不是与Android17一一对应的内核版本表。Q01–Q03是固定Linux标签的上游公开实现；没有核验具体Android产品BSP、DSP固件或板级硬件。Android版本、设备形态、厂商后端不得相互替代。高通更完整的产品专题仍待设备级证据。

## 图的阅读限制

- 绿色线包括PCM样本和DAC后的模拟信号，载荷在边上分别标注；不是每段都传相同编码的字节。
- 进度线折叠了硬件事件→驱动→ALSA的过程，标签明确中间角色；进度通知不等于扬声器已经呈现完毕。
- 使用示例Codec/DAC和功放功能块，不推断芯片数量；数字功放、DSP、SoundWire等不得直接套用此图。
- 数据路径默认循环只提示方向，不表示每次调用或真实执行时序；控制与响应静态。用户可暂停，减少动态效果时默认静态。

2026-11-09复核：补充ALSA非mmap写入范围、流活动→DAPM控制关系及period通知模式限制，见[AUDIO-REVIEW-2026-11-09.md](AUDIO-REVIEW-2026-11-09.md)。
