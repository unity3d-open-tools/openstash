using UnityEngine;
using System.Collections;

public class OSMelee : MonoBehaviour {
	[HideInInspector] public OSItem item;
	[HideInInspector] public int damageIndex;
	[HideInInspector] public int firingRateIndex;
	[HideInInspector] public int rangeIndex;
	[HideInInspector] public int firingSoundIndex;
	[HideInInspector] public int equippingSoundIndex;
	[HideInInspector] public int holsteringSoundIndex;
	[HideInInspector] public int equippingAnimationIndex;
	[HideInInspector] public int holsteringAnimationIndex;
	[HideInInspector] public int firingAnimationIndex;
	
	public bool aimWithMainCamera = true;
	public GameObject wielder;

	private float fireTimer = 0;
	private OSInventory inventory;

	public void SetInventory ( OSInventory inventory ) {
		this.inventory = inventory;
	}

	public float damage {
		get { return item.attributes [damageIndex].value; }
	}

	public float firingRate {
		get { return item.attributes [firingRateIndex].value; }
	}
	
	public float range {
		get { return item.attributes [rangeIndex].value; }
	}
	
	public AudioClip firingSound {
		get { return item.sounds [firingSoundIndex]; }
	}
	
	public AudioClip equippingSound {
		get { return item.sounds [equippingSoundIndex]; }
	}
	
	public AudioClip holsteringSound {
		get { return item.sounds[holsteringSoundIndex]; }
	}

	public void Fire () {
		if ( fireTimer > 0 ) { return; }

		RaycastHit hit = new RaycastHit();
		Ray ray = new Ray();

		item.PlayAnimation ( firingAnimationIndex );

		if ( aimWithMainCamera ) {
			ray = new Ray ( Camera.main.transform.position, Camera.main.transform.forward );

		} else {
			Vector3 here = wielder.transform.position;
			here.y = this.transform.position.y;

			ray = new Ray ( here, wielder.transform.forward );

		}

		int tempLayer = wielder.layer;

		wielder.layer = 2;

		if ( Physics.Raycast ( ray, out hit, range ) ) {
			if ( hit.collider.gameObject == this.gameObject ) {
				ray = new Ray ( hit.point, ray.direction );
				
				Physics.Raycast ( ray, out hit, range );

			}

			hit.collider.gameObject.SendMessage ( "OnMeleeHit", this, SendMessageOptions.DontRequireReceiver );
		}

		wielder.layer = tempLayer;
		
		fireTimer = 1 / firingRate;

		item.PlaySound ( firingSoundIndex, true );
	}

	public void Update () {
		if ( !item ) {
			item = this.GetComponent< OSItem > ();
			return;
		}

		if ( fireTimer > 0 ) {
			fireTimer -= Time.deltaTime;
		}
	}	
}
