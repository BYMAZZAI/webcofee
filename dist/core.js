(function(root){
'use strict';
const normalizeCart=(value,products)=>{
 const out={};if(!value||typeof value!=='object'||Array.isArray(value))return out;
 for(const [id,quantity] of Object.entries(value))if(products.some(p=>p.id===id)&&Number.isInteger(quantity)&&quantity>0)out[id]=Math.min(quantity,99);
 return out;
};
const chooseCoffee=(method,taste,milk)=>{
 const classic=taste==='classic',withMilk=milk==='yes';
 if(method==='filter')return classic||withMilk?'colombia':'ethiopia';
 if(method==='turka')return classic||withMilk?'brazil':'guatemala';
 return classic||withMilk?'blend':'colombia';
};
const validPhone=value=>/^\+?[\d\s()\-]+$/.test(value.trim())&&value.replace(/\D/g,'').length>=10&&value.replace(/\D/g,'').length<=15;
const cartTotal=(cart,products)=>{const entries=Object.entries(normalizeCart(cart,products));if(entries.some(([id])=>!Number.isFinite(products.find(p=>p.id===id).price)))return null;return entries.reduce((sum,[id,n])=>sum+products.find(p=>p.id===id).price*n,0);};
// One selection owner prevents hover, touch and keyboard states accumulating.
function createCatalogSelection(onChange=()=>{}){let active=null;const set=id=>{if(id===active)return;const previous=active;active=id;onChange(active,previous);};return {get active(){return active;},set,toggle:id=>set(active===id?null:id),clear:id=>{if(id===undefined||active===id)set(null);}};}
const api={normalizeCart,chooseCoffee,validPhone,cartTotal,createCatalogSelection};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ZernoCore=api;
})(typeof window!=='undefined'?window:globalThis);
