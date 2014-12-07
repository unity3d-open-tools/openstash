using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class OSDestructibleObject : MonoBehaviour {
	public GameObject[] pieces;
	public bool destroyed = false;

	private List< Collider > SpawnPieces () {
		List< Collider > list = new List< Collider > ();
		
		foreach ( GameObject o in pieces ) {
			GameObject newObj = (GameObject)Instantiate ( o );
			BoxCollider col = newObj.GetComponent<BoxCollider>();
			float randScale = Random.Range ( 0.25f, 1f );
			Bounds bounds = this.collider.bounds;

			newObj.transform.parent = this.transform;
			newObj.transform.position = new Vector3 (
					Random.Range ( bounds.min.x, bounds.max.x ),
					Random.Range ( bounds.min.y, bounds.max.y ),
					Random.Range ( bounds.min.z, bounds.max.z ) );
			newObj.transform.localScale = new Vector3 ( randScale, randScale, randScale );

			list.Add ( col );
		}

		return list;
	}

	public void Explode ( Vector3 position, float force, float radius ) {
		if ( destroyed ) { return; }
		
		List< Collider > colliders = SpawnPieces ();

		foreach ( Collider col in colliders ) {
			col.rigidbody.AddExplosionForce ( force, position, radius, 1 );
		}

		destroyed = true;

		Destroy ( this.gameObject );
	}
	
	public void Explode ( float force, float radius ) {
		Explode ( this.transform.position, force, radius );
	}
}
