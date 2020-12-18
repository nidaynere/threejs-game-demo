/// I used static variables which is not necessary here.
/// You know why? Because I had no idea. I never used JavaScript like this. 
/// I was a happy man when I was generating CSS with JS.
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

	        if ( intersects.length > 0) {
                Input.CurrentTargets [0] = intersects[0].object;
                Input.CurrentTargets[0].ondragstart();
                Input.IsDragging = true;
                //intersects[ i ].object.material.color.set( 0xff0000 );
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
