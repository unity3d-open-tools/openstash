#pragma strict

@CustomEditor ( OSInventory )
public class OSInventoryInspector extends Editor {
	private var scrollPos : Vector2;

	override function OnInspectorGUI () {
		var inventory : OSInventory = target as OSInventory;

		OSInventory.instance = inventory;
		
		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		var slot : OSSlot;
		var slotSize : int = 60;

		inventory.grid.width = EditorGUILayout.IntField ( "Width", inventory.grid.width );
		inventory.grid.height = EditorGUILayout.IntField ( "Height", inventory.grid.height );
		
		scrollPos = EditorGUILayout.BeginScrollView ( scrollPos );

		var rect : Rect = EditorGUILayout.GetControlRect ( GUILayout.Width ( slotSize * inventory.grid.width ), GUILayout.Height ( slotSize * inventory.grid.height ) );	

		var xPos : int = rect.x;
		var yPos : int = rect.y;
		var skip : boolean [ , ] = inventory.grid.GetSkippedSlots();

		for ( var x : int = 0; x < inventory.grid.width; x++ ) {
			for ( var y : int = 0; y < inventory.grid.height; y++ ) {
				if ( skip [ x, y ] == true ) {
					continue;
				
				} else {
					var tex : Texture2D = null;
					var item : OSItem;
					slot = inventory.GetSlot ( x, y ); 
					
					xPos = rect.x + x * slotSize;
					yPos = rect.y + y * slotSize;

					if ( slot && slot.item ) {
						item = slot.item;
						
						tex = item.preview;
					
						GUI.Box ( new Rect ( xPos, yPos, slotSize * slot.scale.x, slotSize * slot.scale.y ), "" );
						
						if ( tex ) {
							GUI.DrawTexture ( new Rect ( xPos, yPos, slotSize * slot.scale.x, slotSize * slot.scale.y ), tex );
						}
						
						GUI.color = new Color ( 0, 0, 0, 0 );
						//item = EditorGUI.ObjectField ( new Rect ( xPos, yPos, slotSize * slot.scale.x, slotSize * slot.scale.y ), item, OSItem, false ) as OSItem; 
						GUI.color = Color.white;

						if ( slot.quantity > 1 ) {
							GUI.Label ( new Rect ( xPos + 4, yPos + slot.scale.y * slotSize - 20, slot.scale.x * slotSize, 20 ), slot.quantity.ToString() );
						}

					} else {
						GUI.Box ( new Rect ( xPos, yPos, slotSize, slotSize ), "" );
						
						GUI.color = new Color ( 0, 0, 0, 0 );
						//item = EditorGUI.ObjectField ( new Rect ( xPos, yPos, slotSize, slotSize ), item, OSItem, false ) as OSItem; 
						GUI.color = Color.white;

					}

					inventory.SetItem ( x, y, item );

				}
				
			}

		}

		EditorGUILayout.Space ();

		var addItem : OSItem;
		addItem = EditorGUILayout.ObjectField ( "Add item", addItem, OSItem, false ) as OSItem;

		if ( addItem ) {
			inventory.AddItem ( addItem );
		}

		if ( GUILayout.Button ( "Clear inventory" ) ) {
			inventory.slots.Clear ();
		}


		EditorGUILayout.EndScrollView ();


		if ( GUI.changed ) {
			inventory.SortAttributes ();
		}
	}
}
