var day;

function Start(){
  day = true;
  StartCoroutine(cycle());
}

function cycle(){
  while(true){
    yield WaitForSeconds(10.0);
    if(day == false){
      day = true;
      light.intensity = 0.3;
    }else{
      day = false;
      light.intensity = 0.1;
    }
  }
}