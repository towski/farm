private var mainCamera;
private var sun;
private var lastClick;
private var selections;
private var matrix;
private var spring;
private var beanstalk;
private var time;
private var guiObject;
private var crops;

function Start() {
  lastClick = Time.time;
  selections = new Array();
  crops = new Array();
  matrix = Instantiate(Resources.Load("soil_matrix"), Vector3(0,0,0), Quaternion.identity);
  matrix = matrix.GetComponent("soil_matrix");
  matrix.initialize();
  Destroy(matrix.getValue(8,4,5));
  Destroy(matrix.getValue(8,3,5));
  var water = Instantiate(Resources.Load("water"), Vector3(8,4,5), Quaternion.identity);
  matrix.setValue(8, 4, 5, water);
  spring = water.GetComponent("water");
  sun = Instantiate(Resources.Load("sun"), Vector3(0,0,0), Quaternion.Euler(30, 60, 0));
  mainCamera = Instantiate(Resources.Load("camera"), Vector3(4,10.5,3), Quaternion.Euler(45, 45, 0));
  StartCoroutine(fillSpring());
  StartCoroutine(growBeanstalk());
}

function OnGUI(){
  GUI.Label(Rect(10,10,100,70), "Time: " + Mathf.Round(Time.time));
  if(guiObject){
    if(guiObject.GetComponent("soil")){
      GUI.Label(Rect(10,50,200,70), "water: " + guiObject.GetComponent("soil").water);
    }else if(guiObject.GetComponent("water")){
      GUI.Label(Rect(10,50,200,70), "water: " + guiObject.GetComponent("water").level + " old:" + guiObject.GetComponent("water").oldLevel);
    }
  }
  GUI.Label(Rect(10,30,200,70), "lastClick: " + lastClick);
}

function growBeanstalk(){
  while(true){
    for(crop in crops){
      crop.grow();
    }
    yield WaitForSeconds(0.5);
  }
}

function fillSpring(){
  while(true){
    matrix.lastPropagationStart = Time.time;
    if(spring.level < 1.0){
      spring.setLevel(spring.level + 0.01);
    }
    matrix.drainNeighbors(spring.initialPosition.x, spring.initialPosition.y, spring.initialPosition.z);
    yield WaitForSeconds(0.5);
  }
}

function Update () {
  if(lastClick + 0.3 < Time.time && Input.GetMouseButton(0)){
    lastClick = Time.time;
    var ray : Ray = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
    var hit : RaycastHit;
    if (Physics.Raycast (ray, hit, 100)) {
      if(Input.GetButton("Create")){
        var objectPosition = hit.collider.transform.position;
        beanstalk = Instantiate(Resources.Load("beanstalk"), Vector3(objectPosition.x, objectPosition.y + 1, objectPosition.z), Quaternion.identity);
        beanstalk.renderer.material.color = Color(0, 0.5, 0.1, 0.5);
        var plant = beanstalk.GetComponent("plant");
        plant.initialize(matrix.getValue(objectPosition.x, objectPosition.y, objectPosition.z), sun);
        crops.Add(plant);
        //matrix.startY(objectPosition.x, objectPosition.y + 1);
        //matrix.setGameObject(Instantiate(Resources.Load("soil"), Vector3(objectPosition.x, objectPosition.y + 1, objectPosition.z), Quaternion.identity));
      }else{
        if(hit.collider.GetComponent("highlight").highlight()){
          guiObject = hit.collider;
          selections.Add(hit.collider.gameObject);
        }else{
          guiObject = null;
          selections.Remove(hit.collider.gameObject);
        }
      }
    }
  }
  if(Input.GetButton("Destroy")){
    matrix.lastPropagationStart = Time.time;
    for(object in selections){
      matrix.drainNeighbors(object.transform.position.x, object.transform.position.y, object.transform.position.z);
      Destroy(object);
    }
    selections = new Array();
  }
}