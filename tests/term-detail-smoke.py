"""Render every glossary explanation in both languages on desktop and mobile."""
import json,subprocess,time
from pathlib import Path

def browser(*args):
 p=subprocess.run(['agent-browser','--session','atlas-terms','--json',*args],capture_output=True,text=True,timeout=45,check=True)
 r=json.loads(p.stdout);assert r['success'],r;return r.get('data',{})
def js(code):return browser('eval',code).get('result')
def expect(code):
 for _ in range(30):
  if js(code):return
  time.sleep(.1)
 raise AssertionError(code)
browser('open','http://127.0.0.1:4173/#/glossary');browser('reload');browser('snapshot','-i')
expect("document.querySelectorAll('.glossary-card').length===34")
results=[]
for language in ['zh','en']:
 browser('click',f'[data-lang={language}]')
 for width,height in [(1440,1080),(390,844)]:
  browser('set','viewport',str(width),str(height))
  result=js("""(()=>{const results=[];for(const card of document.querySelectorAll('.glossary-card')){card.click();const d=document.querySelector('#term-dialog'),svg=d.querySelector('.term-diagram');const bad=[];if(!d.open||!svg)bad.push('missing dialog/diagram');if(d.querySelectorAll('.term-question').length!==3)bad.push('questions');if(!d.querySelector('.term-position')||!d.querySelector('.term-scope')||!d.querySelector('.term-sources a'))bad.push('content');if(document.documentElement.scrollWidth>innerWidth||d.scrollWidth>d.clientWidth+1)bad.push('page overflow');for(const node of d.querySelectorAll('.term-diagram-node')){const r=node.querySelector('rect').getBBox();for(const text of node.querySelectorAll('text')){const b=text.getBBox();if(b.x<r.x||b.x+b.width>r.x+r.width||b.y<r.y||b.y+b.height>r.y+r.height)bad.push('node label:'+node.dataset.termNode)}}for(const text of svg.querySelectorAll('text')){const b=text.getBBox(),v=svg.viewBox.baseVal;if(b.x<0||b.x+b.width>v.width||b.y<0||b.y+b.height>v.height)bad.push('clipped:'+text.textContent)}for(const edge of svg.querySelectorAll('.term-edge')){const path=edge.querySelector('path'),label=edge.querySelector('text').getBBox(),length=path.getTotalLength();for(const node of svg.querySelectorAll('.term-diagram-node')){const r=node.querySelector('rect').getBBox();if(label.x<r.x+r.width&&label.x+label.width>r.x&&label.y<r.y+r.height&&label.y+label.height>r.y)bad.push('edge label overlaps node:'+edge.dataset.from+'-'+edge.dataset.to);if(node.dataset.termNode===edge.dataset.from||node.dataset.termNode===edge.dataset.to)continue;for(let i=1;i<80;i++){const p=path.getPointAtLength(length*i/80);if(p.x>r.x+1&&p.x<r.x+r.width-1&&p.y>r.y+1&&p.y<r.y+r.height-1){bad.push('edge passes through node:'+edge.dataset.from+'-'+edge.dataset.to);break}}}}results.push({id:card.dataset.term,bad});d.close()}return results})()""")
  results.append({'language':language,'width':width,'terms':result})
Path('output/playwright/term-detail-validation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
failures=[(r['language'],r['width'],t) for r in results for t in r['terms'] if t['bad']]
assert not failures,failures
browser('set','viewport','1440','1080');browser('click','[data-lang=zh]');browser('click','.glossary-card[data-term=dma]')
expect("document.querySelector('#term-dialog').open")
browser('screenshot','output/playwright/dma-full.png')
browser('press','Escape')
expect("!document.querySelector('#term-dialog').open&&document.activeElement.dataset.term==='dma'")
print(f'PASS: {sum(len(r["terms"]) for r in results)} rendered full definitions; keyboard dismissal and focus return')
