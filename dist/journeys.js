(() => {
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],C=window.ZERNO,G=window.gsap;
const reduced=()=>window.ZernoMotion.reduced();
const money=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function enter(el){if(G&&!reduced()){G.killTweensOf(el);G.fromTo(el,{opacity:0,y:8},{opacity:1,y:0,duration:.75,ease:'power2.out',clearProps:'transform,opacity'});}}
// Step transitions are serialized: rapid clicks cannot skip or overwrite answers.
const panels=all('[data-quiz-panel]'),quizButtons=all('[data-quiz-step]');let quizStep=0,quizBusy=false,quizComplete=false;
const answer=n=>$('#quiz input[name="'+n+'"]:checked')?.value;
function quizState(){
 const completed=['method','taste','milk'].filter(n=>answer(n)).length;
 $('#quiz-progress-fill').style.width=(completed/3*100)+'%';
 quizButtons.forEach((b,i)=>{b.disabled=i>0&&!answer(i===1?'method':'taste');b.setAttribute('aria-current',i===quizStep?'step':'false');b.classList.toggle('complete',!!answer(['method','taste','milk'][i]));});
 $('#quiz-position').textContent='Шаг '+(quizStep+1)+' из 3';$('#quiz-back').disabled=quizStep===0||quizBusy;
 $('#quiz-next').disabled=quizBusy||!answer(['method','taste','milk'][quizStep]);$('#quiz-next').innerHTML=(quizStep===2?'Показать мой кофе':'Далее')+' <span>→</span>';
}
async function quizGo(step){if(quizBusy||step<0||step>2||step>0&&!answer(step===1?'method':'taste'))return;
 quizBusy=true;quizState();const current=panels[quizStep];
 if(G&&!reduced())await window.ZernoMotion.tween(current,{opacity:0,y:-6,duration:.3});
 panels.forEach((p,i)=>{p.hidden=i!==step;p.disabled=i!==step;});quizStep=step;quizBusy=false;quizState();
 G?.set(current,{clearProps:'transform,opacity'});enter(panels[step]);
}
quizButtons.forEach(b=>b.addEventListener('click',()=>quizGo(Number(b.dataset.quizStep))));
$('#quiz-back').addEventListener('click',()=>quizGo(quizStep-1));
$('#quiz').addEventListener('change',()=>{quizState();if(quizComplete)recommend();});
$('#quiz').addEventListener('submit',e=>{e.preventDefault();if(quizBusy||!answer(['method','taste','milk'][quizStep]))return;if(quizStep<2)quizGo(quizStep+1);else{quizComplete=true;recommend();}});
const roast=$('#roast-choice');
function roastState(value){const n=Number(value),label=n<36?'Светлая':n>65?'Тёмная':'Средняя';$('#roast-reading').textContent=label+' · '+n+' / 100';
 $('#roast-description').textContent=n<36?'Цветы и фрукты, лёгкое тело.':n>65?'Шоколад и орехи, плотный характер.':'Баланс сладости, фруктовых и шоколадных нот.';
 roast.setAttribute('aria-valuetext',label+', '+n+' из 100');$('#quiz-roast-track').style.setProperty('--roast-position',((n-10)/80*100)+'%');
}
function recommend(manual=false){
 const method=answer('method'),taste=answer('taste'),milk=answer('milk');if(!method||!taste||!milk)return;
 let p=C.products.find(p=>p.id===window.ZernoCore.chooseCoffee(method,taste,milk));
 if(manual)p=C.products.filter(p=>p.method.includes(method)).sort((a,b)=>Math.abs(a.roast-Number(roast.value))-Math.abs(b.roast-Number(roast.value)))[0];else roast.value=p.roast;
 roastState(roast.value);
 const result=$('#quiz-result');result.innerHTML=`<p class="eyebrow">ВАШ УТРЕННИЙ ПРОФИЛЬ</p><h3>${esc(p.name)}</h3><p>${esc(p.country)} · ${esc(p.region)}<br>${esc(p.notes)}</p><div class="quiz-answer-pills"><span>${{turka:'Турка',machine:'Кофемашина',filter:'Фильтр'}[method]}</span><span>${taste==='classic'?'Шоколад и орехи':'Фрукты и цветы'}</span><span>${milk==='yes'?'С молоком':'Чёрный кофе'}</span></div><p class="small">Подбор — ориентир по вкусу. Демонстрационный ассортимент.</p><button type="button" class="button" data-add="${p.id}">Добавить 250 г · ${money(p.price)} <span>+</span></button>`;
 enter(result);$('#quiz-progress-fill').style.width='100%';
}
roast.addEventListener('input',()=>{roastState(roast.value);if(quizComplete)recommend(true);});roastState(roast.value);quizState();
// Drink builder: explicit size, recipe and syrup selection, with deterministic SKU IDs.
let drinkSize=null,drinkIndex=null,syrupId=null,milk='classic',builderStep=0,lastSummary='';
const sizeNames=['S','M','L'];
function recipe(){return C.recipes[drinkIndex??2];}
function drawSizes(){const r=recipe();$('#drink-sizes').innerHTML=r.sizes.map((volume,i)=>`<button type="button" data-drink-size="${i}" aria-pressed="${drinkSize===i}"><strong>${sizeNames[i]}</strong><span>${volume} мл</span></button>`).join('');}
$('#syrup-options').innerHTML=C.syrups.map(s=>`<button type="button" data-syrup="${s.id}" aria-pressed="false">${esc(s.name)}<small>${s.price?'+'+s.price+' ₽':'без доплаты'}</small></button>`).join('');
$('#drinks').innerHTML=C.drinkMenu.map(([name,cost],i)=>`<li><button type="button" class="drink-option" data-drink="${i}" disabled aria-pressed="false"><span>${esc(name)}</span><strong>от ${cost} ₽</strong></button></li>`).join('');
function builderGo(step){if(step>0&&drinkSize===null||step>1&&drinkIndex===null)return;builderStep=step;all('[data-builder-panel]').forEach((p,i)=>{p.hidden=i!==step;if(i===step)enter(p);});
 all('[data-drink-step]').forEach((b,i)=>{b.disabled=i>0&&drinkSize===null||i>1&&drinkIndex===null;b.setAttribute('aria-current',i===step?'step':'false');});
 $('#builder-status').textContent=['01 · Выберите размер чашки','02 · Выберите кофе в меню','03 · Добавьте свой оттенок вкуса'][step];
}
function selectedProduct(){if(drinkSize===null||drinkIndex===null||syrupId===null)return null;return C.drinkProducts.find(p=>p.id===`drink-${drinkIndex}-${drinkSize}-${syrupId}-${milk}`);}
function updateBuilder(){
 const r=recipe();all('[data-drink]').forEach(b=>{const active=Number(b.dataset.drink)===drinkIndex;b.disabled=drinkSize===null;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);});
 all('[data-syrup]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.syrup===syrupId)));
 $('#drink-progress-fill').style.width=((drinkSize!==null?1:0)+(drinkIndex!==null?1:0)+(syrupId!==null?1:0))/3*100+'%';
 $('#selected-size').textContent=drinkSize===null?'':'Ваша чашка: '+sizeNames[drinkSize]+' · '+r.sizes[drinkSize]+' мл';
 $('#cup-volume').textContent=drinkSize===null?'ваша чашка':r.sizes[drinkSize]+' мл';
 $('#milk-options').hidden=!r.milk||!!r.cream;
 const p=selectedProduct();$('#builder-summary').textContent=p?p.name+' · '+money(p.price)+'\n'+p.details:drinkIndex!==null?C.drinkMenu[drinkIndex][0]+' · '+r.sizes[drinkSize]+' мл':'Ваша чашка ещё впереди.';
 if($('#builder-summary').textContent!==lastSummary){lastSummary=$('#builder-summary').textContent;enter($('#builder-summary'));}
 const add=$('#builder-add'),was=add.hidden;add.hidden=!p;if(p){add.dataset.add=p.id;if(was)enter(add);}
 $('#recipe-legend').textContent=drinkIndex===null?'':r.labels.join(' · ')+(syrupId&&syrupId!=='none'?' · '+C.syrups.find(s=>s.id===syrupId).name:'');
 const coffee=drinkIndex===null?0:r.layers[0],milkLayer=drinkIndex===null?0:r.layers[1],foam=drinkIndex===null?0:r.layers[2],syrup=syrupId&&syrupId!=='none'?.10:0;
 const total=coffee+milkLayer+foam+syrup||1,capacity=drinkSize===null?0:[66,78,88][drinkSize];let bottom=294;
 const targets=[['#liquid-syrup',syrup],['#liquid-coffee',coffee],['#liquid-milk',milkLayer],['#liquid-foam',foam]];
 if(drinkIndex===1)$('#liquid-coffee').setAttribute('fill','#98724b');else $('#liquid-coffee').setAttribute('fill',drinkIndex===7?'#65422b':'#6c3a20');
 $('#liquid-milk').setAttribute('fill',milk==='oat'?'#d7b987':'#ecd7b0');$('#liquid-syrup').setAttribute('fill',C.syrups.find(s=>s.id===syrupId)?.color||'#ba803d');
 for(const [layerIndex,[selector,fraction]] of targets.entries()){const h=capacity*fraction/total;bottom-=h;const el=$(selector);G?.killTweensOf(el);if(G&&!reduced())G.to(el,{attr:{y:bottom,height:h},duration:1.2,delay:layerIndex*.12,ease:'sine.inOut'});else{el.setAttribute('y',bottom);el.setAttribute('height',h);}}
 const stream=$('#coffee-stream');G?.killTweensOf(stream);if(G&&!reduced()&&drinkIndex!==null){G.set(stream,{opacity:.75});G.to(stream,{opacity:0,duration:.5,delay:.7});}else stream.setAttribute('opacity','0');
}
$('#drink-sizes').addEventListener('click',e=>{const b=e.target.closest('[data-drink-size]');if(!b)return;drinkSize=Number(b.dataset.drinkSize);drawSizes();builderGo(drinkIndex===null?1:2);updateBuilder();if(matchMedia('(max-width:560px)').matches&&drinkIndex===null)requestAnimationFrame(()=>window.ZernoMotion.scrollTo('#drinks',false));});
$('#drinks').addEventListener('click',e=>{const b=e.target.closest('[data-drink]');if(!b||drinkSize===null)return;drinkIndex=Number(b.dataset.drink);if(!recipe().milk||recipe().cream)milk='classic';$('#drink-milk').value=milk;
 $('#drink-description').textContent=C.drinkMenu[drinkIndex][2]+' Порция '+sizeNames[drinkSize]+': '+recipe().sizes[drinkSize]+' мл.';enter($('#drink-description'));drawSizes();builderGo(2);updateBuilder();if(matchMedia('(max-width:560px)').matches)requestAnimationFrame(()=>window.ZernoMotion.scrollTo('.coffee-builder',false));});
$('#syrup-options').addEventListener('click',e=>{const b=e.target.closest('[data-syrup]');if(!b)return;syrupId=b.dataset.syrup;updateBuilder();});
$('#drink-milk').addEventListener('change',e=>{milk=e.target.value;updateBuilder();});
all('[data-drink-step]').forEach(b=>b.addEventListener('click',()=>builderGo(Number(b.dataset.drinkStep))));
document.addEventListener('zerno:motion',()=>{if(reduced())updateBuilder();});
drawSizes();builderGo(0);updateBuilder();
// Steam stays directly above the visible cup as the photograph is cropped.
function alignSteam(){const host=$('.hero-media'),img=$('.hero-background'),steam=$('.steam');if(!img||!host||!steam)return;
 const w=img.clientWidth,h=img.clientHeight;if(!w||!h)return;const sourceW=1300,sourceH=867,scale=Math.max(w/sourceW,h/sourceH),mobile=matchMedia('(max-width:560px)').matches;
 const pos=mobile?.5:matchMedia('(max-width:800px)').matches?.42:.5,vertical=mobile?.65:.5;
 const cx=(mobile?680:590)*scale+(w-sourceW*scale)*pos,cy=400*scale+(h-sourceH*scale)*vertical;
 const width=Math.min(w*.31,245),height=Math.min(270,Math.max(115,h*.34));
 steam.style.left=(cx-width/2)+'px';steam.style.top=(cy-height*.88)+'px';steam.style.width=width+'px';steam.style.height=height+'px';
}
document.documentElement.classList.add('media-enhanced');
all('.hero-background,.gallery-image').forEach(img=>{const ready=()=>{const decoded=img.decode?img.decode():Promise.resolve();decoded.catch(()=>{}).then(()=>img.classList.add('image-decoded'));};if(img.complete)ready();else{img.addEventListener('load',ready,{once:true});img.addEventListener('error',()=>img.classList.add('image-decoded'),{once:true});}});
new ResizeObserver(alignSteam).observe($('.hero-media'));$('.hero-background').addEventListener('load',alignSteam);alignSteam();
})();
