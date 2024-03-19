// import * as BABYLON from 'babylonjs';

document.addEventListener("click", function () {
  document.body.requestPointerLock();
});

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
class Playground {
  static CreateScene(engine, canvas) {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    var ammo = new BABYLON.AmmoJSPlugin(true);
    //await Ammo();
    ammo.setMaxSteps(10);
    ammo.setFixedTimeStep(1/(240));
    scene.enablePhysics(new BABYLON.Vector3(0,-10,0), ammo);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;
    const SPACE_KEY = 32;
    const C_KEY = 67;

    var wPressed = false;
    var aPressed = false;
    var sPressed = false;
    var dPressed = false;
    var spacePressed = false;
    var cPressed = false;

    document.addEventListener('keydown', 
      (event) => {
        if (event.keyCode === W_KEY) {
          console.log("w pressed");
          wPressed = true;
        }
        else if (event.keyCode === A_KEY) {
          console.log("a pressed");
          aPressed = true;
        }
        else if (event.keyCode === S_KEY) {
          console.log("s pressed");
          sPressed = true;
        }
        else if (event.keyCode === D_KEY) {
          console.log("d pressed");
          dPressed = true;
        }
        else if (event.keyCode === SPACE_KEY) {
          console.log("space pressed");
          spacePressed = true;
        }
        else if (event.keyCode === C_KEY) {
          console.log("c pressed");
          cPressed = true;
        }
    });

    document.addEventListener('keyup',
      (event) => {
        if (event.keyCode === W_KEY) {
          wPressed = false;
        }
        else if (event.keyCode === A_KEY) {
          aPressed = false;
        }
        else if (event.keyCode === S_KEY) {
          sPressed = false;
        }
        else if (event.keyCode === D_KEY) {
          dPressed = false;
        }
        else if (event.keyCode === SPACE_KEY) {
          spacePressed = false;
        }
        else if (event.keyCode === C_KEY) {
          cPressed = false;
        }
    });

    var mouseX = 0.0;
    var mouseY = 0.0;
    var rotationSpeed = 0.004;

    document.addEventListener('mousemove',
      (event) => {
        mouseX += event.movementX;
        mouseY += event.movementY;
    });

    var fricton = new BABYLON.Vector3(0.03, 0.03, 0.03);
    var velocity = new BABYLON.Vector3(0, 0, 0);
    var acceleration = new BABYLON.Vector3(0.1, 0.1, 0.1);
    var maxSpeed = new BABYLON.Vector3(0.2, 0.2, 0.2);

    scene.registerBeforeRender(function () {

      if (!scene.isReady()) {
        return;
      }
      
      // player movement
      var quat = BABYLON.Quaternion.FromEulerAngles(0, camera.rotation.y, 0);

      if (wPressed) {
        var forwardsVector = new BABYLON.Vector3(0, 0, acceleration.z);
        var temp = forwardsVector.rotateByQuaternionToRef(quat, BABYLON.Vector3.Zero());
        //velocity.z = Math.min(velocity.z + acceleration.z, maxSpeed.z);
        velocity.x += temp.x;
        velocity.z += temp.z;
      }
      if (aPressed) {
        //velocity.x = Math.max(velocity.x - acceleration.x, -maxSpeed.x);
        var leftVector = new BABYLON.Vector3(-acceleration.x, 0, 0);
        var temp = leftVector.rotateByQuaternionToRef(quat, BABYLON.Vector3.Zero());
        //velocity.z = Math.min(velocity.z + acceleration.z, maxSpeed.z);
        velocity.x += temp.x;
        velocity.z += temp.z;
      }
      if (sPressed) {
        //velocity.z = Math.max(velocity.z - acceleration.z, -maxSpeed.z);
        var forwardsVector = new BABYLON.Vector3(0, 0, -acceleration.z);
        var temp = forwardsVector.rotateByQuaternionToRef(quat, BABYLON.Vector3.Zero());
        //velocity.z = Math.min(velocity.z + acceleration.z, maxSpeed.z);
        velocity.x += temp.x;
        velocity.z += temp.z;
      }
      if (dPressed) {
        //velocity.x = Math.min(velocity.x + acceleration.x, maxSpeed.x);
        var leftVector = new BABYLON.Vector3(acceleration.x, 0, 0);
        var temp = leftVector.rotateByQuaternionToRef(quat, BABYLON.Vector3.Zero());
        //velocity.z = Math.min(velocity.z + acceleration.z, maxSpeed.z);
        velocity.x += temp.x;
        velocity.z += temp.z;
      }
      if (spacePressed) {
        velocity.y += acceleration.y;
      }
      if (cPressed) {
        velocity.y -= acceleration.y;
      }

      velocity.x = Math.min(velocity.x, maxSpeed.x);
      velocity.y = Math.min(velocity.y, maxSpeed.y);
      velocity.z = Math.min(velocity.z, maxSpeed.z);
      velocity.x = Math.max(velocity.x, -maxSpeed.x);
      velocity.y = Math.max(velocity.y, -maxSpeed.y);
      velocity.z = Math.max(velocity.z, -maxSpeed.z);

      camera.position.x += velocity.x;
      camera.position.y += velocity.y;
      camera.position.z += velocity.z;
      

      if (velocity.x > 0) {
        velocity.x = Math.max(velocity.x-fricton.x, 0);
      }

      else if (velocity.x < 0) {
        velocity.x = Math.min(velocity.x+fricton.x, 0);
      }

      if (velocity.y > 0) {
        velocity.y = Math.max(velocity.y-fricton.y, 0);
      }
      
      else if (velocity.y < 0) {
        velocity.y = Math.min(velocity.y+fricton.y, 0);
      }

      if (velocity.z > 0) {
        velocity.z = Math.max(velocity.z-fricton.z, 0);
      }
      else if (velocity.z < 0) {
        velocity.z = Math.min(velocity.z+fricton.z, 0);
      }

      // rotation
      camera.rotation.y += mouseX*rotationSpeed;
      camera.rotation.x += mouseY*rotationSpeed;
      mouseX = 0;
      mouseY = 0;
    });

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    // Our built-in 'sphere' shape. Params: name, options, scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    // Our built-in 'ground' shape. Params: name, options, scene
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    return scene;
  }
}
createScene = function() { return Playground.CreateScene(engine, engine.getRenderingCanvas()); }
window.initFunction = async function() {
    
    
    
  var asyncEngineCreation = async function() {
    try {
      return createDefaultEngine();
    } catch(e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});