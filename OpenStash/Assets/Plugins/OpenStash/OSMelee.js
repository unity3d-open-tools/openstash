#pragma strict

public class OSMelee extends MonoBehaviour {
	@HideInInspector public var item : OSItem;
	@HideInInspector public var damageIndex : int;
	@HideInInspector public var firingRateIndex : int;
	@HideInInspector public var rangeIndex : int;
	@HideInInspector public var firingSoundIndex : int;
	@HideInInspector public var equippingSoundIndex : int;
	@HideInInspector public var holsteringSoundIndex : int;
	@HideInInspector public var equippingAnimationIndex : int;
	@HideInInspector public var holsteringAnimationIndex : int;
	@HideInInspector public var firingAnimationIndex : int;
	
	public var aimWithMainCamera : boolean = true;
	public var wielder : GameObject;

	private var fireTimer : float = 0;
	private var inventory : OSInventory;

	public function SetInventory ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	public function get damage () : float {
		return item.attributes[damageIndex].value;
	}

	public function get firingRate () : float {
		return item.attributes[firingRateIndex].value;
	}
	
	public function get range () : float {
		return item.attributes[rangeIndex].value;
	}
	
	public function get firingSound () : AudioClip {
		return item.sounds[firingSoundIndex];
	}
	
	public function get equippingSound () : AudioClip {
		return item.sounds[equippingSoundIndex];
	}
	
	public function get holsteringSound () : AudioClip {
		return item.sounds[holsteringSoundIndex];
	}

	public function Fire () {
		if ( fireTimer > 0 ) { return; }

		var hit : RaycastHit;
		var ray : Ray;

		item.PlayAnimation ( firingAnimationIndex );

		if ( aimWithMainCamera ) {
			ray = new Ray ( Camera.main.transform.position, Camera.main.transform.forward );

		} else {
			var here : Vector3 = wielder.transform.position;
			here.y = this.transform.position.y;

			ray = new Ray ( here, wielder.transform.forward );

		}

		var tempLayer : int = wielder.layer;

		wielder.layer = 2;

		if ( Physics.Raycast ( ray, hit, range ) ) {
			if ( hit.collider.gameObject == this.gameObject ) {
				ray = new Ray ( hit.point, ray.direction );
				
				Physics.Raycast ( ray, hit, range );

			}

			if ( hit != null ) {
				hit.collider.gameObject.SendMessage ( "OnMeleeHit", this, SendMessageOptions.DontRequireReceiver );
			
			}
		}

		wielder.layer = tempLayer;
		
		fireTimer = 1 / firingRate;

		item.PlaySound ( firingSoundIndex, true );
	}

	public function Update () {
		if ( !item ) {
			item = this.GetComponent.< OSItem > ();
			return;
		}

		if ( fireTimer > 0 ) {
			fireTimer -= Time.deltaTime;
		}
	}	
}
