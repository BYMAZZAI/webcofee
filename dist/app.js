(() => {
'use strict';
const C=window.ZERNO, $=s=>document.querySelector(s), money=n=>Number.isFinite(n)?new Intl.NumberFormat('ru-RU').format(n)+' ₽':'Цена уточняется';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cartProducts=[...C.variants,...C.drinkProducts];
const byId=id=>cartProducts.find(p=>p.id===id);
let cart={};
try {const saved=JSON.parse(localStorage.getItem('zerno-cart-v1')||'{}'); cart=ZernoCore.normalizeCart(saved,cartProducts);}catch{}
let toastTimer, lastFocus, pendingOrder;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function bounce(el){ZernoEffects.restartBounce(el);}
function saveCart(){try{localStorage.setItem('zerno-cart-v1',JSON.stringify(cart));}catch{toast('Корзина сохранится только до закрытия страницы.');}updateCount();$('#checkout-status').textContent='';$('.checkout-submit').disabled=false;}
function updateCount(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$('#cart-count').textContent=n;$('#open-cart').setAttribute('aria-label',`Открыть корзину, товаров: ${n}`);}
const roastEffects=ZernoEffects.observeRoasts(document);
function observeRoast(){roastEffects.scan();}
function renderProducts(filter='all'){
 const list=C.products.filter(p=>filter==='all'||p.method.includes(filter));
 $('#products').innerHTML=list.length?list.map(p=>`<article class="product" id="product-${esc(p.id)}"><div class="product-image choco-outline"><span class="badge" ${p.badge?'':'hidden'}>${esc(p.badge)}</span><div class="flip-inner" aria-hidden="true"><div class="front"><div class="bag" style="--label:${esc(p.color)}"><div class="bag-label"><div class="bag-brand">зерно</div><small>КОФЕ СВОЕЙ ОБЖАРКИ</small><hr><b>${esc(p.name)}</b><span>250 г</span></div></div></div></div><div class="pack-choices" id="choices-${esc(p.id)}" inert><p class="eyebrow">${esc(p.country)}</p><h3>${esc(p.name)}</h3><p>${esc(p.region)}<br>${esc(p.notes)}</p><p class="small">Выберите размер и рассмотрите пачку</p><div class="pack-size-options">${C.variants.filter(v=>v.baseId===p.id).map(v=>`<button type="button" data-model="${v.id}" aria-haspopup="dialog" aria-label="${esc(p.name)}, ${v.grams} граммов: посмотреть модель"><strong>${v.grams===1000?'1 кг':v.grams+' г'}</strong><span>${money(v.price)}</span><small>${money(v.price*250/v.grams)} / 250 г</small></button>`).join('')}</div></div><button class="model-button" data-catalog-open="${esc(p.id)}" aria-controls="choices-${esc(p.id)}" aria-label="Выбрать размер упаковки ${esc(p.name)}">Размеры и 3D ↗</button><button class="flip-button" data-flip="${esc(p.id)}" aria-controls="choices-${esc(p.id)}" aria-expanded="false" aria-pressed="false" aria-label="Перевернуть упаковку ${esc(p.name)}">О вкусе ↻</button></div><div class="product-info"><div class="product-top"><h3>${esc(p.name)}</h3><span class="product-price">${money(p.price)} / 250 г</span></div><p class="notes">${esc(p.notes)}</p><p class="product-meta">${esc(p.country)} · ${esc(p.region)}</p><div class="product-bottom"><div class="roast-mini"><span>Обжарка</span><div class="roast-track" role="img" aria-label="Профиль обжарки: ${p.roast} из 100"><i style="--roast:${p.roast}%"></i></div></div><button class="add-button" data-add="${esc(p.id)}" aria-label="Добавить ${esc(p.name)} в корзину">В корзину +</button></div></div></article>`).join(''):'<p>Для этого способа зерно пока не добавлено. Выберите «Всё зерно».</p>';
 observeRoast();document.dispatchEvent(new Event('catalog:render'));
}
function add(id,button){if(!byId(id))return;if((cart[id]||0)>=99){toast('Можно добавить до 99 единиц одного товара.');return;}cart[id]=(cart[id]||0)+1;saveCart();bounce($('#cart-count'));if(button)bounce(button);toast(byId(id).name+' — в корзине');if($('#cart-dialog').open)renderCart();}
function renderCart(){const entries=Object.entries(cart);$('#cart-bottom').hidden=!entries.length;
 if(!entries.length){$('#cart-items').innerHTML='<div class="empty-cart"><h3>Пока ни зёрнышка.</h3><p>Выберите кофе — и здесь появится ваш заказ.</p><button class="button" id="empty-shop">Выбрать зерно ↗</button></div>';return;}
 $('#cart-items').innerHTML=entries.map(([id,n])=>{const p=byId(id);return `<article class="cart-row"><div><h3>${esc(p.name)}</h3><p>${esc(p.kind==='drink'?p.details:p.grams+' г · '+p.country)} · ${money(p.price)}</p></div><strong>${money(Number.isFinite(p.price)?p.price*n:null)}</strong><div class="quantity"><button data-change="${esc(id)}" data-delta="-1" aria-label="Уменьшить количество ${esc(p.name)}">−</button><span aria-label="${n} товаров">${n}</span><button data-change="${esc(id)}" data-delta="1" aria-label="Увеличить количество ${esc(p.name)}" ${n>=99?'disabled':''}>+</button></div><button class="remove" data-remove="${esc(id)}" aria-label="Удалить ${esc(p.name)}">Убрать</button></article>`;}).join('');
 $('#cart-total').textContent=money(ZernoCore.cartTotal(cart,cartProducts));
}
function closeCart(){window.ZernoMotion?window.ZernoMotion.closeDialog($('#cart-dialog')):$('#cart-dialog').close();}
$('#open-cart').addEventListener('click',()=>{lastFocus=document.activeElement;renderCart();$('#cart-dialog').showModal();window.ZernoMotion?.openDialog($('#cart-dialog'));document.body.classList.add('modal-open');$('#close-cart').focus();});
$('#close-cart').addEventListener('click',closeCart);
$('#cart-dialog').addEventListener('cancel',e=>{e.preventDefault();closeCart();});
$('#cart-dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus();});
$('#cart-dialog').addEventListener('click',e=>{if(e.target===$('#cart-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCart();}});
document.addEventListener('click',e=>{
 const addBtn=e.target.closest('[data-add]');if(addBtn)window.ZernoConfirm?.open(addBtn.dataset.add,addBtn);
 const change=e.target.closest('[data-change]');if(change){const id=change.dataset.change,delta=Number(change.dataset.delta);cart[id]=Math.min(99,(cart[id]||0)+delta);if(cart[id]<=0)delete cart[id];saveCart();renderCart();const next=$(`[data-change="${id}"][data-delta="${delta}"]`);(next&&!next.disabled?next:$('#close-cart')).focus();}
 const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];saveCart();renderCart();$('#close-cart').focus();}
 if(e.target.closest('#empty-shop')){closeCart();window.ZernoMotion?window.ZernoMotion.scrollTo('#beans'):$('#beans').scrollIntoView();$('.filter').focus({preventScroll:true});}
});
$('.filters').addEventListener('click',async e=>{const b=e.target.closest('[data-filter]');if(!b)return;document.querySelectorAll('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});if(window.ZernoMotion)await window.ZernoMotion.changeCatalog(()=>renderProducts(b.dataset.filter));else renderProducts(b.dataset.filter);});
const menu=$('#menu-toggle');menu.addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
function closeMenu(){$('#nav').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#nav').classList.contains('open')){closeMenu();menu.focus();}});
$('#drinks').innerHTML=C.drinks.map(n=>`<li>${esc(n)}<span>Цена уточняется</span></li>`).join('');
$('#checkout').addEventListener('submit',async e=>{e.preventDefault();const name=$('#customer'),phone=$('#phone'),consent=$('#consent');const digits=phone.value.replace(/\D/g,'');let first=null;
 for(const [el,error,message] of [[name,'#name-error',name.value.trim().length<2?'Укажите имя: минимум 2 символа.':''],[phone,'#phone-error',!ZernoCore.validPhone(phone.value)?'Введите телефон: от 10 до 15 цифр.':''],[consent,'#consent-error',!consent.checked?'Подтвердите ознакомление с описанием обработки данных.':'']]){$(error).textContent=message;el.setAttribute('aria-invalid',String(!!message));if(message&&!first)first=el;}
 if(first){$('#checkout-status').textContent='Проверьте отмеченные поля.';first.focus();return;}
 if(!Object.keys(cart).length){$('#checkout-status').textContent='Добавьте зерно в корзину.';return;}
 if(!C.ordersEnabled||!C.orderEndpoint){$('#checkout-status').textContent='Данные заполнены корректно. Онлайн-заказы пока недоступны: ваш выбор сохранён в корзине, данные никуда не отправлены.';return;}
 const payload={name:name.value.trim(),phone:phone.value.trim(),delivery:$('#delivery-type').value,consent:true,items:Object.entries(cart).map(([id,quantity])=>({id,quantity}))};const signature=JSON.stringify(payload);if(!pendingOrder||pendingOrder.signature!==signature)pendingOrder={signature,key:crypto.randomUUID()};
 const button=e.target.querySelector('button[type=submit]');button.disabled=true;$('#checkout-status').textContent='Отправляем заказ…';
 try{const url=new URL(C.orderEndpoint,location.origin);if(url.origin!==location.origin||url.protocol!=='https:')throw new Error('Invalid endpoint');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);let response;try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':pendingOrder.key},signal:controller.signal,body:signature});}finally{clearTimeout(timer);}if(!response.ok)throw new Error('Request failed');const result=await response.json();if(result.accepted!==true||typeof result.orderId!=='string')throw new Error('Unconfirmed order');pendingOrder=null;cart={};saveCart();renderCart();$('#cart-bottom').hidden=false;$('#checkout').reset();$('#checkout-status').textContent='Заказ принят. Номер: '+result.orderId;button.disabled=true;}
 catch{$('#checkout-status').textContent='Не удалось подтвердить приём заказа. Корзина сохранена. Не повторяйте отправку, пока не проверите статус у кофейни.';button.disabled=false;}
});
function external(button,url,missing,pattern){$(button).addEventListener('click',()=>{if(url&&pattern.test(url))window.open(url,'_blank','noopener,noreferrer');else toast(missing);});}
external('#maps-button',C.mapsUrl,'Маршрут появится после добавления адреса кофейни.',/^https:\/\/(2gis\.ru|go\.2gis\.com)\//);
external('#instagram-button',C.instagramUrl,'Ссылка на Instagram скоро появится здесь.',/^https:\/\/(www\.)?instagram\.com\//);
if(C.address)$('#address').textContent=C.address;if(C.hours)$('#hours').textContent=C.hours;
if(C.mapsUrl)$('#map-status').textContent='Откроется карточка кофейни в 2ГИС.';
window.ZernoCart={add,product:byId};
renderProducts();updateCount();
})();
