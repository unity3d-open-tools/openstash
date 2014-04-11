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

public class OSInventory extends MonoBehaviour {
	public var categories : OSCategory[] = new OSCategory [0];
	public var attributes : String [];
	public var items : OSItem[] = new OSItem[0];
	public var grid : OSGrid = new OSGrid ( 0, 0 );

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

	public function AddItem ( item : OSItem ) {
		var tmp : List.< OSItem > = new List.< OSItem > ( items );

		tmp.Add ( item );

		items = tmp.ToArray ();
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

	// Set items
	public function SetSlot ( x : int, y : int, item : OSItem ) {
		var index : int = -1;
		
		for ( var i : int = 0; i < items.Length; i++ ) {
			if ( items[i] == item ) {
				index = i;
			}
		}

		if ( index < 0 ) {
			AddItem ( item );
			index = items.Length - 1;
		}

		items [ index ] = item;
		grid.SetSlot ( x, y, index );
	}

	// Get items
	public function GetSlot ( i : int ) : OSItem {
		if ( i >= items.Length ) {
			return null;

		} else {
			return items [ i ];			

		}
	}
	
	public function GetSlot ( x : int, y : int ) : OSItem {
		var i : int = grid.GetSlot ( x, y );

		if ( i >= items.Length ) {
			return null;

		} else {
			return items [ i ];			

		}
	}
}
