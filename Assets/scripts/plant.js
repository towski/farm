private var soil;
private var sun;

function initialize(mySoil, mySun){
  sun = mySun;
  soil = mySoil.GetComponent("soil");
}

function grow(){
  if(soil.watered()){
    if(soil.hasNutrients()){
      transform.localScale.y += 0.01;
      soil.drainNutrients();
    }
  }
}