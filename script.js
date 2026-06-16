// =====================================
// EEK ANI DEFTERİM V11
// PARÇA 1 / 6
// =====================================

const LOGIN_USER = "Emine";
const LOGIN_PASS = "Emine123";

let db = null;

// =====================================
// GÜNÜN SÖZLERİ
// =====================================

const quotes = [

"Seninle geçen her gün yeni bir anı ❤️",

"Gülüşün en sevdiğim manzara ❤️",

"Hayat seninle daha güzel ❤️",

"Birlikte yaşlanan iki kalp ❤️",

"Sen benim en güzel tesadüfümsün ❤️",

"Her anımda sen varsın ❤️",

"İyi ki yollarımız kesişmiş ❤️",

"En güzel hikayemiz biziz ❤️",

"Kalbimin en güzel köşesi sana ait ❤️",

"Seninle her gün yeniden aşık oluyorum ❤️"

];

// =====================================
// INDEXEDDB
// =====================================

function initDB(){

return new Promise(
(resolve,reject)=>{

const request =
indexedDB.open(
"EEK_V11_DB",
1
);

request.onerror =
()=>reject(
request.error
);

request.onsuccess =
()=>{

db =
request.result;

resolve();

};

request.onupgradeneeded =
(event)=>{

const database =
event.target.result;

if(
!database.objectStoreNames.contains(
"memories"
)
){

database.createObjectStore(
"memories",
{
keyPath:"id"
}
);

}

};

}
);

}

// =====================================
// DB FONKSİYONLARI
// =====================================

function addMemory(memory){

return new Promise(
(resolve,reject)=>{

const tx =
db.transaction(
"memories",
"readwrite"
);

const store =
tx.objectStore(
"memories"
);

const request =
store.add(memory);

request.onsuccess =
()=>resolve();

request.onerror =
()=>reject();

}
);

}

function getAllMemories(){

return new Promise(
(resolve,reject)=>{

const tx =
db.transaction(
"memories",
"readonly"
);

const store =
tx.objectStore(
"memories"
);

const request =
store.getAll();

request.onsuccess =
()=>{

const result =
request.result || [];

result.sort(
(a,b)=>
b.id-a.id
);

resolve(result);

};

request.onerror =
()=>reject();

}
);

}// =====================================
// PARÇA 2 / 6
// CANLI SAYAÇ
// GÜNÜN SÖZÜ
// İSTATİSTİKLER
// =====================================

const dailyQuote =
document.getElementById(
"dailyQuote"
);

const liveCounter =
document.getElementById(
"liveCounter"
);

const totalMemories =
document.getElementById(
"totalMemories"
);

const totalPhotos =
document.getElementById(
"totalPhotos"
);

const totalDays =
document.getElementById(
"totalDays"
);

// =====================================
// GÜNÜN SÖZÜ
// =====================================

function loadDailyQuote(){

const randomIndex =
Math.floor(
Math.random() *
quotes.length
);

dailyQuote.innerText =
quotes[randomIndex];

}

// =====================================
// CANLI SAYAÇ
// =====================================

function startLiveCounter(){

const startDate =
new Date(
"2026-05-04T00:00:00"
);

setInterval(()=>{

const now =
new Date();

const diff =
now - startDate;

const days =
Math.floor(
diff /
(1000*60*60*24)
);

const hours =
Math.floor(
(diff %
(1000*60*60*24))
/
(1000*60*60)
);

const minutes =
Math.floor(
(diff %
(1000*60*60))
/
(1000*60)
);

const seconds =
Math.floor(
(diff %
(1000*60))
/
1000
);

liveCounter.innerHTML =

`
${days} Gün
${hours} Saat
${minutes} Dakika
${seconds} Saniye
`;

},1000);

}

// =====================================
// İSTATİSTİKLER
// =====================================

async function updateStats(){

const memories =
await getAllMemories();

let photoCount = 0;

memories.forEach(memory=>{

photoCount +=
memory.images.length;

});

totalMemories.innerText =
memories.length;

totalPhotos.innerText =
photoCount;

const startDate =
new Date(
"2026-05-04"
);

const today =
new Date();

const diff =
today - startDate;

const days =
Math.floor(
diff /
(
1000*
60*
60*
24
)
);

totalDays.innerText =
days;

}

// =====================================
// SON EKLENEN ANI
// =====================================

