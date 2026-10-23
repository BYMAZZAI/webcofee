(() => {
'use strict';
let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;try{reduce ||= localStorage.getItem('zerno-reduce-motion')==='true';}catch{}
const g=window.gsap;if(!g||reduce)return;g.ticker.lagSmoothing(0);g.from('main',{opacity:0,y:8,duration:1,ease:'power3.out'});
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link||link.target||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname===location.pathname)return;event.preventDefault();let sent=false;const go=()=>{if(sent)return;sent=true;location.href=url.href;};g.to('main',{opacity:0,y:8,duration:1,ease:'power3.in',onComplete:go});setTimeout(go,1100);});
})();
