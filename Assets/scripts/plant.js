private var soil;
private var sun;

function initialize(mySoil, mySun){
  sun = mySun;
  soil = mySoil.GetComponent("soil");
}

function grow(){
  if(soil.watered()){
    transform.localScale.y += 0.01;
    soil.water -= 0.001;
  }
}