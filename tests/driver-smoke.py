"""Check the connected driver example and continuous-motion controls."""
import json,subprocess,time
from pathlib import Path

def b(*args):
 p=subprocess.run(['agent-browser','--session','atlas-driver','--json',*args],capture_output=True,text=True,timeout=40,check=True)
 r=json.loads(p.stdout);assert r['success'],r
 return r.get('data',{})
def js(s):return b('eval',s).get('result')
def expect(code):
 for _ in range(30):
  if js(code):return
  time.sleep(.1)
 raise AssertionError(code)
results=[]
b('open','http://127.0.0.1:4173/#/domain/audio')
b('set','media','light','no-preference')
b('reload')
expect("document.querySelectorAll('.map-particle').length>0 && !document.querySelector('[data-step],[data-next-step],[data-flow-action=replay]')")
t1=js("document.querySelector('.atlas-canvas').getCurrentTime()")
b('snapshot','-i')
assert js("document.querySelector('.atlas-canvas').getCurrentTime()")>t1
for lang in ['zh','en']:
 b('click',f'[data-lang={lang}]')
 for w,h in [(1440,1080),(768,1024),(390,844)]:
  b('set','viewport',str(w),str(h))
  data=js("""(()=>{const nodes=[...document.querySelectorAll('.map-node')];const overflow=nodes.filter(n=>{const r=n.querySelector('rect').getBBox();return [...n.querySelectorAll('text')].some(t=>{const b=t.getBBox();return b.x<r.x||b.x+b.width>r.x+r.width})}).map(n=>n.dataset.mapNode);const clipped=[...document.querySelectorAll('.atlas-canvas text')].filter(t=>{const b=t.getBBox();return b.x<0||b.x+b.width>1200||b.y+b.height>1620}).map(t=>t.textContent);return {nodeCount:nodes.length,overflow,clipped,pageOverflow:document.documentElement.scrollWidth>innerWidth,controls:document.querySelectorAll('[data-flow-action]').length,driverSection:!!document.querySelector('#driver-reading')}})()""")
  assert data==dict(nodeCount=21,overflow=[],clipped=[],pageOverflow=False,controls=1,driverSection=True),data
  assert js("""(()=>{const outer=document.querySelector('[data-map-region=hal]').getBBox(),inner=document.querySelector('[data-map-region=hal-backend]').getBBox();const contains=(a,b)=>a.x<=b.x&&a.y<=b.y&&a.x+a.width>=b.x+b.width&&a.y+a.height>=b.y+b.height;return ['stream','module','backend'].every(id=>contains(outer,document.querySelector('[data-map-node="'+id+'"] rect').getBBox()))&&contains(outer,inner)&&contains(inner,document.querySelector('[data-map-node=backend] rect').getBBox())&&document.querySelectorAll('.map-tier-label').length===5&&document.querySelectorAll('.map-edge').length===32&&!!document.querySelector('[data-map-node=policy]')&&!!document.querySelector('[data-map-edge=policy-output]')&&!!document.querySelector('[data-map-edge=stream-power]')})()""")
  assert js("""(()=>{const svg=document.querySelector('.atlas-canvas');for(const e of svg.querySelectorAll('.map-edge')){const b=e.querySelector('.edge-label').getBBox(),p=e.querySelector('.edge-line'),len=p.getTotalLength();for(const n of svg.querySelectorAll('.map-node')){const r=n.querySelector('rect').getBBox();if(b.x<r.x+r.width&&b.x+b.width>r.x&&b.y<r.y+r.height&&b.y+b.height>r.y)return false;for(let i=1;i<100;i++){const v=p.getPointAtLength(len*i/100);if(v.x>r.x+2&&v.x<r.x+r.width-2&&v.y>r.y+2&&v.y<r.y+r.height-2)return false}}}return true})()""")
  results.append(dict(language=lang,width=w,ownership=True,**data))
b('click','[data-flow-action=play]')
expect("!document.querySelector('.map-particle')")
b('click','[data-map-node=ring]')
expect("!document.querySelector('.map-particle') && document.querySelector('#diagram-popover .diagram-popover-body').textContent.includes('underrun')")
b('click','[data-flow-view=control]')
expect("!document.querySelector('.map-particle')")
b('click','[data-flow-action=play]')
b('click','[data-flow-view=both]')
expect("document.querySelectorAll('.map-particle').length>0 && !document.querySelector('.control .map-particle,.reply .map-particle')")
b('click','#driver-reading .inline-term[data-term=asoc]')
expect("!document.querySelector('#term-popover').hidden && document.querySelector('#term-popover').textContent.includes('ALSA System on Chip')")
b('press','Escape')
b('set','media','light','reduced-motion')
expect("matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('.map-particle') && document.querySelector('[data-flow-action=play]').disabled")
b('reload')
expect("!document.querySelector('.map-particle') && document.querySelector('[data-flow-action=play]').getAttribute('aria-pressed')==='false'")
Path('output/playwright/driver-validation.json').write_text(json.dumps({'layouts':results,'motion':'default/pause/resume/filter/reduced-motion passed','popover':'ASoC passed'},indent=2))
print('6 layouts, motion states and ASoC popover passed')
