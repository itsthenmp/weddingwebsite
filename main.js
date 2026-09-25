const BOOKING_MESSAGE='I would like to book your services for my event';
const WHATSAPP='919836439088';
const bookingUrl=message=>'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);
document.querySelectorAll('[data-book]').forEach(link=>{link.href=bookingUrl(BOOKING_MESSAGE);link.target='_blank';link.rel='noopener noreferrer'});
document.getElementById('year').textContent=new Date().getFullYear();

const header=document.getElementById('site-header');
const setHeader=()=>header.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',setHeader,{passive:true});setHeader();
const nextSectionButton=document.getElementById('next-section-button');
const pageSections=[...document.querySelectorAll('main > section'),document.getElementById('footer')].filter(Boolean);
const reducedScrollMotion=matchMedia('(prefers-reduced-motion: reduce)');
function currentSectionIndex(){
  const readingLine=scrollY+Math.min(innerHeight*.35,220);
  for(let i=pageSections.length-1;i>=0;i--){
    if(pageSections[i].getBoundingClientRect().top+scrollY<=readingLine)return i;
  }
  return 0;
}
function updateNextSectionButton(){nextSectionButton.hidden=currentSectionIndex()>=pageSections.length-1}
nextSectionButton.addEventListener('click',()=>{
  const next=pageSections[currentSectionIndex()+1];
  if(next)scrollTo({top:next.getBoundingClientRect().top+scrollY-78,behavior:reducedScrollMotion.matches?'instant':'smooth'});
});
addEventListener('scroll',updateNextSectionButton,{passive:true});
addEventListener('resize',updateNextSectionButton);updateNextSectionButton();
const menuButton=document.querySelector('.menu-toggle'),mobileMenu=document.getElementById('mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';mobileMenu.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open menu':'Close menu')});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

const spotlight=document.querySelector('[data-spotlight]');
function moveSpotlight(e){const r=spotlight.getBoundingClientRect();spotlight.style.setProperty('--spot-x',e.clientX-r.left+'px');spotlight.style.setProperty('--spot-y',e.clientY-r.top+'px');spotlight.style.setProperty('--spot-opacity','1')}
spotlight.addEventListener('pointermove',moveSpotlight);
spotlight.addEventListener('pointerdown',moveSpotlight);
spotlight.addEventListener('pointerleave',()=>spotlight.style.setProperty('--spot-opacity','0'));
spotlight.addEventListener('pointerup',()=>spotlight.style.setProperty('--spot-opacity','0'));
spotlight.addEventListener('pointercancel',()=>spotlight.style.setProperty('--spot-opacity','0'));

const hero=document.querySelector('.hero');
function moveHeroSpotlight(e){const r=hero.querySelector('.hero-spotlight').getBoundingClientRect();hero.style.setProperty('--hero-x',e.clientX-r.left+'px');hero.style.setProperty('--hero-y',e.clientY-r.top+'px');hero.style.setProperty('--hero-spot-opacity','1')}
hero.addEventListener('pointermove',moveHeroSpotlight);hero.addEventListener('pointerdown',moveHeroSpotlight);
hero.addEventListener('pointerleave',()=>hero.style.setProperty('--hero-spot-opacity','0'));
hero.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')hero.style.setProperty('--hero-spot-opacity','0')});
hero.addEventListener('pointercancel',()=>hero.style.setProperty('--hero-spot-opacity','0'));

const bookingSection=document.querySelector('.booking');
if(bookingSection&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  bookingSection.classList.add('book-pending');
  let opened=false;
  const openBook=()=>{if(opened)return;opened=true;bookingSection.classList.add('book-open');setTimeout(()=>window.animateType?.(bookingSection.querySelector('h2')),1250)};
  const bookObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){openBook();bookObserver.disconnect()}},{threshold:.22});
  bookObserver.observe(bookingSection);
  bookingSection.querySelector('[data-book]').addEventListener('focus',openBook);
}

