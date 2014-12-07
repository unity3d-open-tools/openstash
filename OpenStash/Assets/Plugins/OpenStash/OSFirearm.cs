using UnityEngine;
using System.Collections;

public class OSFirearm : MonoBehaviour {
	[HideInInspector] public OSItem item;
	[HideInInspector] public int accuracyIndex;
	[HideInInspector] public int damageIndex;
	[HideInInspector] public int firingRateIndex;
	[HideInInspector] public int reloadSpeedIndex;
	[HideInInspector] public int rangeIndex;
	[HideInInspector] public int capacityIndex;
	[HideInInspector] public int firingSoundIndex;
	[HideInInspector] public int emptySoundIndex;
	[HideInInspector] public int reloadSoundIndex;
	[HideInInspector] public int equippingSoundIndex;
	[HideInInspector] public int holsteringSoundIndex;
	[HideInInspector] public int equippingAnimationIndex;
	[HideInInspector] public int holsteringAnimationIndex;
	[HideInInspector] public int firingAnimationIndex;
	[HideInInspector] public int reloadingAnimationIndex;
	
	public GameObject muzzleFlash;
	public float muzzleFlashDuration = 0.05f;
	public OSProjectileType projectileType;
	public float projectileTypeThreshold = 1.0f;
	public bool aimWithMainCamera = true;
	public GameObject wielder;

	private float fireTimer = 0;
	private float flashTimer = 0;
	private OSInventory inventory;
	private OSProjectile bullet;

	public void SetInventory ( OSInventory inventory ) {
		this.inventory = inventory;
	}

	public float accuracy {
		get { return item.attributes [accuracyIndex].value; }
	}
	
	public float damage {
		get { return item.attributes[damageIndex].value; }
	}

	public float firingRate {
		get { return item.attributes[firingRateIndex].value; }
	}
	
	public float range {
		get { return item.attributes[rangeIndex].value; }
	}
	
	public float capacity {
		get { return item.attributes[capacityIndex].value; }
	}

	public AudioClip firingSound {
		get { return item.sounds[firingSoundIndex]; }
	}
	
	public AudioClip emptySound {
		get { return item.sounds[emptySoundIndex]; }
	}

	public float reloadSpeed {
		get { return item.attributes[reloadSpeedIndex].value; }
	}
	
	public AudioClip reloadSound {
		get { return item.sounds[reloadSoundIndex]; }
	}

	public AudioClip equippingSound {
		get { return item.sounds[equippingSoundIndex]; }
	}
	
	public AudioClip holsteringSound {
		get { return item.sounds[holsteringSoundIndex]; }
	}

	private Vector3 ScatterDirection ( Vector3 dir, float acc ) {
		float y = Random.Range ( acc - 100f, 100f - acc ) * 0.1f;
		float x = Random.Range ( acc - 100f, 100f - acc ) * 0.1f;
		return Quaternion.Euler ( 0, y, x ) * dir;
	}

	public void Reload () {
		int amount = 0;
		
		if ( item.ammunition.value >= capacity ) {
			amount = (int)capacity;
		
		} else {
			amount = item.ammunition.value;

		}

		if ( item.ammunition.clip > 0 ) {
			amount -= item.ammunition.clip;
		}

		item.ammunition.clip = amount;
		item.ammunition.value -= amount;
	}

	public void Fire () {
		if ( fireTimer > 0 ) { return; }

		fireTimer = 1 / firingRate;
		
		if ( item.ammunition.clip > 0 || item.ammunition.max <= 0 || !item.ammunition.enabled ) {
			flashTimer = muzzleFlashDuration;

			Ray ray;
			Vector3 pos;

			if ( muzzleFlash ) {
				pos = muzzleFlash.transform.position;
			
			} else {
				pos = this.transform.position;
			
			}

			item.PlayAnimation ( firingAnimationIndex );

			if ( aimWithMainCamera ) {
				ray = new Ray ( Camera.main.transform.position, Camera.main.transform.forward );

			} else {
				ray = new Ray ( pos, this.transform.forward );

			}

			Vector3 perfectDir = ray.direction;
			float acc = accuracy;
			
			if ( projectileType == OSProjectileType.Prefab && bullet ) {
				for ( int i = 0; i < item.ammunition.spread; i++ ) {
					ray.direction = ScatterDirection ( perfectDir, acc );

					OSProjectile.Fire ( bullet, range, pos, ray, this );
				}
			
			} else if ( projectileType == OSProjectileType.Raycast ) {
				RaycastHit hit = new RaycastHit();

				for ( int i = 0; i < item.ammunition.spread; i++ ) {
					ray.direction = ScatterDirection ( perfectDir, acc );

					if ( Physics.Raycast ( ray, out hit, range ) ) {
						hit.collider.gameObject.SendMessage ( "OnProjectileHit", this, SendMessageOptions.DontRequireReceiver );
						
						if ( hit.collider.rigidbody ) {
							hit.collider.rigidbody.AddForce ( ray.direction.normalized * damage * 100 );
						}
					}
				}

			}

			item.PlaySound ( firingSoundIndex );

			item.ammunition.clip -= 1;

			if ( item.ammunition.clip <= 0 ) {
				Reload ();
			}
		
		} else if ( item.ammunition.value > 0 ) {
		       Reload ();
		
		} else {
			item.PlaySound ( emptySoundIndex );

		}
	}

	public void Start () {
		if ( muzzleFlash ) {
			muzzleFlash.SetActive ( false );
		}
	}

	public void Update () {
		if ( !item ) {
			item = this.GetComponent< OSItem > ();
			return;
		}

		if ( !bullet ) {
			bullet = item.ammunition.projectile;
		}

		if ( fireTimer > 0 ) {
			fireTimer -= Time.deltaTime;
		}

		if ( flashTimer > 0 ) {
			flashTimer -= Time.deltaTime;
		}

		if ( muzzleFlash ) {
			if ( flashTimer > 0 && !muzzleFlash.activeSelf ) {
				muzzleFlash.SetActive ( true );

				if ( muzzleFlash.particleSystem ) {
					muzzleFlash.particleSystem.Play ();
				}
			
			} else if ( flashTimer <= 0 && muzzleFlash.activeSelf ) {
				muzzleFlash.SetActive ( false );

			}
		}

		if ( projectileTypeThreshold > 0 ) {
			if ( Time.timeScale >= projectileTypeThreshold ) {
				projectileType = OSProjectileType.Raycast;
			
			} else if ( bullet ) {
				projectileType = OSProjectileType.Prefab;
			
			}
		}
	}	
}
