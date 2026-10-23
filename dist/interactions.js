(() => {
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],G=window.gsap;
const reduced=()=>window.ZernoMotion?.reduced?.()??false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const price=value=>Number.isFinite(value)?new Intl.NumberFormat('ru-RU').format(value)+' ₽':'Цена уточняется';
// A single renderer draws all six product views; no renderer is created per card.
try{window.Zerno3D?.init();}catch(error){console.warn('3D preview unavailable; product controls remain usable.',error.message);}
document.addEventListener('catalog:render',()=>{window.Zerno3D?.catalog();});
const model=$('#model-dialog'),stage=$('#model-stage'),slider=$('#model-rotation');model.dataset.modalFlip='true';
let selectedPack,modelFocus,rotation=-.30,tilt=0,drag=null,packOpen=false,sequence=0;
function changePack(open){packOpen=open;$('#open-pack').setAttribute('aria-pressed',String(open));$('#open-pack').innerHTML=(open?'Закрыть пачку':'Открыть пачку')+' <span>'+(open?'−':'↗')+'</span>';
 if(stage.dataset.renderer?.startsWith('threejs')){window.Zerno3D.toggle(open);$('#model-status').textContent=open?'Пачка открыта — зёрна видны внутри.':'Пачка закрыта — '+(selectedPack?.grams||250)+' г.';}
 else $('#model-status').textContent='3D недоступно в этом браузере. Данные о зерне и корзина работают.';
}
function rotate(y,x=tilt){rotation=Math.max(-Math.PI,Math.min(Math.PI,y));tilt=Math.max(-.4,Math.min(.4,x));slider.value=String(Math.round(rotation*180/Math.PI));slider.setAttribute('aria-valuetext',slider.value+' градусов');window.Zerno3D?.rotate(rotation,tilt);}
function openModel(id){const p=window.ZERNO.variants.find(x=>x.id===id);if(!p||model.open)return;selectedPack=p;modelFocus=document.activeElement;const token=++sequence;
 $('#model-title').textContent=p.name;$('#model-profile').textContent=p.country+' · '+p.region+' · '+p.notes;$('.model-price').textContent=price(p.price)+' / '+p.grams+' г · '+price(p.price*250/p.grams)+' / 250 г';$('#model-add').dataset.add=id;$('#model-status').textContent='Объёмная модель · '+p.grams+' г';model.showModal();document.body.classList.add('modal-open');
 window.Zerno3D?.open(p);rotation=-.30;tilt=0;packOpen=false;changePack(false);rotate(rotation,tilt);
 window.ZernoMotion.openDialog(model);changePack(true);$('#close-model').focus();
}
function closeModel(){sequence++;return window.ZernoMotion.closeDialog(model);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-model]');if(b)openModel(b.dataset.model);});
$('#open-pack').addEventListener('click',()=>changePack(!packOpen));$('#close-model').addEventListener('click',closeModel);
model.addEventListener('cancel',e=>{e.preventDefault();closeModel();});model.addEventListener('close',()=>{window.Zerno3D?.close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');const target=modelFocus?.closest('[inert]')?modelFocus.closest('.product')?.querySelector('.model-button'):modelFocus;target?.focus({preventScroll:true});});
model.addEventListener('click',e=>{if(e.target!==model)return;const r=model.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModel();});
slider.addEventListener('input',()=>rotate(Number(slider.value)*Math.PI/180));$('#reset-model').addEventListener('click',()=>{rotate(-.30,0);changePack(false);});
stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,rotation,tilt};stage.setPointerCapture(e.pointerId);stage.classList.add('dragging');stage.focus({preventScroll:true});});
stage.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;rotate(drag.rotation+(e.clientX-drag.x)*.009,drag.tilt+(e.clientY-drag.y)*.003);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,()=>{drag=null;stage.classList.remove('dragging');});
stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')rotate(-.30,0);else rotate(rotation+(e.key==='ArrowLeft'?-.17:e.key==='ArrowRight'?.17:0),tilt+(e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0));});
// Responsive SVG outlines follow the actual curved photograph containers.
for(const [i,host] of all('.hero-media,.cafe-photo').entries()){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('photo-outline');svg.setAttribute('aria-hidden','true');svg.innerHTML=`<defs><linearGradient id="milk-peach-${i}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff3d9"/><stop offset="50%" stop-color="#b78054"/><stop offset="100%" stop-color="#f1c09a"/></linearGradient></defs><path fill="none" stroke="url(#milk-peach-${i})" stroke-width="2"/>`;host.append(svg);
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const x=1.5,y=1.5,right=w-x,bottom=h-y,rx=Math.min(parseFloat(getComputedStyle(host).borderTopLeftRadius)||28,w*.5-2,h*.5-2),ry=rx,r=host.classList.contains('hero-media')?28:18;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.querySelector('path').setAttribute('d',`M ${x+rx} ${y} H ${right-rx} A ${rx} ${ry} 0 0 1 ${right} ${y+ry} V ${bottom-r} Q ${right} ${bottom} ${right-r} ${bottom} H ${x+r} Q ${x} ${bottom} ${x} ${bottom-r} V ${y+ry} A ${rx} ${ry} 0 0 1 ${x+rx} ${y} Z`);};new ResizeObserver(resize).observe(host);resize();
}
// One guarded confirmation dialog serves all cart entry points.
const confirmDialog=$('#drink-dialog');let pendingItem=null,itemFocus,confirmBusy=false;
window.ZernoConfirm={open(id,trigger){const p=window.ZernoCart.product(id);if(!p||confirmDialog.open||confirmBusy)return;
 pendingItem=id;itemFocus=trigger||document.activeElement;
 $('#drink-title').textContent='Вы хотите добавить «'+p.name+'» в корзину?';
 $('#drink-confirm-description').textContent=(p.kind==='drink'?p.details:p.country+' · '+p.region+' · '+p.notes+' · '+p.grams+' г')+'. '+price(p.price)+'.';
 $('#confirm-drink').disabled=false;confirmDialog.dataset.modalFlip='true';confirmDialog.showModal();document.body.classList.add('modal-open');
 window.ZernoMotion.openDialog(confirmDialog);$('#cancel-drink').focus();
}};
async function dismissItem(){pendingItem=null;await window.ZernoMotion.closeDialog(confirmDialog);}
$('#confirm-drink').addEventListener('click',async()=>{if(!pendingItem||confirmBusy)return;const id=pendingItem;pendingItem=null;confirmBusy=true;$('#confirm-drink').disabled=true;
 window.ZernoCart.add(id,itemFocus);await window.ZernoMotion.closeDialog(confirmDialog);if(model.open)await closeModel();confirmBusy=false;
});
for(const id of ['#close-drink','#cancel-drink'])$(id).addEventListener('click',dismissItem);
confirmDialog.addEventListener('cancel',e=>{e.preventDefault();dismissItem();});
confirmDialog.addEventListener('close',()=>{pendingItem=null;if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(itemFocus?.isConnected)itemFocus.focus({preventScroll:true});});
all('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{const index=Number(b.dataset.gallery);all('[data-gallery]').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',String(el===b));});all('.gallery-image').forEach((img,i)=>{img.classList.toggle('is-current',i===index);img.setAttribute('aria-hidden',String(i!==index));});}));
// Animate from the current measured height, including when direction is reversed.
all('.faq-toggle').forEach(button=>button.addEventListener('click',()=>{
 const answer=document.getElementById(button.getAttribute('aria-controls')),open=button.getAttribute('aria-expanded')!=='true';
 button.setAttribute('aria-expanded',String(open));G?.killTweensOf(answer);
 if(!G||reduced()){answer.hidden=!open;answer.style.height='';return;}
 const height=answer.hidden?0:answer.getBoundingClientRect().height;answer.hidden=false;G.set(answer,{height});
 G.to(answer,{height:open?answer.scrollHeight:0,duration:.75,ease:'sine.inOut',onComplete:()=>{
  answer.hidden=!open;G.set(answer,{clearProps:'height'});
  // Refresh measurements without temporarily reverting all ScrollTrigger transforms.
  window.ScrollTrigger?.update();
 }});
}));
document.addEventListener('zerno:motion',()=>{if(!reduced())return;for(const button of all('.faq-toggle')){const answer=document.getElementById(button.getAttribute('aria-controls'));G?.killTweensOf(answer);answer.hidden=button.getAttribute('aria-expanded')!=='true';G?.set(answer,{clearProps:'height,opacity'});}});
const reviews=window.ZERNO.demoReviews;
const dialog=$('#reviews-dialog');dialog.dataset.modalFlip='true';let index=0,reviewFocus,swipe=null;
$('#review-track').innerHTML=reviews.map((r,i)=>`<article class="review-slide" role="group" aria-roledescription="слайд" aria-label="Отзыв ${i+1} из ${reviews.length}" aria-hidden="${i!==0}" ${i?'inert':''}><div class="review-slide-head"><span class="avatar" aria-hidden="true">${esc(r.name.slice(0,1))}</span><div><h3>${esc(r.name)}</h3><p>Услуга: ${esc(r.service)}</p></div><span class="review-stars" role="img" aria-label="Оценка ${r.stars} из 5">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span></div><blockquote>«${esc(r.text)}»</blockquote><p class="small">Вымышленный отзыв · пример для демонстрации дизайна</p></article>`).join('');
$('#review-dots').innerHTML=reviews.map((r,i)=>`<button aria-label="Показать отзыв ${i+1}" data-review="${i}" aria-current="${i===0}"></button>`).join('');
function slide(next,animate=true){index=((next%reviews.length)+reviews.length)%reviews.length;const track=$('#review-track');all('.review-slide').forEach((el,i)=>{el.setAttribute('aria-hidden',String(i!==index));el.inert=i!==index;});all('[data-review]').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));$('#review-position').textContent=String(index+1).padStart(2,'0')+' / '+reviews.length;dialog.dataset.index=String(index);
 if(G&&animate&&!reduced())G.to(track,{xPercent:-index*100,duration:1.1,ease:'power3.inOut'});else if(G)G.set(track,{xPercent:-index*100});else track.style.transform=`translateX(${-index*100}%)`;
}
function openReviews(){if(dialog.open)return;reviewFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');slide(index,false);window.ZernoMotion.openDialog(dialog);$('#close-reviews').focus();}
for(const id of ['#open-reviews','#hero-reviews','#preview-reviews'])$(id).addEventListener('click',openReviews);
function closeReviews(){return window.ZernoMotion.closeDialog(dialog);}
$('#close-reviews').addEventListener('click',closeReviews);dialog.addEventListener('cancel',e=>{e.preventDefault();closeReviews();});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');reviewFocus?.focus();});
$('#review-prev').addEventListener('click',()=>slide(index-1));$('#review-next').addEventListener('click',()=>slide(index+1));$('#review-dots').addEventListener('click',e=>{const b=e.target.closest('[data-review]');if(b)slide(Number(b.dataset.review));});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();slide(index+(e.key==='ArrowLeft'?-1:1));}});
$('.review-slider').addEventListener('pointerdown',e=>{swipe={x:e.clientX,y:e.clientY};});$('.review-slider').addEventListener('pointerup',e=>{if(swipe&&Math.abs(e.clientX-swipe.x)>45&&Math.abs(e.clientX-swipe.x)>Math.abs(e.clientY-swipe.y))slide(index+(e.clientX<swipe.x?1:-1));swipe=null;});$('.review-slider').addEventListener('pointercancel',()=>swipe=null);
const fine=matchMedia('(hover: hover) and (pointer: fine)');
for(const card of all('.review-preview,.review-slider')){
 const reset=()=>{if(G){G.killTweensOf(card);if(reduced())G.set(card,{rotationX:0,rotationY:0});else G.to(card,{rotationX:0,rotationY:0,duration:.6,ease:'power2.out'});}};
 card.addEventListener('pointermove',e=>{
  if(!G||reduced()||!fine.matches)return;const r=card.getBoundingClientRect();
  G.to(card,{rotationX:-(e.clientY-r.top-r.height/2)/r.height*9,rotationY:(e.clientX-r.left-r.width/2)/r.width*12,transformPerspective:1100,duration:.4,ease:'power2.out'});
 });
 card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);document.addEventListener('zerno:motion',reset);
}
window.ZernoExperience={reviewCount:reviews.length,showReview:slide,openReviews};
})();
