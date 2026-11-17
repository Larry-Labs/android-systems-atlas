// One delegated, non-modal definition surface. Data and language stay owned by app.js.
export function createTermPopover({ glossary, getLanguage, openFull }) {
 const panel = document.createElement('section');
 panel.id = 'term-popover';
 panel.className = 'term-popover';
 panel.hidden = true;
 panel.setAttribute('role', 'dialog');
 panel.setAttribute('aria-modal', 'false');
 panel.setAttribute('aria-labelledby', 'term-popover-title');
 document.body.append(panel);
 let anchor = null, pinned = false, timer = null, restoring = false;
 let openTimer = null, pendingAnchor = null;
 const hoverDelay = 350;
 function cancelPending() { clearTimeout(openTimer); openTimer = null; pendingAnchor = null; }
 const selector = '.inline-term[data-term]';
 const termAt = target => target instanceof Element ? target.closest(selector) : null;
 const text = (zh, en) => getLanguage() === 'en' ? en : zh;
 const value = pair => pair[getLanguage()];
 const element = (tag, className, content) => {
  const node = document.createElement(tag); node.className = className; node.textContent = content; return node;
 };
 function close({ restoreFocus = false } = {}) {
  clearTimeout(timer); cancelPending();
  const previous = anchor;
  anchor = null; pinned = false; panel.hidden = true;
  if(panel.parentElement!==document.body)document.body.append(panel);
  previous?.setAttribute('aria-expanded', 'false');
  previous?.removeAttribute('aria-controls');
  if (restoreFocus && previous?.isConnected) {
   restoring = true; previous.focus({ preventScroll: true }); restoring = false;
  }
 }
 function position() {
  if (!anchor) return;
  if (!anchor.isConnected || !anchor.getClientRects().length) { close(); return; }
  const viewport = window.visualViewport;
  const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
  const width = viewport?.width || document.documentElement.clientWidth;
  const height = viewport?.height || window.innerHeight;
  const rect = anchor.getBoundingClientRect(), margin = 12, gap = 8;
  if (rect.bottom < top || rect.top > top + height || rect.right < left || rect.left > left + width) { close(); return; }
  panel.style.maxWidth = `${Math.max(0, width - margin * 2)}px`;
  panel.style.maxHeight = `${Math.max(0, height - margin * 2)}px`;
  const size = panel.getBoundingClientRect();
  const x = Math.max(left + margin, Math.min(rect.left, left + width - size.width - margin));
  const below = rect.bottom + gap;
  const preferred = below + size.height <= top + height - margin ? below : rect.top - gap - size.height;
  const y = Math.max(top + margin, Math.min(preferred, top + height - size.height - margin));
  panel.style.left = `${x}px`; panel.style.top = `${y}px`;
 }
 function show(button, lock = false) {
  cancelPending();
  const item = glossary.find(entry => entry.id === button.dataset.term);
  if (!item) return;
  clearTimeout(timer);
  if (anchor === button) { pinned ||= lock; return; }
  close(); anchor = button; pinned = lock;
  (button.closest('dialog') || document.body).append(panel);
  const heading = element('div', 'term-popover-heading', '');
  const title = element('h2', '', item.term); title.id = 'term-popover-title'; heading.append(title);
  const dismiss = element('button', 'term-popover-close', '×'); dismiss.type = 'button';
  dismiss.setAttribute('aria-label', text('关闭术语解释', 'Close definition'));
  dismiss.addEventListener('click', () => close({ restoreFocus: true })); heading.append(dismiss);
  const full = element('button', 'term-popover-full', text('完整释义与来源 ↗', 'Full definition & source ↗')); full.type = 'button';
  full.addEventListener('click', () => { const id = item.id; close({ restoreFocus: true }); openFull(id); });
  panel.replaceChildren(heading, element('p', 'term-popover-name', `${item.full} · ${value(item.name)}`), element('p', 'term-popover-definition', value(item.definition)), element('p', 'term-popover-note', text('别混淆：','Keep in mind: ')+value(item.note)), full);
  button.setAttribute('aria-expanded', 'true'); button.setAttribute('aria-controls', panel.id);
  panel.hidden = false; position();
 }
 function scheduleClose() {
  clearTimeout(timer);
  if (!pinned) timer = setTimeout(() => {
   if (!panel.matches(':hover') && !anchor?.matches(':hover') && !panel.contains(document.activeElement) && document.activeElement !== anchor) close();
  }, 220);
 }
 document.addEventListener('pointerover', event => {
  if (event.pointerType === 'touch') return;
  if (panel.contains(event.target)) { clearTimeout(timer); return; }
  const button = termAt(event.target);
  if (!button || (pinned && button !== anchor)) return;
  clearTimeout(timer);
  if (button === anchor || button === pendingAnchor) return;
  cancelPending();
  if (anchor && !pinned) close();
  pendingAnchor = button;
  openTimer = setTimeout(() => {
   if (pendingAnchor === button && button.isConnected && button.matches(':hover')) show(button);
   else cancelPending();
  }, hoverDelay);
 });
 document.addEventListener('pointerout', event => {
  if (pendingAnchor?.contains(event.target) && !pendingAnchor.contains(event.relatedTarget)) cancelPending();
  if (termAt(event.target) || panel.contains(event.target)) scheduleClose();
 });
 document.addEventListener('focusin', event => {
  if (restoring) return;
  const button = termAt(event.target);
  if (button) show(button);
  else if (panel.contains(event.target)) clearTimeout(timer);
  else if (!pinned) close();
 });
 document.addEventListener('focusout', event => {
  if (termAt(event.target) || panel.contains(event.target)) scheduleClose();
 });
 document.addEventListener('pointerdown', event => {
  cancelPending();
  if (anchor && !anchor.contains(event.target) && !panel.contains(event.target)) close();
 });
 document.addEventListener('click', event => {
  if (anchor && !anchor.contains(event.target) && !panel.contains(event.target)) close();
 });
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape') cancelPending();
  if (!anchor) return;
  if (event.key === 'Escape') {
   event.preventDefault(); close({ restoreFocus: panel.contains(document.activeElement) });
  } else if (event.key === 'Tab' && !event.shiftKey && event.target === anchor) {
   event.preventDefault(); panel.querySelector('button').focus();
  } else if (event.key === 'Tab' && event.shiftKey && event.target === panel.querySelector('button')) {
   event.preventDefault(); restoring = true; anchor.focus(); restoring = false;
  } else if (event.key === 'Tab' && !event.shiftKey && event.target === panel.querySelector('.term-popover-full')) {
   // Resume the article's normal tab order instead of jumping to the end of body.
   close({ restoreFocus: true });
  }
 });
 function reposition() { cancelPending(); position(); }
 window.addEventListener('resize', reposition);
 document.addEventListener('scroll', reposition, true);
 window.visualViewport?.addEventListener('resize', reposition);
 window.visualViewport?.addEventListener('scroll', reposition);
 // Partial learning/map redraws can replace an anchor without calling render().
 const observer = new MutationObserver(() => { if (pendingAnchor && !pendingAnchor.isConnected) cancelPending(); if (anchor && !anchor.isConnected) close(); });
 observer.observe(document.getElementById('main'), { childList: true, subtree: true });
 return {
  close,
  handleClick(target) {
   const button = termAt(target);
   if (!button) return false;
   show(button, true); return true;
  }
 };
}
