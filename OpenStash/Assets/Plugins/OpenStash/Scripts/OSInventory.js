#pragma strict

import System.Collections.Generic;

public class OSAttributeDefinition {
	public var id : String = "newAttribute";
	public var name : String = "New Attribute";
	public var suffix : String = "points";
}

public class OSAmmunition {
	public var enabled : boolean = true;
	public var name : String = "Bullets";
	public var value : float = 0;
}

public class OSAttribute {
	public var keyIndex : int = 0;
	public var value : float = 0;
	
	public function get id () : String {
		var inventory = OSInventory.GetInstance();
		
		if ( inventory ) {
			return inventory.attributes[keyIndex].id;
		} else {
			return "NULL";
		}
	}

	public function get name () : String {
		var inventory = OSInventory.GetInstance();
		
		if ( inventory ) {
			return inventory.attributes[keyIndex].name;
		} else {
			return "NULL";
		}
	}
	
	public function get suffix () : String {
		var inventory = OSInventory.GetInstance();
		
		if ( inventory ) {
			return inventory.attributes[keyIndex].suffix;
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

	private var inventory : OSInventory;
	
	function OSGrid ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	function OSGrid ( inventory : OSInventory, width : int, height : int ) {
		this.width = width;
		this.height = height;
	}

	public function Move ( slot : OSSlot, x : int, y : int ) {
		if ( !slot.item ) { return; }
		
		if ( CheckSlot ( x, y, slot.item ) ) {
			slot.x = x;
			slot.y = y;
		}
	}

	public function GetSkippedSlots () : boolean [ , ] {
		return GetSkippedSlots ( null );
	}

	public function GetSkippedSlots ( except : OSItem ) : boolean [ , ] { 
		if ( !inventory ) {
			inventory = OSInventory.GetInstance ();
		}
		
		var skip : boolean [ , ] = new boolean [ width, height ];

		for ( var x : int = 0; x < width; x++ ) {
			for ( var y : int = 0; y < height; y++ ) {
				var slot : OSSlot = inventory.GetSlot ( x, y );

				if ( !slot || slot.hidden || ( slot.item != null && slot.item == except ) ) { continue; }
				
				for ( var sx : int = 0; sx < slot.scale.x; sx++ ) {
					for ( var sy : int = 0; sy < slot.scale.y; sy++ ) {
						if ( ( sx == 0 && sy == 0 ) || x + sx >= width || y + sy >= height ) {
							continue;
						} else {
							skip [ x + sx, y + sy ] = true;
						}
					}
				}
			}
		}

		return skip;
	}

	public function CheckSlot ( x : int, y : int, item : OSItem ) : boolean {
		if ( x < 0 || y < 0 ) {
			return false;
		}
		
		var skip : boolean [ , ] = GetSkippedSlots ( item );
		
		for ( var sx : int = 0; sx < item.slotSize.x; sx++ ) {
			for ( var sy : int = 0; sy < item.slotSize.y; sy++ ) {
				var slot : OSSlot = inventory.GetSlot ( x + sx, y + sy );

				if ( ( x + sx < skip.GetLength(0) && y + sy < skip.GetLength(1) && skip [ x + sx, y + sy ] ) || ( slot && !slot.hidden && slot.item != null && slot.item != item ) || x + sx >= width || y + sy >= height ) {
					return false;
				}
			}
		}

		return true;
	}

	public function GetAvailableSlot ( item : OSItem ) : OSPoint {
		if ( !inventory ) {
			inventory = OSInventory.GetInstance ();
		}
		
		var skip : boolean [ , ] = GetSkippedSlots ();

		for ( var y : int = 0; y < height; y++ ) {
			for ( var x : int = 0; x < width; x++ ) {
				var cancel : boolean = false;
				var point : OSPoint = new OSPoint ( x, y );

				for ( var sx : int = 0; sx < item.slotSize.x; sx++ ) {
					for ( var sy : int = 0; sy < item.slotSize.y; sy++ ) {
						var slot : OSSlot = inventory.GetSlot ( x + sx, y + sy );

						if ( slot && !slot.hidden && slot.item != null || x + sx >= width || y + sy >= height || skip [ x + sx, y + sy ] ) {
							cancel = true;
						}
					}
				}
				
				if ( cancel ) {
					continue;

				} else {
					return point;

				}
			}
		}

		return null;
	}
}

public class OSPoint {
	public var x : int = 0;
	public var y : int = 0;

	function OSPoint ( x : int, y : int ) {
		this.x = x;
		this.y = y;
	}

	function OSPoint ( str : String, sep : char, reverse : boolean ) {
		var strings : String[] = str.Split ( sep );

		if ( !reverse ) {
			this.x = int.Parse ( strings[0] );
			this.y = int.Parse ( strings[1] );
		} else {
			this.y = int.Parse ( strings[0] );
			this.x = int.Parse ( strings[1] );
		}
	}

	public static function IsNullOrNegative ( p : OSPoint ) {
		return ( p == null || p.x < 0 || p.y < 0 );
	}
}

public class OSSlot {
	public var item : OSItem;
	public var x : int = 0;
	public var y : int = 0;
	public var quantity : int = 1;
	public var hidden : boolean = false;

	function OSSlot () {

	}

	function OSSlot ( x : int, y : int, item : OSItem ) {
		this.x = x;
		this.y = y;
		this.item = item;
	}
	
	function get scale () : OSPoint {
		if ( item ) {
			return item.slotSize;

		} else {
			return new OSPoint ( 1, 1 );
		
		}
	}
}

public class OSInventory extends MonoBehaviour {
	public var categories : OSCategory[] = new OSCategory [0];
	public var attributes : OSAttributeDefinition [];
	public var slots : List.< OSSlot > = new List.< OSSlot >();
	public var grid : OSGrid = new OSGrid ( this, 5, 3 );

	public static var instance : OSInventory;

	public static function GetInstance () : OSInventory {
		return instance;
	}

	// Init
	public function Start () {
		instance = this;
	}

	// Get data
	public function GetItemIndex ( item : OSItem ) : int {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				return i;
			}
		}
		
		return -1;
	}
	
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

	public function GetSlot ( x : int, y : int ) : OSSlot {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i];
			}
		}

		return null;
	}

	// Get/set items
	public function RemoveItem ( item : OSItem ) {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				slots.RemoveAt ( i );
			}
		}
	}
	
	public function AddItem ( item : OSItem ) : boolean {
		if ( !item ) { return false; }
		
		// Check if similar item is already in the inventory
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
			       	if ( item.stackable ) {
					slots[i].quantity++;
				
				} else if ( item.ammunition.enabled ) {
					slots[i].item.ChangeAmmunition ( item.ammunition.value );
				
				}
				
				return true;
			}
		}
		
		// If not, search for available slots
		var availableSlot : OSPoint = new OSPoint ( -1, -1 );

		availableSlot = grid.GetAvailableSlot ( item );

		if ( OSPoint.IsNullOrNegative ( availableSlot ) ) {
			return false;

		} else {
			slots.Add ( new OSSlot ( availableSlot.x, availableSlot.y, item ) );
			return true;

		}
	}
	
	public function GetItem ( x : int, y : int ) : OSItem {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i].item;
			}
		}

		return null;
	}
}
