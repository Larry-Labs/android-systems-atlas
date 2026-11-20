import { audioNodeExplanations, audioEdgeExplanations } from './audio-explanations.js?v=344aee49d425';
import { showDiagramPopover, closeDiagramPopover, isDiagramPopoverAnchor } from './diagram-popover.js?v=6e59a476be74';
// One connected diagram: vertical responsibilities, horizontal collaboration.
import { sourceTitle } from './source-links.js?v=12527b297d95';
const pair=(zh,en)=>({zh,en});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const source=(url,text)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
const nodes=[
 ["policy",950,205,220,64,"AudioPolicyService",{"zh":"包含 AudioPolicyManager · 输出与路由决策","en":"Contains AudioPolicyManager · output / route decisions"}],
 ["pcm",180,100,180,68,"PCM",{"zh":"应用已有的样本","en":"Samples in the app"}],
 ["java",460,100,210,68,"AudioTrack",{"zh":"Java / Kotlin API","en":"Java / Kotlin API"}],
 ["native",800,100,230,68,"Native AudioTrack",{"zh":"同一应用进程内","en":"In the same app process"}],
 ["flinger",240,300,220,74,"AudioFlinger",{"zh":"普通软件混音","en":"Ordinary software mixing"}],
 ["adapter",660,300,220,74,"libaudiohal",{"zh":"框架侧 HAL 适配","en":"Framework-side HAL adapter"}],
 ["reply",300,470,180,64,"reply FMQ",{"zh":"状态 / 消费量 / 位置","en":"Status / count / position"}],
 ["data",600,470,180,64,"audio.fmq",{"zh":"本例载荷：PCM 字节","en":"Payload here: PCM bytes"}],
 ["command",850,470,180,64,"command FMQ",{"zh":"burst / start / pause …","en":"burst / start / pause …"}],
 ["stream",240,620,220,76,"HAL output stream",{"zh":"读取命令与音频，写入响应","en":"Read commands/audio; reply"}],
 ["module",880,620,210,76,"IModule",{"zh":"AIDL 管理接口","en":"AIDL management interface"}],
 ["backend",240,790,260,76,"HAL backend / tinyalsa",{"zh":"本例：ALSA 用户态访问","en":"Here: ALSA userspace access"}],
 ["pcm-core",240,960,260,76,"ALSA PCM",{"zh":"参数、状态与播放位置","en":"Parameters, state, position"}],
 ["card",700,960,390,76,"ASoC card / DAPM",{"zh":"Machine：连接；DAPM：按路由供电","en":"Machine links; route-based power"}],
 ["ring",240,1120,260,76,{"zh":"播放环形缓冲","en":"Playback ring buffer"},{"zh":"内存中的 PCM，不是 FMQ","en":"PCM in memory, not FMQ"}],
 ["dai-driver",620,1120,250,76,"DMA / CPU DAI driver",{"zh":"配置传输、接口与时钟","en":"Configure transfer/interface/clocks"}],
 ["codec-driver",930,1120,240,76,"Codec driver",{"zh":"寄存器、音量与电源","en":"Registers, gain, power"}],
 ["dma",240,1330,260,76,{"zh":"DMA 引擎","en":"DMA engine"},{"zh":"硬件搬运内存样本","en":"Hardware moves memory samples"}],
 ["dai-hw",620,1330,250,76,{"zh":"SoC 音频控制器","en":"SoC audio controller"},{"zh":"本例：I²S 数字接口","en":"Here: I²S digital interface"}],
 ["codec-hw",930,1330,240,76,"Codec / DAC",{"zh":"数字样本 → 模拟信号","en":"Digital samples → analog signal"}],
 ["speaker",930,1500,240,76,{"zh":"功放 → 扬声器","en":"Amplifier → speaker"},{"zh":"驱动负载，产生声音","en":"Drive the load; produce sound"}]].map(([id,x,y,w,h,title,sub])=>({id,x,y,w,h,title,sub}));
