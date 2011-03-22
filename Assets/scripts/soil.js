var N;
var Ph;
var K;
var pH;
var humus;
var water;

function Awake() {
  N = 0.1;
  Ph = 0.1;
  K = 0.1;
  pH = 7.0;
  water = 0.0;
  if(transform.position.y == 4){
    humus = Random.Range(0.01, 0.1);
  }else{
    humus = 0;
  }
  color();
}

function initialize(objectPosition, game){
}

function watered(){
  return water > 0.2;
}

function OnParticleCollision(){
  water += 0.01;
}

function color(){
  if(GetComponent("highlight").toggle == false){
    renderer.material.color = Color(0.6 - (humus * 0.6), 0.5 - (humus * 0.5), 0.1 - (humus * 0.1), 1.0);
  }
}

function hasNutrients(){
  if(N > 0 && Ph > 0 && K > 0 && humus > 0){
    return true;
  } else {
    return false;
  }
}

function drainNutrients(){
  water -= 0.001;
  N -= 0.001;
  K -= 0.001;
  Ph -= 0.001;
  humus -= 0.001;
  color();
}

function inspect(){
  return "water: " + water + " N: " + N + " Ph: " + Ph + " K: " + K + " humus: " + humus;
}