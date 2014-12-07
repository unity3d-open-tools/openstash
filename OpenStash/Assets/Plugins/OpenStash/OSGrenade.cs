using UnityEngine;
using System.Collections;

public class OSGrenade : MonoBehaviour {
	public enum ExplodeTrigger {
		None,
		Timed,
		OnCollision
	}

	[HideInInspector] public OSItem item;
	
	[HideInInspector] public int firingRateIndex = 0;
	[HideInInspector] public int damageIndex = 0;
	[HideInInspector] public int rangeIndex = 0;
	
	[HideInInspector] public int equippingSoundIndex = 0;
	[HideInInspector] public int explodingSoundIndex = 0;
	[HideInInspector] public int holsteringSoundIndex = 0;
	[HideInInspector] public int throwingSoundIndex = 0;

	public float countdown = 5;
	public ExplodeTrigger trigger;
	public bool armed = false;
	public bool sticky = false;
	public GameObject explosion;
	public float explosionLifetime = 5;
	public float throwingForce = 20;

	private bool thrown = false;
	private bool exploded = false;
	private OSInventory inventory;
	private Bezier bezier;
	private float bezierTimer;
	private float distance;
	private Vector3 startNormal;
	private Vector3 endNormal;
	private RaycastHit hit;
	private LineRenderer lineRenderer;
	
	public float range {
		get { return item.attributes [rangeIndex].value; }
	}
	
	public float damage {
		get { return item.attributes[damageIndex].value; }
	}

	public void SetInventory ( OSInventory inventory ) {
		this.inventory = inventory;
	}

	public void Throw () {
		if ( bezier == null || thrown ) { return; }
		
		this.transform.parent = this.transform.root.parent;
		
		thrown = true;
		
		if ( collider ) {
			collider.enabled = true;
		}
		
		startNormal = this.transform.up;

		if ( lineRenderer ) {
			lineRenderer.enabled = false;
		}

		if ( inventory ) {
			inventory.DecreaseItem ( this.GetComponent< OSItem > () );
		}
	}

	public void Aim ( Vector3 pos, Vector3 dir ) {
		if ( thrown ) { return; }

		RaycastHit hit = new RaycastHit ();

		if ( Physics.Raycast ( pos, dir, out hit, range ) ) {
			endNormal = hit.normal;
			bezier = new Bezier ( this.transform.position, dir, Vector3.up, hit.point );
		
		} else if ( Physics.Raycast ( pos + dir * range, Vector3.down, out hit, Mathf.Infinity ) ) {
			endNormal = hit.normal;
			bezier = new Bezier ( this.transform.position, dir, Vector3.up, hit.point );
		
		}

		if ( lineRenderer  != null && bezier != null ) {
			lineRenderer.SetVertexCount ( 32 );
			
			for ( int i = 0; i < 32; i++ ) {
				float time = ( i * 1.0f ) * ( 1.0f / 32f );

				lineRenderer.SetPosition ( i, bezier.GetPointAtTime ( time ) );
			}
		}

		distance = Vector3.Distance ( pos, hit.point ); 
	}

	public void Explode () {
		if ( !exploded && explosion ) {
			explosion.SetActive ( true );
			
			if ( explosion.activeInHierarchy ) {
				explosion.transform.parent = this.transform.parent;
				explosion.transform.position = this.transform.position;
			
			} else {
				explosion = (GameObject) Instantiate ( explosion );
				explosion.transform.parent = this.transform.parent;
				explosion.transform.position = this.transform.position;
		
			}
			
		}

		exploded = true;
	}

	public void OnCollisionEnter () {
		if ( armed && trigger == ExplodeTrigger.OnCollision ) {
			Explode ();
		}
	}

	public void Start () {
		lineRenderer = this.GetComponent< LineRenderer > ();

		if ( explosion ) {
			explosion.SetActive ( false );
		}
	}

	public void Update () {
		if ( exploded ) {
			if ( renderer ) {
				renderer.enabled = false;
			}
			
			if ( explosionLifetime <= 0 ) {
				Destroy ( this.gameObject );
				Destroy ( explosion );

			} else {
				explosionLifetime -= Time.deltaTime;

			}
		
		} else if ( armed ) {
			if ( trigger == ExplodeTrigger.Timed ) {
				Explode ();
			}
		
		} else if ( thrown ) {
			if ( bezierTimer > 1 ) {
				bezierTimer = 1;
			}

			if ( sticky ) {
				this.transform.up = Vector3.Lerp ( startNormal, endNormal, bezierTimer );
			
			}

			int revolutions = Mathf.RoundToInt ( ( distance * 2 ) / throwingForce );

			this.transform.localEulerAngles -= new Vector3 ( 0, 0, 360 * revolutions ) * bezierTimer;

			if ( countdown <= 0 ) {
				armed = true;
			
			} else {
				countdown -= Time.deltaTime;
			
			}

			if ( bezierTimer >= 1 ) {
				if ( !sticky && rigidbody ) {	
					rigidbody.useGravity = true;
					rigidbody.isKinematic = false;
				}
			
			} else {
				this.transform.position = bezier.GetPointAtTime ( bezierTimer );
				
				bezierTimer += Time.deltaTime * ( throwingForce / distance );

			}

		}
	}
}
