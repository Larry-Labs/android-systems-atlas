# 内容基线 / Content baseline

核验日期 / Checked: **2026-11-08**。状态：首批内容设计；网站仍为预览，未完成全部章节的版本复核。

## 正式版本与源码锚点

| 项目 / Item | 结论 / Result | 依据 |
|---|---|---|
| 正式大版本 / Stable major | Android 17，API 37 | B01、B02 |
| 发布时间 / Release date | 2026-06-16 | B01 |
| 首批源码锚点 / Pinned source baseline | `android-17.0.0_r1` | B02、B03 |
| 对应构建 / Build | `CP2A.260605.016` | B02 |
| 该构建安全补丁日期 / Security patch level | 2026-06-05 | B02 |

Android 17 的正式发布状态与该源码标签已经确认。`r1` 是本项目选择的可复查锚点，不等于当前所有设备最新 OTA，也不宣称是最新 QPR 或安全维护标签。安全补丁日期不是正式发布日期。原始英文发布博客本次访问受限，正文通过 Google 官方 `developer.android.google.cn` 镜像读取。

Android 17 is the verified stable major baseline. The selected `r1` tag is a reproducible source anchor, not a claim about the newest OTA, QPR, or security-maintenance revision on every device. The security patch date and release date have different meanings.

## 不同证据分别说明什么

- **发布说明 / Release announcement**：确认正式发布，不能证明某设备或某 BSP 已支持。
- **版本表与 manifest / Build table and manifest**：确认版本映射与源码标签；不能替代逐个文件的实现核验。
- **官方说明 / Official documentation**：支持通用机制，仍需检查历史术语和适用条件。
- **固定标签源码 / Tagged source**：支持对应版本的接口与实现关系；开发分支不能替代正式标签。
- **设备实测 / Device validation**：本批没有设备实测、Android 编译或厂商 BSP 验证。

## 当前范围与缺口

1. 三张入门图解释职责、执行边界和场景；它们是原创教学设计，不是完整系统拓扑。
2. 音频样板限定为应用提供 PCM、AudioTrack MODE_STREAM、普通混音输出、AIDL Audio HAL。不能推广到 offload、direct、MMAP、蓝牙或通话路径。
3. Android 17 manifest 与 frameworks/av 仓库根目录已读取；若干具体文件通过网页工具不可访问，本地下载也超时。随后通过目录导航补核HAL流协议、开流返回与transfer/sendCommand关键实现，见 [源码复核](AUDIO-SOURCE-VERIFICATION.md)。仍不声明完成Android17完整函数调用链审计。访问失败不证明文件不存在。
4. Android 版本、设备形态、厂商实现分别记录。尚无可靠材料的组合明确留空，不补造差异。
5. 已补充Linux v6.12上游q6asm/q6routing/AudioReach机制比较，见 [驱动核验](AUDIO-DRIVER-VERIFICATION.md)；不增加具体芯片或出货BSP支持结论。

Scope: original introductory diagrams and one ordinary mixed-PCM playback design. Function-level Android 17 tracing, hardware measurements, and Qualcomm BSP validation remain open. Version, device form factor, and vendor implementation are independent dimensions.

来源编号见 [来源登记表](SOURCE-REGISTER.md)。升级基线必须复核涉及的节点、边和差异说明，不能只替换版本徽标。

## 网页接入更新

三种入门视角已接入首页；音频页已实现连续关系图、控制/数据筛选、载荷说明、默认方向动画与暂停/继续、中英切换及术语原位解释。此进展不改变厂商后端与设备未实测的边界。

音频首图下半段已展开ALSA/ASoC直接DMA/I²S教学例子，严格区别于Android平台版本及实际产品拓扑。动画改为默认数据方向循环与暂停/继续，取消阶段自动跳转。
