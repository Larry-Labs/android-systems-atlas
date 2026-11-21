# 虚拟化与隔离专题首版验证记录

日期：2026-11-20

## 内容与来源

- 已复核 Armv8-A virtualization、AOSP AVF overview/architecture/Why AVF、AOSP AAOS SDV、Qualcomm Linux virtualization、Qualcomm Linux software overview、Qualcomm Gunyah source、Qualcomm QHEE secure-boot material 和 Qualcomm/Dolby automotive white paper。
- QHEE 与 Gunyah 按不同公开资料语境呈现，没有写成所有产品适用的一对一替代关系。
- Android AVF 的 pVM 与车载 Qualcomm/Dolby 资料中的 PVM/GVM 已在正文和术语中分开说明。

## 浏览器检查

使用本地静态服务 `python3 -m http.server 4173 --bind 127.0.0.1 --directory site` 打开 `#/domain/virtualization`，通过 CUA 实际查看页面。

| 检查项 | 结果 |
| --- | --- |
| 中文页面与专题路由 | 通过 |
| 英文切换与英文正文 | 通过 |
| 主图横纵关系和图例 | 通过，检查了 EL0–EL3、Guest、Hypervisor、共享通道、宿主后端和物理设备 |
| 节点旁解释 | 通过，点击 Hypervisor 后显示职责和来源 |
| 键盘节点入口 | 通过，聚焦 Hypervisor 节点后按 Enter 可打开解释 |
| 全屏进入/退出 | 通过，退出后恢复正文页面 |
| 数据方向动画暂停/继续 | 通过，按钮在“暂停动画”和“继续动画”之间切换 |
| 控制台错误 | 未观察到 error/warning |
| 手机视口 | 本轮未完成 |
| 实体设备、Android 编译、BSP 实测 | 未执行 |

图中文字下划线问题已修复。原因是 SVG 交互节点采用 `<a>` 时继承了全局链接样式，现改为 SVG `g[role=button]` 交互节点，并在页面事件委托中保留键盘和点击入口。

## 2026-11-21 主图复验

- 旧图在侧栏目录旁固定为 1180px，普通阅读时宿主端落在可视区域外。新版复用音频专题的顶部目录、图框、控件、图例和连线样式。
- 用本地静态服务和应用内浏览器验证中英文各四种宽度。1440、1024、768px 默认看到横向两端，390px 无页面横向溢出，键盘可将图内横滚至右端。
- 验证 1440×1020 全屏完整可见，390×844 全屏保留图内横、纵滚动。检查筛选、暂停/继续、减少动态效果、Enter 打开解释、Esc 逐层关闭及回焦。音频页全屏打开与 Esc 退出回归通过。
- 对照 Arm、AOSP 和 VirtIO 1.2 检查权限归属、描述符和完成状态，调整图面和相应释义。原生手机触摸与实体设备未实测。

### 权限分层调整复验

- EL0–EL3 改用带层名的横向分区。共享队列独立标为跨层通道，驱动至硬件的请求线从 EL2、EL3 边框外走线。
- 在 Chrome 内核的应用内浏览器核对中英文和 1440、1024、768、390px，检查组件归属、标签裁切或覆盖、全屏、键盘释义和 Esc 退出。减少动态效果时未生成流动光点。

### IoT 与车载局部图复验（2026-11-21）

以下为三图版的历史验证记录。

- 复核 Qualcomm/Dolby 白皮书图 9 的控制与样本走线，以及 [AAOS SDV system architecture](https://source.android.com/docs/automotive/sdv/sdv-system-architecture) 的虚拟设备与跨 VM 通信关系。
- 用 Chromium 核对三张图的中英文和 1440、1024、768、390、320px。图中文字在画布与节点内，窄屏溢出局限在图框内。检查高通音频服务节点的点击、空格、来源链接与 Esc 回焦。

用户随后要求移除车载音频案例。复验中英文的 1440px 和 390px，章节只显示 IoT 对照和 AAOS SDV 分工图，SDV Core 节点可打开解释并通过 Esc 回焦。
