var watered;

function Awake() {
  renderer.material.color = Color(0, 0.5, 0.1, 0.5);
  watered = false;
}

function initialize(objectPosition, game){
  var plant = gameObject.GetComponent("plant");
  plant.initialize(game.matrix.getValue(objectPosition.x, objectPosition.y, objectPosition.z), game.sun);
  game.crops.Add(plant);
}