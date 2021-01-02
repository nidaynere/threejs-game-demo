class Level {
  constructor(scene) {
    this.textureLoader = new THREE.TextureLoader();
    this.modelLoader = new THREE.FBXLoader();
    this.clock = new THREE.Clock();
    this.deltaTime = this.clock.getDelta();
    this.scene = scene;
    this.init();
  }
  init() {
    this.loadTextures();
    this.loadModels();
  }

  loadModel(modelName, path){
    this.modelLoader.load( path, ( fbx ) =>{
      this[`${modelName}`] = fbx;
      this.loadedModels.push(fbx);
    });
  }

  loadModels(){
    this.loadedModels = [];
    this.models = [
        { name: 'level', path: 'models/level.fbx'},
        { name: 'carBlue', path: 'models/car_blue.fbx'},
        { name: 'carRed', path: 'models/car_red.fbx'},
        { name: 'carPolice', path: 'models/car_police.fbx'}
      ];
    this.loadedModels.push = (model) => {
      this.loadedModels[this.loadedModels.length] = model;
      if(this.loadedModels.length === this.models.length){
        this.buildScene();
      }
    };
    for(let i = 0; i < this.models.length; i += 1){
      this.loadModel(this.models[i].name, this.models[i].path);
    }
  }
  loadTextures(){
    this.textureLoader = new THREE.TextureLoader();
    const promise = Promise.all([
        this.textureLoader.load('img/tex_water.jpg'),
        this.textureLoader.load('img/tex_car_blue.jpg'),
        this.textureLoader.load('img/tex_car_red.jpg'),
        this.textureLoader.load('img/tex_car_police.jpg')
        ], (resolve, reject) => {
      resolve(promise);
    }).then(result => {
      this.textures = result;
    });
  }
  loadmaterial (obj, material){
      obj.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material = material;
        }
      });
  }
  buildScene() {
    this.buildWater();
    this.addLevel();
    
    this.addInteractables ();
    this.setCamera();
    this.update();
  }

  addLevel(){
    scene.scene3D.add(this.level);
    this.level.scale.set(0.005,0.005,0.005);
    
    // add collider.
    const geometry = new THREE.BoxGeometry( 10, 0.01, 10 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
    var collider = new THREE.Mesh( geometry, material );
    collider.visible = false;
    scene.scene3D.add( collider );

    Scene.Input.SetDraggingZone (collider);
  }

  addInteractables(){
    Level.spawneds = [];
  
    var carScale = 0.0008;
    var scaler = {x:carScale, y:carScale, z:carScale};
    // all interactables. they are also draggable
    var list = [
      { 
        id: "bluecar1", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x: -1.58, y:1, z:0.3 } , 
        initialscale: scaler,
        initialrotation: {x: 0, y: 90, z: 0},
        mergeStep: 0
      },      
      { 
        id: "bluecar2", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x: 1.58, y:1, z:4.4 } , 
        initialscale: scaler, 
        initialrotation: {x: 0, y: 180, z: 0},
        mergeStep: 0
      },
      { 
        id: "redcar1", 
        color: "red", 
        mesh: "carRed",
        material: new THREE.MeshBasicMaterial( {map: this.textures[2]}),
        initialposition: { x: 0.7, y:1, z:2.1 } , 
        initialscale: scaler, 
        initialrotation: {x: 0, y: 90, z: 0},
        mergeStep: 0
      },
      { 
        id: "redcar2", 
        color: "red", 
        mesh: "carRed",
        material: new THREE.MeshBasicMaterial( {map: this.textures[2]}),
        initialposition: { x: -1.25, y:0, z:1.7 } , 
        initialscale: scaler, 
        initialrotation: {x: 0, y: 90, z: 0},
        mergeStep: 0
      }
    ]

    Level.colliders = [];
    var length = list.length;
    for (var i=0; i<length; i++) {
      Level.colliders.push (this.spawnObject (list[i]));
    }

    Scene.Input.RefreshDragControls (Level.colliders);
  }

  deSpawnObject (match) {
    // destroy the match from the scene.
    scene.scene3D.remove (match);
    
    var index = Level.spawneds.findIndex (x=>x.obj.id == match.obj.id);
    if (index > -1){
      Level.spawneds.splice (index, 1);
    }

    // remove from colliders.
    index = Level.colliders.findIndex (x=> x == match.collider);
    if (index > -1){
      Level.colliders.splice (index, 1);
      
      // collider list updated. update input drag controls.
      Scene.Input.RefreshDragControls (Level.colliders);
    }
 }

  spawnObject (obj) {
    var groupObject = new THREE.Group();
    groupObject.obj = obj; // assign our spawn object to group object.

    // WE HAVE ONE SIDED CAR FBX => FULL CAR
    var mesh = [];
    mesh.push (this[obj.mesh].clone ());
    mesh.push (this[obj.mesh].clone ());

    for (let i=0; i<2; i++)
    {
      mesh[i].scale.set(obj.initialscale.x,obj.initialscale.y,obj.initialscale.z);
      this.loadmaterial (mesh[i], obj.material);
      groupObject.add (mesh[i]);
    }

    // set mesh [0] rotation
    if (mesh.length > 1) {
          // set transform.
          mesh[1].applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        //
    }
    // HALFCAR TO FULLCAR ENDS.

    // add collider.
    const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var collider = new THREE.Mesh( geometry, material );
    collider.visible = false;
    //

    /// we will use 'this' in events.
    var currentLevel = this;

    // collider events.
    collider.ondragstart = function() { 
      console.log( "Drag started => " + obj.id ); 
    }

    collider.ondragend = function() { 
      console.log( "Drag end => " + obj.id ); 
      // find possible match?
      var match = Level.spawneds.find (x => 
        obj.id != x.obj.id &&
        obj.mergeStep == x.obj.mergeStep &&
        (obj.color == x.obj.color || obj.mergeStep == 1) &&
        groupObject.position.distanceTo (x.position) <= 1); // => 1 can be optional

        if (match != null)
        {
            console.log ("Match found");
            currentLevel.deSpawnObject (groupObject);
            match.obj.mergeStep++; // target is now scaled up.

            if (match.obj.mergeStep > 1) {
               // police car!
               console.log ("policecar");
               var policeCar = { 
                  id: "policecar", 
                  color: "police", 
                  mesh: "carPolice",
                  material: new THREE.MeshBasicMaterial( {map: currentLevel.textures[3]}),
                  initialposition: { x: match.position.x, y : match.position.y, z : match.position.z } , 
                  initialscale: { x: 0.005, y: 0.005, z: 0.005 }, 
                  initialrotation: {x: 0, y: 90, z: 0},
                  mergeStep: 1,
                  instantiated: null
                };

                currentLevel.deSpawnObject (match);
                currentLevel.spawnObject (policeCar);

                currentLevel.scene.hud.showEndGame ();
            } else {
              // tween the scale increase.
              var target = new THREE.Vector3(match.scale.x *2, match.scale.y*2, match.scale.z*2); // create on init
              createjs.Tween.get (match.scale).to (target, 400);

              currentLevel.scene.hud.hideTutorial ();
              //
            }
        }
    }

    collider.ondrag = function(point) { 
      var position = Scene.Input.RaycastToDraggingZone (point);
      if (position != null)
      {
          // VERY COMPLEX FAKE GRID SYSTEM 
          // calculated the dragging zone. it has 10m length. 
          // 20 slots on the visual.
          position.x = position.x - (position.x % 0.5) + 0.25;
          position.z = position.z - (position.z % 0.5) + 0.25;
          // VERY COMPLEX FAKE GRID SYSTEM ENDs.
          
          //assign the new position
          groupObject.position.set (position.x, position.y, position.z);
      }
    }
    //

    groupObject.collider = collider;
    groupObject.add (collider);

    // set transform.
    var rotation = new THREE.Vector3 (THREE.Math.degToRad (obj.initialrotation.x), 
    THREE.Math.degToRad (obj.initialrotation.y), 
    THREE.Math.degToRad (obj.initialrotation.z) );
    groupObject.rotation.setFromVector3(rotation);
    groupObject.position.set (obj.initialposition.x, obj.initialposition.y, obj.initialposition.z);
    //
    
    Level.spawneds.push (groupObject);
    scene.scene3D.add ( groupObject);

    // tween the group scale. (spawn animation)
    groupObject.scale.set (0, 0, 0);
    var target = new THREE.Vector3(1, 1, 1);
    createjs.Tween.get (groupObject.scale).to (target, 400);
    //

    return collider;
  }

  buildWater() {
    this.waterTexture = this.textures[0]
    this.waterTexture.wrapS = THREE.RepeatWrapping;
    this.waterTexture.wrapT = THREE.RepeatWrapping;
    this.waterTexture.repeat.set(30, 30);

    const geometry = new THREE.PlaneBufferGeometry(150, 150,1,1);
    const material = new THREE.MeshBasicMaterial({ map: this.waterTexture  });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.set(THREE.Math.degToRad(-90), 0, 0);
    this.floor.position.set(0, -10, 0);
    scene.scene3D.add(this.floor);

    geometry.dispose();
    material.dispose();
  }
  setCamera() {
    scene.camera.position.set(0, 10, 10);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0)); // set the correct camera angle
  }
  update() {
    requestAnimationFrame(this.update.bind(this));
    this.deltaTime = this.clock.getDelta();
  }
}
