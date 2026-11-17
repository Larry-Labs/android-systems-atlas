import { readingHelp } from './reading-help.js?v=445f878c6b1a';
import { renderQualcommComparison } from './qualcomm-reading.js?v=df593f0e1ef1';
let frames = 240;
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function periodDemo(t) {
 const ms=frames/48;
 return `<div class="period-controls"><span>${t('固定采样率 48 kHz · 示例设为 4 个分段','48 kHz · four segments in this example')}</span><div>${[240,480].map(n=>`<button data-period-frames="${n}" aria-pressed="${frames===n}">${n} ${t('帧','frames')}</button>`).join('')}</div></div><div class="period-buffer" aria-label="${t('四个等长缓冲分段','Four equal buffer segments')}">${[1,2,3,4].map(n=>`<div><span>0${n}</span><strong>${frames} ${t('帧','frames')}</strong><small>${ms} ms</small></div>`).join('')}</div><div class="period-equations" aria-live="polite"><div><span>${t('一个分段的音频时长','Audio duration per segment')}</span><strong>${frames} ${t('帧','frames')} ÷ 48,000 ${t('帧/秒','frames/s')} = ${frames/48000} s = ${ms} ms</strong></div><div><span>${t('整个缓冲的音频容量','Audio capacity of this buffer')}</span><strong>${frames*4} ${t('帧','frames')} = ${ms*4} ms</strong></div></div>`;
}
export function handleAudioReading(target, annotate, t) {
 if(!target.dataset.periodFrames)return false;
 frames=Number(target.dataset.periodFrames);
 const root=document.querySelector('#period-demo');root.innerHTML=periodDemo(t);annotate(root);
 root.querySelector(`[data-period-frames="${frames}"]`).focus({preventScroll:true});return true;
}
export function renderAudioReading(t) {
 const tr=(a,b)=>escape(t(a,b));
 const node=(id,x,y,w,title,sub)=>`<a role="button" tabindex="0" aria-pressed="false" aria-label="${tr('解释：','Explain: ')}${title}" data-reading-help="dread-${id}" data-reading-node="dread-${id}"><rect x="${x}" y="${y}" width="${w}" height="64" rx="8"/><text x="${x+w/2}" y="${y+27}" text-anchor="middle" class="node-title">${title}</text><text x="${x+w/2}" y="${y+49}" text-anchor="middle">${sub}</text></a>`;
 const edge=(id,k,d,x,y,label)=>`<g tabindex="0" role="img" aria-label="${label}" data-reading-edge="dread-${id}" class="${k}"><path class="reading-edge-line" d="${d}" marker-end="url(#dread-${k})"/>${k==='data'?`<circle class="reading-particle" r="4"><animateMotion dur="3.4s" repeatCount="indefinite" path="${d}"/></circle>`:''}<text x="${x}" y="${y}" text-anchor="middle">${label}</text></g>`;
 return `<section id="driver-reading" class="audio-reading"><header><span class="reading-eyebrow">01 / DRIVER</span><h2>${tr('驱动段：三种关系，一起看','The driver: three relationships together')}</h2><p>${tr('本例：板载 PCM 播放，ALSA 非 mmap 写入 → DMA 搬运 → I²S → Codec/DAC。tinyalsa 是用户态访问 ALSA 的库；下面放大内核与硬件之间的关系。','Example: board PCM playback, ALSA non-mmap writes → DMA transfer → I²S → codec/DAC. tinyalsa is a user-space library for accessing ALSA; below we zoom into the kernel and hardware.')}</p></header>
 <p class="reading-motion-note">${tr('绿色样本线默认缓慢流动；配置与反馈保持静态，聚焦时短暂强调。动画只表示方向，不代表真实时序或速度。','Green sample paths flow slowly by default; setup and feedback stay static and emphasize briefly when focused. Animation shows direction, not real timing or speed.')}</p><div class="driver-legend"><span class="data">━→ ${tr('样本／信号','Samples / signals')}</span><span class="control">┄→ ${tr('配置／活动','Setup / activity')}</span><span class="reply">···→ ${tr('消费进展','Consumption progress')}</span></div>
 <div class="driver-scroll" tabindex="0" role="region" aria-label="${tr('驱动关系图，小屏可横向滚动','Driver relationships; scroll horizontally on small screens')}"><svg viewBox="0 0 960 450" role="group" aria-labelledby="dread-title"><title id="dread-title">${tr('样本走向硬件，配置并行，消费进展返回内核','Samples flow to hardware, setup runs alongside, consumption progress returns to the kernel')}</title><defs>${['data','control','reply'].map(k=>`<marker id="dread-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" class="${k}"/></marker>`).join('')}</defs>
 <rect class="band" x="16" y="18" width="928" height="154" rx="10"/><text class="band-title" x="36" y="48">${tr('内核软件 · 负责管理与配置','KERNEL SOFTWARE · MANAGEMENT & SETUP')}</text>
 <rect class="band memory" x="16" y="285" width="255" height="145" rx="10"/><text class="band-title" x="36" y="313">${tr('内存 · 存放样本','MEMORY · SAMPLES')}</text>
 <rect class="band hardware" x="315" y="285" width="629" height="145" rx="10"/><text class="band-title" x="335" y="313">${tr('硬件 · 搬运与输出','HARDWARE · TRANSFER & OUTPUT')}</text>
 ${edge('write','data','M140 150 V335',193,262,tr('写入样本','Write samples'))}
 ${edge('activity','control','M240 118 H340',290,100,tr('流活动','Activity'))}
 ${edge('setup','control','M540 118 H650',595,100,tr('协同配置','Coordinate'))}
 ${edge('dma-setup','control','M690 150 V239 H440 V335',560,229,tr('设置传输','Set up transfer'))}
 ${edge('io-setup','control','M800 150 V335',862,262,tr('接口／时钟','Interface / clocks'))}
 ${edge('samples','data','M240 367 H340',310,351,'PCM')}
 ${edge('transfer','data','M540 367 H650',595,351,'PCM')}
 ${edge('feedback','reply','M340 382 H270 V201 H95 V150',170,191,tr('经驱动反馈','Via driver'))}
 ${node('alsa',40,86,200,'ALSA PCM',tr('管理播放缓冲','Playback buffer control'))}
 ${node('asoc',340,86,200,'ASoC / DAPM',tr('绑定组件 · 路由与电源','Binding · routing / power'))}
 ${node('drivers',650,86,250,tr('组件驱动','Component drivers'),tr('配置硬件与传输','Configure hardware / transfers'))}
 ${node('ring',40,335,200,tr('环形缓冲','Ring buffer'),tr('等待消费的 PCM','PCM awaiting consumption'))}
 ${node('dma',340,335,200,tr('DMA 引擎','DMA engine'),tr('从内存搬运样本','Transfer samples from memory'))}
 ${node('output',650,335,250,tr('音频控制器 → Codec/DAC','Controller → Codec/DAC'),'I²S → '+tr('模拟信号 → 输出','analog signal → output'))}
 </svg></div>${readingHelp()}
 <div class="driver-notes"><div><span class="data">01 · ${tr('样本走哪里','Where samples go')}</span><p>${tr('环形缓冲 → DMA → 音频控制器 → Codec/DAC。驱动是软件；搬运和输出由相应硬件完成。','Ring buffer → DMA → audio controller → Codec. Drivers are software; the corresponding hardware moves and outputs samples.')}</p></div><div><span class="control">02 · ${tr('谁负责配置','Who configures it')}</span><p>${tr('ASoC 的 Machine 绑定组件；DAPM 根据路由与流活动管理电源。配置关系与样本路径并行。','ASoC Machine binds components; DAPM manages power from routes and stream activity. Configuration runs alongside the sample path.')}</p></div><div><span class="reply">03 · ${tr('反馈说明什么','What feedback means')}</span><p>${tr('驱动报告缓冲消费进展，供内核更新可用空间；不是“扬声器已经播放完”。','Drivers report buffer-consumption progress so the kernel can update available space; this does not mean the speaker has finished playing.')}</p></div></div>
 <div class="period-reading"><span class="reading-eyebrow">02 / BUFFER</span><h3>${tr('把“进展”放回缓冲里理解','Understand progress inside the buffer')}</h3><p>${tr('ALSA period 是缓冲处理的分段单位。用下面的帧数换算音频时长，更容易区分容量、通知与听到声音的时间。','An ALSA period is a buffer-processing segment. Converting frames to audio duration helps distinguish capacity, notifications and when sound is heard.')}</p><div id="period-demo">${periodDemo(t)}</div><p class="reading-caveat">${tr('这是所选缓冲配置的算术示例：5 ms / 10 ms 不保证相同节奏的中断，20 ms / 40 ms 也不是端到端延迟；实际通知机制与播放时间取决于驱动和完整输出链。','This is arithmetic for the chosen buffer example: 5 / 10 ms does not guarantee that interrupt cadence, and 20 / 40 ms is not end-to-end latency. Notifications and presentation depend on the driver and the complete output path.')}</p></div>
 <div class="driver-boundaries"><h3>${tr('哪些能通用，哪些要看设备','What generalizes, and what depends on the device')}</h3><dl><div><dt>${tr('Android 版本','Android version')}</dt><dd>${tr('AIDL / HIDL 描述 HAL 接口边界，不能据此推断内核后端。','AIDL / HIDL describe the HAL boundary; they do not identify the kernel backend.')}</dd></div><div><dt>${tr('产品实现','Product implementation')}</dt><dd>${tr('ALSA、DSP 方案取决于内核、BSP 与固件；手机或车载形态不直接决定物理链路。','ALSA and DSP choices depend on the kernel, BSP and firmware. Phone or automotive form factors do not determine the physical path.')}</dd></div><div><dt>${tr('输出设备','Output device')}</dt><dd>${tr('USB 音频经 USB 链路到外设，不能套用本例板载 I²S / Codec 连线。','USB audio reaches an external device over USB; it does not follow this onboard I²S / Codec wiring.')}</dd></div></dl></div>
 <div class="reading-sources">${[['https://docs.kernel.org/sound/soc/overview.html','ASoC'],['https://docs.kernel.org/sound/soc/dapm.html','DAPM'],['https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html','ALSA PCM'],['https://source.android.com/docs/core/audio/usb','USB Audio']].map(([url,label])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</div>
 ${renderQualcommComparison(t)}</section>`;
}
