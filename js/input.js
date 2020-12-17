class Input {
    RefreshDragControls (objs) {
        Input.TargetObjects = objs;
    }

    SetDraggingZone (obj) {
        Input.TargetDraggingZone = obj;
    }

    RaycastToDraggingZone (point) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( point, Input.Camera );

        const intersect = raycaster.intersectObject( Input.TargetDraggingZone );

        if (intersect.length> 0){
            return intersect [0].point;
        }

        return null;
    }

    constructor (cam) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        Input.Camera = cam;

        function GetMousePosition (event) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            return mouse;
        }

        function OnMouseDown (event) {
            Input.CurrentTargets = [];

            GetMousePosition (event); // update the last one.
            // update the picking ray with the camera and mouse position

            raycaster.setFromCamera( mouse, Input.Camera );
            // calculate objects intersecting the picking ray
        
	        const intersects = raycaster.intersectObjects( Input.TargetObjects );

	        for ( let i = 0; i < intersects.length; i ++ ) {
                Input.CurrentTargets [i] = intersects[i].object;
		        //intersects[ i ].object.material.color.set( 0xff0000 );
            }
            
            if (intersects.length > 0)
                Input.IsDragging = true;

            var length =  Input.CurrentTargets.length;
            for ( let i = 0; i < length; i ++ ) {
                 Input.CurrentTargets[ i ].ondragstart();
            }    
        }

        function OnMouseMove (event) {
            if (Input.IsDragging) {
                var length =  Input.CurrentTargets.length;
                for ( let i = 0; i < length; i ++ ) {
                    Input.CurrentTargets[ i ].ondrag(GetMousePosition (event));
                }    
            }
        }

        function OnMouseUp (event) {
            if (Input.IsDragging) {
                console.log ("drag end");
                var length =  Input.CurrentTargets.length;
                for ( let i = 0; i < length; i ++ ) {
                    Input.CurrentTargets[ i ].ondragend();
                }
    
                Input.IsDragging = false;
                Input.CurrentTargets = [];
            }
        }

        document.addEventListener ('mousedown', OnMouseDown);
        document.addEventListener ('mousemove', OnMouseMove);
        document.addEventListener ('mouseup', OnMouseUp);
    };
}
