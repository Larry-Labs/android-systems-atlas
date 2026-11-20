import { audioLocalExplanations } from './audio-explanations.js?v=344aee49d425';
import { showDiagramPopover, closeDiagramPopover, isDiagramPopoverAnchor } from './diagram-popover.js?v=6e59a476be74';
// Contextual explanations for grouped teaching nodes, distinct from glossary definitions.
import { sourceTitle } from './source-links.js?v=12527b297d95';
export function handleReadingHelp(target,annotate,t){
 const id=target.dataset.readingHelp;if(!id)return false;
 const item=audioLocalExplanations[id];if(!item)return false;
 if(isDiagramPopoverAnchor(target)){closeDiagramPopover({restoreFocus:true});return true;}
 closeDiagramPopover();
 const root=target.closest('.qualcomm-reading,.audio-reading');
 root.querySelectorAll('[data-reading-help]').forEach(n=>n.setAttribute('aria-pressed',String(n===target)));
 showDiagramPopover(target,{label:t('组件解释','COMPONENT'),title:item.title,text:t(item.text.zh,item.text.en),sources:item.sources.map(url=>({url,title:sourceTitle(url)}))},annotate,t);
 root.querySelectorAll('[data-reading-edge]').forEach(edge=>edge.classList.remove('is-emphasized'));
 const related=[...root.querySelectorAll(`[data-reading-edge][data-from=\"${id}\"], [data-reading-edge][data-to=\"${id}\"]`)];
 related.forEach(edge=>edge.classList.add('is-emphasized'));
 if(related.length)setTimeout(()=>related.forEach(edge=>edge.classList.remove('is-emphasized')),1800);
 return true;
}

export function observeReadingAnimations() {
 const roots=document.querySelectorAll('.audio-reading,.qualcomm-reading');
 if(!roots.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>roots.forEach(root=>root.classList.toggle('motion-paused',reduced.matches));
 update();
 if(reduced.addEventListener) reduced.addEventListener('change',update,{once:false});
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-paused',!entry.isIntersecting)),{threshold:0.08});
 roots.forEach(root=>observer.observe(root));
 document.addEventListener('focusin',e=>{const root=e.target.closest?.('.audio-reading,.qualcomm-reading');if(root&&e.target.closest('[data-reading-help],[data-reading-edge]'))root.classList.add('motion-paused-focus')});
 document.addEventListener('focusout',e=>{const root=e.target.closest?.('.audio-reading,.qualcomm-reading');if(root)root.classList.remove('motion-paused-focus')});
}
