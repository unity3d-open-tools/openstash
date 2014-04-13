#pragma strict

@script ExecuteInEditMode()
public class InventoryUI extends MonoBehaviour {
	public var inventory : OSInventory;
	public var slotSize : float = 64;
	public var grid : GameObject;
	public var dragTexture : OGTexture;
	public var info : OGLabel;

	private var dragSlot : OSSlot;
	private var textures : OGTexture[];

	// Get or create an OGTexture object
	private function GetTexture ( x, y ) : OGTexture {
		for ( var i : int = 0; i < textures.Length; i++ ) {
			if ( textures[i].gameObject.name == y + "-" + x ) {
				return textures[i];
			}
		}

		var newTex : OGTexture = new GameObject( y + "-" + x, OGTexture, OGButton ).GetComponent.<OGTexture>();
		newTex.GetComponent.<OGButton>().GetDefaultStyles ();
		newTex.transform.parent = grid.transform;
		
		textures = grid.GetComponentsInChildren.<OGTexture>(true);

		return newTex;
	}

	// Method for defining the selected OSSlot
	public function SetDragSlot ( n : String ) {
		var i : int = int.Parse ( n );

		dragSlot = inventory.slots[i];
		dragSlot.hidden = true;

		info.text = dragSlot.item.id;
		info.text += "\n\n";
		info.text += dragSlot.item.description;
	}

	// Try to move the OSSlot to another location
	public function PutItem ( btn : OGButton ) {
		var p : OSPoint = new OSPoint ( btn.gameObject.name, "-"[0], true );

		if ( dragSlot ) {
			inventory.grid.Move ( dragSlot, p.x, p.y );
		
			dragSlot.hidden = false;
			dragSlot = null;
		}
	}

	function Update () {
		if ( !inventory ) {
			return;
		}
	
		// Keep the drag texture underneath the mouse...
		dragTexture.transform.position = new Vector3 ( Input.mousePosition.x - slotSize / 2, Screen.height - Input.mousePosition.y - slotSize / 2, 0 );

		// ...and make sure it has the right texture
		if ( dragSlot && dragSlot.item ) {
			dragTexture.mainTexture = dragSlot.item.preview;
			dragTexture.transform.localScale = new Vector3 ( dragSlot.scale.x * slotSize, dragSlot.scale.y * slotSize, 1 );
		} else {
			dragTexture.mainTexture = null;
		}

		// Update the list of OGTexture objects
		textures = grid.GetComponentsInChildren.<OGTexture>(true);

		// Get the list of skipped cells, so we know which ones to draw
		var skip : boolean  [ , ] = inventory.grid.GetSkippedSlots ();

		// Loop through both axies of the OSGrid
		for ( var x : int = 0; x < inventory.grid.width; x++ ) {
			for ( var y : int = 0; y < inventory.grid.height; y++ ) {
				// Localise the OGTexture object
				var tex : OGTexture = GetTexture ( x, y );

				if ( tex ) {
					// Force its position
					tex.transform.localPosition = new Vector3 ( x * slotSize, y * slotSize, 0 );
					
					// Get the correspending OSSlot from the OSInventory
					var slot : OSSlot = inventory.GetSlot ( x, y );

					// Get the OGButton component too
					var btn : OGButton = tex.GetComponent.<OGButton>();

					// If there is a slot, and it's not currently hidden, draw the content
					if ( slot && !slot.hidden ) {
						// Set the texture and scale of the cell, bind correct functions	
						tex.transform.localScale = new Vector3 ( slotSize * slot.scale.x, slotSize * slot.scale.y, 1 );
						
						if ( slot.item ) {
							tex.mainTexture = slot.item.preview;
							
							btn.target = this.gameObject;
							btn.message = "SetDragSlot";
							btn.argument = inventory.GetItemIndex ( slot.item ).ToString();

						} else {
							tex.mainTexture = null;
							
							btn.target = this.gameObject;
							btn.message = "PutItem";
							btn.argument = null;
						}

					// If not, draw an empty cell and cancel any functions bound to it
					} else {
						tex.transform.localScale = new Vector3 ( slotSize, slotSize, 1 );
						tex.mainTexture = null;
						btn.target = this.gameObject;
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