const filmStage=document.getElementById('film-stage');
const filmObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const iframe=document.createElement('iframe');
  iframe.title='Memories in Pixels prewedding film';
  iframe.src='https://www.youtube-nocookie.com/embed/Pp2XzkrV-Eg?autoplay=1&mute=1&playsinline=1&controls=1&rel=0';
  iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.allowFullscreen=true;
  filmStage.replaceChildren(iframe);
  filmObserver.disconnect();
}),{rootMargin:'200px 0px',threshold:.1});
filmObserver.observe(filmStage);

const typeMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(!typeMotion.matches){
  function animateType(target){
    if(target.classList.contains('type-ready'))return;
    const original=target.innerText.replace(/\s+/g,' ').trim();let count=0;
    const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      for(const char of Array.from(node.textContent)){
        if(/\s/.test(char)){fragment.append(document.createTextNode(char));continue}
        const span=document.createElement('span');span.className='type-char';span.setAttribute('aria-hidden','true');span.style.setProperty('--char-delay',Math.round(count*22)+'ms');span.textContent=char;fragment.append(span);count++;
      }
      node.replaceWith(fragment);
    });
    target.setAttribute('aria-label',original);target.classList.add('type-ready');
    typeObserver.observe(target);
  }
  const typeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('type-visible');typeObserver.unobserve(entry.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
  document.querySelectorAll('main h1,main h2,main .why h3,main .eyebrow,footer h3').forEach(target=>{if(!target.closest('.booking'))animateType(target)});
  window.animateType=animateType;
}

const whySection=document.querySelector('.why');
const petalField=whySection.querySelector('.petal-field');
for(let i=0;i<15;i++){
  const petal=document.createElement('span');petal.className='petal';
  petal.style.setProperty('--x',((i*37)%97)+'%');
  petal.style.setProperty('--size',(9+(i*7)%13)+'px');
  petal.style.setProperty('--duration',(8+(i*3)%7)+'s');
  petal.style.setProperty('--delay',(-i*.9)+'s');
  petal.style.setProperty('--drift',(((i*17)%90)-45)+'px');
  petalField.append(petal);
}
const petalObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('petals-active',entry.isIntersecting)),{threshold:.08});
petalObserver.observe(whySection);

const aboutCard=document.querySelector('.about-card');
aboutCard.addEventListener('click',()=>{const flipped=aboutCard.classList.toggle('flipped');aboutCard.setAttribute('aria-pressed',String(flipped));aboutCard.setAttribute('aria-label',flipped?'Flip About Us card back':'Flip About Us card')});

const footer=document.getElementById('footer');
footer.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=footer.getBoundingClientRect();footer.style.setProperty('--glow-x',e.clientX-r.left+'px');footer.style.setProperty('--glow-y',e.clientY-r.top+'px')});
const footerMotion=matchMedia('(prefers-reduced-motion: reduce)');
let footerRevealFrame=0;
function updateFooterReveal(){
  footerRevealFrame=0;
  if(footerMotion.matches){footer.classList.remove('has-reveal');return}
  const top=footer.getBoundingClientRect().top;
  const progress=Math.max(0,Math.min(1,(innerHeight-top)/(innerHeight*.78)));
  footer.classList.add('has-reveal');
  footer.style.setProperty('--footer-opacity',String(.35+.65*progress));
  footer.style.setProperty('--footer-shift',Math.round((1-progress)*64)+'px');
}
function requestFooterReveal(){if(!footerRevealFrame)footerRevealFrame=requestAnimationFrame(updateFooterReveal)}
addEventListener('scroll',requestFooterReveal,{passive:true});
addEventListener('resize',requestFooterReveal,{passive:true});
footerMotion.addEventListener('change',requestFooterReveal);
requestFooterReveal();

