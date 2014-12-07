using UnityEngine;
using System.Collections;

[System.Serializable]
public class OSAttributeDefinition {
	public string name = "New Attribute";
	public string suffix = "points";
}

[System.Serializable]
public class OSCurrency {
	public string name;
	public Texture2D image;
}

[System.Serializable]
public class OSAmmunition {
	public bool enabled = true;
	public string name = "Bullets";
	public Texture2D image;
	public OSProjectile projectile;
}

[System.Serializable]
public class OSCategory {
	public string id = "NewType";
	public string[] subcategories = new string[0];
	
	public int GetSubcategoryIndex ( string id ) {
		for ( int i = 0; i < subcategories.Length; i++ ) {
			if ( subcategories[i] != null && subcategories[i] == id ) {
				return i;
			}
		}
		
		return 0;
	}
}

public class OSDefinitions : MonoBehaviour {
	public OSCategory[] categories = new OSCategory [0];
	public OSAttributeDefinition[] attributes = new OSAttributeDefinition [0];
	public OSCurrency[] currencies = new OSCurrency [0];
	public OSAmmunition[] ammunitions = new OSAmmunition [0];
	public string prefabPath = "";

	public string[] GetAttributeStrings () {
		string[] output = new string [ attributes.Length ];

		for ( int i = 0; i < attributes.Length; i++ ) {
			output[i] = attributes[i].name; 
		}

		return output;
	}
	
	public int GetCategoryIndex ( string id ) {
		for ( int i = 0; i < categories.Length; i++ ) {
			if ( categories[i] != null && categories[i].id == id ) {
				return i;
			}
		}
		
		return 0;
	}
	
	public string [] GetAmmunitionStrings () {
		string[] strings = new string [ ammunitions.Length ];

		for ( int i = 0; i < ammunitions.Length; i++ ) {
			strings[i] = ammunitions[i].name;
		}

		return strings;
	}
	
	public string [] GetCurrencyStrings () {
		string[] strings = new string [ currencies.Length ];

		for ( int i = 0; i < currencies.Length; i++ ) {
			strings[i] = currencies[i].name;
		}

		return strings;
	}

	public string [] GetCategoryStrings () {
		string[] strings = new string [ categories.Length ];

		for ( int i = 0; i < categories.Length; i++ ) {
			strings[i] = categories[i].id;
		}

		return strings;
	}
	
	public string [] GetSubcategoryStrings ( int catIndex ) {
		string[] strings = new string [ categories[catIndex].subcategories.Length ];

		for ( int i = 0; i < categories[catIndex].subcategories.Length; i++ ) {
			strings[i] = categories[catIndex].subcategories[i];
		}

		return strings;
	}
}
