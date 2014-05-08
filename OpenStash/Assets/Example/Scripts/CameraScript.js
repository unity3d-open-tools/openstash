#pragma strict

public class CameraScript extends MonoBehaviour {
	public var inventory : OSInventory;
	
	public function Update () {
		
		if ( Input.GetMouseButtonDown ( 0 ) ) {
			var ray : Ray = camera.ScreenPointToRay ( Input.mousePosition );
			var hit : RaycastHit;

			if ( Physics.Raycast ( ray, hit, Mathf.Infinity ) ) {
				var go : GameObject = hit.transform.gameObject;
				var item : OSItem = go.GetComponent.<OSItem>();

				if ( item ) {
					inventory.AddItemFromScene ( item );
				}
			}
			
		}
	}
}
