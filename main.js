const BOOKING_MESSAGE='I would like to book your services for my event';
const WHATSAPP='919836439088';
const bookingUrl=message=>'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);
document.querySelectorAll('[data-book]').forEach(link=>{link.href=bookingUrl(BOOKING_MESSAGE);link.target='_blank';link.rel='noopener noreferrer'});
document.getElementById('year').textContent=new Date().getFullYear();

const header=document.getElementById('site-header');
const setHeader=()=>header.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',setHeader,{passive:true});setHeader();
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

const comparison=document.querySelector('[data-comparison]');let comparing=false;
function setCompare(p){p=Math.max(0,Math.min(100,p));comparison.style.setProperty('--position',p+'%');comparison.setAttribute('aria-valuenow',Math.round(p));comparison.setAttribute('aria-valuetext',Math.round(p)+' percent unedited image revealed')}
function comparePointer(e){const r=comparison.getBoundingClientRect();setCompare((e.clientX-r.left)/r.width*100)}
comparison.addEventListener('pointerdown',e=>{comparing=true;comparison.setPointerCapture(e.pointerId);comparePointer(e)});
comparison.addEventListener('pointermove',e=>{if(comparing)comparePointer(e)});
comparison.addEventListener('pointerup',()=>comparing=false);comparison.addEventListener('pointercancel',()=>comparing=false);
comparison.addEventListener('keydown',e=>{let n=Number(comparison.getAttribute('aria-valuenow'));if(e.key==='ArrowLeft')n-=5;else if(e.key==='ArrowRight')n+=5;else if(e.key==='Home')n=0;else if(e.key==='End')n=100;else return;e.preventDefault();setCompare(n)});
function sizeCompare(){comparison.style.setProperty('--comparison-width',comparison.clientWidth+'px')}new ResizeObserver(sizeCompare).observe(comparison);sizeCompare();

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
try{
  const seen=sessionStorage.getItem('mip-visitor-display-seen');
  visitorDisplay.textContent=seen?String(53+Math.floor(Math.random()*68)):'52';
  sessionStorage.setItem('mip-visitor-display-seen','1');
}catch{visitorDisplay.textContent='52'}

const music=document.getElementById('site-music'),musicToggle=document.getElementById('music-toggle'),musicState=document.getElementById('music-state');
music.volume=.38;
musicToggle.addEventListener('click',async()=>{
  if(music.paused){
    try{await music.play();musicToggle.setAttribute('aria-pressed','true');musicToggle.setAttribute('aria-label','Pause original wedding instrumental music');musicState.textContent='PAUSE MUSIC'}
    catch{musicState.textContent='UNAVAILABLE';musicToggle.setAttribute('aria-label','Music unavailable; try again')}
  }else{music.pause();musicToggle.setAttribute('aria-pressed','false');musicToggle.setAttribute('aria-label','Play original wedding instrumental music');musicState.textContent='PLAY MUSIC'}
});

