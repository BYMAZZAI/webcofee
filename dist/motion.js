(() => {
'use strict';
const $=s=>document.querySelector(s),g=window.gsap,system=matchMedia('(prefers-reduced-motion: reduce)');
let userReduced=false;try{userReduced=localStorage.getItem('zerno-reduce-motion')==='true';}catch{}
const reduced=()=>system.matches||userReduced;
window.ZernoTimings=Object.freeze({text:1,heading:1.2,image:1.4,section:1.2,card:1,hover:.3,press:.2,faq:.75,menu:.8,page:1,crossfade:1.5,zoom:2,scroll:1.2,carousel:1.1,letters:1.5,words:1.3,gradient:8,kenburns:12,float:6,rotation:20,particles:15,glow:3,marquee:48,ambient:20});
const T=window.ZernoTimings;
if(g){g.registerPlugin(window.ScrollTrigger,window.Flip,window.SplitText);g.defaults({ease:'power3.out',overwrite:'auto'});g.ticker.lagSmoothing(0);}
function tween(target,vars){return new Promise(resolve=>{if(!g||reduced()){if(g){const v={...vars};delete v.onUpdate;g.set(target,{...v,duration:0,delay:0});}resolve();return;}const cap=setTimeout(resolve,Math.max(0,(vars.duration||0)*1000)+100);const done=()=>{clearTimeout(cap);resolve();};g.to(target,{...vars,onComplete:done,onInterrupt:done});});}
let scrollTween=null,scrollProgress={value:0};
function stopScroll(){scrollTween?.kill();scrollTween=null;}
function scrollTo(target,focus=true){const el=typeof target==='string'?$(target):target;if(!el)return;stopScroll();const top=Math.max(0,el.getBoundingClientRect().top+scrollY-30);
 const done=()=>{if(!focus)return;const had=el.hasAttribute('tabindex');if(!had)el.setAttribute('tabindex','-1');el.focus({preventScroll:true});if(!had)el.addEventListener('blur',()=>el.removeAttribute('tabindex'),{once:true});};
 if(reduced()||!g){window.scrollTo({top,behavior:'instant'});done();return;}
 scrollProgress.value=scrollY;scrollTween=g.to(scrollProgress,{value:top,duration:T.scroll,ease:'power3.inOut',onUpdate:()=>window.scrollTo({top:scrollProgress.value,behavior:'instant'}),onComplete:()=>{scrollTween=null;done();}});
}
for(const type of ['wheel','touchstart','pointerdown'])window.addEventListener(type,stopScroll,{passive:true});
document.addEventListener('keydown',e=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key))stopScroll();});
document.addEventListener('click',e=>{
 if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
 const a=e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
 const href=a.getAttribute('href');
 if(href.startsWith('#')){const id=href.slice(1);const el=id?document.getElementById(decodeURIComponent(id)):$('header');if(!el)return;e.preventDefault();history.pushState(null,'',href);scrollTo(el);return;}
 const url=new URL(href,location.href);if(url.origin===location.origin&&url.pathname!==location.pathname){e.preventDefault();if(reduced()||!g){location.href=url.href;return;}g.to('main,header,footer',{opacity:0,duration:T.page,onComplete:()=>{location.href=url.href;}});}
});
window.addEventListener('pageshow',e=>{if(e.persisted&&g)g.set('main,header,footer',{opacity:1});});
const closing=new WeakMap();let generation=0;
window.ZernoMotion={reduced,scrollTo,tween,
 openDialog(dialog){g?.killTweensOf(dialog);if(!g||reduced()){g?.set(dialog,{clearProps:'transform,opacity'});return;}
  g.fromTo(dialog,{rotationY:-82,opacity:0,scale:.94,transformPerspective:1400},{rotationY:0,opacity:1,scale:1,duration:1,ease:'power3.inOut',clearProps:'transform,opacity'});
 },
 closeDialog(dialog){
  if(closing.has(dialog))return closing.get(dialog);
  if(!dialog.open)return Promise.resolve();
  const close=(async()=>{
   dialog.dataset.closing='true';g?.killTweensOf(dialog);
   // Close straight on, including when an opening Flip was interrupted.
   g?.set(dialog,{rotationY:0,rotationX:0,scale:1,y:0});
   try{
    if(!reduced()&&g)await tween(dialog,{opacity:0,duration:.28,ease:'power1.out'});
    if(dialog.open)dialog.close();
   }finally{g?.set(dialog,{clearProps:'opacity,transform'});delete dialog.dataset.closing;closing.delete(dialog);}
  })();
  // Immediate reduced-motion closes do not leave a completed promise in the map.
  if(dialog.open)closing.set(dialog,close);
  return close;
 },
 async changeCatalog(render){const id=++generation,grid=$('#products');g?.killTweensOf(grid);if(!reduced()&&g)await tween(grid,{opacity:0,y:6,duration:.35});if(id!==generation)return;
  render();if(!reduced()&&g){g.set(grid,{opacity:0,y:14});await tween(grid,{opacity:1,y:0,duration:.65});if(id===generation)g.set(grid,{clearProps:'opacity,transform'});}window.ScrollTrigger?.refresh();
 },
};
let context;
function cards(){if(!g||reduced())return;g.fromTo('#products .product',{opacity:0,y:12,scale:.975},{opacity:1,y:0,scale:1,duration:T.card,stagger:{amount:.15},clearProps:'opacity,transform',onComplete:()=>window.Zerno3D?.resizeCatalog()});}
function reveals(){
 context?.revert();context=null;
 document.body.classList.toggle('reduce-motion',reduced());
 const toggle=$('#motion-toggle');if(toggle){toggle.textContent=reduced()?'Движение: выкл.':'Движение: вкл.';toggle.setAttribute('aria-pressed',String(reduced()));}
 if(!g||reduced()){$('#review-count').textContent='100';document.dispatchEvent(new Event('zerno:motion'));return;}
 context=g.context(()=>{
  g.from('.hero-copy .eyebrow',{opacity:0,duration:T.text});
  g.from('#hero-title',{opacity:0,y:22,duration:T.heading});
  const italic=$('#hero-title em');if(window.SplitText){const split=new window.SplitText(italic,{type:'words,chars',charsClass:'split-char',wordsClass:'split-word',aria:'auto'});g.from(split.chars,{opacity:0,y:14,duration:1.15,stagger:{amount:.35},delay:.12});}
  g.from('.lead,.hero-cta,.hero-link',{opacity:0,y:10,duration:T.text,stagger:.10,delay:.2});
  g.from('.hero-visual',{opacity:0,duration:T.image,clearProps:'opacity'});
  const count={value:0};g.to(count,{value:100,duration:2,ease:'power2.out',onUpdate:()=>{$('#review-count').textContent=String(Math.round(count.value));}});
  document.querySelectorAll('main section:not(.hero):not(.faq-section)').forEach(el=>g.from(el,{opacity:.25,y:22,duration:T.section,scrollTrigger:{trigger:el,start:'top 93%',once:true},clearProps:'opacity,transform'}));
  document.querySelectorAll('main h2').forEach(el=>g.from(el,{opacity:0,y:20,duration:T.heading,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'opacity,transform'}));
  document.querySelectorAll('.section-heading>p,.review-intro>p:not(.eyebrow),.choose-grid>div>p:not(.eyebrow),.faq-section>div>p:not(.eyebrow)').forEach(el=>g.from(el,{opacity:0,duration:T.text,scrollTrigger:{trigger:el,start:'top 95%',once:true},clearProps:'opacity'}));
  if(window.SplitText){const words=new window.SplitText('.review-preview blockquote',{type:'words',wordsClass:'reveal-word',aria:'auto'});g.from(words.words,{opacity:0,y:12,duration:.95,stagger:{amount:.35},scrollTrigger:{trigger:'.review-preview',start:'top 92%',once:true},clearProps:'opacity,transform'});}
  g.from('.cafe-photo',{clipPath:'inset(10% 0 0 0 round 30px)',opacity:0,duration:T.image,scrollTrigger:{trigger:'.cafe-photo',start:'top 94%',once:true},clearProps:'clipPath,opacity'});
  g.from('#products .product',{opacity:0,y:18,scale:.975,duration:T.card,stagger:.07,scrollTrigger:{trigger:'#products',start:'top 92%',once:true},clearProps:'opacity,transform',onComplete:()=>window.Zerno3D?.resizeCatalog()});
  document.querySelectorAll('.steam path').forEach((path,i)=>g.to(path,{attr:{d:i===0?'M65 170 C110 125 25 86 65 25':i===1?'M105 180 C145 135 65 92 105 10':'M145 170 C185 120 100 80 145 30'},duration:11,ease:'sine.inOut',repeat:-1,yoyo:true,delay:-i*3.6}));

 });
 document.dispatchEvent(new Event('zerno:motion'));window.ScrollTrigger?.refresh();
}
$('#motion-toggle')?.addEventListener('click',()=>{userReduced=!reduced();try{localStorage.setItem('zerno-reduce-motion',String(userReduced));}catch{}stopScroll();reveals();});
system.addEventListener('change',()=>{stopScroll();reveals();});
document.addEventListener('catalog:render',cards);
if(document.fonts?.status==='loading')document.fonts.ready.then(reveals);else reveals();
})();
