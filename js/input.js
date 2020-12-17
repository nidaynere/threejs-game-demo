class Input {
    RefreshDragControls (objs) {
        Input.TargetObjects = objs;
    }

    constructor (cam) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        console.log (cam);
        Input.Camera = cam;

        document.addEventListener ('mousedown', OnMouseDown);

        function OnMouseDown (event) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            // update the picking ray with the camera and mouse position

            raycaster.setFromCamera( mouse, Input.Camera );
            
            // calculate objects intersecting the picking ray
            
            console.log (raycaster.ray);

            console.log (Input.TargetObjects);
	        const intersects = raycaster.intersectObjects( Input.TargetObjects );

	        for ( let i = 0; i < intersects.length; i ++ ) {
		        intersects[ i ].object.material.color.set( 0xff0000 );
	        }
        }
    };


}
