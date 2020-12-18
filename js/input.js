/// I used static variables which is not necessary here.
/// You know why? Because I had no idea. I never used JavaScript like this. 
class Input {
    RefreshDragControls (objs) {
        Input.TargetObjects = objs;
    }

    SetDraggingZone (obj) {
        Input.TargetDraggingZone = obj;
    }

    /// raycast to the dragging zone for Input.TargetObjects on Input.TargetDraggingZone.
    RaycastToDraggingZone (point) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( point, Input.Camera );

        const intersect = raycaster.intersectObject( Input.TargetDraggingZone );

        if (intersect.length> 0){
            return intersect [0].point; // only the first one.
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

            GetMousePosition (event);
            raycaster.setFromCamera( mouse, Input.Camera );
        
	        const intersects = raycaster.intersectObjects( Input.TargetObjects );

	        if ( intersects.length > 0) {
                Input.CurrentTargets [0] = intersects[0].object;
                Input.CurrentTargets[0].ondragstart();
                Input.IsDragging = true;
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
