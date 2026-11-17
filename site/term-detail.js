// Shared full-definition presentation; the source record also feeds inline help.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function lines(text, capacity) {
 const result=[]; let line='', width=0;
 for(const char of text){const next=/[\x00-\x7f]/.test(char)?.55:1;if(width+next>capacity&&line){result.push(line.trim());line='';width=0;}line+=char;width+=next;}
 if(line)result.push(line.trim());
 return result;
}
function textBlock(text,x,y,capacity,className,lineHeight){
 return `<text x="${x}" y="${y}" text-anchor="middle" class="${className}">${lines(text,capacity).map((line,i)=>`<tspan x="${x}" dy="${i?lineHeight:0}">${escape(line)}</tspan>`).join('')}</text>`;
}

export function renderTermDiagram(item,t){
 const v=p=>t(p.zh,p.en), diagram=item.diagram, prefix=`term-${item.id}`;
 const nodes=diagram.nodes.map(n=>({...n,x:20+n.col*280,y:60+n.row*210,w:220,h:76}));
 const rows=Math.max(...nodes.map(n=>n.row))+1, height=rows===1?190:400;
 const kinds={data:t('数据 / 信号','Data / signal'),control:t('控制 / 配置','Control / setup'),reply:t('结果 / 反馈','Result / feedback'),relation:t('组成 / 关联','Structure / relation')};
 const links=diagram.edges.map((e,i)=>{
  const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);
  const duplicate=diagram.edges.slice(0,i).some(p=>(p.from===e.from&&p.to===e.to)||(p.from===e.to&&p.to===e.from));
  const lane=duplicate?14:0;let path,lx,ly;
  if(a.row===b.row){const right=b.x>a.x,sy=a.y+a.h/2+lane;path=`M${right?a.x+a.w:a.x} ${sy} H${right?b.x:b.x+b.w}`;lx=(a.x+a.w/2+b.x+b.w/2)/2;ly=a.y-(duplicate?38:14);}
  else {const down=b.y>a.y,sx=a.x+a.w/2+lane,tx=b.x+b.w/2+lane,sy=down?a.y+a.h:a.y,ty=down?b.y:b.y+b.h,my=(sy+ty)/2+lane;path=`M${sx} ${sy} V${my} H${tx} V${ty}`;lx=a.col===b.col?sx+(a.col===2?-88:88):(sx+tx)/2;ly=my-12+(duplicate?30:0);}
  return `<g class="term-edge ${e.kind}" data-from="${escape(e.from)}" data-to="${escape(e.to)}"><path d="${path}" ${e.kind==='relation'?'':`marker-end="url(#${prefix}-${e.kind})"`}/>${textBlock(v(e.label),lx,ly,22,'term-edge-label',13)}</g>`;
 }).join('');
 const used=[...new Set(diagram.edges.map(e=>e.kind))];
 return `<figure class="term-figure"><div class="term-figure-heading"><h3>${t('在关系中理解','See the relationships')}</h3><span>${t('原创教学图','Original learning diagram')}</span></div><div class="term-diagram-scroll" tabindex="0" role="region" aria-label="${t('术语关系图，小屏可横向滚动','Term relationship diagram; horizontally scrollable on small screens')}"><svg viewBox="0 0 820 ${height}" role="img" aria-labelledby="${prefix}-title ${prefix}-desc" class="term-diagram"><title id="${prefix}-title">${escape(item.term)} · ${t('关系图','relationship diagram')}</title><desc id="${prefix}-desc">${escape(v(diagram.caption))} ${diagram.edges.map(e=>{const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);return escape(`${v(a.label)} — ${v(e.label)} — ${v(b.label)}.`);}).join(' ')}</desc><defs>${['data','control','reply'].map(kind=>`<marker id="${prefix}-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" class="term-arrow ${kind}"/></marker>`).join('')}</defs>${links}${nodes.map(n=>`<g class="term-diagram-node ${n.focus?'is-focus':''}" data-term-node="${escape(n.id)}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9"/>${textBlock(v(n.label),n.x+n.w/2,n.y+27,14,'term-node-label',17)}${textBlock(v(n.sub),n.x+n.w/2,n.y+53,19,'term-node-sub',14)}</g>`).join('')}</svg></div><div class="term-diagram-legend">${used.map(kind=>`<span class="${kind}">${kind==='data'?'━▶':kind==='control'?'┄▶':kind==='reply'?'···▶':'—'} ${kinds[kind]}</span>`).join('')}</div><figcaption>${escape(v(diagram.caption))}</figcaption></figure>`;
}

export function renderTermDetail(item,t){
 const v=p=>t(p.zh,p.en);
 return `<div class="term-position"><span>${t('所在位置','WHERE IT FITS')}</span><p>${escape(v(item.position))}</p></div>${renderTermDiagram(item,t)}<section class="term-questions" aria-label="${t('三个关键问题','Three key questions')}">${item.questions.map((qa,i)=>`<div class="term-question"><span class="term-question-number">0${i+1}</span><div><h3>${escape(v(qa.q))}</h3><p>${escape(v(qa.a))}</p></div></div>`).join('')}</section><div class="term-boundary"><strong>${t('别混淆','Keep in mind')}</strong><p>${escape(v(item.note))}</p></div><section class="term-scope"><h3>${t('适用范围','Scope')}</h3><p>${escape(v(item.scope))}</p></section><section class="term-sources"><h3>${t('依据与延伸阅读','Sources & further reading')}</h3><ul>${item.sources.map(s=>`<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a></li>`).join('')}</ul></section>`;
}
