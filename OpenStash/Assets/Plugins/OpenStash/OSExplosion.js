#pragma strict

public class OSExplosion extends MonoBehaviour {
	public var shakeTime : float = 2;
	public var shakeFadeOut : float = 0.03;
	public var shakeAmount : float = 0.6;
	public var expirationTime : float = 10;
	public var radius : float = 5;
	public var damage : float = 200;
	
	public function Explode () {
		var target : Vector3 = this.transform.position;
		var colliders : Collider[] = Physics.OverlapSphere ( target, radius );

		for ( var hit : Collider in colliders ) {
			if ( hit.rigidbody != null ) {
				hit.rigidbody.AddExplosionForce ( damage, target, radius, 3 );
			}
			
			// Is it an actor?
			var stats : OSStats = hit.collider.GetComponent.< OSStats > ();

			if ( stats && stats.hp > 0 ) {
				var dist : float = ( hit.collider.transform.position - target ).sqrMagnitude;
		
				if ( dist < radius ) {
					dist = 1;

				} else {
					dist = Mathf.Clamp ( dist - radius, 1, 999 );

				}

				stats.gameObject.SendMessage ( "TakeDamage", damage / dist, SendMessageOptions.DontRequireReceiver );
				
				// If the explosion kills the character, apply force to ragdoll
				if ( stats.hp <= 0 ) {
					for ( var col : Collider in stats.GetComponentsInChildren.< Collider > () ) {
						if ( col != hit ) {
							col.rigidbody.AddExplosionForce ( damage * 4, target, radius * 2, 0.4 );
						}
					}
				}
			}
			
			// Is it a destructible object?
			var destructible : OSDestructibleObject = hit.GetComponent.< OSDestructibleObject >();

			if ( destructible != null ) {
				destructible.Explode ( target, damage * 10, radius );
			}
		}

	}

	public function LateUpdate () {
		if ( shakeTime > 0 && shakeAmount > 0 ) {
			shakeTime -= Time.deltaTime;
			expirationTime -= Time.deltaTime;
			shakeAmount -= shakeFadeOut;

			var x : float = Random.Range ( -shakeAmount, shakeAmount );
			var y : float = Random.Range ( -shakeAmount, shakeAmount );
			var z : float = Random.Range ( -shakeAmount, shakeAmount );

			Camera.main.transform.position += new Vector3 ( x, y, z );
		
		} else if ( expirationTime > 0 ) {
			expirationTime -= Time.deltaTime;
		
		} else {
			Destroy ( this.gameObject );
		
		}
	}

	public function OnEnable () {
		Explode ();
	}
}