const localTime=document.getElementById('local-time');
const timeFormatter=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true});
function updateLocalTime(){const now=new Date();localTime.textContent=timeFormatter.format(now);localTime.dateTime=now.toISOString()}
updateLocalTime();setInterval(updateLocalTime,30000);

const visitorDisplay=document.getElementById('visitor-display');
const deviceVisitsKey='mip-device-visits';
function syncDeviceVisits(){
  try{visitorDisplay.textContent=localStorage.getItem(deviceVisitsKey)||'—'}
  catch{visitorDisplay.textContent='—'}
}
try{
  const previous=Number(localStorage.getItem(deviceVisitsKey));
  const visits=Number.isSafeInteger(previous)&&previous>=0?previous+1:1;
  localStorage.setItem(deviceVisitsKey,String(visits));
  visitorDisplay.textContent=String(visits);
}catch{visitorDisplay.textContent='—'}
addEventListener('storage',event=>{if(event.key===deviceVisitsKey)syncDeviceVisits()});
setInterval(syncDeviceVisits,60000);

const music=document.getElementById('site-music'),musicToggle=document.getElementById('music-toggle'),musicState=document.getElementById('music-state');
music.volume=.78;
let musicManuallyPaused=false;
function setMusicPlaying(playing){
  musicToggle.setAttribute('aria-pressed',String(playing));
  musicToggle.setAttribute('aria-label',(playing?'Pause':'Play')+' Walen Apache Flute background music');
  musicState.textContent=playing?'PAUSE MUSIC':'PLAY MUSIC';
}
async function startMusic(){
  music.muted=false;
  try{await music.play();setMusicPlaying(true)}
  catch{setMusicPlaying(false);musicState.textContent='TAP TO PLAY MUSIC'}
}
music.addEventListener('play',()=>setMusicPlaying(true));
music.addEventListener('pause',()=>setMusicPlaying(false));
musicToggle.addEventListener('click',()=>{
  if(music.paused){musicManuallyPaused=false;startMusic()}
  else{musicManuallyPaused=true;music.pause()}
});
function resumeMusicOnInteraction(event){
  if(musicManuallyPaused||(event.target instanceof Element&&event.target.closest('#music-toggle'))||!music.paused)return;
  startMusic();
}
document.addEventListener('pointerdown',resumeMusicOnInteraction,{capture:true});
document.addEventListener('keydown',resumeMusicOnInteraction,{capture:true});
startMusic();

const videoTiles=[...document.querySelectorAll('.video-tile')];
const videoPosters=new Map(videoTiles.map(tile=>[tile,tile.innerHTML]));
document.querySelector('.video-grid').addEventListener('click',event=>{
  const tile=event.target.closest('.video-tile');
  if(!tile)return;
  if(event.target.closest('.video-close')){tile.innerHTML=videoPosters.get(tile);return}
  if(!event.target.closest('.video-play'))return;
  const id=tile.dataset.videoId;
  if(id==='aMZZukjbdB4'){
    musicManuallyPaused=true;
    music.pause();
    window.open('https://www.youtube.com/watch?v='+id,'_blank','noopener,noreferrer');
    return;
  }
  videoTiles.forEach(other=>{if(other!==tile)other.innerHTML=videoPosters.get(other)});
  musicManuallyPaused=true;
  music.pause();
  tile.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1" title="Featured film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><button class="video-close" type="button" aria-label="Close film">×</button>';
});

