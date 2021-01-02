class Hud extends PIXI.Container {
  constructor() {
    super();
    this.containers = [];
    this.buildHud();
  }

  buildHud() {
      this.createTutorial ();
      this.createEndGame ();
  }

  onRotate() {
    // update positions of containers.
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
      container.pivot.x = container.width / 2;
      container.pivot.y = container.height / 2;

      return container;
  }
  
  addImage (container, path, x, y, w, h) {
      // create a PIXI sprite from an image path
      var img = PIXI.Sprite.fromImage(path); // 

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
    var pointer = this.addImage (container, 'img/pointer.png', 0, 0, 70, 70);

    function lerp () {
      var target = {};
      target.x = -30;
      target.y = 120;
  
      var start = {};
      start.x = 80;
      start.y = 100;

      pointer.position = start;

      createjs.Tween.get (pointer.position).to (target, 600).wait(700).call (lerp);
    }

    // add animation.
    lerp (pointer);

    this.containerTutorial = container;
  }

  hideTutorial () {
    this.containerTutorial.visible = false;
  }

  createEndGame () {
    var container = this.addContainer (0,0, 100, 100);
    this.addImage (container, 'img/popup_endcard.png', 0, 0, 250, 250);
    this.addImage (container, 'img/logo.png', 0, -230, 300, 100);
    var shine = this.addImage (container, 'img/shine.png', 0, 0, 400, 400);
    this.addImage (container, 'img/policecar2d.png', 0, 0, 220, 120);
    this.addImage (container, 'img/amazing_banner.png', 0, -120, 300, 100);
    var button = this.addImage (container, 'img/letsplay_cta.png', 0, 220, 300, 100);

    setTimeout(lerp, 1);
    function lerp () {
      shine.rotation += 5;
      setTimeout(lerp, 100);
    }

    container.visible = false;
    this.containerEndGame = container;

    function onDown () {
      window.alert ("YOU HAVE COMPLETED MY FIRST JAVASCRIPT GAME. NOW I WILL SMOKE LIKE THIS => ");
      window.location.href = "https://www.youtube.com/watch?v=ti7uWldOlSs";
    };

    button.interactive = true;
    button.on('mousedown', onDown);
    button.on('touchstart', onDown);
  }

  showEndGame () {
    setTimeout(() => {
      this.containerEndGame.scale.x = 0;
      this.containerEndGame.scale.y = 0;

      var target = {};
      target.x = 1;
      target.y = 1;
      createjs.Tween.get (this.containerEndGame.scale).to (target, 300);

      this.containerEndGame.visible = true;

      window.StartConfetti ();
    }, 700);
  }
}