async function updateLastMemory(){

const box =
document.getElementById(
"lastMemory"
);

const memories =
await getAllMemories();

if(
memories.length === 0
){

box.innerHTML =
"Henüz anı eklenmedi ❤️";

return;

}

const latest =
memories[0];

box.innerHTML =

`
<h4>
${latest.title}
</h4>

<p>
${latest.text}
</p>

<small>
${latest.date}
</small>
`;

}// =====================================
// PARÇA 3 / 6
// GİRİŞ
// SLIDER
// MENÜLER
// ÇIKIŞ
// =====================================

const loginScreen =
document.getElementById(
"loginScreen"
);

const appScreen =
document.getElementById(
"appScreen"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

const loginError =
document.getElementById(
"loginError"
);

const username =
document.getElementById(
"username"
);

const password =
document.getElementById(
"password"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const slides =
document.querySelectorAll(
".slide"
);

let currentSlide = 0;

// =====================================
// SLIDER
// =====================================

function startSlider(){

if(
slides.length === 0
){
return;
}

setInterval(()=>{

slides[currentSlide]
.classList.remove(
"active"
);

currentSlide++;

if(
currentSlide >=
slides.length
){
currentSlide = 0;
}

slides[currentSlide]
.classList.add(
"active"
);

},4000);

}

startSlider();

// =====================================
// GİRİŞ
// =====================================

loginBtn.addEventListener(
"click",
loginUser
);

function loginUser(){

const user =
username.value.trim();

const pass =
password.value.trim();

if(
user === LOGIN_USER &&
pass === LOGIN_PASS
){

localStorage.setItem(
"eekLogged",
"true"
);

showApplication();

}
else{

loginError.innerText =
"Kullanıcı adı veya şifre hatalı";

}

}

// =====================================
// UYGULAMA
// =====================================

async function showApplication(){

loginScreen.classList.add(
"hidden"
);

appScreen.classList.remove(
"hidden"
);

loadDailyQuote();

startLiveCounter();

await loadMemories();

await updateStats();

await updateLastMemory();

await buildGallery();

await buildTimeline();

await loadFavorites();

}

// =====================================
// OTOMATİK GİRİŞ
// =====================================

if(
localStorage.getItem(
"eekLogged"
) === "true"
){

window.addEventListener(
"load",
async ()=>{

await initDB();

showApplication();

}
);

}

// =====================================
// ÇIKIŞ
// =====================================

logoutBtn.addEventListener(
"click",
()=>{

localStorage.removeItem(
"eekLogged"
);

location.reload();

}
);

// =====================================
// MENÜLER
// =====================================

const pageButtons =
document.querySelectorAll(
".menu button[data-page]"
);

const pages =
document.querySelectorAll(
".page"
);

pageButtons.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const target =
btn.dataset.page;

pages.forEach(page=>{

page.classList.remove(
"active-page"
);

});

document
.getElementById(
target
)
.classList.add(
"active-page"
);

});

});// =====================================
// PARÇA 4 / 6
// GELİŞMİŞ MÜZİK SİSTEMİ
// =====================================

const musicBtn =
document.getElementById(
"musicBtn"
);

const nextMusicBtn =
document.getElementById(
"nextMusicBtn"
);

const prevMusicBtn =
document.getElementById(
"prevMusicBtn"
);

const shuffleBtn =
document.getElementById(
"shuffleBtn"
);

const volumeSlider =
document.getElementById(
"volumeSlider"
);

const musicName =
document.getElementById(
"musicName"
);

const bgMusic =
document.getElementById(
"bgMusic"
);

// =====================================
// PLAYLIST
// =====================================

const playlist = [

{
name:"Romantik 1",
file:"romantik1.mp3"
},

{
name:"Romantik 2",
file:"romantik2.mp3"
},

{
name:"Romantik 3",
file:"romantik3.mp3"
},

{
name:"Romantik 4",
file:"romantik4.mp3"
},

{
name:"Romantik 5",
file:"romantik5.mp3"
},

{
name:"Romantik 6",
file:"romantik6.mp3"
},

{
name:"Romantik 7",
file:"romantik7.mp3"
},

{
name:"Romantik 8",
file:"romantik8.mp3"
},

{
name:"Romantik 9",
file:"romantik9.mp3"
},

{
name:"Romantik 10",
file:"romantik10.mp3"
}

];

let currentTrack =
parseInt(
localStorage.getItem(
"currentTrack"
) || "0"
);

let musicPlaying =
false;

// =====================================
// ŞARKI YÜKLE
// =====================================

function loadTrack(){

bgMusic.src =
playlist[currentTrack].file;

musicName.innerText =
playlist[currentTrack].name;

localStorage.setItem(
"currentTrack",
currentTrack
);

}

// =====================================
// KALDIĞI YERDEN DEVAM
// =====================================

