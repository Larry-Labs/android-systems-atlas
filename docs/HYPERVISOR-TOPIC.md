# 虚拟化与隔离专题编写稿 / Hypervisor & Isolation Topic Draft

状态：首版实现稿。内容核对日期：2026-11-20。本文档是内部编写与审查材料，网站正文只呈现经过重写的教学内容。

## 1. 读者应看懂什么

读者能够用一张图区分应用、Guest OS、宿主服务、Hypervisor 和物理设备，理解一次虚拟设备 I/O 中控制、数据与反馈分别经过哪里，并能把 Android AVF/pKVM、Qualcomm Gunyah/QHEE、IoT 单系统/多系统及车载 PVM/GVM 放回同一套概念框架。

## 2. 固定范围

- ARM64 异常级与虚拟化边界，重点解释 EL0、EL1、EL2、EL3 的职责，不把异常级直接等同于进程或固定软件组件。
- 一次 Guest 通过 VirtIO 或共享内存访问宿主设备的教学路径，明确前端、后端、VMM/Resource Manager、Hypervisor 和硬件的关系。
- Android 13 引入 AVF 的背景，Android 17 作为当前项目基线，解释 pKVM、pVM、Microdroid、VirtualizationService 和 crosvm 的关系。
- Qualcomm 公开资料中的 QHEE 安全启动语境、Gunyah Type-1 hypervisor、Qualcomm Linux 默认 EL1/EL2路径和 KVM 选择条件。
- IoT 中的单一 HLOS、多个 Guest OS 和 KVM alternative。车载中采用 Qualcomm/Dolby 公开资料的 PVM/GVM 语境，并链接 AOSP AAOS SDV 的公开多 VM/VirtIO 方向。

排除完整芯片启动链、私有 BSP 拓扑、具体 SoC 的出货配置、功能安全认证结论、性能数字和设备实测。QNX 只在公开资料明确出现的车载语境中作为 Guest/HLOS 示例，不把用户线程中的“HQX”直接扩写成产品事实。

## 3. 虚拟机 I/O 主图

### 图名

虚拟机 I/O：从 Guest 到物理设备

### 画布分区

| 纵向边界 | 图中对象 | 解释重点 |
| --- | --- | --- |
| EL0 | Guest 应用、VMM、本例的宿主 VirtIO 后端 | 发起 I/O、管理虚拟机、读取队列 |
| EL1 | Guest 内核及 VirtIO 前端、宿主驱动 | 系统调用、提交请求及访问设备 |
| EL2 | Hypervisor | vCPU 与 Stage-2 内存隔离 |
| EL3 | 安全监控固件 | 平台启动与安全服务 |
| 独立于异常级 | 共享队列及缓冲区、物理设备 | 通信载体与实际设备分别标示 |

### 横向关系

本例请求路径为 Guest 应用 → Guest 内核 → VirtIO 前端 → 共享队列及缓冲区 → 宿主用户态 VirtIO 后端 → 宿主驱动 → 物理设备。

VMM 经宿主内核发起创建 VM，Hypervisor 提供 Stage-2 映射与隔离，平台启动单独标示。宿主后端写回完成状态，Guest 前端再从队列取回。描述符记录缓冲区地址、长度和读写方向，具体设备可采用其他后端、通知和启动机制。

## 4. 版本和平台差异

设备形态区采用三张局部图。IoT 对照单系统直接运行和多虚拟机共享 SoC。车载白皮书图 9 的播放样本从 GVM 经共享内存送往 DSP，PVM 的音频服务参与控制。AAOS SDV 另画并列的 Core、Media、IVI 执行配置、跨 VM 通信与 VirtIO 运行环境。

| 维度 | 本专题采用的结论 | 证据范围 |
| --- | --- | --- |
| Android 版本 | Android 13 引入 AVF 安全虚拟化。Android 17 的 AOSP SDV 公开资料进一步描述多 VM/VirtIO 形态。 | AOSP `Why AVF`、AVF overview、AAOS SDV |
| Android 版本 | pKVM 是 AVF 的标准 Hypervisor 方向，Microdroid 是运行在 pVM 中的精简 Android，不等同于完整 Android。 | AOSP AVF architecture、Microdroid |
| 设备形态 | 通用 Android 设备可使用 AVF/pVM 进行隔离执行，是否支持取决于设备能力和实现。 | AOSP AVF overview |
| 设备形态 | AAOS SDV 的公开架构采用多 VM 与 VirtIO，SDV Core、SDV Media、SDV IVI 是 AOSP 公开的执行配置。 | AOSP AAOS SDV |
| 厂商实现 | Qualcomm Linux 文档描述 Gunyah 默认位于 EL2、Linux 位于 EL1，KVM 方案要求 Linux 从 EL2 启动并有不同的资源与设备支持边界。 | Qualcomm Linux virtualization guide |
| 厂商实现 | Qualcomm/Dolby 车载白皮书使用 Primary HLOS/PVM、Guest HLOS/GVM、VirtIO-Snd 和共享内存的音频示例。 | Qualcomm/Dolby white paper |

