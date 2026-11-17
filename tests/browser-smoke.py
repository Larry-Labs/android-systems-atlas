"""Browser smoke checks. Requires agent-browser and a running local preview server."""
import json
import subprocess
from pathlib import Path
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
SESSION = 'atlas-validation'
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4173'
checks = []

def browser(*args):
    result = subprocess.run(['agent-browser', '--session', SESSION, '--json', *args], capture_output=True, text=True, timeout=40)
    if result.returncode:
        raise RuntimeError(result.stderr or result.stdout)
    data = json.loads(result.stdout)
    if not data['success']:
        raise RuntimeError(data)
    return data.get('data', {})

def evaluate(script):
    return browser('eval', script).get('result')

def check(name, condition):
    if not evaluate(condition):
        raise AssertionError(name)
    checks.append(name)

def navigate(path):
    evaluate(f'location.hash = {json.dumps("#/" + path)}')
    # Commands are serialized, but the hashchange event is asynchronous.
    for _ in range(20):
        if evaluate(f'document.body.dataset.renderedRoute === {json.dumps(path)}'):
            return
        time.sleep(.1)
    raise AssertionError('Route did not render: ' + path)

browser('open', BASE + '/#/home')
browser('reload')
browser('set', 'viewport', '1440', '1080')
for _ in range(30):
    if evaluate('!!document.querySelector("#architecture-map")'):
        break
    time.sleep(.1)
check('Home renders an architecture map', '!!document.querySelector("#architecture-map")')
browser('click', '[data-lang="zh"]')
browser('click', '[data-layer="hal"]')
check('Layer selection updates its explanation', 'document.querySelector(".layer-inspector h3").textContent.includes("HAL")')
browser('click', '#expand-map')
check('Expanded map opens as a modal', 'document.querySelector("#map-dialog").open')
browser('click', '#expanded-map [data-layer="kernel"]')
check('Expanded map updates selection', 'document.querySelector("#expanded-map .layer-inspector h3").textContent.includes("Linux")')
browser('press', 'Escape')
check('Escape closes map', '!document.querySelector("#map-dialog").open')
browser('press', '/')
check('Keyboard shortcut opens search', 'document.querySelector("#search-dialog").open')
browser('fill', '#search-input', 'AudioFlinger')
check('Symbol search finds audio', 'document.querySelectorAll("#search-results a.search-result").length === 1 && document.querySelector("#search-results a").hash === "#/domain/audio"')
browser('fill', '#search-input', '<script>no-match</script>')
check('Unknown search has a safe empty state', '!!document.querySelector("#search-results .empty-state") && !document.querySelector("#search-results script")')
browser('fill', '#search-input', '音频')
browser('click', '#search-results a')
for _ in range(20):
    if evaluate('!!document.querySelector("#audio-flow")'):
        break
    time.sleep(.1)
check('Search navigates to audio and closes dialog', '!!document.querySelector("#audio-flow") && !document.querySelector("#search-dialog").open')
check('Data paths animate by default', 'document.querySelectorAll(".map-particle").length > 0 && !document.querySelector(".control .map-particle,.reply .map-particle")')
browser('click', '[data-flow-action="play"]')
check('Pause stops motion without removing diagram', '!document.querySelector(".map-particle") && document.querySelectorAll(".map-node").length === 21')
browser('click', '[data-map-node="ring"]')
check('Node click exposes driver detail', 'document.querySelector("[data-map-node=ring]").getAttribute("aria-pressed") === "true" && document.querySelector("#diagram-popover .diagram-popover-body").textContent.includes("underrun")')
evaluate('window.scrollTo(0, 320)')
before = evaluate('window.scrollY')
browser('click', '[data-lang="en"]')
check('Language switch keeps topic and selected flow', 'document.documentElement.lang === "en" && location.hash === "#/domain/audio" && document.querySelector("[data-map-node=ring]").getAttribute("aria-pressed") === "true" && !document.querySelector(".map-particle")')
after = evaluate('window.scrollY')
assert abs(before - after) < 3, (before, after)
checks.append('Language switch preserves scroll offset')
check('Audio exposes both difference dimensions in English', 'document.querySelector("#versions h2").textContent.includes("Version difference") && document.querySelector("#devices h2").textContent.includes("Device difference")')
browser('screenshot', str(ROOT/'artifacts/audio-en.png'), '--full')
browser('reload')
for _ in range(20):
    if evaluate('!!document.querySelector("#audio-flow")'):
        break
    time.sleep(.1)
check('Language survives reload', 'document.documentElement.lang === "en"')
navigate('domains')
check('All 18 domain links render', 'document.querySelectorAll(".domain-card").length === 18')
browser('fill', '#domain-filter', 'Binder')
check('Domain filter works across languages', 'document.querySelectorAll(".domain-card").length === 1 && document.querySelector(".domain-card").hash === "#/domain/ipc"')
browser('fill', '#domain-filter', 'zzzz-no-match')
check('Domain filter empty state', '!!document.querySelector("#domain-list .empty-state")')
for lang in ['zh', 'en']:
    browser('click', f'[data-lang="{lang}"]')
    for page in ['home', 'domains', 'differences', 'qualcomm', 'sources', 'domain/audio', 'domain/camera']:
        navigate(page)
        check(f'{lang} {page} has no desktop overflow', 'document.documentElement.scrollWidth <= innerWidth')
        if lang == 'en':
            check(f'{page} English content has no untranslated Chinese', '!/[\u4e00-\u9fff]/.test(document.querySelector("#main").innerText)')
    navigate('domain/camera')
    check(f'{lang} incomplete domain is clearly labeled', 'document.querySelector(".outline-notice") !== null')
    browser('set', 'viewport', '390', '844')
    for page in ['home', 'domains', 'differences', 'qualcomm', 'sources', 'domain/audio', 'domain/camera']:
        navigate(page)
        check(f'{lang} {page} has no mobile overflow', 'document.documentElement.scrollWidth <= innerWidth')
    navigate('home')
    browser('click', '#menu-button')
    check(f'{lang} mobile menu opens', 'document.body.classList.contains("nav-open") && !document.querySelector("#scrim").hidden')
    browser('click', '#sidebar a[href="#/domains"]')
    browser('click', '.domain-card[href="#/domain/audio"]')
    check(f'{lang} menu closes on navigation', '!document.body.classList.contains("nav-open")')
    browser('screenshot', str(ROOT/f'artifacts/audio-mobile-{lang}.png'), '--full')
    browser('set', 'viewport', '1440', '1080')
navigate('missing-route')
check('Unknown routes have a recovery link', 'document.querySelector("#main a").hash === "#/home"')
navigate('home')
browser('click', '[data-lang="zh"]')
browser('screenshot', str(ROOT/'artifacts/home-desktop.png'), '--full')
browser('set', 'viewport', '390', '844')
browser('screenshot', str(ROOT/'artifacts/home-mobile.png'), '--full')
browser('set', 'viewport', '1440', '1080')
(ROOT/'artifacts/browser-smoke.json').write_text(json.dumps({'base':BASE, 'checks':checks, 'passed':len(checks)},ensure_ascii=False,indent=2)+'\n')
print(f'PASS: {len(checks)} browser assertions')
