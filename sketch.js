//Create variables here
var dog, happydog;
var foods,foodStock;
var database;
var Dog;
var feedFood,addFood, fedTime, lastFed;
var FOOD;
var bedroom, garden, washroom;
function preload()
{
  dog = loadImage("images/Dog.png");
  happydog = loadImage("images/happydog.png");
  bedroom = loadImage("images/virtual pet images/Bed Room.png");
  garden = loadImage("images/virtual pet images/Garden.png");
  washroom = loadImage("images/virtual pet images/Wash Room.png")
}


function setup() {
  database = firebase.database();
	createCanvas(500,500);

readState = database.ref("gameState");
readState.on("value",function(data){
  gameState = data.val();
});

  FOOD = new Food();

  foodStock = database.ref("food");
  foodStock.on("value",readStock);

  Dog = createSprite(250,380,0,0);
  Dog.addImage(dog)
  Dog.scale=0.3;

  feedFood=createButton("Feed the dog");
  feedFood.position(750,200);
  feedFood.mousePressed(feedDog);
  addFood=createButton("Add Food");
  addFood.position(750,220);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
background(46,139,87)
FOOD.display();

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();

  if(gameState!="Hungry"){
feedFood.hide();
addFood.hide();
Dog.remove();
  }else{
    feedFood.show();
    addFood.show();
Dog.addImage(dog);
  }




});
fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM", 350,30);
 }else if(lastFed==0){
   text("Last Feed : 12 AM",350,30);
 }else{
   text("Last Feed : "+ lastFed + " AM", 350,30);
 }

  drawSprites();
  textSize(20)
fill("white");
stroke("black");
text("Food:"+foods,230,100);
text("Note: Press up arrow to feed the dog milk!",75,50)


currentTime = hour();
if(currentTime==(lastFed+1)){
update("playing")
Dog.garden()
}
else if(currentTime==(lastFed+2)){
  update("sleeping")
  Dog.bedroom()
}else if(currentTime==(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing")
  Dog.washroom()
}else{
  update("Hungry")
  Dog.display();
}
}
function readStock(data){
foods=data.val()
FOOD.updateFoodStock(foods);
}

function feedDog(){
  Dog.addImage(happydog);
  FOOD.updateFoodStock(FOOD.getFoodStock()-1);
  database.ref('/').update({
    food:FOOD.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foods++;
  database.ref('/').update({
    food:foods
  })
}
function update(state){
database.ref("/").update({
  gameState: state
})
}
function bedroom(){
  background(bedroom,550,500)
  }
  function garden(){
  background(garden,550,500)
  }
 function washroom(){
  background(washroom,550,500)
  }
