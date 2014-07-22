#pragma strict

public enum OSProjectileType {
	Raycast,
	Prefab
}
	
public class OSProjectile extends MonoBehaviour {
	public var layerMask : LayerMask;
	public var raycastDistance : float = 0.25;
	public var speed : float = 1;
	public var renderers : Renderer [] = new Renderer [0];
	
	@HideInInspector public var firearm : OSFirearm;
	@HideInInspector public var lifetime : float = 2;

	public function Update () {
		lifetime -= Time.deltaTime;

		if ( lifetime < 0 ) {
			Destroy ( this.gameObject );
		
		} else {
			this.transform.position += ( this.transform.forward * speed ) * Time.deltaTime;
			
			var hit : RaycastHit;
			
			if ( Physics.Raycast ( this.transform.position, this.transform.forward, hit, raycastDistance, layerMask ) ) {
				this.transform.position = hit.point;
				lifetime = 0;

				hit.collider.gameObject.SendMessage ( "OnProjectileHit", this.firearm, SendMessageOptions.DontRequireReceiver );
				
				if ( hit.collider.rigidbody ) {
					hit.collider.rigidbody.AddForce ( ( this.transform.forward.normalized * firearm.damage ) * ( 1 / Time.timeScale ) );
				}
			}
		
		}
	}

	public static function Fire ( p : OSProjectile, range : float, position : Vector3, ray : Ray, firearm : OSFirearm ) {
		var projectile : OSProjectile = Instantiate ( p );

		projectile.lifetime = range / projectile.speed;
		projectile.transform.position = position;
		projectile.firearm = firearm;
		
		var hit : RaycastHit;

		if ( Physics.Raycast ( ray, hit, Mathf.Infinity, projectile.layerMask ) ) {
			projectile.transform.LookAt ( hit.point );
		}
	}
}
