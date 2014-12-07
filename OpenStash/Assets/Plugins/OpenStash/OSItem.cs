using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[System.Serializable]
public class OSAmmunitionAmount {
	public bool enabled = false;
	public int index = 0;
	public int value = 0;
	public int clip = 0;
	public int max = 100;
	public int spread = 1;
	public OSItem item;

	public OSAmmunitionAmount ( OSItem item ) {
		this.item = item;
	}

	public string name {
		get { return item.definitions.ammunitions [index].name; }
	}
	
	public Texture2D image {
		get { return item.definitions.ammunitions[index].image; }
	}
	
	public OSProjectile projectile {
		get { return item.definitions.ammunitions[index].projectile; }
	}
}

[System.Serializable]
public class OSAttribute {
	public int index = 0;
	public float value = 0;
	public OSDefinitions definitions;

	public OSAttribute ( OSDefinitions definitions ) {
		this.definitions = definitions;
	}

	public string name {
		get { return definitions.attributes[index].name; }
	}
	
	public string suffix {
		get { return definitions.attributes[index].suffix; }
	}
}

public class OSItem : MonoBehaviour {
	public string id = "New Item";
	public string description = "This is a new item";
	public bool stackable = false;
	public bool canDrop = true;
	public int catIndex;
	public int subcatIndex;
	public OSPoint slotSize = new OSPoint ( 1, 1 );
	public OSAttribute[] attributes = new OSAttribute[0];
	public OSAmmunitionAmount ammunition = null; 
	public Texture2D thumbnail;
	public Texture2D preview;
	public string prefabPath;
	public OSDefinitions definitions;
	public AudioClip[] sounds = new AudioClip [0];

	private List< AnimationState > animationStates = new List< AnimationState > ();

	public string category {
		get { return definitions.categories [ catIndex ].id; }
	}
	
	public string subcategory {
		get { return definitions.categories [catIndex].subcategories [subcatIndex]; }
	}

	public int layer {
		get { return this.gameObject.layer; }
		set {
			this.gameObject.layer = value;
			
			foreach ( Transform t in this.gameObject.GetComponentsInChildren< Transform > () ) {
				t.gameObject.layer = value;
			}	
		}
	}

	public void Start () {
		if (ammunition == null) {
			ammunition = new OSAmmunitionAmount (this);
		}
	}

	public AudioClip GetSound ( string id ) {
		for ( int i = 0; i < sounds.Length; i++ ) {
			if ( sounds[i] && sounds[i].name == id ) {
				return sounds[i];
			}
		}

		return null;
	}

	public OSAttribute[] GetAttributes() {
		for (int i = 0; i < attributes.Length; i++) {
			attributes[i].definitions = definitions;
		}

		return attributes;
	}

	public string[] GetSoundStrings () {
		string[] output = new string [ sounds.Length ];
		
		for ( int i = 0; i < sounds.Length; i++ ) {
			output[i] = ( sounds[i] == null ) ? "(none)" : sounds[i].name;
		}

		return output;
	}

	public void PlayAnimation ( string id ) {
		if ( animation ) {
			animation.Play ( id );
		}
	}
	
	public void PlayAnimation ( int index ) {
		if ( animation && animationStates.Count > index ) {
			PlayAnimation ( animationStates [ index ].name );
		}
	}

	private IEnumerator SignalNeighbors (float delay) {
		yield return new WaitForSeconds ( delay );
		
		Collider[] colliders = Physics.OverlapSphere ( transform.position, audio.maxDistance );
		
		foreach ( Collider c in colliders ) {
			if ( c.gameObject != this.gameObject ) {
				c.gameObject.SendMessage ( "OnHeardSound", this.gameObject, SendMessageOptions.DontRequireReceiver );
			}
		}
	}

	private void SignalNeighbors () {
		StartCoroutine (SignalNeighbors (0.5f));
	}

	public void PlaySound ( string id ) {
		PlaySound ( id, false );
	}

	public void PlaySound ( string id, bool inaudible ) {
		if ( !audio ) {
			this.gameObject.AddComponent< AudioSource > ();
		}

		audio.clip = GetSound ( id );
		audio.Play ();

		if ( !inaudible ) {
			SignalNeighbors ();
		}
	}

	public void PlaySound ( int index ) {
		PlaySound ( index, false );
	}

	public void PlaySound ( int index, bool inaudible ) {
		if ( !audio ) {
			this.gameObject.AddComponent< AudioSource > ();
		}

		audio.clip = sounds[index];
		audio.Play ();
		
		if ( !inaudible ) {
			SignalNeighbors ();
		}
	}

	public void ChangeAmmunition ( int value ) {
		ammunition.value = Mathf.Clamp ( 0, ammunition.max, ammunition.value + value );
	}

	public void SetAmunition ( int value ) {
		ammunition.value = Mathf.Clamp ( 0, ammunition.max, value );
	}

	public float GetAttribute ( string name ) {
		for ( int i = 0; i < attributes.Length; i++ ) {
			if ( attributes[i].name == name ) {
				return attributes[i].value;
			}
		}

		return -1;
	}
	
	public string [] GetAttributeStrings () {
		string[] output = new string [ attributes.Length ];

		for ( int i = 0; i < attributes.Length; i++ ) {
			output[i] = attributes[i].name; 
		}

		return output;
	}

	public void AdoptValues ( OSItem item ) {
		this.ammunition.value = item.ammunition.value;

		for ( int i = 0; i < item.attributes.Length; i++ ) {
			this.attributes[i].value = item.attributes[i].value;
		}
	}

	public static OSItem ConvertFromScene ( OSItem item ) {
		return (OSItem) Resources.Load ( item.prefabPath );
	}
	
	public void Awake () {
		if ( animation ) {
			foreach ( AnimationState state in animation ) {
				animationStates.Add ( state );
			}
		}
	}
}
