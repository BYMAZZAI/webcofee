window.ZERNO = {
  ordersEnabled: false,
  orderEndpoint: '', // Same-origin HTTPS endpoint. Server must validate prices, consent and rate limits.
  // Blank client data must be supplied before launch.
  mapsUrl: '', instagramUrl: '', address: '', hours: '',
  products: [
    {id:'brazil',name:'Шоколадный',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Шоколад · фундук · карамель',price:null,roast:65,color:'#8a5039',method:['machine','turka'],badge:'Хит · пример'},
    {id:'ethiopia',name:'Цветочный',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Бергамот · жасмин · лимон',price:null,roast:28,color:'#6e764f',method:['filter'],badge:'Новинка · пример'},
    {id:'colombia',name:'Фруктовый',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Красное яблоко · какао · мёд',price:null,roast:48,color:'#b2784f',method:['filter','machine'],badge:''},
    {id:'kenya',name:'Ягодный',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Смородина · грейпфрут · чай',price:null,roast:25,color:'#8d4840',method:['filter'],badge:''},
    {id:'guatemala',name:'Цитрусовый',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Апельсин · шоколад · миндаль',price:null,roast:58,color:'#7d7760',method:['turka','machine'],badge:''},
    {id:'blend',name:'Карамельный',country:'Страна нужна от клиента',region:'Регион уточняется',notes:'Карамель · орехи · какао',price:null,roast:75,color:'#584239',method:['machine','turka'],badge:''}
  ],
  drinks:['Эспрессо','Американо','Капучино','Латте','Флэт уайт','Раф','Фильтр-кофе','Какао']
};

window.ZERNO.drinkMenu = [
 ['Эспрессо',140,'Короткий и насыщенный. Для тех, кто любит кофе без лишних деталей.'],['Американо',170,'Эспрессо и горячая вода — спокойный чёрный кофе для неспешной чашки.'],['Капучино',240,'Кофе, молоко и мягкая пена. Знакомый утренний ритуал.'],['Латте',270,'Больше молока, мягче кофейный характер. Для длинной паузы.'],['Флэт уайт',260,'Выраженный кофейный вкус и тонкий слой молочной пены.'],['Раф',310,'Сливочный напиток для тех, кому хочется десертного настроения.'],['Фильтр-кофе',220,'Чёрный кофе, который интересно пить медленно, замечая оттенки.'],['Какао',250,'Тёплая шоколадная альтернатива кофе.']
];

window.ZERNO.demoReviews = [
 {name:'Анна К.',service:'Зерно для дома',stars:5,text:'Открываешь пачку — и утро уже началось правильно. Люблю шоколадные ноты и то, как кофе раскрывается в моей небольшой кофемашине.'},
 {name:'Михаил С.',service:'Капучино у стойки',stars:5,text:'Зашёл на чашку перед прогулкой. Мягкий капучино, спокойный разговор и несколько минут без спешки — за этим настроением хочется вернуться.'},
 {name:'Екатерина М.',service:'Подбор кофе',stars:5,text:'Раньше выбирала зерно только по названию страны. Подсказки про вкус и способ приготовления помогли понять, с чего мне начать.'},
 {name:'Даниил П.',service:'Фильтр-кофе',stars:4,text:'Мне ближе фруктовые профили. Интересно пить кофе небольшими глотками и замечать, как меняется впечатление, когда чашка остывает.'},
 {name:'Ольга В.',service:'Зерно для турки',stars:5,text:'Варю кофе по выходным, когда можно никуда не торопиться. Ореховый аромат и маленькая чашка — мой любимый способ начать день.'},
 {name:'Артём Л.',service:'Американо',stars:4,text:'Для меня хороший кофе — простой чёрный, без добавок. Взял американо и спокойно дочитал главу книги у окна.'},
 {name:'Мария Н.',service:'Латте',stars:5,text:'Люблю мягкие молочные напитки. Здесь в макете особенно нравится ощущение тепла: хочется выбрать латте и устроить себе небольшой перерыв.'},
 {name:'Илья Р.',service:'Зерно для кофемашины',stars:5,text:'Сравнил несколько профилей и выбрал карамельный. Нравится, когда в описании понятно написано, чего ждать от чашки, а не только красивое название.'},
 {name:'Виктория А.',service:'Раф и какао',stars:4,text:'Мы с подругой выбираем разные напитки: она любит раф, я чаще беру какао. Хорошо, когда можно встретиться за одним столом и каждой найти свой вкус.'},
 {name:'Павел Д.',service:'Домашний кофейный ритуал',stars:5,text:'Пачка на кухонной полке, любимая чашка и десять минут для себя. Именно такие маленькие вещи делают обычное утро чуть приятнее.'}
];


// Demonstration assortment and prices, supplied for UI review only.
const coffeeSamples=[['Бразилия','Серрадо',650],['Эфиопия','Иргачефф',750],['Колумбия','Уила',700],['Кения','Кириньяга',850],['Гватемала','Антигуа',720],['Бразилия / Колумбия','Купаж',620]];
window.ZERNO.products.forEach((p,i)=>{[p.country,p.region,p.price]=coffeeSamples[i];p.grams=250;});
window.ZERNO.packSizes=[250,500,1000];
window.ZERNO.variants=window.ZERNO.products.flatMap(p=>window.ZERNO.packSizes.map((grams,i)=>({...p,baseId:p.id,id:i?p.id+'-'+grams:p.id,grams,price:Math.round(p.price*[1,1.9,3.6][i]),name:p.name+' · '+grams+' г',baseName:p.name,kind:'beans'})));
window.ZERNO.syrups=[{id:'none',name:'Без сиропа',price:0,color:'#b9803f'},{id:'vanilla',name:'Ваниль',price:40,color:'#d6ab61'},{id:'caramel',name:'Карамель',price:40,color:'#a86425'},{id:'hazelnut',name:'Лесной орех',price:40,color:'#875336'}];
// Recipe fractions are illustrative; sizes and prices are not a confirmed menu.
window.ZERNO.recipes=[
 {sizes:[30,60,90],layers:[1,0,0],labels:['Эспрессо']},
 {sizes:[200,300,400],layers:[.65,0,.03],labels:['Горячая вода','Эспрессо']},
 {sizes:[200,300,400],layers:[.25,.45,.30],labels:['Эспрессо','Молоко','Молочная пена'],milk:true},
 {sizes:[200,300,400],layers:[.20,.65,.15],labels:['Эспрессо','Молоко','Молочная пена'],milk:true},
 {sizes:[180,250,350],layers:[.35,.55,.10],labels:['Двойной эспрессо','Молоко','Тонкая пена'],milk:true},
 {sizes:[200,300,400],layers:[.22,.68,.10],labels:['Эспрессо','Сливки','Пена'],milk:true,cream:true},
 {sizes:[200,300,400],layers:[.95,0,.05],labels:['Фильтр-кофе']},
 {sizes:[200,300,400],layers:[.3,.65,.05],labels:['Какао','Молоко'],milk:true}
];
window.ZERNO.drinkProducts=[];
window.ZERNO.drinkMenu.forEach(([name,base],i)=>{
 window.ZERNO.drinkProducts.push({id:'drink-'+i,name,price:base,kind:'drink',details:'Напиток · базовая порция'});
 for(let size=0;size<3;size++)for(const syrup of window.ZERNO.syrups)for(const milk of ['classic','oat']){
  const r=window.ZERNO.recipes[i];if(milk==='oat'&&(!r.milk||r.cream))continue;
  const volume=r.sizes[size],details=volume+' мл · '+syrup.name+(r.milk?' · '+(r.cream?'Сливки':milk==='oat'?'Овсяный напиток':'Классическое молоко'):'');
  window.ZERNO.drinkProducts.push({id:'drink-'+i+'-'+size+'-'+syrup.id+'-'+milk,name:name+' · '+volume+' мл',price:base+size*50+syrup.price+(milk==='oat'?40:0),kind:'drink',details,recipe:i,size,syrup:syrup.id,milk,volume});
 }
});
