using UnityEngine;
using System.Collections;

using System.Collections.Generic;

[System.Serializable]
public class OSCurrencyAmount {
	public int index = 0;
	public int amount = 0;

	public OSCurrencyAmount ( int index ) {
		this.index = index;
	}
}

[System.Serializable]
public class OSGrid {
	public int width = 1;
	public int height = 1;

	public OSInventory inventory;
	
	public OSGrid ( OSInventory inventory ) {
		this.inventory = inventory;
	}

	public OSGrid ( OSInventory inventory, int width, int height ) {
		this.width = width;
		this.height = height;
	}

	public void Move ( OSSlot slot, int x, int y ) {
		if ( !slot.item ) { return; }
		
		if ( CheckSlot ( x, y, slot.item ) ) {
			slot.x = x;
			slot.y = y;
		}
	}

	public bool [ , ] GetSkippedSlots () {
		return GetSkippedSlots ( null );
	}

	public bool [ , ] GetSkippedSlots ( OSItem except ) { 
		bool [ , ] skip = new bool [ width, height ];

		for ( int x = 0; x < width; x++ ) {
			for ( int y = 0; y < height; y++ ) {
				OSSlot slot = inventory.GetSlot ( x, y );

				if ( slot == null || slot.hidden || ( slot.item != null && slot.item == except ) ) { continue; }
				
				for ( int sx = 0; sx < slot.scale.x; sx++ ) {
					for ( int sy = 0; sy < slot.scale.y; sy++ ) {
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

	public bool CheckSlot ( int x, int y, OSItem item ) {
		if ( x < 0 || y < 0 ) {
			return false;
		}
		
		bool [ , ] skip = GetSkippedSlots ( item );
		
		for ( int sx = 0; sx < item.slotSize.x; sx++ ) {
			for ( int sy = 0; sy < item.slotSize.y; sy++ ) {
				OSSlot slot = inventory.GetSlot ( x + sx, y + sy );

				if ( ( x + sx < skip.GetLength(0) && y + sy < skip.GetLength(1) && skip [ x + sx, y + sy ] ) || ( slot != null && !slot.hidden && slot.item != null && slot.item != item ) || x + sx >= width || y + sy >= height ) {
					return false;
				}
			}
		}

		return true;
	}

	public OSPoint GetAvailableCell ( OSItem item ) {
		bool [ , ] skip = GetSkippedSlots ();

		for ( int y = 0; y < height; y++ ) {
			for ( int x = 0; x < width; x++ ) {
				bool cancel = false;
				OSPoint point = new OSPoint ( x, y );

				for ( int sx = 0; sx < item.slotSize.x; sx++ ) {
					for ( int sy = 0; sy < item.slotSize.y; sy++ ) {
						OSSlot slot = inventory.GetSlot ( x + sx, y + sy );

						if ( slot != null && !slot.hidden && slot.item != null || x + sx >= width || y + sy >= height || skip [ x + sx, y + sy ] ) {
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

[System.Serializable]
public class OSPoint {
	public int x = 0;
	public int y = 0;

	public OSPoint ( int x, int y ) {
		this.x = x;
		this.y = y;
	}

	public OSPoint ( string str, char sep, bool reverse ) {
		string[] strings = str.Split ( sep );

		if ( !reverse ) {
			this.x = int.Parse ( strings[0] );
			this.y = int.Parse ( strings[1] );
		} else {
			this.y = int.Parse ( strings[0] );
			this.x = int.Parse ( strings[1] );
		}
	}

	public static bool IsNullOrNegative ( OSPoint p ) {
		return ( p == null || p.x < 0 || p.y < 0 );
	}
}

[System.Serializable]
public class OSSlot {
	public OSItem item;
	public int x = 0;
	public int y = 0;
	public int quantity = 1;
	public bool hidden = false;
	public bool equipped = false;

	public OSSlot () {

	}

	public OSSlot ( int x, int y, string path ) {
		GameObject go = (GameObject) Resources.Load ( path );
		this.x = x;
		this.y = y;
		this.item = go.GetComponent< OSItem > ();
	}	

	public OSSlot ( int x, int y, OSItem item ) {
		this.x = x;
		this.y = y;
		this.item = item;
	}
	
	public OSPoint scale {
		get {
			if (item) {
				return item.slotSize;

			} else {
				return new OSPoint (1, 1);
	
			}
		}
	}
}

public class OSInventory : MonoBehaviour {
	public OSDefinitions definitions;
	public List< OSSlot > slots = new List< OSSlot >();
	public List< int > quickSlots = new List< int > ();
	public OSGrid grid = null;
	public OSCurrencyAmount[] wallet = new OSCurrencyAmount[0];
	public GameObject eventHandler;

	// Make sure definitions are set
	public void SetDefinitions () {
		foreach ( OSSlot slot in slots ) {
			if ( slot.item ) {
				slot.item.definitions = definitions;

				foreach ( OSAttribute attr in slot.item.attributes ) {
					attr.definitions = definitions;
				}
			}
		}
	}

	// Equipped info
	public OSItem[] GetEquippedItems () {
		List< OSItem > tmpItems = new List< OSItem > ();
		
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].equipped ) {
				tmpItems.Add ( slots[i].item );
			}
		}
		
		return tmpItems.ToArray();
	}

	public bool IsEquippedCategory ( string category ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].item.category == category && slots[i].equipped ) {
				return true;
			}
		}

		return false;
	}

	public bool IsEquipped ( OSItem item ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].item == item && slots[i].equipped ) {
				return true;
			}
		}

		return false;
	}

	public void SetQuickSlotEquipped ( int i ) {
		if ( i < quickSlots.Count && quickSlots[i] < slots.Count ) {
			OSSlot slot = slots [ quickSlots[i] ];

			if ( slot.item ) {
				UnequipAll ();
				SetEquipped ( slot.item );
			}
		}
	}

	public void SetEquipped ( OSItem item ) {
		SetEquipped ( item, true );
	}

	public void SetEquipped ( OSItem item, bool isEquipped ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].item == item ) {
				slots[i].equipped = isEquipped;
				
				if ( eventHandler ) {
					eventHandler.SendMessage ( "OnEquipItem", slots[i].item, SendMessageOptions.DontRequireReceiver );
				}
				
				break;
			}
		}
	}
	
