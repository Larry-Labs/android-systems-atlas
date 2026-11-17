import assert from 'node:assert/strict';
import {glossary} from '../site/glossary.js';
assert.equal(glossary.length,34);
assert.equal(new Set(glossary.map(t=>t.id)).size,34);
const spellings=glossary.flatMap(t=>[t.term,...(t.aliases||[])].map(x=>x.toLowerCase()));
assert.equal(new Set(spellings).size,spellings.length,'ambiguous aliases');
for(const id of ['q6asm','q6routing','q6apm','adm','audioreach','gpr','period','tinyalsa','mmap','audio-patch','apr','underrun'])assert.ok(glossary.some(t=>t.id===id),id);
const bilingual=(v,label)=>{for(const lang of ['zh','en'])assert.ok(typeof v?.[lang]==='string'&&v[lang].trim().length>0,`${label}.${lang}`);};
for(const term of glossary){
 for(const field of ['definition','note','position','scope'])bilingual(term[field],`${term.id}.${field}`);
 assert.equal(term.questions.length,3,term.id);
 for(const qa of term.questions){bilingual(qa.q,term.id+'.q');bilingual(qa.a,term.id+'.a');}
 assert.ok(term.sources.length>0,term.id);
 for(const source of term.sources){assert.ok(source.title);assert.equal(new URL(source.url).protocol,'https:');}
 const diagram=term.diagram;bilingual(diagram.caption,term.id+'.caption');
 assert.ok(diagram.nodes.length>=3&&diagram.nodes.length<=5,term.id);
 const ids=new Set(diagram.nodes.map(n=>n.id));assert.equal(ids.size,diagram.nodes.length);
 const cells=new Set();
 for(const n of diagram.nodes){assert.ok([0,1,2].includes(n.col)&&[0,1].includes(n.row));cells.add(n.col+','+n.row);bilingual(n.label,term.id+'.node');bilingual(n.sub,term.id+'.sub');}
 assert.equal(cells.size,diagram.nodes.length,term.id+' duplicate cell');
 for(const e of diagram.edges){assert.ok(ids.has(e.from)&&ids.has(e.to)&&e.from!==e.to,term.id+' edge');assert.ok(['data','control','reply','relation'].includes(e.kind));bilingual(e.label,term.id+'.edge');}
 const reached=new Set([diagram.nodes[0].id]);let changed=true;
 while(changed){changed=false;for(const e of diagram.edges)if(reached.has(e.from)||reached.has(e.to)){for(const id of [e.from,e.to])if(!reached.has(id)){reached.add(id);changed=true;}}}
 assert.equal(reached.size,ids.size,term.id+' disconnected diagram');
}
console.log('PASS: 34 bilingual term records, Q&A, sources and connected diagrams');