function restoreMusicState(){

const savedTime =
parseFloat(
localStorage.getItem(
"musicTime"
) || "0"
);

const savedVolume =
parseFloat(
localStorage.getItem(
"musicVolume"
) || "0.7"
);

bgMusic.volume =
savedVolume;

volumeSlider.value =
savedVolume * 100;

bgMusic.addEventListener(
"loadedmetadata",
()=>{

bgMusic.currentTime =
savedTime;

},
{
once:true
}
);

}

// =====================================
// SES AYARI
// =====================================

volumeSlider.addEventListener(
"input",
()=>{

const volume =
volumeSlider.value / 100;

bgMusic.volume =
volume;

localStorage.setItem(
"musicVolume",
volume
);

}
);

// =====================================
// MÜZİK KONUMU KAYDET
// =====================================

setInterval(()=>{

localStorage.setItem(
"musicTime",
bgMusic.currentTime
);

},2000);

// =====================================
// OYNAT / DURDUR
// =====================================

musicBtn.addEventListener(
"click",
()=>{

if(!musicPlaying){

bgMusic.play();

musicBtn.innerText =
"⏸";

musicPlaying = true;

}else{

bgMusic.pause();

musicBtn.innerText =
"▶";

musicPlaying = false;

}

});

// =====================================
// SONRAKİ
// =====================================

nextMusicBtn.addEventListener(
"click",
()=>{

currentTrack++;

if(
currentTrack >=
playlist.length
){
currentTrack = 0;
}

loadTrack();

if(musicPlaying){
bgMusic.play();
}

});

// =====================================
// ÖNCEKİ
// =====================================

prevMusicBtn.addEventListener(
"click",
()=>{

currentTrack--;

if(
currentTrack < 0
){
currentTrack =
playlist.length - 1;
}

loadTrack();

if(musicPlaying){
bgMusic.play();
}

});

// =====================================
// RASTGELE ÇAL
// =====================================

shuffleBtn.addEventListener(
"click",
()=>{

let randomTrack;

do{

randomTrack =
Math.floor(
Math.random() *
playlist.length
);

}
while(
randomTrack ===
currentTrack
);

currentTrack =
randomTrack;

loadTrack();

if(musicPlaying){
bgMusic.play();
}

});

// =====================================
// ŞARKI BİTİNCE
// =====================================

bgMusic.addEventListener(
"ended",
()=>{

currentTrack++;

if(
currentTrack >=
playlist.length
){
currentTrack = 0;
}

loadTrack();

bgMusic.play();

});

// =====================================
// İLK BAŞLAT
// =====================================

loadTrack();
restoreMusicState();// =====================================
// PARÇA 5 / 6
// ANI EKLEME
// FAVORİLER
// ARAMA
// =====================================

const saveMemoryBtn =
document.getElementById(
"saveMemoryBtn"
);

const memoryTitle =
document.getElementById(
"memoryTitle"
);

const memoryText =
document.getElementById(
"memoryText"
);

const memoryPhotos =
document.getElementById(
"memoryPhotos"
);

const memoryList =
document.getElementById(
"memoryList"
);

const searchInput =
document.getElementById(
"searchInput"
);

const favoritesList =
document.getElementById(
"favoritesList"
);

// =====================================
// BASE64
// =====================================

function fileToBase64(file){

return new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
e=>resolve(
e.target.result
);

reader.onerror =
()=>reject();

reader.readAsDataURL(
file
);

});

}

// =====================================
// ANI EKLE
// =====================================

saveMemoryBtn.addEventListener(
"click",
saveMemory
);

async function saveMemory(){

const title =
memoryTitle.value.trim();

const text =
memoryText.value.trim();

if(
title === "" ||
text === ""
){

alert(
"Başlık ve anı alanı boş bırakılamaz."
);

return;

}

const images = [];

const files =
Array.from(
memoryPhotos.files
);

for(
const file of files
){

const base64 =
await fileToBase64(
file
);

images.push(
base64
);

}

const memory = {

id:Date.now(),

title:title,

text:text,

date:new Date()
.toLocaleString(
"tr-TR"
),

images:images,

favorite:false

};

await addMemory(
memory
);

memoryTitle.value = "";
memoryText.value = "";
memoryPhotos.value = "";

await loadMemories();

await updateStats();

await updateLastMemory();

await buildGallery();

await buildTimeline();

await loadFavorites();

alert(
"Anı başarıyla kaydedildi ❤️"
);

}

// =====================================
// ANILARI YÜKLE
// =====================================