const offerDialog=document.getElementById('offer-dialog');
const offerTrigger=document.getElementById('offer-trigger');
const offerPercent=document.getElementById('offer-percent');
const offerCode=document.getElementById('offer-code');
const offerBook=document.getElementById('offer-book');
function getBookingOffer(){
  try{
    const saved=JSON.parse(sessionStorage.getItem('mip-booking-offer')||'null');
    if(saved&&[10,15,20].includes(saved.percent)&&/^MIP(10|15|20)-[A-Z0-9]{4}$/.test(saved.code))return saved;
  }catch{}
  const bytes=new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const percent=[10,15,20][bytes[0]%3];
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code='MIP'+percent+'-'+Array.from(bytes.slice(1),byte=>alphabet[byte%alphabet.length]).join('');
  const offer={percent,code};
  try{sessionStorage.setItem('mip-booking-offer',JSON.stringify(offer))}catch{}
  return offer;
}
offerTrigger.addEventListener('click',()=>{
  const offer=getBookingOffer();
  offerPercent.textContent=offer.percent+'%';
  offerCode.textContent=offer.code;
  offerBook.href=bookingUrl('I would like to book your services for my event. My offer code is '+offer.code+' ('+offer.percent+'% off). I will send the offer screenshot with my booking.');
  offerDialog.showModal();
});
document.getElementById('offer-close').addEventListener('click',()=>offerDialog.close());
offerDialog.addEventListener('click',e=>{if(e.target===offerDialog)offerDialog.close()});

const phoneInput=document.querySelector('#enquiry-form [name="phone"]');
phoneInput.addEventListener('input',()=>{
  const value=phoneInput.value.trim();
  const digitCount=value.replace(/\D/g,'').length;
  phoneInput.setCustomValidity(!value||(/^[+]?[-().\d\s]+$/.test(value)&&digitCount>=7&&digitCount<=15)?'':'Enter a valid phone number with 7 to 15 digits.');
});
document.getElementById('enquiry-form').addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(e.currentTarget);
  const fields=[['Name','name'],['Phone','phone'],['Email','email'],['Event','event'],['Date','date'],['City','city'],['Venue','venue'],['Message','message']];
  const lines=[BOOKING_MESSAGE,'',...fields.map(([label,key])=>d.get(key)?label+': '+String(d.get(key)).trim():'').filter(Boolean)];
  try{const offer=JSON.parse(sessionStorage.getItem('mip-booking-offer')||'null');if(offer&&[10,15,20].includes(offer.percent)&&/^MIP(10|15|20)-[A-Z0-9]{4}$/.test(offer.code))lines.push('Offer code: '+offer.code+' ('+offer.percent+'% off; screenshot to follow)')}catch{}
  window.location.assign(bookingUrl(lines.join('\n')));
});

