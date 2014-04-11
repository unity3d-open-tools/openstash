#pragma strict

import System.Collections.Generic;

public class OSAttribute {
	public var keyIndex : int = 0;
	public var value : float = 0;
	
	public function get key () : String {
		var inventory = OSInventory.GetInstance();
		
		if ( inventory ) {
			return inventory.attributes[keyIndex];
		} else {
			return "NULL";
		}
	}
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

public class OSGrid {
	public var width : int = 1;
	public var height : int = 1;
}

public class OSPoint {
	public var x : int = 0;
	public var y : int = 0;

	function OSPoint ( x : int, y : int ) {
		this.x = x;
		this.y = y;
	}
}

public class OSSlot {
	public var item : OSItem;
	public var x : int = 0;
	public var y : int = 0;
	public var quantity : int = 1;

	function OSSlot () {

	}

	function OSSlot ( x : int, y : int, item : OSItem ) {
		this.x = x;
		this.y = y;
		this.item = item;
	}
}

public class OSInventory extends MonoBehaviour {
	public var categories : OSCategory[] = new OSCategory [0];
	public var attributes : String [];
	public var slots : List.< OSSlot > = new List.< OSSlot >();
	public var grid : OSGrid = new OSGrid ();

	public static var instance : OSInventory;

	public static function GetInstance () : OSInventory {
		return instance;
	}

	// Init
	public function Start () {
		instance = this;
	}

	// Sorting functions
	public function SortAttributes () {
		//attributes.OrderBy ();
	}

	// Get data
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

	// Get/set items
	public function GetItem ( x : int, y : int ) : OSItem {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i].item;
			}
		}

		return null;
	}

	public function SetItem ( x : int, y : int, item : OSItem ) {
		if ( !item ) { return; }
		
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				slots[i].x = x;
				slots[i].y = y;
				return;
			}
		}

		slots.Add ( new OSSlot ( x, y, item ) );
	}
}
