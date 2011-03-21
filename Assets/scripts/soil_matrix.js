class EmptySoil{
  var soil;
  var name;
  var x;
  var y;
  var z;
  
  function EmptySoil(myX, myY, myZ){
    this.name = "empty";
    this.x = myX;
    this.y = myY;
    this.z = myZ;
  }
}

var matrix;
var lastPropagationStart;

function initialize(){
  matrix = new Array();
  lastPropagationStart = 0.0;
  for(var x = 0; x < 20; x++){
    this.startX(x);
    for(var y = 0; y < 5; y++){
      this.startY(x, y);
      for(var z = 0; z < 20; z++){
        this.setValue(x, y, z, Instantiate(Resources.Load("soil"), Vector3(x,y,z), Quaternion.identity));
      }
    }
  }
}

function startX(x){
  matrix[x] = new Array();
}

function startY(x, y){
  try{
    return matrix[x][y];
  }catch(e){
    matrix[x][y] = new Array();
  }
}

function getValue(x, y, z){
  try {
    return matrix[x][y][z];
  }catch(e){
    return null;
  }
}

function setValue(x, y, z, object){
  try{
    matrix[x][y][z] = object;
  }catch(e){
  }
}

function setGameObject(object){
  try{
    matrix[object.transform.position.x][object.transform.position.y][object.transform.position.z] = object;
  }catch(e){
    return null;
  }
}

function drainNeighbors(x, y, z){
  var self = getValue(x, y, z);
  var neighbors = getNeighbors(x, y, z);
  var totalLevel = 0.0;
  if(self && self.name == "water(Clone)"){
    totalLevel = self.GetComponent("water").level;
  }
  var waters = new Array();
  var soils = new Array();
  var empties = new Array();
  for(neighbor in neighbors){
    if(neighbor.name == "water(Clone)"){
      var water = neighbor.GetComponent("water");
      waters.Add(water);
      totalLevel += water.level;
    }else if(neighbor.name == "soil(Clone)"){
      soils.Add(neighbor.GetComponent("soil"));
    }else if(neighbor.name == "empty"){
      empties.Add(neighbor);
    }
  }
  if(totalLevel > 0){
    var newLevel = totalLevel / (waters.length + 1.0);
    if(newLevel > 0.05){
      var newWater = getValue(x, y, z);
      var madeNewWater = false;
      if(newWater == null || newWater.name != "water(Clone)"){
        madeNewWater = true;
        newLevel = totalLevel / (waters.length + 2.0);
        newWater = Instantiate(Resources.Load("water"), Vector3(x,y,z), Quaternion.identity);
        newWater.GetComponent("water").setLevel(newLevel);
        setValue(x, y, z, newWater);
      }
      for(water in waters){
        water.setLevel(newLevel);
        if(water.lastPropagation < lastPropagationStart){
          water.lastPropagation = Time.time;
          drainNeighbors(water.initialPosition.x, water.initialPosition.y, water.initialPosition.z);
        }
      }
      for(soil in soils){
        if(madeNewWater){
          soil.water += newLevel / soils.length;
        }else{
          soil.water += (newLevel - newWater.GetComponent("water").oldLevel) / soils.length;
        }
      }
      for(empty in empties){
        if(getValue(empty.x, empty.y, empty.z) == null){
          newWater = Instantiate(Resources.Load("water"), Vector3(empty.x,empty.y,empty.z), Quaternion.identity);
          newWater.GetComponent("water").setLevel(0.0);
          setValue(empty.x, empty.y, empty.z, newWater);
        }
      }
    }
  } else {
    setValue(x, y, z, null);
  }
}

function fillIfPresent(result, x, y, z){
  if(x >= 0 && x < 20 && z >= 0 && z < 20){
    try{
      if(matrix[x][y][z]){
        result.Add(matrix[x][y][z]);
      }else{
        result.Add(new EmptySoil(x, y, z));
      }
    }catch(e){
    }
  }
}

function getNeighbors(x, y, z){
  var result = new Array();
  fillIfPresent(result, x + 1, y, z);
  fillIfPresent(result, x - 1, y, z);
  fillIfPresent(result, x, y, z + 1);
  fillIfPresent(result, x, y, z - 1);
  return result;
}