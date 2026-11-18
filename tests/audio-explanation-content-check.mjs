import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {audioNodeExplanations,audioEdgeExplanations,audioLocalExplanations,audioExplanationSources} from '../site/audio-explanations.js';
import {audioSources} from '../site/data.js';
import {sourceTitle} from '../site/source-links.js';
import {renderAudioReading} from '../site/audio-reading.js';

// Compare explanation coverage with actual diagram entry points, not a second ID list.
const code=fs.readFileSync(new URL('../site/learning.js',import.meta.url),'utf8');
const {nodes,edges}=vm.runInNewContext(code.split('const reducedMotion=')[0].replace(/^import .*;\n/gm,'')+';({nodes,edges})');
const sameKeys=(records,ids)=>assert.deepEqual(Object.keys(records).sort(),[...ids].sort());
sameKeys(audioNodeExplanations,nodes.map(n=>n.id));
sameKeys(audioEdgeExplanations,edges.map(e=>e.id));
for(const lang of ['zh','en']){
 const localHtml=renderAudioReading((zh,en)=>lang==='zh'?zh:en);
 const localIds=[...localHtml.matchAll(/data-reading-help="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(localIds).size,localIds.length,'duplicate local entry point');
 sameKeys(audioLocalExplanations,localIds);
}
const bibliography=new Set(audioSources.map(s=>s.url));
const records=[...Object.values(audioNodeExplanations),...Object.values(audioEdgeExplanations),...Object.values(audioLocalExplanations)];
for(const item of records){
 for(const lang of ['zh','en'])assert.ok(item.text[lang]?.trim(),`missing ${lang}`);
 assert.ok(item.sources.length>0,'missing evidence');
 assert.equal(new Set(item.sources).size,item.sources.length,'duplicate source');
 for(const url of item.sources){
  assert.equal(new URL(url).protocol,'https:');
  assert.ok(sourceTitle(url).trim(),'missing source title');
  assert.ok(bibliography.has(url),`source missing from chapter: ${url}`);
 }
}
for(const lang of ['zh','en'])assert.equal(new Set(Object.values(audioEdgeExplanations).map(e=>e.text[lang])).size,edges.length,'connections share boilerplate');
assert.equal(new Set(audioExplanationSources).size,audioExplanationSources.length);
assert.equal(records.length,69);
console.log(`PASS: ${nodes.length} nodes, ${edges.length} connections, 16 local nodes, both languages and ${audioExplanationSources.length} cited sources covered`);
