private var soil;
private var sun;

function initialize(mySoil, mySun){
  sun = mySun.GetComponent("sun");
  soil = mySoil.GetComponent("soil");
}

function grow(){
  if(soil.watered() && sun.day){
    if(soil.hasNutrients()){
      transform.localScale.y += 0.01;
      soil.drainNutrients();
    }
  }
}