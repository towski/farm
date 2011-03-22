var level;
private var baseLevel;
private var lastPropagation;
private var initialPosition;
var oldLevel;

function Awake(){
  initialPosition = transform.position;
  lastPropagation = 0;
  oldLevel = 0.0;
  level = 1.0;
  baseLevel = transform.position.y;
  setLevel(level);
  gameObject.renderer.material.color.a = 0.4;
}

function setLevel(newLevel){
  //-0.5 = 0
  //0 = 3
  //0.5 = 6
  oldLevel = level;
  level = newLevel;
  transform.position.y = baseLevel + newLevel;
}