// A single explanation card anchored to the selected diagram participant.
let panel=null, anchor=null, frame=0;
const childExplanation=target=>target instanceof Element&&target.closest('#term-popover,#term-dialog[open]');
const clamp=(value,low,high)=>Math.max(low,Math.min(value,Math.max(low,high)));

function ensurePanel(){
 if(panel)return;
 panel=document.createElement('section');panel.id='diagram-popover';panel.className='diagram-popover';panel.hidden=true;
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','diagram-popover-title');
 document.body.append(panel);
}

export function closeDiagramPopover({restoreFocus=false}={}){
 if(!anchor)return;
 const previous=anchor;anchor=null;cancelAnimationFrame(frame);frame=0;
 document.dispatchEvent(new Event('diagram-popover-close'));
 panel.hidden=true;panel.replaceChildren();
 if(panel.parentElement!==document.body)document.body.append(panel);
 previous.setAttribute('aria-expanded','false');previous.removeAttribute('aria-controls');
 if(restoreFocus&&previous.isConnected)previous.focus({preventScroll:true});
}
export const isDiagramPopoverAnchor=target=>anchor===target;

function position(){
 if(!anchor)return;
 if(!anchor.isConnected){closeDiagramPopover();return;}
 const viewport=window.visualViewport;
 const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0;
 const width=viewport?.width||document.documentElement.clientWidth,height=viewport?.height||window.innerHeight;
 const right=left+width,bottom=top+height,margin=12,gap=12;
 const target=(anchor.dataset.mapEdge || anchor.dataset.hyperEdge)?anchor.querySelector('text')||anchor:anchor.querySelector('rect')||anchor;
 const raw=target.getBoundingClientRect();
 const rect={left:Math.max(raw.left,left),right:Math.min(raw.right,right),top:Math.max(raw.top,top),bottom:Math.min(raw.bottom,bottom)};
 for(let parent=anchor.parentElement;parent&&parent!==document.body;parent=parent.parentElement){
  const style=getComputedStyle(parent),box=parent.getBoundingClientRect();
  if(/auto|scroll|hidden|clip/.test(style.overflowX)){rect.left=Math.max(rect.left,box.left);rect.right=Math.min(rect.right,box.right);}
  if(/auto|scroll|hidden|clip/.test(style.overflowY)){rect.top=Math.max(rect.top,box.top);rect.bottom=Math.min(rect.bottom,box.bottom);}
 }
 if(rect.right<=rect.left||rect.bottom<=rect.top){closeDiagramPopover();return;}
 panel.style.width=`${Math.min(380,Math.max(0,width-2*margin))}px`;
 panel.style.maxHeight=`${Math.min(440,Math.max(0,height-2*margin))}px`;
 let size=panel.getBoundingClientRect(),x,y,side;
 if(right-margin-rect.right-gap>=size.width){side='right';x=rect.right+gap;y=rect.top;}
 else if(rect.left-gap-left-margin>=size.width){side='left';x=rect.left-gap-size.width;y=rect.top;}
 else{
  const above=rect.top-gap-top-margin,below=bottom-margin-rect.bottom-gap;
  side=below>=size.height||below>=above?'bottom':'top';
  const space=side==='bottom'?below:above;
  if(space>=110){panel.style.maxHeight=`${Math.min(440,space)}px`;size=panel.getBoundingClientRect();}
  x=(rect.left+rect.right-size.width)/2;y=side==='bottom'?rect.bottom+gap:rect.top-gap-size.height;
 }
 panel.style.left=`${clamp(x,left+margin,right-margin-size.width)}px`;
 panel.style.top=`${clamp(y,top+margin,bottom-margin-size.height)}px`;
 panel.dataset.side=side;
}
function reposition(){if(anchor&&!frame)frame=requestAnimationFrame(()=>{frame=0;position();});}

export function showDiagramPopover(target,detail,annotate,t){
 closeDiagramPopover();ensurePanel();anchor=target;
 (target.closest('dialog[open]')||document.body).append(panel);
 const header=document.createElement('header'),heading=document.createElement('div');
 const label=document.createElement('span');label.className='note-key';label.textContent=detail.label;
 const title=document.createElement('h3');title.id='diagram-popover-title';title.textContent=detail.title;heading.append(label,title);
 const close=document.createElement('button');close.type='button';close.className='diagram-popover-close';close.textContent='×';
 close.setAttribute('aria-label',t('关闭图中解释','Close diagram explanation'));close.addEventListener('click',()=>closeDiagramPopover({restoreFocus:true}));
 header.append(heading,close);
 const body=document.createElement('div');body.className='diagram-popover-body';
 const text=document.createElement('p');text.textContent=detail.text;
 body.append(text);
 for(const item of detail.sources||[{url:detail.url,title:detail.sourceLabel}]){
  const source=document.createElement('a');source.href=item.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent=item.title+' ↗';body.append(source);
 }
 panel.replaceChildren(header,body);annotate(body);
 anchor.setAttribute('aria-expanded','true');anchor.setAttribute('aria-controls',panel.id);
 panel.hidden=false;position();if(anchor)close.focus({preventScroll:true});
}

function outside(event){
 if(anchor&&!anchor.contains(event.target)&&!panel.contains(event.target)&&!childExplanation(event.target))closeDiagramPopover();
}
document.addEventListener('pointerdown',outside,true);
document.addEventListener('click',outside,true);
document.addEventListener('keydown',event=>{
 if(!anchor)return;
 if(event.key==='Escape'&&!document.querySelector('#term-popover:not([hidden]),#term-dialog[open]')){
  event.preventDefault();event.stopImmediatePropagation();closeDiagramPopover({restoreFocus:true});
 }else if(event.key==='Tab'){
  const controls=[...panel.querySelectorAll('button,a[href]')];
  if(event.shiftKey&&event.target===controls[0]){event.preventDefault();closeDiagramPopover({restoreFocus:true});}
  else if(!event.shiftKey&&event.target===controls.at(-1))closeDiagramPopover({restoreFocus:true});
 }
},true);
document.addEventListener('scroll',reposition,true);window.addEventListener('resize',reposition);
window.visualViewport?.addEventListener('resize',reposition);window.visualViewport?.addEventListener('scroll',reposition);
const observer=new MutationObserver(()=>{if(anchor&&!anchor.isConnected)closeDiagramPopover();});
observer.observe(document.getElementById('main'),{childList:true,subtree:true});
