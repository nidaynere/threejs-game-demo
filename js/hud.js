class Hud extends PIXI.Container {
  constructor() {
    super();
    this.containers = [];
    this.loadImages();
    this.buildHud();
  }

  loadImages(){
    this.logo = new PIXI.Sprite(PIXI.Texture.from('img/logo.png'));
  }

  buildHud() {
      this.createTutorial ();
      this.createEndGame ();
  }

  onRotate() {
    // update.
    for (let i=0;i<this.containers.length;i++){
      this.containers[i].x = window.innerWidth/2;
      this.containers[i].y = window.innerHeight/2;
    }
  }

  addContainer (x, y, w, h) {
      const container = new PIXI.Container();
      stage.addChild(container);
      this.containers.push (container);
            
      // Move container to the center
      container.x = app.screen.width / 2;
      container.y = app.screen.height / 2;
      container.x += x;
      container.y += y;
      container.width = w;
      container.height= h;
            // Center bunny sprite in local container coordinates
      container.pivot.x = container.width / 2;
      container.pivot.y = container.height / 2;

      return container;
  }
  
  addImage (container, path, x, y, w, h) {
      // create a PIXI sprite from an image path
      var img = PIXI.Sprite.fromImage(path); // 

      // center the sprite anchor point
      img.anchor.x = 0.5;
      img.anchor.y = 0.5;
      img.position.x = x;
      img.position.y = y;
      img.width = w;
      img.height = h;

      container.addChild(img);

      return img;
  }

  createTutorial () {
    var container = this.addContainer (0,0, 100, 100);
    var pointer = this.addImage (container, 'img/pointer.png', 0, 0, 100, 100);

    // add animation.
    // tween the scale increase.
    lerp (pointer);

    function lerp () {
      var target = {};
      target.x = 50;
      target.y = 100;
  
      var start = {};
      start.x = 150;
      start.y = 200;

      pointer.position = start;

      createjs.Tween.get (pointer.position).to (target, 300).wait(500).call (lerp);
    }

    this.containerTutorial = container;
  }

  hideTutorial () {
    this.containerTutorial.visible = false;
  }

  createEndGame () {
    var container = this.addContainer (0,0, 100, 100);
    var pointer = this.addImage (container, 'img/pointer.png', 0, 0, 100, 100);
  }
}
