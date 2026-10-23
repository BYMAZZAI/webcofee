(function(root){
'use strict';
function restartBounce(element){if(!element)return;element.classList.remove('bounce');void element.offsetWidth;element.classList.add('bounce');}
function observeRoasts(scope,env=root){
 const seen=new WeakSet(),reduced=env.matchMedia?.('(prefers-reduced-motion: reduce)');
 const fill=el=>el.classList.add('is-filled');
 const observer=env.IntersectionObserver?new env.IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting||entry.intersectionRatio<.35)continue;if(entry.target.id==='quiz-roast-track')entry.target.classList.add('scale-visible');else fill(entry.target);observer.unobserve(entry.target);}},{threshold:.35}):null;
 const scan=()=>{scope.querySelectorAll('.product .roast-track').forEach(el=>{if(seen.has(el))return;seen.add(el);if(!observer||reduced?.matches)fill(el);else observer.observe(el);});const guide=scope.querySelector?.('#quiz-roast-track');if(guide&&!seen.has(guide)){seen.add(guide);if(!observer||reduced?.matches)guide.classList.add('scale-visible');else observer.observe(guide);}};
 reduced?.addEventListener?.('change',e=>{if(e.matches){scope.querySelectorAll('.product .roast-track').forEach(fill);scope.querySelector?.('#quiz-roast-track')?.classList.add('scale-visible');observer?.disconnect();}});
 return {scan};
}
const api={restartBounce,observeRoasts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ZernoEffects=api;
})(typeof window!=='undefined'?window:globalThis);
