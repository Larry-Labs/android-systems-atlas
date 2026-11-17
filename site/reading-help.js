// Contextual explanations for grouped teaching nodes, distinct from glossary definitions.
import { sourceTitle } from './source-links.js?v=b5bd0e8df5b1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kernel='https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html';
const soc='https://docs.kernel.org/sound/soc/';
const qcom='https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/';
const records={
 'dread-alsa':['ALSA PCM','ALSA 管理流状态、参数与缓冲位置；本例非 mmap 写入把 PCM 放入播放缓冲。供数不足可产生 underrun。','ALSA manages stream state, parameters and buffer positions. This non-mmap example writes PCM into the playback buffer; insufficient data can cause an underrun.',kernel],
 'dread-asoc':['ASoC / DAPM','这是合并职责视图：Machine 绑定声卡组件，DAPM 根据路由和流活动协调电源。PCM 样本不依次穿过它们。','These are grouped responsibilities: Machine binds card components; DAPM coordinates power from routes and stream activity. PCM samples do not pass through them in sequence.',soc+'overview.html'],
 'dread-drivers':['组件驱动 / Component drivers','本框合并 DMA、CPU DAI 与 Codec 等组件驱动的配置职责。它们设置传输、数字接口、时钟和寄存器；不是一个叫“组件驱动”的独立模块。','This box groups DMA, CPU DAI and Codec driver responsibilities: transfer setup, digital interfaces, clocks and registers. It is not a single module named “component drivers”.',soc+'platform.html'],
 'dread-ring':['播放环形缓冲 / Playback ring buffer','这里存放等待硬件消费的 PCM。生产位置与消费位置帮助判断可用空间；它与 HAL 边界的临时 FMQ 是不同缓冲。','This holds PCM awaiting hardware consumption. Producer and consumer positions track available space; it is distinct from the transient FMQ at the HAL boundary.',kernel],
 'dread-dma':['DMA 引擎 / DMA engine','驱动设置传输后，DMA 硬件从内存搬运样本到音频控制器。进展经驱动报告给 ALSA；不等于这些样本已从扬声器呈现。','Once configured by drivers, DMA hardware transfers samples from memory to the audio controller. Progress is reported through the driver to ALSA, not proof of speaker presentation.',kernel],
 'dread-output':['音频控制器与 Codec / Controller and Codec','本框合并硬件输出段：控制器经 I²S 传递数字样本，Codec 的 DAC 转为模拟信号，再经适当放大驱动输出。器件集成边界依硬件而异。','This groups hardware output: the controller sends digital samples over I²S; the Codec DAC converts them to analog signals for suitable amplification and output. Device integration varies.',soc+'codec.html'],
 'qread-asm-front':['q6asm-dai','ALSA 前端适配通过 q6asm 发起 DSP 流操作；完成事件可推进 ALSA 缓冲位置并通知 period。不是 DSP 服务本体。','The ALSA front end uses q6asm for DSP stream operations. Completion events can advance ALSA buffer position and notify a period; this is not the DSP service itself.',qcom+'q6asm-dai.c'],
 'qread-asm-client':['q6asm','主机内核客户端通过 APR 发送流请求；写请求引用共享缓冲的地址、长度与映射信息。PCM 字节保存在缓冲中。','The host kernel client sends stream requests over APR. Write requests reference shared-buffer addresses, lengths and mapping information; PCM bytes remain in the buffer.',qcom+'q6asm.c'],
 'qread-asm-dsp':['ASM 服务 / ASM service','这是 DSP 侧音频流服务，与主机侧 q6asm 客户端分开。图用共享缓冲箭头表示样本访问，APR 箭头表示请求及事件。','This is the DSP audio stream service, distinct from the host q6asm client. Shared-buffer arrows mean sample access; APR arrows mean requests and events.',qcom+'q6asm.c'],
 'qread-asm-buffer':['共享样本缓冲 / Shared sample buffer','保存主机与 DSP 交换的样本。请求引用这块缓冲，不把整段 PCM 填进 APR 命令。缓冲映射不代表无需同步。','Holds samples exchanged between host and DSP. Requests reference this buffer rather than embedding PCM in APR commands. Mapping does not remove synchronization requirements.',qcom+'q6asm.c'],
 'qread-routing':['q6routing','管理流与设备路径的路由关系，调用 q6adm 打开设备路径、配置矩阵映射；不是逐块转发 PCM 的节点。','Manages routing between streams and device paths, calling q6adm to open paths and configure matrix mappings. It does not forward PCM blocks.',qcom+'q6routing.c'],
 'qread-adm-client':['q6adm','主机侧 ADM 客户端，把路由操作组织为 APR 请求发送到 DSP。它与 DSP 上的 ADM 服务不是同一个组件。','The host ADM client packages routing operations into APR requests for the DSP. It is separate from the DSP ADM service.',qcom+'q6adm.c'],
 'qread-adm-dsp':['ADM 服务 / ADM service','DSP 侧设备路径与流映射服务。这里仅画路由控制关系；不表示音频样本沿这条虚线经过 q6routing、q6adm 和 ADM。','DSP service for device paths and stream mappings. Only routing control is shown; samples do not travel along this dashed client/service chain.',qcom+'q6adm.c'],
 'qread-apm-client':['q6apm','AudioReach 主机客户端管理处理图，并通过 GPR 与管理服务及图端点通信；它不是 Android 的 AudioPolicyManager。','The AudioReach host client manages processing graphs and communicates with management services and graph endpoints through GPR. It is not Android AudioPolicyManager.',qcom+'q6apm.c'],
 'qread-apm-dsp':['APM / 图端点 / Graph endpoints','此框合并两类 DSP 接收方：APM 负责图管理，音频共享缓冲写请求发往图的相应端点。不是所有请求都送给同一个服务。','This groups two DSP recipient roles: APM handles graph management; shared-buffer audio writes target the corresponding graph endpoint. Requests do not all go to one service.',qcom+'q6apm.c'],
 'qread-apm-buffer':['共享音频缓冲 / Shared audio buffer','音频字节位于共享缓冲中。GPR 写请求携带地址、长度和映射句柄；本图省略固件内部图拓扑，不代表具体产品。','Audio bytes reside in shared buffers. GPR writes carry addresses, lengths and mapping handles; internal firmware topology is omitted, not a specific product implementation.',qcom+'q6apm.c']
};
export function readingHelp(t){return `<div class="reading-node-help" aria-live="polite"><p>${t('点击图中节点查看职责；键盘可用 Tab 选择、Enter 或空格打开。','Select a diagram node for its role; use Tab, then Enter or Space with a keyboard.')}</p></div>`;}
export function handleReadingHelp(target,annotate,t){
 const id=target.dataset.readingHelp;if(!id)return false;
 const item=records[id];if(!item)return false;
 const root=target.closest('.qualcomm-reading,.audio-reading');
 root.querySelectorAll('[data-reading-help]').forEach(n=>n.setAttribute('aria-pressed',String(n===target)));
 const panel=root.querySelector('.reading-node-help');
 panel.innerHTML=`<h4>${esc(item[0])}</h4><p>${esc(t(item[1],item[2]))}</p><a href="${item[3]}" target="_blank" rel="noopener noreferrer">${esc(sourceTitle(item[3]))} ↗</a>`;
 annotate(panel);
 root.querySelectorAll('[data-reading-edge]').forEach(edge=>edge.classList.remove('is-emphasized'));
 const related=[...root.querySelectorAll(`[data-reading-edge][data-from=\"${id}\"], [data-reading-edge][data-to=\"${id}\"]`)];
 related.forEach(edge=>edge.classList.add('is-emphasized'));
 if(related.length)setTimeout(()=>related.forEach(edge=>edge.classList.remove('is-emphasized')),1800);
 return true;
}

export function observeReadingAnimations() {
 const roots=document.querySelectorAll('.audio-reading,.qualcomm-reading');
 if(!roots.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>roots.forEach(root=>root.classList.toggle('motion-paused',reduced.matches));
 update();
 if(reduced.addEventListener) reduced.addEventListener('change',update,{once:false});
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-paused',!entry.isIntersecting)),{threshold:0.08});
 roots.forEach(root=>observer.observe(root));
 document.addEventListener('focusin',e=>{const root=e.target.closest?.('.audio-reading,.qualcomm-reading');if(root&&e.target.closest('[data-reading-help],[data-reading-edge]'))root.classList.add('motion-paused-focus')});
 document.addEventListener('focusout',e=>{const root=e.target.closest?.('.audio-reading,.qualcomm-reading');if(root)root.classList.remove('motion-paused-focus')});
}
