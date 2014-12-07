using UnityEngine;
using System.Collections;

public class OSExplosion : MonoBehaviour {
	public float shakeTime = 2f;
	public float shakeFadeOut = 0.03f;
	public float shakeAmount = 0.6f;
	public float expirationTime = 10f;
	public float radius = 5f;
	public float damage = 200f;
	
	public void Explode () {
		Vector3 target = this.transform.position;
		Collider[] colliders = Physics.OverlapSphere ( target, radius );

		foreach ( Collider hit in colliders ) {
			if ( hit.rigidbody != null ) {
				hit.rigidbody.AddExplosionForce ( damage, target, radius, 3 );
			}
			
			// Is it an actor?
			OSStats stats = hit.collider.GetComponent< OSStats > ();

			if ( stats && stats.hp > 0 ) {
				float dist = ( hit.collider.transform.position - target ).sqrMagnitude;
		
				if ( dist < radius ) {
					dist = 1;

				} else {
					dist = Mathf.Clamp ( dist - radius, 1, 999 );

				}

				stats.gameObject.SendMessage ( "TakeDamage", damage / dist, SendMessageOptions.DontRequireReceiver );
				
				// If the explosion kills the character, apply force to ragdoll
				if ( stats.hp <= 0 ) {
					foreach ( Collider col in stats.GetComponentsInChildren< Collider > () ) {
						if ( col != hit ) {
							col.rigidbody.AddExplosionForce ( damage * 4f, target, radius * 2f, 0.4f );
						}
					}
				}
			}
			
			// Is it a destructible object?
			OSDestructibleObject destructible = hit.GetComponent< OSDestructibleObject >();

			if ( destructible != null ) {
				destructible.Explode ( target, damage * 10, radius );
			}
		}

	}

	public void LateUpdate () {
		if ( shakeTime > 0 && shakeAmount > 0 ) {
			shakeTime -= Time.deltaTime;
			expirationTime -= Time.deltaTime;
			shakeAmount -= shakeFadeOut;

			float x = Random.Range ( -shakeAmount, shakeAmount );
			float y = Random.Range ( -shakeAmount, shakeAmount );
			float z = Random.Range ( -shakeAmount, shakeAmount );

			Camera.main.transform.position += new Vector3 ( x, y, z );
		
		} else if ( expirationTime > 0 ) {
			expirationTime -= Time.deltaTime;
		
		} else {
			Destroy ( this.gameObject );
		
		}
	}

	public void OnEnable () {
		Explode ();
	}
}
