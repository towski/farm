private var N;
private var Ph;
private var K;
private var pH;
private var humus;
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
  renderer.material.color = Color(0.6 - (humus * 0.6), 0.5 - (humus * 0.5), 0.1 - (humus * 0.1), 1.0);
}

function watered(){
  return water > 0.2;
}

function OnParticleCollision(){
  water += 0.01;
}