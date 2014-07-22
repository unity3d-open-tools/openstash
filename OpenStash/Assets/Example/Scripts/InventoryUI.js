#pragma strict

public class InventoryUI extends MonoBehaviour {
	public var inventory : OSInventory;
	public var slotSize : float = 64;
	public var grid : GameObject;
	public var dragTexture : OGTexture;
	public var info : OGLabel;
	public var action : OGButton;
	public var drop : OGButton;
	public var healthBar : OGProgressBar;
	public var equippedTex : OGTexture;
	public var scene : Transform;

	private var dragging : boolean = false;
	private var selectedSlot : OSSlot;
	private var cells : OGTexture[];
	private var equippedItem : OSItem;
	private var health : float = 50;
	private var maxHealth : float = 100;

	// Get or create a cell object
	private function GetCell ( x, y ) : OGTexture {
		for ( var i : int = 0; i < cells.Length; i++ ) {
			if ( cells[i].gameObject.name == y + "-" + x ) {
				return cells[i];
			}
		}

		var newCell : OGTexture = new GameObject( y + "-" + x, OGTexture, OGButton, OGLabel ).GetComponent.<OGTexture>();
		newCell.GetComponent.<OGButton>().ApplyDefaultStyles ();
		newCell.GetComponent.<OGLabel>().ApplyDefaultStyles ();
		newCell.transform.parent = grid.transform;
		
		cells = grid.GetComponentsInChildren.<OGTexture>(true);

		return newCell;
	}

	// Method for defining the selected OSSlot
	public function SelectSlot ( n : String ) {
		var i : int = int.Parse ( n );

		if ( dragging && selectedSlot ) {
			CancelDrag ();
		}

		if ( inventory.slots[i] == selectedSlot ) {
			dragging = true;
			selectedSlot.hidden = true;
		
		} else {
			selectedSlot = inventory.slots[i];

			info.text = selectedSlot.item.id;
			info.text += "\n\n";
			info.text += selectedSlot.item.description;
			info.text += "\n\n";
			
			if ( selectedSlot.item.ammunition.enabled ) {
				info.text += selectedSlot.item.ammunition.name + ": " + selectedSlot.item.ammunition.value;
				info.text += "\n\n";
			}

			for ( var attr : OSAttribute in selectedSlot.item.attributes ) {
				info.text += attr.name + ": " + attr.value + "\n";
			}

			info.text += "\n";
		
		}

	}

	// Cancel the currently dragged item
	public function CancelDrag () {
		if ( selectedSlot ) {
			selectedSlot.hidden = false;
		}
		
		dragging = false;
	}

	// Drop selected item
	public function Drop () {
		if ( !dragging && selectedSlot ) {
			if ( equippedItem == selectedSlot.item ) {
				equippedItem = null;
			}
			
			inventory.SpawnSlot ( selectedSlot, scene, new Vector3 ( 0, 0.5, 2.3 ) );
			inventory.RemoveSlot ( selectedSlot );

			selectedSlot = null;
			info.text = "";
		}
	}

	// Try to move the OSSlot to another location
	public function PutItem ( btn : OGButton ) {
		var p : OSPoint = new OSPoint ( btn.gameObject.name, "-"[0], true );

		if ( selectedSlot ) {
			inventory.grid.Move ( selectedSlot, p.x, p.y );
			CancelDrag ();
		}
	}

	// Consume item
	public function Consume () {
		if ( !dragging && selectedSlot && selectedSlot.item ) {
			var healFactor : float = selectedSlot.item.GetAttribute ( "heal" );

			if ( healFactor > 0 && healFactor < maxHealth ) {
				health += healFactor;
			}

			inventory.DecreaseSlot ( selectedSlot );
		
		}
	}

	// Equip/unequip item
	public function Equip () {
		if ( !dragging && selectedSlot && selectedSlot.item ) {
			equippedItem = selectedSlot.item;
		}
	}

	public function Unequip () {
		equippedItem = null;
	}

