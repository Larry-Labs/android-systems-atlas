import { readingHelp } from './reading-help.js?v=445f878c6b1a';
// Original comparison, grounded in the Linux v6.12 sources below.
// The two lanes are alternatives, never a successive processing chain.
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderQualcommComparison(t) {
  const tr = (zh, en) => escapeHtml(t(zh, en));
  const node = (id, x, y, w, title, sub, kind = '') => `<a role="button" tabindex="0" aria-pressed="false" aria-label="${tr('解释：','Explain: ')}${title}" data-reading-help="qread-${id}" data-reading-node="qread-${id}" class="reading-node ${kind}"><rect x="${x}" y="${y}" width="${w}" height="68" rx="7"/><text x="${x+w/2}" y="${y+28}" text-anchor="middle" class="reading-node-title">${title}</text><text x="${x+w/2}" y="${y+50}" text-anchor="middle" class="reading-node-sub">${sub}</text></a>`;
  const edge = (id, from, to, kind, path, x, y, label) => `<g tabindex="0" role="img" aria-label="${label}" data-reading-edge="qread-${id}" data-from="qread-${from}" data-to="qread-${to}" class="reading-edge reading-${kind}">${kind==='data'?`<circle class="reading-particle" r="4"><animateMotion dur="3.8s" repeatCount="indefinite" path="${path}"/></circle>`:''}<path class="reading-edge-line" d="${path}" marker-end="url(#qread-arrow-${kind})"/><text x="${x}" y="${y}" text-anchor="middle">${label}</text></g>`;
  const root = 'https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/';
  return `<div class="qualcomm-reading">
    <div class="reading-heading"><span class="reading-kicker">LINUX v6.12 · DSP</span><h3>${tr('高通音频：两套路径，分别阅读','Qualcomm audio: two separate paths')}</h3></div>
    <p class="reading-motion-note">${tr('绿色样本线默认缓慢流动；控制与返回只在聚焦时强调。动画表达方向，不代表真实时序或速度。','Green sample paths flow slowly by default; control and reply paths emphasize on focus. Animation shows direction, not real timing or speed.')}</p>
    <div class="reading-legend" aria-label="${tr('图例','Legend')}"><span class="reading-control">┄→ ${tr('请求／配置','Requests / setup')}</span><span class="reading-reply">···→ ${tr('响应／事件','Replies / events')}</span><span class="reading-data">━→ ${tr('样本访问','Sample access')}</span></div>
    <div class="reading-scroll" tabindex="0" role="region" aria-label="${tr('高通音频路径对照图，小屏可横向滚动','Qualcomm audio comparison; scroll horizontally on small screens')}">
      <svg class="reading-canvas" viewBox="0 0 960 790" xmlns="http://www.w3.org/2000/svg" role="group" aria-labelledby="qread-title qread-desc">
        <title id="qread-title">${tr('ASM / ADM 与 AudioReach：主机、DSP 和共享缓冲','ASM / ADM and AudioReach: host, DSP and shared buffers')}</title>
        <desc id="qread-desc">${tr('上下两条路径独立。上图前端调用内核客户端，通过 APR 与 DSP 的 ASM 服务交换请求和事件。下图内核客户端通过 GPR 与 DSP 的 APM 及图端点通信。两图的样本都另存在共享缓冲中，绿色箭头表示 DSP 访问样本，不是命令包携带样本。','The lanes are independent. Above, the front end calls the kernel client, exchanging APR requests and events with DSP ASM. Below, the kernel client uses GPR with DSP APM and graph endpoints. Samples reside in separate shared buffers; green arrows mean DSP sample access, not samples inside command packets.')}</desc>
        <defs>${['control','reply','data'].map(k=>`<marker id="qread-arrow-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" class="reading-arrow reading-${k}"/></marker>`).join('')}</defs>
        <text x="32" y="34" class="reading-column">${tr('主处理器 · Linux 内核','HOST · LINUX KERNEL')}</text>
        <text x="710" y="34" class="reading-column">${tr('DSP · 服务与固件','DSP · SERVICES / FIRMWARE')}</text>
        <rect x="14" y="62" width="932" height="414" rx="9" class="reading-lane"/>
        <rect x="14" y="494" width="932" height="282" rx="9" class="reading-lane"/>
        <path d="M662 62 V476 M662 494 V776" class="reading-boundary"/>
        <text x="32" y="94" class="reading-lane-title">01 · ASM / ADM</text>
        <text x="32" y="526" class="reading-lane-title">02 · AudioReach</text>
        ${edge('asm-call','asm-front','asm-client','control','M202 169 H290',246,153,tr('流操作','Stream ops'))}
        ${edge('asm-request','asm-client','asm-dsp','control','M480 151 H710',595,137,tr('APR 请求','APR requests'))}
        ${edge('asm-reply','asm-dsp','asm-client','reply','M710 188 H480',595,214,tr('状态／完成事件','Status / completion'))}
        ${edge('asm-event','asm-client','asm-front','reply','M290 188 H202',246,215,tr('事件','Events'))}
        ${edge('asm-samples','asm-buffer','asm-dsp','data','M480 284 H815 V203',594,274,tr('共享内存样本','Shared-memory samples'))}
        ${node('asm-front',32,135,170,'q6asm-dai',tr('ALSA 前端适配','ALSA front end'))}
        ${node('asm-client',290,135,190,'q6asm',tr('内核客户端','Kernel client'))}
        ${node('asm-dsp',710,135,210,tr('ASM 服务','ASM service'),tr('DSP 侧音频流服务','DSP stream service'),'reading-dsp')}
        ${node('asm-buffer',290,250,190,tr('共享缓冲','Shared buffer'),tr('PCM 样本在这里','PCM samples live here'),'reading-buffer')}
        <text x="32" y="346" class="reading-side-note">${tr('独立的路由配置支线 · 不传输 PCM','Separate routing setup · no PCM transfer')}</text>
        ${edge('route-call','routing','adm-client','control','M202 403 H290',246,389,tr('调用','Call'))}
        ${edge('route-apr','adm-client','adm-dsp','control','M480 403 H710',595,389,tr('APR 路由配置','APR routing setup'))}
        ${node('routing',32,369,170,'q6routing',tr('流与设备路径映射','Stream / device routing'))}
        ${node('adm-client',290,369,190,'q6adm',tr('主机客户端','Host client'))}
        ${node('adm-dsp',710,369,210,tr('ADM 服务','ADM service'),tr('设备路径与矩阵映射','Device paths / matrix map'),'reading-dsp')}
        ${edge('apm-request','apm-client','apm-dsp','control','M480 583 H710',595,569,tr('GPR 请求','GPR requests'))}
        ${edge('apm-reply','apm-dsp','apm-client','reply','M710 620 H480',595,646,tr('响应／完成事件','Replies / completion'))}
        ${edge('apm-samples','apm-buffer','apm-dsp','data','M480 716 H815 V635',594,706,tr('共享内存样本','Shared-memory samples'))}
        ${node('apm-client',290,567,190,'q6apm',tr('内核客户端','Kernel client'))}
        ${node('apm-dsp',710,567,210,tr('APM / 图端点','APM / graph endpoints'),tr('合并示意：不同接收方','Grouped: distinct targets'),'reading-dsp')}
        ${node('apm-buffer',290,682,190,tr('共享缓冲','Shared buffer'),tr('音频字节在这里','Audio bytes live here'),'reading-buffer')}
        <text x="32" y="593" class="reading-side-note"><tspan x="32">${tr('另一套图管理模型','A separate graph model')}</tspan><tspan x="32" dy="23">${tr('不是上图的下一站','Not the next stage above')}</tspan></text>
      </svg>
    </div>
    ${readingHelp()}
    <div class="reading-notes">
      <p>${tr('q6asm 是主机侧客户端，负责与 DSP 音频流服务通信；q6routing 经 ADM 配置路由，不逐块转发样本。','q6asm is the host client for the DSP stream service; q6routing configures routes through ADM rather than forwarding sample blocks.')}</p>
      <p>${tr('AudioReach 路径中，q6apm 管理处理图；GPR 共享缓冲写请求引用地址、长度和映射句柄，实际音频字节留在缓冲中。图中合并表示管理服务与图端点，不表示它们是同一个接收方。','In the AudioReach path, q6apm manages graphs; GPR shared-buffer write requests reference an address, length and mapping handle, with audio bytes in the buffer. The diagram groups management and graph endpoints without making them one recipient.')}</p>
    </div>
    <p class="reading-scope">${tr('两图仅说明上游机制，不是必经的串行链。完成事件不等于扬声器呈现；Android 版本或芯片品牌不能证明产品采用哪套 BSP／固件实现。','These are separate upstream models, not a mandatory serial chain. Completion is not speaker presentation; Android versions or chip brands do not establish a product’s BSP or firmware implementation.')}</p>
    <div class="reading-sources"><span>${tr('源码 · 固定版本','SOURCE · PINNED VERSION')}</span>${[['q6asm-dai.c','q6asm-dai'],['q6routing.c','q6routing'],['q6adm.c','q6adm'],['q6apm.c','q6apm']].map(([file,label])=>`<a href="${root+file}" target="_blank" rel="noopener noreferrer">${label} · v6.12 ↗</a>`).join('')}</div>
  </div>`;
}
