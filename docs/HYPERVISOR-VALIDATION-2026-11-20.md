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
