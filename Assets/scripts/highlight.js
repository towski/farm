var toggle = false;
private var oldColor;

function highlight() {
  if(!toggle){
    oldColor = gameObject.renderer.material.color;
    gameObject.renderer.material.color = Color(0, 1, 0, 0.5);
  }else{
    gameObject.renderer.material.color = oldColor;
  }
  toggle = !toggle;
  return toggle;
}