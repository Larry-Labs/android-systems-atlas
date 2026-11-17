"""Rendered checks for driver and DSP explanatory diagrams."""
import json,subprocess
from pathlib import Path

def b(*args):
 p=subprocess.run(['agent-browser','--session','atlas-reading','--json',*args],capture_output=True,text=True,check=True)
 r=json.loads(p.stdout);assert r['success'],r
 return r.get('data',{})
def js(s):return b('eval',s).get('result')
b('open','http://127.0.0.1:4173/#/domain/audio');b('reload');b('snapshot','-i')
results=[]
for lang in ['zh','en']:
 b('click',f'[data-lang={lang}]')
 for width in [1440,768,390]:
  b('set','viewport',str(width),'1000')
  result=js('''(()=>{const root=document.querySelector('#driver-reading');const issues=[];for(const svg of root.querySelectorAll('svg')){const nodes=[...svg.querySelectorAll('[data-reading-node] rect')].map(n=>n.getBBox());for(const text of svg.querySelectorAll('[data-reading-edge] text')){const r=text.getBBox();if(nodes.some(n=>r.x<n.x+n.width&&r.x+r.width>n.x&&r.y<n.y+n.height&&r.y+r.height>n.y))issues.push(text.textContent);}for(const g of svg.querySelectorAll('[data-reading-node]')){const r=g.querySelector('rect').getBBox();for(const t of g.querySelectorAll('text')){const a=t.getBBox();if(a.x<r.x||a.x+a.width>r.x+r.width)issues.push('node text: '+t.textContent);}}}return {issues,svgCount:root.querySelectorAll('svg').length,overflow:document.documentElement.scrollWidth>innerWidth};})()''')
  assert result['svgCount']==2 and not result['issues'] and not result['overflow'],(lang,width,result)
  results.append({'lang':lang,'width':width,**result})
 js("document.querySelector('[data-period-frames=\"480\"]').scrollIntoView({block:'center'})")
 b('click','[data-period-frames="480"]')
 assert js("document.querySelector('.period-equations').textContent.includes('40 ms') && document.querySelector('.period-buffer').textContent.includes('10 ms')")
 b('click','[data-period-frames="240"]')
 assert js("document.querySelector('.period-equations').textContent.includes('20 ms')")
b('click','[data-lang=zh]');b('set','viewport','1440','1100')
js("document.querySelector('#driver-reading').scrollIntoView()")
b('screenshot','output/playwright/audio-reading-driver.png')
js("document.querySelector('.qualcomm-reading').scrollIntoView()")
b('screenshot','output/playwright/audio-reading-qualcomm.png')
Path('output/playwright/audio-reading-validation.json').write_text(json.dumps(results,indent=2))
print('PASS: six bilingual responsive layouts, diagram labels and period calculations')
