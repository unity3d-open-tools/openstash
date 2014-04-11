#pragma strict

public class OSItem extends MonoBehaviour {
	public var id : String = "New Item";
	public var description : String = "This is a new item";
	public var catIndex : int;
	public var subcatIndex : int;
	public var slotWidth : int = 1;
	public var slotHeight : int = 1;
	public var attributes : OSAttribute[] = new OSAttribute[0];
	public var thumbnail : Texture2D;
	public var preview : Texture2D;

	public function get category () : OSCategory {
		var inventory : OSInventory = OSInventory.GetInstance ();

		if ( inventory ) {
			return inventory.categories [ catIndex ];
		} else {
			return null;
		}
	}
	
	public function get subcategory () : String {
		var inventory : OSInventory = OSInventory.GetInstance ();

		if ( inventory ) {
			return inventory.categories [ catIndex ].subcategories [ subcatIndex ];
		} else {
			return "NULL";
		}
	}

	public function GetAttribute ( attribute : String ) : OSAttribute {
		for ( var i : int = 0; i < attributes.Length; i++ ) {
			if ( attributes[i].key == attribute ) {
				return attributes[i];
			}
		}

		return null;
	}
}