async function loadMemories(){

const memories =
await getAllMemories();

memoryList.innerHTML = "";

memories.forEach(memory=>{

let imagesHtml = "";

memory.images.forEach(img=>{

imagesHtml += `
<img
src="${img}"
class="memory-photo"
onclick="openImage('${img}')">
`;

});

const card =
document.createElement(
"div"
);

card.className =
"glass memory-card";

card.innerHTML =

`
<div class="memory-date">
${memory.date}
</div>

<h3>
${memory.title}
</h3>

<p>
${memory.text}
</p>

<div class="memory-images">
${imagesHtml}
</div>

<div class="card-buttons">

<button
class="favorite-btn"
onclick="toggleFavorite(${memory.id})">

⭐

</button>

<button
class="edit-btn"
onclick="editMemory(${memory.id})">

✏

</button>

<button
class="delete-btn"
onclick="deleteMemory(${memory.id})">

🗑

</button>

</div>
`;

memoryList.appendChild(
card
);

});

}

// =====================================
// ARAMA
// =====================================

searchInput.addEventListener(
"input",
searchMemories
);

async function searchMemories(){

const text =
searchInput.value
.toLowerCase();

const memories =
await getAllMemories();

memoryList.innerHTML = "";

const filtered =
memories.filter(memory=>{

return (

memory.title
.toLowerCase()
.includes(text)

||

memory.text
.toLowerCase()
.includes(text)

);

});

filtered.forEach(memory=>{

let imagesHtml = "";

memory.images.forEach(img=>{

imagesHtml += `
<img
src="${img}"
onclick="openImage('${img}')">
`;

});

const card =
document.createElement(
"div"
);

card.className =
"glass memory-card";

card.innerHTML =

`
<div class="memory-date">
${memory.date}
</div>

<h3>
${memory.title}
</h3>

<p>
${memory.text}
</p>

<div class="memory-images">
${imagesHtml}
</div>
`;

memoryList.appendChild(
card
);

});

}// =====================================
// PARÇA 6 / 6
// FAVORİLER
// SİL
// DÜZENLE
// GALERİ
// ZAMAN TÜNELİ
// YEDEKLEME
// MODAL
// KALPLER
// =====================================

// =====================================
// FAVORİLER
// =====================================

async function toggleFavorite(id){

const memories =
await getAllMemories();

const memory =
memories.find(
x => x.id === id
);

if(!memory){
return;
}

memory.favorite =
!memory.favorite;

const tx =
db.transaction(
"memories",
"readwrite"
);

const store =
tx.objectStore(
"memories"
);

store.put(memory);

tx.oncomplete =
async ()=>{

await loadFavorites();
await loadMemories();

};

}

async function loadFavorites(){

const memories =
await getAllMemories();

favoritesList.innerHTML = "";

const favorites =
memories.filter(
x => x.favorite
);

favorites.forEach(memory=>{

const card =
document.createElement(
"div"
);

card.className =
"glass memory-card";

card.innerHTML = `
<div class="memory-date">
${memory.date}
</div>

<h3>
⭐ ${memory.title}
</h3>

<p>
${memory.text}
</p>
`;

favoritesList.appendChild(
card
);

});

}

// =====================================
// SİL
// =====================================

async function deleteMemory(id){

if(
!confirm(
"Bu anıyı silmek istediğine emin misin?"
)
){
return;
}

const tx =
db.transaction(
"memories",
"readwrite"
);

const store =
tx.objectStore(
"memories"
);

store.delete(id);

tx.oncomplete =
async ()=>{

await loadMemories();
await loadFavorites();
await updateStats();
await updateLastMemory();
await buildGallery();
await buildTimeline();

};

}

// =====================================
// DÜZENLE
// =====================================

async function editMemory(id){

const memories =
await getAllMemories();

const memory =
memories.find(
x => x.id === id
);

if(!memory){
return;
}

const title =
prompt(
"Başlık",
memory.title
);

if(title === null){
return;
}

const text =
prompt(
"Anı",
memory.text
);

if(text === null){
return;
}

memory.title = title;
memory.text = text;

const tx =
db.transaction(
"memories",
"readwrite"
);

const store =
tx.objectStore(
"memories"
);

store.put(memory);

tx.oncomplete =
async ()=>{

await loadMemories();
await loadFavorites();
await updateLastMemory();
await buildTimeline();

};

}

// =====================================
// GALERİ
// =====================================

async function buildGallery(){

const gallery =
document.getElementById(
"galleryContainer"
);

gallery.innerHTML = "";

const memories =
await getAllMemories();

memories.forEach(memory=>{

memory.images.forEach(img=>{

const image =
document.createElement(
"img"
);

image.src = img;

image.onclick =
()=>openImage(img);

gallery.appendChild(
image
);

});

});

}

