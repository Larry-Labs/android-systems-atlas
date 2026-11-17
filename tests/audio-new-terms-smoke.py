import subprocess,json

def b(*args):
 p=subprocess.run(['agent-browser','--session','atlas-reading','--json',*args],capture_output=True,text=True,check=True,timeout=45)
 r=json.loads(p.stdout);assert r['success'],r;return r.get('data',{})
def js(x):return b('eval',x).get('result')
b('open','http://127.0.0.1:4173/#/domain/audio');b('reload');b('snapshot','-i')
for node,term in [('[data-map-node=module]','audio-patch'),('[data-map-node=ring]','underrun'),('[data-reading-help=qread-asm-client]','apr')]:
 b('click',node+' rect')
 selector=f'#diagram-popover .diagram-popover-body [data-term={term}]'
 js(f'document.querySelector("{selector}").scrollIntoView({{block:"center"}})')
 b('wait','400');b('click',selector)
 assert js('!document.querySelector("#term-popover").hidden'),term
 b('click','.term-popover-full')
 assert js('document.querySelector("#term-dialog").open && document.querySelectorAll("#term-dialog .term-question").length===3'),term
 b('press','Escape');b('press','Escape');b('press','Escape')
print('PASS: audio patch, underrun and APR inline-to-full explanation links')
