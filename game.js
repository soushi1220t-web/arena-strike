<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Arena Strike Lite</title>
<style>
body{margin:0;background:#0f172a;color:white;font-family:sans-serif;overflow:hidden}
#ui{position:fixed;top:10px;left:10px}
#ranking{position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.5);padding:10px;border-radius:8px}
canvas{display:block}
button{padding:6px 10px;margin:2px}
</style>
</head>
<body>

<canvas id="game"></canvas>

<div id="ui">
<button onclick="setWeapon('normal')">Shooter</button>
<button onclick="setWeapon('pickaxe')">Miner (Carl)</button>
<div>HP: <span id="hp">100</span></div>
<div>Kills: <span id="kills">0</span></div>
</div>

<div id="ranking">
<b>Ranking</b>
<div id="rankList"></div>
</div>

<script>

const canvas=document.getElementById('game')
const ctx=canvas.getContext('2d')

function resize(){
canvas.width=window.innerWidth
canvas.height=window.innerHeight
}
window.onresize=resize
resize()

let player={x:400,y:300,hp:100,kills:0,weapon:'normal'}

let enemies=[]
let bullets=[]

function spawnEnemy(){

let e={
 x:Math.random()*canvas.width,
 y:Math.random()*canvas.height,
 hp:60,
 id:Date.now()+Math.random()
}

enemies.push(e)

}

setInterval(spawnEnemy,2000)

function setWeapon(w){
player.weapon=w
}

window.onclick=e=>{
shoot(e.clientX,e.clientY)
}

function shoot(tx,ty){

let angle=Math.atan2(ty-player.y,tx-player.x)

if(player.weapon==='normal'){

bullets.push({
 x:player.x,
 y:player.y,
 dx:Math.cos(angle)*8,
 dy:Math.sin(angle)*8,
 damage:20,
 type:'normal'
})

}

if(player.weapon==='pickaxe'){

bullets.push({
 x:player.x,
 y:player.y,
 angle:angle,
 dist:0,
 range:250,
 speed:10,
 damage:28,
 type:'pickaxe'
})

}

}

function update(){

bullets=bullets.filter(b=>{

if(b.type==='normal'){

b.x+=b.dx
b.y+=b.dy

}

if(b.type==='pickaxe'){

b.dist+=b.speed

if(b.dist<b.range){

b.x+=Math.cos(b.angle)*b.speed
b.y+=Math.sin(b.angle)*b.speed

}else{

let dx=player.x-b.x
let dy=player.y-b.y
let d=Math.hypot(dx,dy)

b.x+=dx/d*b.speed
b.y+=dy/d*b.speed

}

}

for(let e of enemies){

if(Math.hypot(e.x-b.x,e.y-b.y)<20){

 e.hp-=b.damage

 if(e.hp<=0){

 player.kills++
 document.getElementById('kills').textContent=player.kills

 enemies=enemies.filter(x=>x.id!==e.id)
 updateRanking()

 }

 return false

}

}

return true

})

}

function updateRanking(){

let list=document.getElementById('rankList')

let data=[
 {name:'YOU',kills:player.kills}
]

for(let i=0;i<4;i++){

 data.push({name:'BOT'+(i+1),kills:Math.floor(Math.random()*player.kills+1)})

}

data.sort((a,b)=>b.kills-a.kills)

list.innerHTML=''

for(let i=0;i<data.length;i++){

let d=document.createElement('div')

d.textContent=(i+1)+'. '+data[i].name+' - '+data[i].kills

list.appendChild(d)

}

}

updateRanking()

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.fillStyle='#22c55e'
ctx.beginPath()
ctx.arc(player.x,player.y,20,0,Math.PI*2)
ctx.fill()

ctx.fillStyle='#ef4444'

for(let e of enemies){

ctx.beginPath()
ctx.arc(e.x,e.y,18,0,Math.PI*2)
ctx.fill()

}

ctx.fillStyle='#fbbf24'

for(let b of bullets){

ctx.beginPath()
ctx.arc(b.x,b.y,8,0,Math.PI*2)
ctx.fill()

}

}

function loop(){
update()
draw()
requestAnimationFrame(loop)
}

loop()

</script>

</body>
</html>
