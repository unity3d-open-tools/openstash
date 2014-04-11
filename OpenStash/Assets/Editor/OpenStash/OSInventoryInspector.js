#pragma strict

@CustomEditor ( OSInventory )
public class OSInventoryInspector extends Editor {
	private var changeX : int = -1;
	private var changeY : int = -1;
	
	override function OnInspectorGUI () {
		var inventory : OSInventory = target as OSInventory;

		var width : int = inventory.grid.GetWidth ();
		var height : int = inventory.grid.GetHeight ();

		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		width = EditorGUILayout.IntField ( "Width", width );
		height = EditorGUILayout.IntField ( "Height", height );
		
		EditorGUILayout.BeginHorizontal ();
	
		inventory.grid.SetDimensions ( width, height );

		EditorGUILayout.EndHorizontal ();
		
		EditorGUILayout.BeginHorizontal ();

		if ( changeX > 0 && changeY > 0 ) {
			var item : OSItem = inventory.GetSlot (changeX, changeY ); 
			item = EditorGUILayout.ObjectField ( item as Object, typeof ( OSItem ), false ) as OSItem;
			inventory.SetSlot ( changeX, changeY, item );

			if ( GUILayout.Button ( "Done" ) ) {
				changeX = -1;
				changeY = -1;
			}

		} else {
			for ( var x : int = 0; x < width; x++ ) {
				EditorGUILayout.BeginVertical ();
				
				for ( var y : int = 0; y < height; y++ ) {
					var tex : Texture2D = null;
					item = inventory.GetSlot ( x, y ); 
					
					if ( item ) {
						tex = item.thumbnail;
						
						if ( tex ) {
							if ( GUILayout.Button ( tex ) ) {
								changeX = x;
								changeY = y;
							}
						
						} else {
							if ( GUILayout.Button ( item.id ) ) {
								changeX = x;
								changeY = y;
							}

						}
					
					} else {
						if ( GUILayout.Button ( x + "-" + y ) ) {
							changeX = x;
							changeY = y;
						}
					}
				}

				EditorGUILayout.EndVertical ();
			}
		}

		EditorGUILayout.EndHorizontal ();

		if ( GUI.changed ) {
			inventory.SortAttributes ();
		}

		OSInventory.instance = inventory;
	}
}
