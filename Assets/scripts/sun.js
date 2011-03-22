function Start(){
  StartCoroutine(cycle());
}

function cycle(){
  while(true){
    yield WaitForSeconds(10.0);
    if(light.intensity == 0.1){
      light.intensity = 0.3;
    }else{
      light.intensity = 0.1;
    }
  }
}