#pragma strict

public class OSItem extends MonoBehaviour {
	public var id : String = "New Item";
	public var description : String = "This is a new item";
	public var stackable : boolean = false;
	public var catIndex : int;
	public var subcatIndex : int;
	public var slotSize : OSPoint = new OSPoint ( 1, 1 );
	public var attributes : OSAttribute[] = new OSAttribute[0];
	public var thumbnail : Texture2D;
	public var preview : Texture2D;

	public function get category () : String {
		var inventory : OSInventory = OSInventory.GetInstance ();

		if ( inventory ) {
			return inventory.categories [ catIndex ].id;
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

	public function SortAttributes () {

	}
}
