class Level {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.modelLoader = new THREE.FBXLoader();
    this.clock = new THREE.Clock();
    this.deltaTime = this.clock.getDelta();

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
    scene.scene3D.add( collider );

    Scene.Input.SetDraggingZone (collider);
  }

  addInteractables(){
    this.spawneds = [];
  
    var carScale = 0.001;
    var scaler = {x:carScale, y:carScale, z:carScale};
    // all interactables. they are also draggable
    var list = [
      { 
        id: "bluecar1", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x: 0, y:2, z:2 } , 
        initialscale: scaler,
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH (cloned in this case :)
      },      
      { 
        id: "bluecar2", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x:4, y:2, z:2 } , 
        initialscale: scaler, 
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH (cloned in this case :)
      },
      { 
        id: "redcar1", 
        color: "red", 
        mesh: "carRed",
        material: new THREE.MeshBasicMaterial( {map: this.textures[2]}),
        initialposition: { x: 1, y:1, z:0 } , 
        initialscale: scaler, 
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH (cloned in this case :)
      }
    ]

    var colliders = [];
    var length = list.length;
    for (var i=0; i<length; i++) {
      colliders.push (this.spawnObject (list[i]));
    }

    Scene.Input.RefreshDragControls (colliders);
  }

  spawnObject (obj) {
    var groupObject = new THREE.Group(); // I ALREADY MISSED PARENTS & CHILDRENS IN UNITY.

    var mesh = this[obj.mesh].clone ();
    obj.instantiated = mesh;
    
    mesh.scale.set(obj.initialscale.x,obj.initialscale.y,obj.initialscale.z);
    this.loadmaterial (mesh, obj.material);

    groupObject.add (mesh);

    // add collider.
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var collider = new THREE.Mesh( geometry, material );
    scene.scene3D.add( collider );

    // collider events.
    collider.ondragstart = function() { console.log( "Drag started => " + obj.id ); }
    collider.ondragend = function() { console.log( "Drag end => " + obj.id ); }
    collider.ondrag = function(point) { 
      var position = Scene.Input.RaycastToDraggingZone (point);
      if (position != null)
      {
          groupObject.position.set (position.x, position.y + 1, position.z);
      }
    }
    //

    groupObject.add (collider);

    // set transform.

    var rotation = new THREE.Vector3 (THREE.Math.degToRad (obj.initialrotation.x), 
    THREE.Math.degToRad (obj.initialrotation.y), 
    THREE.Math.degToRad (obj.initialrotation.z) );

    scene.scene3D.add ( groupObject);

    groupObject.rotation.setFromVector3(rotation);
    groupObject.position.set (obj.initialposition.x, obj.initialposition.y, obj.initialposition.z);

    console.log (groupObject);

    this.spawneds[obj.id] = groupObject;

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