// =====================================
// ZAMAN TÜNELİ
// =====================================

async function buildTimeline(){

const timeline =
document.getElementById(
"timelineContainer"
);

timeline.innerHTML = "";

const memories =
await getAllMemories();

memories.forEach(memory=>{

const item =
document.createElement(
"div"
);

item.className =
"glass timeline-item";

item.innerHTML = `
<div class="timeline-title">
${memory.title}
</div>

<div class="timeline-date">
${memory.date}
</div>

<p>
${memory.text}
</p>
`;

timeline.appendChild(
item
);

});

}

// =====================================
// MODAL
// =====================================

const modal =
document.getElementById(
"imageModal"
);

const modalImage =
document.getElementById(
"modalImage"
);

const closeModal =
document.getElementById(
"closeModal"
);

function openImage(src){

modal.style.display =
"flex";

modalImage.src = src;

}

closeModal.addEventListener(
"click",
()=>{

modal.style.display =
"none";

}
);

window.addEventListener(
"click",
e=>{

if(
e.target === modal
){
modal.style.display =
"none";
}

}
);

// =====================================
// KALP EFEKTİ
// =====================================

memoryText.addEventListener(
"input",
()=>{

const heart =
document.createElement(
"div"
);

heart.className =
"heart";

heart.innerHTML =
"❤️";

heart.style.left =
Math.random() *
window.innerWidth +
"px";

heart.style.top =
(window.innerHeight-120)
+"px";

document.body.appendChild(
heart
);

setTimeout(
()=>heart.remove(),
2000
);

}
);

// =====================================
// ARKA PLAN KALPLERİ
// =====================================

setInterval(()=>{

const heart =
document.createElement(
"div"
);

heart.className =
"bg-heart";

heart.innerHTML =
"❤️";

heart.style.left =
Math.random() *
100 + "%";

document.body.appendChild(
heart
);

setTimeout(
()=>heart.remove(),
15000
);

},3000);

// =====================================
// YEDEKLEME
// =====================================

const exportBtn =
document.getElementById(
"exportBtn"
);

const importFile =
document.getElementById(
"importFile"
);

exportBtn.addEventListener(
"click",
async ()=>{

const memories =
await getAllMemories();

const blob =
new Blob(
[
JSON.stringify(
memories,
null,
2
)
],
{
type:
"application/json"
}
);

const link =
document.createElement(
"a"
);

link.href =
URL.createObjectURL(
blob
);

link.download =
"EEK_YEDEK.json";

link.click();

}
);

importFile.addEventListener(
"change",
event=>{

const file =
event.target.files[0];

if(!file){
return;
}

const reader =
new FileReader();

reader.onload =
async e=>{

const data =
JSON.parse(
e.target.result
);

const tx =
db.transaction(
"memories",
"readwrite"
);

const store =
tx.objectStore(
"memories"
);

data.forEach(item=>{

store.put(item);

});

tx.oncomplete =
async ()=>{

await loadMemories();
await loadFavorites();
await updateStats();
await updateLastMemory();
await buildGallery();
await buildTimeline();

alert(
"Yedek başarıyla yüklendi ❤️"
);

};

};

reader.readAsText(
file
);

}
);

// =====================================
// BAŞLAT
// =====================================

window.addEventListener(
"load",
async ()=>{

await initDB();

loadDailyQuote();

loadTrack();

restoreMusicState();

}
);
// =====================================
// PWA
// =====================================

if(
"serviceWorker"
in navigator
){

window.addEventListener(
"load",
()=>{

navigator
.serviceWorker
.register(
"./service-worker.js"
)
.then(()=>{

console.log(
"PWA hazır ❤️"
);

})
.catch(err=>{

console.log(
"SW Hatası:",
err
);

});

});

}
// =====================================
// PWA INSTALL
// =====================================

let deferredPrompt;

window.addEventListener(
"beforeinstallprompt",
(event)=>{

event.preventDefault();

deferredPrompt = event;

const installBtn =
document.getElementById(
"installAppBtn"
);

if(installBtn){

installBtn.style.display =
"block";

}

}
);

document.addEventListener(
"click",
async (e)=>{

if(
e.target &&
e.target.id ===
"installAppBtn"
){

if(!deferredPrompt){
return;
}

deferredPrompt.prompt();

await deferredPrompt.userChoice;

deferredPrompt = null;

e.target.style.display =
"none";

}

}
);