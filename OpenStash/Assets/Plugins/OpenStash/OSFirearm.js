#pragma strict

public class OSFirearm extends MonoBehaviour {
	@HideInInspector public var item : OSItem;
	@HideInInspector public var accuracyIndex : int;
	@HideInInspector public var damageIndex : int;
	@HideInInspector public var firingRateIndex : int;
	@HideInInspector public var reloadSpeedIndex : int;
	@HideInInspector public var rangeIndex : int;
	@HideInInspector public var capacityIndex : int;
	@HideInInspector public var firingSoundIndex : int;
	@HideInInspector public var emptySoundIndex : int;
	@HideInInspector public var reloadSoundIndex : int;
	@HideInInspector public var equippingSoundIndex : int;
	@HideInInspector public var holsteringSoundIndex : int;
	@HideInInspector public var equippingAnimationIndex : int;
	@HideInInspector public var holsteringAnimationIndex : int;
	@HideInInspector public var firingAnimationIndex : int;
	@HideInInspector public var reloadingAnimationIndex : int;
	
	public var muzzleFlash : GameObject;
	public var muzzleFlashDuration : float = 0.05;
	public var projectileType : OSProjectileType;
	public var projectileTypeThreshold : float = 1.0;
	public var aimWithMainCamera : boolean = true;
	public var wielder : GameObject;

	private var fireTimer : float = 0;
	private var flashTimer : float = 0;
	private var inventory : OSInventory;
	private var bullet : OSProjectile;

	public function SetInventory ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	public function get accuracy () : float {
		return item.attributes[accuracyIndex].value;
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
	
	public function get capacity () : float {
		return item.attributes[capacityIndex].value;
	}

	public function get firingSound () : AudioClip {
		return item.sounds[firingSoundIndex];
	}
	
	public function get emptySound () : AudioClip {
		return item.sounds[emptySoundIndex];
	}

	public function get reloadSpeed () : float {
		return item.attributes[reloadSpeedIndex].value;
	}
	
	public function get reloadSound () : AudioClip {
		return item.sounds[reloadSoundIndex];
	}

	public function get equippingSound () : AudioClip {
		return item.sounds[equippingSoundIndex];
	}
	
	public function get holsteringSound () : AudioClip {
		return item.sounds[holsteringSoundIndex];
	}

	private function ScatterDirection ( dir : Vector3, acc : float ) : Vector3 {
		var y : float = Random.Range ( acc - 100, 100 - acc ) * 0.1;
		var x : float = Random.Range ( acc - 100, 100 - acc ) * 0.1;
		return Quaternion.Euler ( 0, y, x ) * dir;
	}

	public function Reload () {
		var amount : float = 0;
		
		if ( item.ammunition.value >= capacity ) {
			amount = capacity;
		
		} else {
			amount = item.ammunition.value;

		}

		if ( item.ammunition.clip > 0 ) {
			amount -= item.ammunition.clip;
		}

		item.ammunition.clip = amount;
		item.ammunition.value -= amount;
	}

	public function Fire () {
		if ( fireTimer > 0 ) { return; }

		fireTimer = 1 / firingRate;
		
		if ( item.ammunition.clip > 0 || item.ammunition.max <= 0 || !item.ammunition.enabled ) {
			flashTimer = muzzleFlashDuration;

			var ray : Ray;
			var pos : Vector3;

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

			var perfectDir : Vector3 = ray.direction;
			var acc : float = accuracy;
			
			if ( projectileType == OSProjectileType.Prefab && bullet ) {
				for ( var i : int = 0; i < item.ammunition.spread; i++ ) {
					ray.direction = ScatterDirection ( perfectDir, acc );

					OSProjectile.Fire ( bullet, range, pos, ray, this );
				}
			
			} else if ( projectileType == OSProjectileType.Raycast ) {
				var hit : RaycastHit;

				for ( i = 0; i < item.ammunition.spread; i++ ) {
					ray.direction = ScatterDirection ( perfectDir, acc );

					if ( Physics.Raycast ( ray, hit, range ) ) {
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

	public function Start () {
		if ( muzzleFlash ) {
			muzzleFlash.SetActive ( false );
		}
	}

	public function Update () {
		if ( !item ) {
			item = this.GetComponent.< OSItem > ();
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