	public void UnequipAll () {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null ) {
				slots[i].equipped = false;
				
				if ( eventHandler ) {
					eventHandler.SendMessage ( "OnUnequipAll", SendMessageOptions.DontRequireReceiver );
				}
			}
		}
	}

	// Quick info
	public void SetQuickItem ( OSItem item, int key ) {
		quickSlots.Insert ( key, GetItemIndex ( item ) );
	}

	public OSItem GetQuickItem ( int index ) {
		if ( index < quickSlots.Count ) {
			return slots[quickSlots[index]].item;
		
		} else {
			return null;
		}
	}

	public void ClearQuickItem ( int index ) {
		quickSlots.RemoveAt ( index );
	}

	public void ClearQuickItems () {
		quickSlots.Clear ();
	}

	// Get data
	public int GetItemIndex ( OSItem item ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				return i;
			}
		}
		
		return -1;
	}
	
	public OSSlot GetSlot ( int x, int y ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i];
			}
		}

		return null;
	}

	// Currency
	public void CheckCurrency ( int index ) {
		List< OSCurrencyAmount > tmpWallet = new List< OSCurrencyAmount > ( wallet );

		for ( int i = 0; i < tmpWallet.Count; i++ ) {
			if ( tmpWallet[i].index == index ) {
				return;
			}
		}

		tmpWallet.Add ( new OSCurrencyAmount ( index ) );

		wallet = tmpWallet.ToArray();
	}
	
	public void ChangeCurrencyAmount ( string id, int amount ) {
		for ( int i = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				wallet[i].amount += amount;
				return;
			}
		}
	}
	
	public void SetCurrencyAmount ( string id, int amount ) {
		for ( int i = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				wallet[i].amount = amount;
				return;
			}
		}
	}
	
	public int GetCurrencyAmount ( string id ) {
		for ( int i = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				return wallet[i].amount;
			}
		}

		return -1;
	}
	
	// Search voids
	public OSItem FindItemByCategory ( string cat, string subcat ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].item ) {
				if ( cat == slots[i].item.category && subcat == slots[i].item.subcategory ) {
					return slots[i].item;
				}
			}
		}

		return null;
	}

	// Get/set items
	public void SpawnSlot ( OSSlot slot, Transform parent, Vector3 position ) {
		if ( !slot.item ) { return; }
	
		for ( int i = 0; i < slot.quantity; i++ ) {	
			GameObject go = (GameObject) Instantiate ( Resources.Load ( slot.item.prefabPath ) );
			Vector3 scale = go.transform.localScale;
			OSItem oldItem = slot.item; 
			OSItem newItem = go.GetComponent< OSItem > ();

			newItem.AdoptValues ( oldItem );

			go.transform.parent = parent;
			go.transform.position = position;
			go.transform.localScale = scale;
		}
	}
	
	public void DecreaseItem ( OSItem item ) {
		OSSlot slot = GetSlot ( item );

		if ( slot != null ) {
			DecreaseSlot ( slot );
		}
	}
	
	public void DecreaseSlot ( OSSlot slot ) {
		slot.quantity--;
		
		if ( slot.quantity < 1 ) {
			RemoveSlot ( slot );
		}
	}

	public void RemoveSlot ( OSSlot slot ) {
		slot.equipped = false;
		slots.Remove ( slot );
	}
	
	public void RemoveItem ( OSItem item ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				slots.RemoveAt ( i );
			}
		}
	}
	
	public bool AddItemFromScene ( OSItem sceneItem ) {
		if ( !sceneItem ) { return false; }
		
		GameObject go = (GameObject) Resources.Load ( sceneItem.prefabPath );

		sceneItem.gameObject.SendMessage ( "OnPickUp", SendMessageOptions.DontRequireReceiver );
		Destroy ( sceneItem.gameObject );

		return AddItem ( go.GetComponent< OSItem > () );
	}

	public bool AddItem ( OSItem item ) {
		if ( !item ) { return false; }
	
		item.definitions = this.definitions;
	
		// Check if similar item is already in the inventory
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i].item.id == item.id ) {
			       	if ( item.stackable ) {
					slots[i].quantity++;
				
				// TODO: Find a way to store ammunition information *not* in the OSItem prefab itself
				//} else if ( item.ammunition.enabled ) {
				//	slots[i].item.ChangeAmmunition ( item.ammunition.value );
				
					return true;
				}
			}
		}
		
		// If not, search for available slots
		OSPoint availableCell = new OSPoint ( -1, -1 );

		availableCell = grid.GetAvailableCell ( item );
		
		if ( OSPoint.IsNullOrNegative ( availableCell ) ) {
			return false;

		} else {
			slots.Add ( new OSSlot ( availableCell.x, availableCell.y, item ) );
			return true;

		}

	}

	public OSSlot GetSlot ( OSItem item ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i] != null && slots[i].item.prefabPath == item.prefabPath ) {
				return slots[i];
			}
		}

		return null;
	}

	public OSItem GetItem ( int x, int y ) {
		for ( int i = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i].item;
			}
		}

		return null;
	}

	// Behaviour
	void Start () {
		if (grid == null) {
			grid = new OSGrid (this, 5, 3);
		}
		
		SetDefinitions ();
	}
}