document.getElementById('enquiry-form').addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(e.currentTarget);
  const fields=[['Name','name'],['Phone','phone'],['Email','email'],['Event','event'],['Date','date'],['City','city'],['Venue','venue'],['Message','message']];
  const lines=[BOOKING_MESSAGE,'',...fields.map(([label,key])=>d.get(key)?label+': '+String(d.get(key)).trim():'').filter(Boolean)];
  window.open(bookingUrl(lines.join('\n')),'_blank','noopener,noreferrer');
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
    return '<article class="specialty-card" data-category="'+category.key+'"><span class="specialty-inner"><span class="specialty-face specialty-front"><span class="specialty-top">MEMORIES IN PIXELS <span aria-hidden="true">✦</span> 0'+(i+1)+'</span><span><h3>'+category.title+'<span>'+category.subtitle+'</span></h3></span><ul>'+services+'</ul><span class="specialty-bottom"><span>DISCOVER THE STORY</span><span>↗</span></span></span><span class="specialty-face specialty-back"><img src="'+src+'" alt="" loading="lazy"><span class="specialty-back-content"><strong>'+category.title+'</strong><span>TAP TO FLIP BACK ↶</span></span></span></span><button class="card-flip" type="button" aria-label="Flip '+category.title+' card" aria-pressed="false"></button><a class="card-book" href="'+bookingUrl(BOOKING_MESSAGE)+'" target="_blank" rel="noopener noreferrer" aria-label="Book '+category.title+' photography">BOOK THIS STORY ↗</a></article>';
  }).join('');
  track.innerHTML='<div class="marquee-group">'+cards+'</div><div class="marquee-group" aria-hidden="true" inert>'+cards+'</div>';
  let x=0,last=0,hoverPause=false,touchPause=false,drag=false,dragged=false,startX=0,startOffset=0;
  function segment(){return track.querySelector('.marquee-group').getBoundingClientRect().width+25}
  function wrap(){const w=segment();if(!w)return;while(x<=-w)x+=w;while(x>0)x-=w}
  function frame(t){if(last&&!hoverPause&&!touchPause&&!drag&&!reducedMotion.matches){x-=(t-last)*(innerWidth<600?.023:.036);wrap();track.style.transform='translate3d('+x+'px,0,0)'}last=t;requestAnimationFrame(frame)}requestAnimationFrame(frame);
  track.querySelectorAll('.specialty-card').forEach(card=>{
    card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hoverPause=true});
    card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hoverPause=false});
    const button=card.querySelector('.card-flip');
    button.addEventListener('click',()=>{if(dragged){dragged=false;return}const flip=card.classList.toggle('flipped');button.setAttribute('aria-pressed',String(flip));button.setAttribute('aria-label',(flip?'Flip back ':'Flip ')+categoryLabels[card.dataset.category]+' card');if(matchMedia('(pointer:coarse)').matches)touchPause=true});
    button.addEventListener('focus',()=>hoverPause=true);
    button.addEventListener('blur',()=>hoverPause=false);
  });
  mask.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;drag=true;dragged=false;touchPause=true;startX=e.clientX;startOffset=x;mask.setPointerCapture(e.pointerId)});
  mask.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-startX;if(Math.abs(delta)>9)dragged=true;if(dragged){x=startOffset+delta;wrap();track.style.transform='translate3d('+x+'px,0,0)'}});
  mask.addEventListener('pointerup',()=>{drag=false;if(dragged)setTimeout(()=>dragged=false,50)});
  mask.addEventListener('pointercancel',()=>drag=false);
  document.addEventListener('pointerdown',e=>{if(!mask.contains(e.target))touchPause=false});
}
function initGallery(content){
  const grid=document.getElementById('gallery-grid'),filters=[...document.querySelectorAll('[data-filter]')],dialog=document.getElementById('lightbox');
  const all=Object.entries(content.photos).flatMap(([category,items])=>items.map((item,i)=>({...item,category,index:i})));
  let visible=all,current=0,touchX=0;
  function render(filter){
    visible=filter==='all'?all:all.filter(item=>item.category===filter);
    grid.innerHTML=visible.map((item,i)=>'<button class="gallery-frame" type="button" data-index="'+i+'" aria-label="View '+categoryLabels[item.category]+' photograph '+(item.index+1)+'"><span class="gallery-mount"><span class="gallery-photo"><img src="'+item.src+'" alt="'+categoryLabels[item.category]+' photography by Memories in Pixels" loading="lazy" width="720" height="900"><span class="gallery-caption">'+categoryLabels[item.category]+' · VIEW</span></span></span></button>').join('');
    grid.querySelectorAll('img').forEach(img=>{img.srcset=img.src.replace('-thumb.webp','-small.webp')+' 360w, '+img.src+' 720w';img.sizes='(max-width:600px) 45vw, (max-width:850px) 48vw, 30vw'});
    filters.forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  }
  filters.forEach(button=>button.addEventListener('click',()=>render(button.dataset.filter)));
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
