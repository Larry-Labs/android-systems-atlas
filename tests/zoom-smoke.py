"""Targeted diagram zoom regression; local preview and agent-browser required."""
import json, subprocess
from pathlib import Path

def browser(*args):
    p=subprocess.run(['agent-browser','--session','atlas-zoom','--json',*args],capture_output=True,text=True,check=True)
    data=json.loads(p.stdout)
    assert data['success'], data
    return data.get('data',{})
def js(code): return browser('eval',code).get('result')
browser('open','http://127.0.0.1:4173/#/domain/audio')
browser('reload')
browser('snapshot','-i')
results=[]
for lang in ['zh','en']:
 for width,height in [(1440,1000),(768,1024),(390,844)]:
    browser('set','viewport',str(width),str(height))
    browser('find','role','button','click','--name','中' if lang=='zh' else 'EN','--exact')
    expand='放大图 ↗' if lang=='zh' else 'Expand diagram ↗'
    restore='退出全屏 ↙' if lang=='zh' else 'Exit full screen ↙'
    baseline=js("document.querySelector('.atlas-canvas').getBoundingClientRect().width")
    browser('find','role','button','click','--name',expand,'--exact')
    assert js("document.querySelector('[data-map-expand]').getAttribute('aria-expanded')==='true'")
    assert js("(()=>{const d=document.querySelector('.diagram-fullscreen'),r=d.getBoundingClientRect();return d.matches(':modal')&&r.x===0&&r.y===0&&Math.abs(r.width-innerWidth)<2&&Math.abs(r.height-innerHeight)<2&&getComputedStyle(document.body).overflow==='hidden'})()")
    assert js("document.documentElement.scrollWidth<=innerWidth")
    assert js("document.querySelector('.atlas-canvas').getBoundingClientRect().width")>=baseline
    pos=js("(()=>{const v=document.querySelector('.architecture-viewport');v.scrollLeft=220;v.scrollTop=240;return [v.scrollLeft,v.scrollTop]})()")
    assert pos[1]>0
    assert js("(()=>{const v=document.querySelector('.architecture-viewport');return v.scrollWidth>v.clientWidth?v.scrollLeft>0:v.scrollLeft===0})()")
    browser('find','role','button','click','--name','追踪音频数据' if lang=='zh' else 'Trace audio data','--exact')
    assert js("(()=>{const v=document.querySelector('.architecture-viewport');return [v.scrollLeft,v.scrollTop]})()") == pos
    browser('eval',"document.querySelector('.diagram-fullscreen').scrollTop=500")
    assert js("(()=>{const r=document.querySelector('[data-map-expand]').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()")
    browser('find','role','button','click','--name',restore,'--exact')
    assert js("!document.querySelector('.diagram-fullscreen')&&getComputedStyle(document.body).overflow!=='hidden'")
    assert js("document.querySelector('.atlas-canvas').getBoundingClientRect().width")==baseline
    assert js("(()=>{const v=document.querySelector('.architecture-viewport');return v.scrollLeft===0&&v.scrollTop===0})()")
    browser('find','role','button','click','--name',expand,'--exact')
    browser('press','Escape')
    assert js("document.activeElement.matches('[data-map-expand]')&&document.activeElement.getAttribute('aria-expanded')==='false'")
    browser('press','Enter')
    assert js("document.querySelector('.architecture-lab').classList.contains('expanded')")
    browser('press','Escape')
    results.append({'language':lang,'width':width,'height':height,'passed':True})
Path('output/playwright/zoom-validation.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results))
