# 前期学习项目与公开资源调研

整理日期：2026-11-08。来源：本会话前轮对项目仓库、正文、配置及许可的只读调查。本轮迁入没有重新联网核验，下面是调研快照；许可和维护状态在实际引入时需要复核。未部署这些项目、未逐条验证教材，也未做设备实测。

## 结论

存在可借鉴的系统教材和学习网站，但本轮调查未发现完整满足“中英双语、图解、新手入门、最新正式 Android、领域学习、高通补充”的单一项目。覆盖丰富不等于内容正确；公开仓库不自动等于所有正文和插图可自由改编。

当前需求要求自主重写重绘，因此这些项目主要作为信息组织和站点功能参考，技术事实仍需核对 Google 与高通的一手材料。

## 学习项目

| 项目 | 本轮已见内容 | 许可与适配边界 |
| --- | --- | --- |
| [AOSP Internals](https://github.com/aospbooks/aosp-internal-book) / [站点](https://aospbooks.github.io/aosp-internal-book/) | 67 个编号 Markdown 文件（含前言）、系统领域广、Mermaid 图、源码分析；已抽查音频/HAL/Camera 内容，存在实际长篇正文 | 根 LICENSE 为 Apache-2.0，但前言限制未经许可复制，存在冲突；前言自述 Android 17/main 基线，该自述不是 Google 正式发布状态证据。优先参考目录组织，不直接搬运全书 |
| [AndroidFrameworkTutorial](https://github.com/yuandaimaahao/AndroidFrameworkTutorial) | 中文 AOSP、JNI、Binder、HAL 教程及示例；部分内容为 PPT/思维导图 | Apache-2.0；Binder 较集中，部分 HIDL 和内核工具链偏旧，目录不等于完整课程 |
| [Gityuan](https://gityuan.com/) / [仓库](https://github.com/yuanhuihui/yuanhuihui.github.io) | 启动、Binder、进程与服务的机制图解，部分明确以 Android M 为背景 | 根 LICENSE 为 Apache-2.0，但 about 页面另有文章转载、修改和商业使用限制，改编范围不明确；最新版本需重新核对 |
| [hello-android](https://github.com/android24/hello-android) / [站点](https://android24.github.io/hello-android/) | 中文课程及示例，从应用开发进入 Binder、窗口、渲染、进程等机制，Docsify 站点 | README 声明 CC BY-NC-SA 4.0；以应用和 Framework 为主，底层 BSP 覆盖不足；其练习不纳入本项目 |
| [AndroidDevKit](https://github.com/vishnusreddy/androiddevkit) / [站点](https://androiddevkit.com) | README 提供搜索、主题文章、题库、练习和本地进度，Astro 站点结构 | README 声明代码与内容 MIT；应用/面试重心，不是系统教材。可研究导航搜索组织，题库与进度不作为当前需求 |
| [BeesAndroid](https://github.com/BeesX/BeesAndroid) | README 基于 android-7.0.0_r34 / Nexus 6，当前仓库正文较少，书籍链接到语雀 | GPL-3.0；外链正文入口调查时返回 401，无法确认完整性，非最新版本基线 |
| [aosp-guide](https://github.com/doc2dev/aosp-guide) | 14 篇系统概览正文，涉及启动、Binder、服务、HAL、安全与更新 | MIT；README 明确说明 Claude 生成，应独立核验，不能直接用作技术结论依据 |

AOSP Internals 的 [前言](https://github.com/aospbooks/aosp-internal-book/blob/main/00-frontmatter.md) 与 [LICENSE](https://github.com/aospbooks/aosp-internal-book/blob/main/LICENSE) 是许可边界的直接检查入口；Gityuan 的额外声明见 [about.html](https://github.com/yuanhuihui/yuanhuihui.github.io/blob/master/about.html)。

## 高通及相关公开资源

| 资源 | 可用于学习的内容 | 范围限制 |
| --- | --- | --- |
| [AudioReach 文档](https://audioreach.github.io/) / [项目概述](https://audioreach.github.io/sdk_overview.html) / [源码组织](https://github.com/AudioReach) | 音频处理图、Engine、Graph Services、APM、模块与跨域控制 | 概述明确以 Linux 支持为主；不能直接套为 Android 手机 BSP。主许可 BSD-3-Clause，具体仓库仍需检查第三方声明 |
| [Qualcomm FastRPC](https://github.com/qualcomm/fastrpc) | CPU 与 DSP RPC 用户态实现、远端句柄、调用和参数 | BSD-3-Clause；不能代替 DSP 固件、内核和实际设备集成资料，不等同于 Binder |
| [linux-msm mainline-status](https://linux-msm.github.io/mainline-status/) / [仓库](https://github.com/linux-msm/mainline-status) | 高通 SoC 与子系统的上游支持矩阵，适合参考技术地图组织 | MIT；是上游 Linux 支持状态，不是 Android BSP 兼容性或课程完整性证明 |
| [Bootlin 历史 Android 课件](https://bootlin.com/doc/legacy/android/) | 构建、启动、内核和系统开发的教学结构 | CC BY-SA 3.0；已见 Android 幻灯片最后更新为 2019-02-15，主材料仓库活跃不等于 Android 课程已更新 |

## 正式内容的一手资料入口

- [Android Open Source Project 文档](https://source.android.com/docs)
- [Android Developers](https://developer.android.com/)
- [AOSP Gitiles 源码](https://android.googlesource.com/)
- [Qualcomm Developer](https://www.qualcomm.com/developer)
- [Qualcomm 文档门户](https://docs.qualcomm.com/)

这些入口用于后续按主题建立来源清单。不能仅引用门户首页来支撑具体机制、版本变化或设备形态差异。