const categoryLabels={wedding:'Wedding',prewedding:'Prewedding',other:'Other Events'};
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
fetch('content.json').then(r=>{if(!r.ok)throw Error('Could not load photographs');return r.json()}).then(initContent).catch(error=>{console.error(error);document.getElementById('gallery-grid').innerHTML='<p class="gallery-error">Photographs are temporarily unavailable. Please try again shortly.</p>'});
function initContent(content){
  initMarquee(content);
  initGallery(content);
}
function initMarquee(content){
  const track=document.getElementById('marquee-track'),mask=track.parentElement;
  const cards=content.categories.map((category,i)=>{
    const src=content.photos[category.key][i===0?1:0].src;
    const services=category.services.map(service=>'<li>'+service+'</li>').join('');
    return '<article class="specialty-card" data-category="'+category.key+'"><span class="specialty-inner"><span class="specialty-face specialty-front"><span class="specialty-top">MEMORIES IN PIXELS <span aria-hidden="true">✦</span> 0'+(i+1)+'</span><span><h3>'+category.title+'<span>'+category.subtitle+'</span></h3></span><ul>'+services+'</ul><span class="specialty-bottom"><span>DISCOVER THE STORY</span></span></span><span class="specialty-face specialty-back"><img src="'+src+'" alt="" loading="lazy"><span class="specialty-back-content"><strong>'+category.title+'</strong><span>TAP TO FLIP BACK</span></span></span></span><button class="card-flip" type="button" aria-label="Flip '+category.title+' card" aria-pressed="false"></button><a class="card-book" href="'+bookingUrl(BOOKING_MESSAGE)+'" target="_blank" rel="noopener noreferrer" aria-label="Book '+category.title+' photography">BOOK THIS STORY</a></article>';
  });
  const clone=html=>html.replace('<article class="specialty-card"','<article class="specialty-card marquee-clone" aria-hidden="true"');
  track.innerHTML=clone(cards[2])+cards.join('')+clone(cards[0]);
  track.querySelectorAll('.marquee-clone button,.marquee-clone a').forEach(control=>control.tabIndex=-1);
  const slides=[...track.querySelectorAll('.specialty-card')];
  let active=2,dragStart=null,dragged=false,scrollTimer=0,ignoreScroll=false;
  function leftFor(index){return slides[index].offsetLeft-(mask.clientWidth-slides[index].offsetWidth)/2}
  function setActive(index){
    active=index;
    slides.forEach((card,i)=>{
      card.classList.toggle('is-active',i===index);
      if(i!==index&&card.classList.contains('flipped')){card.classList.remove('flipped');const button=card.querySelector('.card-flip');button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Flip '+categoryLabels[card.dataset.category]+' card')}
    });
  }
  function nearest(){const centre=mask.scrollLeft+mask.clientWidth/2;return slides.reduce((best,card,i)=>Math.abs(card.offsetLeft+card.offsetWidth/2-centre)<Math.abs(slides[best].offsetLeft+slides[best].offsetWidth/2-centre)?i:best,active)}
  function go(index,behavior='smooth'){if(index<0)index=3;if(index>4)index=1;setActive(index);mask.scrollTo({left:leftFor(index),behavior:reducedMotion.matches?'instant':behavior})}
  function normalize(){if(ignoreScroll)return;const index=nearest();setActive(index);if(index===0||index===4){ignoreScroll=true;mask.style.scrollBehavior='auto';const target=index===0?3:1;mask.scrollLeft=leftFor(target);setActive(target);requestAnimationFrame(()=>{mask.style.scrollBehavior='';ignoreScroll=false})}}
  function onScroll(){if(ignoreScroll)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(normalize,160)}
  mask.addEventListener('scroll',onScroll,{passive:true});
  requestAnimationFrame(()=>{mask.style.scrollBehavior='auto';mask.scrollLeft=leftFor(2);setActive(2);requestAnimationFrame(()=>mask.style.scrollBehavior='')});
  slides.forEach((card,index)=>{
    const button=card.querySelector('.card-flip');
    button.addEventListener('click',()=>{
      if(dragged)return;
      if(index!==active){go(index);return}
      const flip=card.classList.toggle('flipped');button.setAttribute('aria-pressed',String(flip));button.setAttribute('aria-label',(flip?'Flip back ':'Flip ')+categoryLabels[card.dataset.category]+' card');
    });
  });
  document.getElementById('services').querySelectorAll('[data-marquee-step]').forEach(button=>button.addEventListener('click',()=>go(active+(button.dataset.marqueeStep==='next'?1:-1))));
  mask.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('.card-book'))return;dragStart={id:e.pointerId,x:e.clientX,left:mask.scrollLeft};dragged=false});
  mask.addEventListener('pointermove',e=>{if(!dragStart||e.pointerId!==dragStart.id)return;const delta=e.clientX-dragStart.x;if(!dragged&&Math.abs(delta)>8){dragged=true;mask.classList.add('is-dragging');mask.setPointerCapture(e.pointerId)}if(dragged)mask.scrollLeft=dragStart.left-delta});
  function endDrag(e){if(!dragStart||e.pointerId!==dragStart.id)return;dragStart=null;mask.classList.remove('is-dragging');if(mask.hasPointerCapture(e.pointerId))mask.releasePointerCapture(e.pointerId);if(dragged){const index=nearest();go(index);setTimeout(()=>dragged=false,0)}}
  mask.addEventListener('pointerup',endDrag);mask.addEventListener('pointercancel',endDrag);
  mask.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopPropagation()}},true);
}
function initGallery(content){
  const grid=document.getElementById('gallery-grid'),filters=[...document.querySelectorAll('[data-filter]')],dialog=document.getElementById('lightbox');
  const categories=['wedding','prewedding','other'];
  const grouped=categories.map(category=>{
    const items=content.photos[category].map((item,index)=>({...item,category,index}));
    for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
    return items;
  });
  const all=Array.from({length:Math.max(...grouped.map(items=>items.length))},(_,i)=>grouped.map(items=>items[i]).filter(Boolean)).flat();
  let visible=all,current=0,touchX=0,lastWidth=0;
  function rowPlan(width){
    const gap=width<600?5:8,target=width<600?230:width<920?270:325,max=width<600?2:width<920?3:4;
    const dp=Array(visible.length+1).fill(null);dp[visible.length]={cost:0,rows:[]};
    for(let i=visible.length-1;i>=0;i--){
      for(let count=1;count<=max&&i+count<=visible.length;count++){
        const items=visible.slice(i,i+count),sum=items.reduce((total,item)=>total+item.width/item.height,0);
        const height=(width-gap*(count-1))/sum;
        const penalty=Math.pow(Math.log(height/target),2)*100+(height>560?80:0)+(height<150?60:0);
        const cost=penalty+dp[i+count].cost;
        if(!dp[i]||cost<dp[i].cost)dp[i]={cost,rows:[{items,start:i,height},...dp[i+count].rows]};
      }
    }
    return dp[0].rows;
  }
  function layout(){
    if(!visible.length)return;
    const width=grid.clientWidth;
    lastWidth=Math.round(width);
    grid.innerHTML=rowPlan(width).map(row=>'<div class="gallery-row" style="--row-height:'+Math.round(row.height)+'px">'+row.items.map((item,j)=>'<button class="gallery-frame" style="--ratio:'+(item.width/item.height).toFixed(5)+'" type="button" data-index="'+(row.start+j)+'" aria-label="View '+categoryLabels[item.category]+' photograph '+(item.index+1)+'"><span class="gallery-mount"><span class="gallery-photo"><img src="'+item.src+'" alt="'+categoryLabels[item.category]+' photography by Memories in Pixels" loading="lazy" decoding="async" width="'+item.width+'" height="'+item.height+'"><span class="gallery-caption">'+categoryLabels[item.category]+' · VIEW</span></span></span></button>').join('')+'</div>').join('');
  }
  function render(filter){
    visible=filter==='all'?all:all.filter(item=>item.category===filter);
    layout();
    filters.forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  }
  filters.forEach(button=>button.addEventListener('click',()=>render(button.dataset.filter)));
  let resizeTimer=0;new ResizeObserver(()=>{if(Math.round(grid.clientWidth)===lastWidth)return;clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,120)}).observe(grid);
  grid.addEventListener('click',e=>{const frame=e.target.closest('.gallery-frame');if(frame)open(Number(frame.dataset.index))});
  const image=dialog.querySelector('img'),category=dialog.querySelector('.lightbox-category'),counter=dialog.querySelector('.lightbox-counter');
  function show(){const item=visible[current];image.src=item.full;image.alt=categoryLabels[item.category]+' photograph by Memories in Pixels';category.textContent=categoryLabels[item.category];counter.textContent=(current+1)+' / '+visible.length}
  function open(i){current=i;show();dialog.showModal();document.body.style.overflow='hidden'}
  function close(){dialog.close();document.body.style.overflow='';image.removeAttribute('src')}
  function step(amount){current=(current+amount+visible.length)%visible.length;show()}
  dialog.querySelector('.lightbox-close').addEventListener('click',close);
  dialog.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));
  dialog.querySelector('.lightbox-next').addEventListener('click',()=>step(1));
  dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';image.removeAttribute('src')});
  document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
  dialog.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});
  dialog.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touchX;if(Math.abs(d)>50)step(d<0?1:-1)},{passive:true});
  render('all');
}
