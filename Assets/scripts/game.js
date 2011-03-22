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
private var rain;
private var creationString;

function Start() {
  lastClick = Time.time;
  creationString = "beanstalk";
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
  StartCoroutine(cycleRain());
  StartCoroutine(growBeanstalk());
  //AssetDatabase.CreateAsset(water.GetComponent(MeshFilter).mesh, "Assets/beanstalk_mesh.cubemap");
}

function OnGUI(){
  GUI.Label(Rect(10,10,100,70), "Time: " + Mathf.Round(Time.time));
  if(guiObject){
    if(guiObject.GetComponent("soil")){
      GUI.Label(Rect(10,50,200,200), guiObject.GetComponent("soil").inspect());
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
    yield WaitForSeconds(2.0);
  }
}

function cycleRain(){
  while(true){
    rainChance = Random.Range(0.0, 1.0);
    if(rainChance < 0.4){
      if(rain == null){
        rain = Instantiate(Resources.Load("rain"), Vector3(10,30,10), Quaternion.identity);
      }
    } else {
      Destroy(rain);
      rain = null;
    }
    yield WaitForSeconds(2.0);
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
  if(lastClick == null){
    lastClick = Time.time;
  }
  if(lastClick + 0.3 < Time.time && Input.GetMouseButton(0)){
    lastClick = Time.time;
    var ray : Ray = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
    var hit : RaycastHit;
    if (Physics.Raycast (ray, hit, 100)) {
      if(Input.GetButton("Create")){
        var objectPosition = hit.collider.transform.position;
        creation = Instantiate(Resources.Load(creationString), Vector3(objectPosition.x, objectPosition.y + 1, objectPosition.z), Quaternion.identity);
        creation.GetComponent(creationString).initialize(objectPosition, this);
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
  if(Input.GetButton("Potato")){
    creationString = "beanstalk";
  }
  if(Input.GetButton("soil")){
    creationString = "soil";
  }
}