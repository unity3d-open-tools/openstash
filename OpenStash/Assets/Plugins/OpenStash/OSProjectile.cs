using UnityEngine;
using System.Collections;

public enum OSProjectileType {
	Raycast,
	Prefab
}
	
public class OSProjectile : MonoBehaviour {
	public LayerMask layerMask;
	public float raycastDistance = 0.25f;
	public float speed = 1f;
	public Renderer[] renderers = new Renderer [0];
	
	[HideInInspector] public OSFirearm firearm;
	[HideInInspector] public float lifetime = 2;

	public void Update () {
		lifetime -= Time.deltaTime;

		if ( lifetime < 0 ) {
			Destroy ( this.gameObject );
		
		} else {
			this.transform.position += ( this.transform.forward * speed ) * Time.deltaTime;
			
			RaycastHit hit = new RaycastHit();
			
			if ( Physics.Raycast ( this.transform.position, this.transform.forward, out hit, raycastDistance, layerMask ) ) {
				this.transform.position = hit.point;
				lifetime = 0;

				hit.collider.gameObject.SendMessage ( "OnProjectileHit", this.firearm, SendMessageOptions.DontRequireReceiver );
				
				if ( hit.collider.rigidbody ) {
					hit.collider.rigidbody.AddForce ( ( this.transform.forward.normalized * firearm.damage ) * ( 1 / Time.timeScale ) );
				}
			}
		
		}
	}

	public static void Fire ( OSProjectile p, float range, Vector3 position, Ray ray, OSFirearm firearm ) {
		OSProjectile projectile = (OSProjectile) Instantiate ( p );

		projectile.lifetime = range / projectile.speed;
		projectile.transform.position = position;
		projectile.firearm = firearm;
		
		RaycastHit hit = new RaycastHit();

		if ( Physics.Raycast ( ray, out hit, Mathf.Infinity, projectile.layerMask ) ) {
			projectile.transform.LookAt ( hit.point );
		}
	}
}
