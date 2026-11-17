"""Check review fixes through rendered explanatory nodes and input events."""
import json,subprocess,time
from pathlib import Path
def b(*args):
 p=subprocess.run(['agent-browser','--session','atlas-reading','--json',*args],capture_output=True,text=True,timeout=45,check=True)
 r=json.loads(p.stdout);assert r['success'],r;return r.get('data',{})
def js(s):return b('eval',s).get('result')
b('open','http://127.0.0.1:4173/#/domain/audio');b('reload');b('snapshot','-i')
results=[]
for lang in ['zh','en']:
 b('click',f'[data-lang={lang}]')
 ids=js("[...document.querySelectorAll('[data-reading-help]')].map(n=>n.dataset.readingHelp)")
 result=[]
 for node_id in ids:
  b('click',f'[data-reading-help="{node_id}"] rect')
  result.append(js("""(()=>{const surface=document.querySelector('#diagram-popover'),p=surface.querySelector('.diagram-popover-body'),n=document.querySelector('[aria-controls=diagram-popover]'),r=surface.getBoundingClientRect();return {id:n.dataset.readingHelp,selected:n.getAttribute('aria-pressed')==='true',inside:r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,text:!surface.hidden&&!!surface.querySelector('#diagram-popover-title')&&p.querySelector('p').textContent.length>35,source:p.querySelector('a[target=_blank]')?.href.startsWith('https://')};})()"""))
  b('press','Escape')
 assert len(result)==16 and all(x['selected'] and x['inside'] and x['text'] and x['source'] for x in result),result
 results.append({'lang':lang,'nodes':result})
 js("document.querySelector('[data-reading-help=dread-dma]').focus()")
 b('press','Enter')
 assert js("document.querySelector('[data-reading-help=dread-dma]').getAttribute('aria-pressed')==='true'")
 js("document.querySelector('[data-reading-help=qread-adm-dsp]').focus()")
 b('press','Space')
 assert js("document.querySelector('[data-reading-help=qread-adm-dsp]').getAttribute('aria-pressed')==='true'")
 assert js("document.querySelector('.period-equations').textContent.includes('0.005 s = 5 ms')")
 assert js("!document.querySelector('#driver-reading a[href*=pcm_interface]')")
 assert js("[...document.querySelectorAll('[data-reading-edge*=route-]')].every(e=>e.classList.contains('reading-control'))")
 b('click','[data-map-node=data] rect')
 assert js("document.querySelector('#diagram-popover .diagram-popover-body').textContent.includes('reply.fmqByteCount')")
# Real pointer click on a new routing node.
js("document.querySelector('[data-reading-help=qread-routing]').scrollIntoView({block:'center'})")
b('wait','400');b('click','[data-reading-help=qread-routing]')
assert js("document.querySelector('#diagram-popover-title').textContent==='q6routing'")
Path('output/playwright/audio-review-fixes-validation.json').write_text(json.dumps(results,indent=2))
print('PASS: 32 bilingual node explanations, Enter/Space and pointer activation, FMQ detail, dimensional formula and independent ADM controls')
