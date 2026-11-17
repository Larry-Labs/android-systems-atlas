"""Check inline component definitions, aliases and playback-progress feedback."""
import json,subprocess,time
from pathlib import Path

def browser(*args):
 p=subprocess.run(['agent-browser','--session','atlas-components','--json',*args],capture_output=True,text=True,timeout=45,check=True)
 r=json.loads(p.stdout);assert r['success'],r;return r.get('data',{})
def js(code):return browser('eval',code).get('result')
def expect(code):
 for _ in range(30):
  if js(code):return
  time.sleep(.1)
 raise AssertionError(code)
browser('open','http://127.0.0.1:4173/#/domain/audio');browser('reload');browser('snapshot','-i')
results=[]
for lang in ['zh','en']:
 browser('click',f'[data-lang={lang}]')
 for term in ['q6asm','q6routing','q6apm','adm','audioreach','gpr','tinyalsa','period']:
  js(f"document.querySelector('#driver-reading .inline-term[data-term={term}]').scrollIntoView({{block:'center'}})")
  # Let scroll events settle before opening help (scroll dismisses popovers).
  browser('wait','350')
  browser('click',f'#driver-reading .inline-term[data-term={term}]')
  expect("!document.querySelector('#term-popover').hidden")
  browser('click','.term-popover-full')
  expect("document.querySelector('#term-dialog').open && document.querySelectorAll('#term-dialog .term-question').length===3")
  assert js("!!document.querySelector('#term-dialog .term-diagram')")
  browser('press','Escape');browser('press','Escape')
  results.append({'lang':lang,'term':term,'passed':True})
 js("document.querySelector('[data-map-edge=period] .edge-label').scrollIntoView({block:'center',inline:'center'})")
 browser('click','[data-map-edge=period] .edge-label')
 expect("document.querySelector('.map-detail').textContent.includes('snd_pcm_period_elapsed')")
 assert js("!!document.querySelector('.map-detail .inline-term[data-term=period]')")
browser('open','http://127.0.0.1:4173/#/glossary');browser('snapshot','-i')
browser('fill','#glossary-filter','q6asm-dai')
expect("document.querySelectorAll('.glossary-card').length===1 && document.querySelector('.glossary-card').dataset.term==='q6asm'")
Path('output/playwright/component-terms-validation.json').write_text(json.dumps(results,indent=2))
print('PASS: 16 inline-to-full definitions, feedback explanation and component alias search')
