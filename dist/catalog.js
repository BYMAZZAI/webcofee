(() => {
'use strict';
const grid=document.querySelector('#products'),fine=matchMedia('(hover: hover)');let keyboard=false;
const selection=window.ZernoCore.createCatalogSelection(active=>{
 for(const card of grid.querySelectorAll('.product')){
  const id=card.id.replace('product-',''),open=id===active,image=card.querySelector('.product-image'),button=card.querySelector('[data-flip]'),panel=card.querySelector('.pack-choices');
  image.classList.toggle('flipped',open);panel.inert=!open;button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-expanded',String(open));button.textContent=open?'Упаковка ↻':'О вкусе ↻';
 }
 window.Zerno3D?.request();
});
function bind(){selection.clear();for(const card of grid.querySelectorAll('.product')){
 const id=card.id.replace('product-',''),image=card.querySelector('.product-image');
 image.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&fine.matches)selection.set(id);});
 image.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')selection.clear(id);});
 image.addEventListener('focusin',()=>{if(keyboard)selection.set(id);});
 image.addEventListener('focusout',e=>{if(!image.contains(e.relatedTarget))selection.clear(id);});
}}
document.addEventListener('keydown',e=>{if(e.key==='Tab')keyboard=true;if(e.key==='Escape')selection.clear();});
document.addEventListener('pointerdown',()=>{keyboard=false;},true);
grid.addEventListener('click',e=>{const button=e.target.closest('[data-flip],[data-catalog-open]');if(!button)return;const id=button.dataset.flip||button.dataset.catalogOpen;
 if(button.dataset.catalogOpen)selection.set(id);else selection.toggle(id);
});
grid.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')selection.clear();});
document.addEventListener('catalog:render',bind);bind();
})();
