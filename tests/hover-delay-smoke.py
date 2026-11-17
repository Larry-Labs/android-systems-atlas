"""Measure real hover delay and ensure cancelled intentions never open help."""
import subprocess,json,time
from pathlib import Path

def b(*args):
 p=subprocess.run(['agent-browser','--session','atlas-hover','--json',*args],text=True,capture_output=True,timeout=45)
 assert p.returncode==0,p.stdout+p.stderr
 r=json.loads(p.stdout);assert r['success'],r;return r.get('data',{})
def js(code):return b('eval',code).get('result')
b('open','http://127.0.0.1:4173/#/domain/audio');b('reload');b('set','viewport','1440','1080');b('snapshot','-i');b('click','[data-lang=zh]')
js("""(()=>{window.hoverLog=[];const panel=document.querySelector('#term-popover');document.addEventListener('pointerover',e=>{if(e.target.closest('.inline-term'))window.hoverStart=performance.now()},true);new MutationObserver(()=>{if(!panel.hidden)hoverLog.push({elapsed:performance.now()-hoverStart,title:document.querySelector('#term-popover-title').textContent})}).observe(panel,{attributes:true,attributeFilter:['hidden']});document.querySelector('.architecture-intro .inline-term').scrollIntoView({block:'center'})})()""")
b('mouse','move','0','0');b('wait','250')
b('hover','.architecture-intro .inline-term[data-term=audiotrack]')
b('wait','500')
result=None
for _ in range(20):
 result=js("hoverLog.find(x=>x.title==='AudioTrack')")
 if result:break
 time.sleep(.1)
assert result and result['elapsed']>=330,result
hoverMeasurement=result
b('press','Escape');b('mouse','move','0','0')
# Rapid pointer crossing, Escape, scroll, DOM replacement and language render cancel pending work.
cases={
 'leave':"el.dispatchEvent(new PointerEvent('pointerout',{bubbles:true,pointerType:'mouse',relatedTarget:document.body}))",
 'escape':"document.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'Escape'}))",
 'scroll':"document.dispatchEvent(new Event('scroll'))",
 'detach':"el.remove()",
 'language':"document.querySelector('[data-lang=en]').click()"
}
for name,cancel in cases.items():
 b('hover','.architecture-intro .inline-term');b('press','Escape')
 assert js("document.querySelector('.architecture-intro .inline-term').matches(':hover')")
 result=js("""new Promise(resolve=>{const el=document.querySelector('.architecture-intro .inline-term');document.activeElement.blur();const before=hoverLog.length;el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse'}));CANCEL;setTimeout(()=>resolve(document.querySelector('#term-popover').hidden&&hoverLog.length===before),500)})""".replace('CANCEL',cancel))
 assert result,name
# Focus and click must remain immediate, independent of hover timer.
assert js("(()=>{const el=document.querySelector('.architecture-intro .inline-term');el.focus();return !document.querySelector('#term-popover').hidden})()")
b('press','Escape')
assert js("(()=>{document.querySelector('.architecture-intro .inline-term').click();return !document.querySelector('#term-popover').hidden})()")
b('press','Escape')
Path('output/playwright/hover-delay-validation.json').write_text(json.dumps({'actualHover':hoverMeasurement,'cancellations':list(cases),'focusAndClick':'immediate'},indent=2))
print('PASS: real hover >=330ms, five cancellation cases, immediate focus and click')