## 5. 术语覆盖

首版必须覆盖：EL0、EL1、EL2、EL3、VM、Guest OS、Type-1 hypervisor、Stage-2 translation、pKVM、pVM、AVF、Microdroid、VMM、VirtIO、Gunyah、Resource Manager、QHEE、PVM、GVM、QNX、KVM、VHE。

其中 `pVM` 表示 Android AVF 的 protected virtual machine，`PVM` 表示 Qualcomm/Dolby 车载资料中的 Physical/Primary Virtual Machine。大小写和上下文必须保留。

## 6. 证据登记

| 来源 | 支持结论 | 限制 |
| --- | --- | --- |
| [Armv8-A virtualization](https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20virtualization.pdf) | EL0–EL3、EL2 虚拟化控制、Stage-2、Type-1/hosted hypervisor关系 | 2019 Armv8-A架构学习资料，不代表具体 Android 或 Qualcomm 产品 |
| [AOSP Why AVF?](https://source.android.com/docs/core/virtualization/whyavf) | Android 13 引入 AVF 安全虚拟化，AVF 与 TrustZone 的关系 | 解释目标和背景，不是设备支持清单 |
| [AOSP AVF architecture](https://source.android.com/docs/core/virtualization/architecture) | pKVM、EL2、pVM firmware、crosvm、pVM启动关系 | AOSP参考实现，设备厂商还需满足集成条件 |
| [Virtual I/O Device (VIRTIO) Version 1.2](https://docs.oasis-open.org/virtio/virtio/v1.2/virtio-v1.2.html) | 第 2.7–2.8 节描述符、缓冲区和完成通知 | 协议依据，具体后端位置和硬件由产品实现决定 |
| [AOSP AVF overview](https://source.android.com/docs/core/virtualization) | AVF、pVM、Microdroid、VirtualizationService、crosvm术语 | 仅支持具备 AVF 的设备，不能推断所有 Android 设备都有 |
| [AOSP AAOS SDV](https://source.android.com/docs/automotive/sdv) | Android 17 `26Q2` 的 SDV 多 VM/VirtIO 执行配置 | SDV公开架构，不代表所有量产车载产品 |
| [Qualcomm Linux virtualization](https://docs.qualcomm.com/bundle/publicresource/topics/80-70022-3/virtualization.html) | Gunyah职责、默认 EL1/EL2路径、KVM条件与限制 | Qualcomm Linux custom BSP，不能推断 Android出货BSP |
| [Qualcomm Linux software overview](https://docs.qualcomm.com/bundle/publicresource/topics/80-70014-115/overview.html) | Qualcomm Linux使用 Gunyah 的公开定位 | Qualcomm Linux资料，不代表所有平台 |
| [Qualcomm Gunyah source](https://github.com/quic/gunyah-hypervisor) | 开源 Type-1 hypervisor、EL2、VM隔离和基础能力 | 开源参考项目，不能覆盖私有平台扩展 |
| [Qualcomm secure boot improvements](https://www.qualcomm.com/news/onq/2019/08/secure-boot-and-image-authentication-improvements) | QHEE产品名及 REE 启动语境 | 不证明 QHEE 与 Gunyah 是统一替代关系 |
| [Qualcomm/Dolby cabin tuning](https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/dolby-qualcomm-white-paper.pdf) | 车载 PVM/GVM、Primary/Guest HLOS、VirtIO-Snd和共享内存音频示例 | 单一公开白皮书中的音频架构，不代表所有车载产品 |

## 7. 实现与验收状态

- 稿件：本文件已完成首版范围和证据边界。
- 页面：已接入 `virtualization` 路由，完成双语正文、横纵一体主图、路径筛选、数据方向动画、暂停/继续、全屏和节点旁解释。
- 术语：已接入 15 个双语条目，正文中的 EL2、VirtIO、VMM、AVF、pKVM、pVM、Gunyah、QHEE 等入口可进入完整释义。
- 浏览器：主图改版后的双语尺寸、手机图内滚动、全屏、动效与键盘验收见 [11 月 21 日主图复验](HYPERVISOR-VALIDATION-2026-11-20.md#2026-11-21-主图复验)。
- 设备：未做实体设备、Android 编译或 Qualcomm BSP 实测。
