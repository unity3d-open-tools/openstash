#pragma strict

public class OSAttributeDefinition {
	public var id : String = "newAttribute";
	public var name : String = "New Attribute";
	public var suffix : String = "points";
}

public class OSCategory {
	public var id : String = "NewType";
	public var subcategories : String[] = new String[0];
	
	public function GetSubcategoryIndex ( id : String ) : int {
		for ( var i : int = 0; i < subcategories.Length; i++ ) {
			if ( subcategories[i] && subcategories[i] == id ) {
				return i;
			}
		}
		
		return 0;
	}
}

public class OSDefinitions extends MonoBehaviour {
	public var categories : OSCategory[] = new OSCategory [0];
	public var attributes : OSAttributeDefinition [] = new OSAttributeDefinition [0];

	public function GetAttributeStrings () : String [] {
		var output : String [] = new String [ attributes.Length ];

		for ( var i : int = 0; i < attributes.Length; i++ ) {
			output[i] = attributes[i].id; 
		}

		return output;
	}
	
	public function GetCategoryIndex ( id : String ) : int {
		for ( var i : int = 0; i < categories.Length; i++ ) {
			if ( categories[i] && categories[i].id == id ) {
				return i;
			}
		}
		
		return 0;
	}

	public function GetCategoryStrings () : String [] {
		var strings : String[] = new String [ categories.Length ];

		for ( var i : int = 0; i < categories.Length; i++ ) {
			strings[i] = categories[i].id;
		}

		return strings;
	}
}