	function Update () {
		if ( !inventory ) {
			return;
		}

		// Update the OGProgressBar
		healthBar.value = health / maxHealth;
	
		// Update the OGTexture
		if ( equippedItem ) {
			equippedTex.mainTexture = equippedItem.preview;
			equippedTex.transform.localScale = new Vector3 ( equippedItem.slotSize.x * slotSize, equippedItem.slotSize.y * slotSize, 1 );
		} else {
			equippedTex.mainTexture = null;
		}

		// Keep the drag texture underneath the mouse...
		dragTexture.transform.position = new Vector3 ( Input.mousePosition.x - slotSize / 2, Screen.height - Input.mousePosition.y - slotSize / 2, 0 );

		// ...and make sure it has the right texture
		if ( dragging && selectedSlot && selectedSlot.item ) {
			dragTexture.mainTexture = selectedSlot.item.preview;
			dragTexture.transform.localScale = new Vector3 ( selectedSlot.scale.x * slotSize, selectedSlot.scale.y * slotSize, 1 );	
		
		} else {
			dragTexture.mainTexture = null;
		
		}

		// Set button properties
		if ( selectedSlot && selectedSlot.item ) {
			if ( selectedSlot.item.category == "Consumable" ) {
				action.gameObject.SetActive ( true );
				action.text = "Consume";
				action.target = this.gameObject;
				action.message = "Consume";
			
			} else if ( selectedSlot.item.category == "Equipment" ) {
				action.gameObject.SetActive ( true );
				action.target = this.gameObject;
				
				if ( equippedItem == selectedSlot.item ) {
					action.text = "Unequip";
					action.message = "Unequip";
				} else {
					action.text = "Equip";
					action.message = "Equip";
				}
			
			} else {
				action.gameObject.SetActive ( false );

			}

			drop.gameObject.SetActive ( selectedSlot.item.canDrop );
		} else {
			action.gameObject.SetActive ( false );
			drop.gameObject.SetActive ( false );
		
		}
			
		// Update the list of OGTexture objects
		cells = grid.GetComponentsInChildren.<OGTexture>(true);

		// Get the list of skipped cells, so we know which ones to draw
		var skip : boolean  [ , ] = inventory.grid.GetSkippedSlots ();

		// Loop through both axies of the OSGrid
		for ( var x : int = 0; x < inventory.grid.width; x++ ) {
			for ( var y : int = 0; y < inventory.grid.height; y++ ) {
				// Localise the cell object
				var tex : OGTexture = GetCell ( x, y );

				if ( tex ) {
					// Force its position
					tex.transform.localPosition = new Vector3 ( x * slotSize, y * slotSize, 0 );
					
					// Get the correspending OSSlot from the OSInventory
					var slot : OSSlot = inventory.GetSlot ( x, y );

					// Get the other components too
					var btn : OGButton = tex.GetComponent.<OGButton>();
					var lbl : OGLabel = tex.GetComponent.<OGLabel>();

					// If there is a slot, and it's not currently hidden, draw the content
					if ( slot && !slot.hidden ) {
						// Set the texture and scale of the cell, bind correct functions	
						tex.transform.localScale = new Vector3 ( slotSize * slot.scale.x, slotSize * slot.scale.y, 1 );
						
						if ( slot.item ) {
							tex.mainTexture = slot.item.preview;
							
							btn.target = this.gameObject;
							btn.message = "SelectSlot";
							btn.argument = inventory.GetItemIndex ( slot.item ).ToString();
							
							lbl.text = slot.quantity > 1 ? slot.quantity.ToString() : "";

						} else {
							tex.mainTexture = null;
							
							btn.target = this.gameObject;
							lbl.text = "";
							btn.message = "PutItem";
							btn.argument = null;
						}

					// If not, draw an empty cell and cancel any functions bound to it
					} else {
						tex.transform.localScale = new Vector3 ( slotSize, slotSize, 1 );
						tex.mainTexture = null;
						btn.target = this.gameObject;
						lbl.text = "";
						btn.message = "PutItem";
						btn.argument = null;
					}
				
					// If this cell is skipped, hide it	
					tex.gameObject.SetActive ( !skip [ x, y ] );
				}
			}
		}
	}
}
