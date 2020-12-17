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
  }

  addInteractables(){

    // all interactables. they are also draggable
    var list = [
      { 
        id: "bluecar1", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x: 0, y:2, z:2 } , 
        initialscale: {x :0.005, y:0.005, z: 0.005}, 
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH
      },      
      { 
        id: "bluecar2", 
        color: "blue", 
        mesh: "carBlue",
        material: new THREE.MeshBasicMaterial( {map: this.textures[1]}),
        initialposition: { x:4, y:2, z:2 } , 
        initialscale: {x :0.005, y:0.005, z: 0.005}, 
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH
      },
      { 
        id: "redcar1", 
        color: "red", 
        mesh: "carRed",
        material: new THREE.MeshBasicMaterial( {map: this.textures[2]}),
        initialposition: { x: 1, y:1, z:0 } , 
        initialscale: {x :0.005, y:0.005, z: 0.005}, 
        initialrotation: {x: 0, y: 90, z: 0},
        instantiated: null // SPAWNED MESH
      }
    ]

    var length = list.length;
    for (var i=0; i<length; i++) {
      this.spawnObject (list[i]);
    }
  }

  ///degree to radian
  degToRad (val) {
    const deg = 57.295779515;
    return val / deg;
  }
  // create spawned objects list.

  spawnObject (obj) {
    /// load mesh first. (THANK YOU DEVELOPER I HAD NO IDEA ABOUT THREE.JS)

    var mesh = this[obj.mesh].clone ();
    console.log (mesh);
    obj.instantiated = mesh;
    scene.scene3D.add(mesh);

    mesh.scale.set(obj.initialscale.x,obj.initialscale.y,obj.initialscale.z);
    var rotation = new THREE.Vector3 (this.degToRad (obj.initialrotation.x), 
    this.degToRad (obj.initialrotation.y), 
    this.degToRad (obj.initialrotation.z) );
    
    mesh.rotation.setFromVector3(rotation);
    mesh.position.set (obj.initialposition.x, obj.initialposition.y, obj.initialposition.z);
    this.loadmaterial (mesh, obj.material);
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