const edges=[
 ['policy-output','control',1,'M950 237 H570 V285 H420 V300',740,240,pair('输出 / 路由请求','Output / route requests'),'policy','flinger'],
 ['hal-operations','control',2,'M460 360 H660',560,385,pair('输出 / patch 操作','Output / patch ops'),'flinger','adapter'],
 ['write','data',0,'M360 134 H460',410,119,'write · PCM','pcm','java'],
 ['jni','data',0,'M670 134 H800',735,119,'JNI','java','native'],
 ['buffer','data',1,'M915 168 V220 H350 V300',610,211,pair('共享音轨缓冲 · 客户端写 / 服务端读','Shared track buffer · client writes / server reads'),'native','flinger'],
 ['track-control','control',1,'M850 168 V252 H290 V300',560,244,pair('Binder · 音轨控制（概览）','Binder · track control (overview)'),'native','flinger'],
 ['mix','data',1,'M460 337 H660',560,325,pair('混音输出 PCM','Mixed PCM output'),'flinger','adapter'],
 ['to-data','data',2,'M750 374 V430 H690 V470',738,421,pair('写入字节','Write bytes'),'adapter','data'],
 ['from-data','data',2,'M690 534 V572 H350 V620',545,563,pair('读取 PCM','Read PCM'),'data','stream'],
 ['to-command','control',2,'M880 345 H940 V470',994,411,pair('写入命令','Write command'),'adapter','command'],
 ['from-command','control',2,'M940 534 V596 H430 V620',800,587,pair('读取命令','Read command'),'command','stream'],
 ['to-reply','reply',2,'M290 620 V556 H390 V534',245,563,pair('写入响应','Write reply'),'stream','reply'],
 ['from-reply','reply',2,'M390 470 V405 H700 V374',511,397,pair('读取响应','Read reply'),'reply','adapter'],
 ['open','control',2,'M880 316 H1120 V646 H1090',1085,382,pair('开流 / 端口 / patch','Open / ports / patch'),'adapter','module'],
 ['open-result','reply',2,'M1090 675 H1155 V282 H845 V300',1010,294,pair('返回流接口 + 描述符','Return stream + descriptor'),'module','adapter'],
 ['create','control',2,'M880 656 H460',670,645,pair('创建输出流','Create output stream'),'module','stream'],
 ["backend", "data", 3, "M350 696 V790", 492, 753, {"zh": "PCM → 选定 ALSA 后端", "en": "PCM → selected ALSA backend"}, "stream", "backend"],
 ["pcm-submit", "data", 3, "M370 866 V960", 553, 935, {"zh": "非 mmap：提交 PCM", "en": "Non-mmap PCM write"}, "backend", "pcm-core"],
 ["buffer-fill", "data", 3, "M370 1036 V1120", 451, 1086, {"zh": "写入环形缓冲", "en": "Write ring buffer"}, "pcm-core", "ring"],
 ["pcm-ops", "control", 3, "M500 995 H550 V1158 H620", 563, 1054, {"zh": "PCM 回调", "en": "PCM ops"}, "pcm-core", "dai-driver"],
 ["card-dai", "control", 3, "M745 1036 V1120", 758, 1085, {"zh": "连接 / 配置", "en": "Link / configure"}, "card", "dai-driver"],
 ["card-codec", "control", 3, "M1035 1036 V1120", 1037, 1085, {"zh": "路由 / 电源", "en": "Route / power"}, "card", "codec-driver"],
 ["dma-config", "control", 3, "M650 1196 V1240 H460 V1330", 540, 1231, {"zh": "准备 / 启停", "en": "Prepare / trigger"}, "dai-driver", "dma"],
 ["dai-config", "control", 3, "M745 1196 V1330", 774, 1280, {"zh": "接口 / 时钟", "en": "Interface / clocks"}, "dai-driver", "dai-hw"],
 ["codec-config", "control", 3, "M1050 1196 V1330", 1050, 1260, {"zh": "寄存器控制 · I²C / SPI", "en": "Register control · I²C / SPI"}, "codec-driver", "codec-hw"],
 ["dma-fetch", "data", 3, "M350 1196 V1330", 345, 1266, {"zh": "DMA 取样", "en": "DMA fetch"}, "ring", "dma"],
 ["period", "reply", 3, "M240 1365 H165 V998 H240", 255, 1217, {"zh": "播放进展 → 驱动 → ALSA", "en": "Progress → driver → ALSA"}, "dma", "pcm-core"],
 ["dma-out", "data", 3, "M500 1368 H620", 560, 1353, "PCM", "dma", "dai-hw"],
 ["i2s", "data", 3, "M870 1368 H930", 901, 1353, "I²S", "dai-hw", "codec-hw"],
 ["analog", "data", 3, "M1050 1406 V1500", 1050, 1461, {"zh": "模拟音频", "en": "Analog audio"}, "codec-hw", "speaker"],
 ['stream-power','control',3,'M500 1018 H700',600,1008,pair('流活动 / 供电','Stream / power'),'pcm-core','card'],
 ['mixer-config','control',3,'M500 850 H590 V895 H895 V960',745,884,pair('控制接口 · 路由设置','Control interface · routing'),'backend','card']
].map(([id,kind,phase,path,lx,ly,label,from,to])=>({id,kind,phase,path,lx,ly,label,from,to}));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let mode='both',playing=!reducedMotion.matches,selected='pcm',selectionType='node',translate,afterDraw;
const read=(value,t)=>typeof value==='string'?value:t(value.zh,value.en);
function graph(t){
 const r=v=>esc(read(v,t));
 const chosen=selectionType==='edge'?edges.find(e=>e.id===selected):null;
 return `<svg class="atlas-canvas" viewBox="0 0 1200 1620" xmlns="http://www.w3.org/2000/svg" aria-labelledby="audio-map-title audio-map-desc">
 <title id="audio-map-title">${t('普通 PCM 播放：层级与协作关系','Ordinary PCM playback: layers and collaboration')}</title><desc id="audio-map-desc">${t('纵向排列应用、系统音频、HAL实现、驱动与硬件。FMQ连接系统音频侧与HAL侧；设备访问后端包含在HAL实现内。实线传递音频，虚线传递控制，蓝色点线返回结果。节点和连线均可选择。','Apps, system audio, HAL implementation, drivers and hardware arranged vertically. FMQ connects system audio and HAL; the device-access backend is inside the HAL implementation. Solid lines carry audio, dashed lines control, and blue dotted lines replies. Nodes and edges are selectable.')}</desc>
 <defs>${[['data','#25756b'],['control','#a16c2c'],['reply','#527d99']].map(([kind,color])=>`<marker id="arrow-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${color}" stroke-width="1.5"/></marker>`).join('')}</defs>
 <rect x="130" y="62" width="1048" height="126" rx="12" class="map-band app-band"/>
 <rect x="130" y="200" width="1048" height="190" rx="12" class="map-band native-band"/>
 <path d="M130 452 H1178 M130 548 H1178" class="queue-boundary"/>
 <rect x="130" y="608" width="1048" height="298" rx="12" class="map-band hal-band" data-map-region="hal"/>
 <rect x="210" y="774" width="950" height="110" rx="9" class="hal-backend-region" data-map-region="hal-backend"/>
 <text x="550" y="794" class="map-zone-label">${t('HAL 内部：设备访问后端与用户态库','INSIDE HAL: DEVICE BACKEND AND USERSPACE LIBRARIES')}</text>
 <rect x="130" y="944" width="1048" height="290" rx="12" class="map-band kernel-band"/>
 <rect x="130" y="1310" width="1048" height="285" rx="12" class="map-band hardware-band"/>
 <text x="550" y="816" class="map-zone-label">${t('下半图：板载 PCM 示例 · ALSA 非 mmap · DMA · I²S','BOARD PCM EXAMPLE: ALSA NON-MMAP · DMA · I²S')}</text>
 <text x="550" y="839" class="map-zone-label">${t('不是所有 Android 或高通设备的统一实现','NOT A UNIVERSAL ANDROID OR QUALCOMM IMPLEMENTATION')}</text>
 ${[[105,'01',pair('应用进程','APP PROCESS')],[316,'02',pair('系统音频','SYSTEM AUDIO')],[645,'03',pair('HAL 实现','HAL IMPLEMENTATION')],[984,'04',pair('内核 / 驱动','KERNEL / DRIVERS')],[1350,'05',pair('物理硬件','HARDWARE')]].map(([y,n,label])=>`<text x="18" y="${y}" class="map-tier-number">${n}</text><text x="18" y="${y+25}" class="map-tier-label">${r(label)}</text>`).join('')}
 <text x="150" y="83" class="map-zone-label">${t('客户端代码在同一进程内','CLIENT CODE IN ONE PROCESS')}</text>
 <text x="150" y="280" class="map-zone-label">${t('原生服务与适配层 · 组件视图','NATIVE SERVICES AND ADAPTER · COMPONENT VIEW')}</text>
 <text x="150" y="446" class="map-zone-label">${t('FMQ 共享内存通信：连接系统音频侧与 HAL 侧','FMQ SHARED-MEMORY COMMUNICATION BETWEEN SYSTEM AUDIO AND HAL')}</text>
 <line x1="145" y1="915" x2="1160" y2="915" class="map-space-boundary"/><text x="720" y="905" class="map-zone-label">${t('用户空间 / 内核边界','USERSPACE / KERNEL BOUNDARY')}</text>
 <text x="210" y="1545" class="map-zone-label">${t('绿色：样本与信号；虚线：软件配置','GREEN: SAMPLES / SIGNALS. DASHED: SOFTWARE CONFIGURATION.')}</text>
 ${edges.map(e=>{const related=chosen?chosen.id===e.id:selectionType==='node'&&(e.from===selected||e.to===selected);return `<a role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" data-map-edge="${e.id}" aria-label="${r(e.label)}" aria-pressed="${chosen?.id===e.id}" class="map-edge ${e.kind} ${related?'selected':''}"><path d="${e.path}" class="edge-hit"/><path d="${e.path}" class="edge-line" marker-end="url(#arrow-${e.kind})"/><text x="${e.lx}" y="${e.ly}" class="edge-label" text-anchor="middle">${r(e.label)}</text>${playing&&e.kind==='data'&&mode!=='control'?`<circle r="4" class="map-particle"><animateMotion dur="2.5s" repeatCount="indefinite" path="${e.path}"/></circle>`:''}</a>`;}).join('')}
 ${nodes.map(n=>`<a role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" data-map-node="${n.id}" aria-label="${r(n.title)} — ${r(n.sub)}" aria-pressed="${selectionType==='node'&&selected===n.id}" class="map-node ${selectionType==='node'&&selected===n.id?'selected':''}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9"/><text x="${n.x+n.w/2}" y="${n.y+28}" class="map-node-title" text-anchor="middle">${r(n.title)}</text><text x="${n.x+n.w/2}" y="${n.y+49}" class="map-node-sub" text-anchor="middle">${r(n.sub)}</text></a>`).join('')}
 </svg>`;
}
function audioDetail(t){
 const item=selectionType==='node'?nodes.find(n=>n.id===selected):edges.find(e=>e.id===selected);
 const explanation=(selectionType==='node'?audioNodeExplanations:audioEdgeExplanations)[item.id];
 return {label:selectionType==='node'?t('组件解释','COMPONENT'):t('连线解释','CONNECTION'),title:read(selectionType==='node'?item.title:item.label,t),text:read(explanation.text,t),sources:explanation.sources.map(url=>({url,title:sourceTitle(url)}))};
}
export function audioLearning(t){
 translate=t;
 return `<div class="architecture-lab" data-view="${mode}"><div class="architecture-intro"><h2 id="audio-map-heading">${t('普通 PCM 播放：层级与协作','Ordinary PCM playback: layers and collaboration')}</h2><p>${t('AudioTrack MODE_STREAM · 普通软件混音 · AIDL / 非 MMAP。','AudioTrack MODE_STREAM · Ordinary software mixing · AIDL / non-MMAP.')}</p></div>
 <div class="map-toolbar"><div class="lab-options" role="group" aria-label="${t('流向视图','Flow view')}">${[['both','完整关系','All relationships'],['data','追踪音频数据','Trace audio data'],['control','追踪控制与返回','Trace control and replies']].map(([v,zh,en])=>`<button data-flow-view="${v}" aria-pressed="${mode===v}">${t(zh,en)}</button>`).join('')}</div><div class="map-actions" role="group" aria-label="${t('图操作','Diagram controls')}"><button data-flow-action="play" aria-pressed="${playing}" ${reducedMotion.matches?'disabled':''}>${playing?t('暂停动画','Pause animation'):t('继续动画','Resume animation')}</button><button class="subtle-button" data-map-expand aria-expanded="false">${t('放大图','Expand diagram')} ↗</button></div></div>
 <p class="motion-note">${reducedMotion.matches?t('已遵循减少动态效果设置：静态阅读','Reduced-motion preference: static reading'):t('光点仅示意数据方向；控制与返回保持静态，不表示持续开流或真实时序。','Dots indicate data direction only. Control and reply paths stay static; this is not repeated setup or real timing.')}</p><div class="map-legend"><span class="data">━▶ ${t('音频 / 数据路径','Audio / data path')}</span><span class="control">┄▶ ${t('控制 / 建立关系','Control / setup')}</span><span class="reply">···▶ ${t('响应 / 返回','Reply / return')}</span></div>
 <div class="architecture-viewport" tabindex="0" role="region" aria-label="${t('架构图，可滚动查看；放大后支持上下左右滚动；Tab 选择节点与连线','Architecture diagram; scroll to explore, in both directions when enlarged; Tab to nodes and edges')}">${graph(t)}</div>

 <p class="map-scope">${t('HAL 队列及开流关系依据 android-17.0.0_r1。应用与服务端共享音轨缓冲，内部同步细节省略；驱动以下选择ALSA非mmap写入与直接DMA/I²S教学例子，不代表具体BSP。AudioPolicy仅展示输出/路由职责；完整决策逻辑与状态机未展开。线交叉不代表连接，以端点为准。动画只演示路径，不代表真实时序或速度。','HAL queue and setup relationships use android-17.0.0_r1. The app and service share a track buffer; synchronization internals are omitted; the driver/device section uses ALSA non-mmap writes and direct DMA/I²S, not a specific BSP. AudioPolicy shows output/routing responsibilities only; full decision logic and state machines are omitted. Crossing lines do not connect unless they share an endpoint. Animation illustrates paths, not timing or speed.')}</p></div>`;
}
function setExpanded(expanded,{reset=false,focus=false}={}){
 closeDiagramPopover();
 const lab=document.querySelector('.architecture-lab');if(!lab)return;
 let dialog=lab.closest('.diagram-fullscreen');
 if(expanded&&!dialog){
  dialog=document.createElement('dialog');dialog.className='diagram-fullscreen';
  dialog.setAttribute('aria-label',translate('音频架构图 · 全屏','Audio architecture · Full screen'));
  lab.before(dialog);dialog.append(lab);
  dialog.addEventListener('cancel',event=>{event.preventDefault();if(!document.querySelector('.term-popover:not([hidden]),.diagram-popover:not([hidden])'))setExpanded(false,{reset:true,focus:true});});
  dialog.showModal();
 }else if(!expanded&&dialog){
  const panel=dialog.querySelector('#term-popover');if(panel)document.body.append(panel);
  dialog.close();dialog.before(lab);dialog.remove();
 }
 lab.classList.toggle('expanded',expanded);
 const button=lab.querySelector('[data-map-expand]');
 button.setAttribute('aria-expanded',String(expanded));
 button.textContent=expanded?translate('退出全屏 ↙','Exit full screen ↙'):translate('放大图 ↗','Expand diagram ↗');
 if(reset){const viewport=lab.querySelector('.architecture-viewport');viewport.scrollLeft=0;viewport.scrollTop=0;}
 if(focus||expanded)button.focus({preventScroll:true});
}
function draw(focus){const root=document.querySelector('#audio-flow');if(!root)return;closeDiagramPopover();const expanded=root.querySelector('.architecture-lab')?.classList.contains('expanded');const viewport=root.querySelector('.architecture-viewport');const left=viewport?.scrollLeft||0,top=viewport?.scrollTop||0;const dialogScroll=root.querySelector('.diagram-fullscreen')?.scrollTop||0;const panel=root.querySelector('#term-popover');if(panel)document.body.append(panel);root.querySelector('.diagram-fullscreen')?.close();root.innerHTML=audioLearning(translate);setExpanded(!!expanded);if(expanded)root.querySelector('.diagram-fullscreen').scrollTop=dialogScroll;const next=root.querySelector('.architecture-viewport');next.scrollLeft=left;next.scrollTop=top;afterDraw?.(root);if(focus)root.querySelector(focus)?.focus({preventScroll:true});}
export function handleLearning(target,annotate){afterDraw=annotate;let focus;
 const isDetail=target.matches('[data-map-node],[data-map-edge]');
 if(isDetail&&isDiagramPopoverAnchor(target)){closeDiagramPopover({restoreFocus:true});return true;}
 if(target.dataset.mapNode){selected=target.dataset.mapNode;selectionType='node';focus=`[data-map-node="${selected}"]`;}
 else if(target.dataset.mapEdge){selected=target.dataset.mapEdge;selectionType='edge';focus=`[data-map-edge="${selected}"]`;}
 else if(target.hasAttribute('data-map-expand')){const expanded=!document.querySelector('.architecture-lab').classList.contains('expanded');setExpanded(expanded,{reset:true});return true;}
 else if(target.dataset.flowView){mode=target.dataset.flowView;focus=`[data-flow-view="${mode}"]`;}
 else if(target.dataset.flowAction==='play'){playing=!playing&&!reducedMotion.matches;focus='[data-flow-action="play"]';}
 else return false;draw(focus);
 if(isDetail)showDiagramPopover(document.querySelector(focus),audioDetail(translate),annotate,translate);
 return true;
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(document.querySelector('.architecture-lab.expanded')&&!document.querySelector('dialog[open],.term-popover:not([hidden])'))setExpanded(false,{reset:true,focus:true});}const target=event.target.closest('[data-map-node],[data-map-edge]');if(target&&['Enter',' '].includes(event.key)){event.preventDefault();target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
document.addEventListener('visibilitychange',()=>{const svg=document.querySelector('.atlas-canvas');if(svg){if(document.hidden)svg.pauseAnimations();else svg.unpauseAnimations();}});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)playing=false;if(document.querySelector('#audio-flow'))draw();});
export function foundationViews(t) {
 return `<section class="foundation-section"><div class="section-heading"><div><span class="section-index">02 — BOUNDARIES</span><h2>${t('同一张系统地图，换个角度看','Same system. A different perspective.')}</h2></div></div><p>${t('上面解释职责；下面区分执行位置。层级、进程、语言边界不是一回事。','The map above explains responsibilities. This view separates execution locations. Layers, processes and language boundaries are different concepts.')}</p>
 <div class="boundary-map"><div class="process-box"><span class="note-key">${t('客户端进程 · 用户空间','CLIENT PROCESS · USER SPACE')}</span><strong>Java / Kotlin</strong><div class="boundary-arrow">↓ <span>${t('JNI · 同进程语言接口','JNI · same-process language interface')}</span></div><strong>C / C++</strong></div><div class="ipc-bridge"><strong>Binder IPC</strong><span>→ ${t('请求 / 参数','Request / arguments')}</span><span>← ${t('返回 / 结果','Return / result')}</span></div><div class="process-box"><span class="note-key">${t('服务进程 · 用户空间','SERVICE PROCESS · USER SPACE')}</span><strong>${t('服务实现','Service implementation')}</strong><p>${t('接收请求并执行工作','Receives requests and performs work')}</p></div></div>
 <div class="boundary-caption"><p>${t('这是一个同步调用的最小示例，不是全部 Android 进程清单。Java 也能直接使用 Binder 绑定，不是每次 IPC 都需要先经过 JNI。Binder 内核传输在此省略。','This is a minimal synchronous-call example, not an inventory of Android processes. Java can use Binder bindings directly; JNI is not required before every IPC. Kernel-side Binder transport is omitted.')}</p><div>${source('https://developer.android.com/ndk/guides/jni-tips','JNI')} · ${source('https://source.android.com/docs/core/architecture/ipc/binder-overview','Binder')} · ${source('https://source.android.com/docs/core/architecture/aidl','AIDL')}</div></div>
 <div class="scenario-entry"><span class="section-index">03 — FOLLOW A SCENARIO</span><h2>${t('把关系连起来：播放一段声音','Connect the pieces: play a sound')}</h2><ol class="scenario-path"><li>${t('应用已有 PCM','App has PCM')}</li><li>AudioTrack</li><li>${t('系统播放处理','System playback')}</li><li>Audio HAL</li><li>${t('设备输出','Device output')}</li></ol><p>${t('这里的箭头只表示选定场景的数据方向。进入音频图解后，可分开追踪控制请求、音频载荷与返回结果。','Arrows show data direction in the selected scenario. In the audio diagram, inspect control requests, audio payloads and return results separately.')}</p><a class="button primary" href="#/domain/audio">${t('打开可交互的音频图解','Open the interactive audio diagram')} →</a></div></section>`;
}
