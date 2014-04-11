#pragma strict

@CustomEditor ( OSInventory )
public class OSInventoryInspector extends Editor {
	private var changeX : int = -1;
	private var changeY : int = -1;
	private var scrollPos : Vector2;

	function OSInventoryInspector () {
		changeX = -1;
		changeY = -1;
	}

	private function ChangeMode ( x : int, y : int ) {
		changeX = x;
		changeY = y;
	}
	
	override function OnInspectorGUI () {
		var inventory : OSInventory = target as OSInventory;

		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		var item : OSItem;
		var slotSize : int = 60;

		if ( changeX > -1 && changeY > -1 ) {
			EditorGUILayout.BeginHorizontal ();
			
			item = inventory.GetItem ( changeX, changeY ); 
		
			item = EditorGUILayout.ObjectField ( changeX + " - " + changeY, item as Object, typeof ( OSItem ), false ) as OSItem;
			inventory.SetItem ( changeX, changeY, item );

			if ( GUILayout.Button ( "Done" ) ) {
				changeX = -1;
				changeY = -1;
			}
			
			EditorGUILayout.EndHorizontal ();

		} else {
			inventory.grid.width = EditorGUILayout.IntField ( "Width", inventory.grid.width );
			inventory.grid.height = EditorGUILayout.IntField ( "Height", inventory.grid.height );
			
			scrollPos = EditorGUILayout.BeginScrollView ( scrollPos );

			var rect : Rect = GUILayout.GetControlRect ();	

			for ( var x : int = 0; x < inventory.grid.width; x++ ) {
				for ( var y : int = 0; y < inventory.grid.height; y++ ) {
					var tex : Texture2D = null;
					item = inventory.GetItem ( x, y ); 
					
					if ( item ) {
						tex = item.preview;
						
						if ( tex ) {
							if ( GUI.Button ( new Rect ( xPos, yPos, slotSize * item.slotSize.x, slotSize * item.slotSize.y ), tex ) ) {
								ChangeMode ( x, y );
							}
						
						} else {
							if ( GUI.Button ( new Rect ( xPos, yPos, slotSize * item.slotSize.x, slotSize * item.slotSize.y ), tex ) ) {
								ChangeMode ( x, y );
							}

						}
					
					} else {
						if ( GUI.Button ( new Rect ( xPos, yPos, slotSize, slotSize ), "" ) ) {
							ChangeMode ( x, y );
						}
					}
				}

			}


			EditorGUILayout.EndScrollView ();
		}


		if ( GUI.changed ) {
			inventory.SortAttributes ();
		}

		OSInventory.instance = inventory;
	}
}
