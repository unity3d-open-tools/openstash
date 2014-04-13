#pragma strict

@CustomEditor ( OSInventory )
public class OSInventoryInspector extends Editor {
	public static function SavePrefab ( target : UnityEngine.Object ) {
		var selectedGameObject : GameObject;
		var selectedPrefabType : PrefabType;
		var parentGameObject : GameObject;
		var prefabParent : UnityEngine.Object;
		     
		selectedGameObject = Selection.gameObjects[0];
		selectedPrefabType = PrefabUtility.GetPrefabType(selectedGameObject);
		parentGameObject = selectedGameObject.transform.root.gameObject;
		prefabParent = PrefabUtility.GetPrefabParent(selectedGameObject);
		     
		EditorUtility.SetDirty(target);
		     
		if (selectedPrefabType == PrefabType.PrefabInstance) {
			PrefabUtility.ReplacePrefab(parentGameObject, prefabParent,
			ReplacePrefabOptions.ConnectToPrefab);
	    	}
	}

	override function OnInspectorGUI () {
		var inventory : OSInventory = target as OSInventory;

		OSInventory.instance = inventory;
		
		// Grid
		EditorGUILayout.LabelField ( "Grid", EditorStyles.boldLabel );

		var slot : OSSlot;
		var slotSize : int = 60;

		EditorGUILayout.BeginHorizontal ();
		
		GUILayout.Space ( 34 );
		inventory.grid.width = EditorGUILayout.IntField ( inventory.grid.width, GUILayout.Width ( 30 ) );
		
		EditorGUILayout.EndHorizontal ();
		
		GUILayout.Space ( 4 );
		
		EditorGUILayout.BeginHorizontal ();
	
		inventory.grid.height = EditorGUILayout.IntField ( inventory.grid.height, GUILayout.Width ( 30 ) );
		
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
		
		EditorGUILayout.EndHorizontal ();

		EditorGUILayout.Space ();

		var addItem : OSItem;
		addItem = EditorGUILayout.ObjectField ( "Add item", addItem, OSItem, false ) as OSItem;

		if ( addItem ) {
			inventory.AddItem ( addItem );
		}

		if ( GUILayout.Button ( "Clear inventory" ) ) {
			inventory.slots.Clear ();
		}

		// Categories
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Categories", EditorStyles.boldLabel );
		
		var tmpCat : List.< OSCategory >;
		var tmpStr : List.< String >;

		for ( var c : int = 0; c < inventory.categories.Length; c++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			inventory.categories[c].id = EditorGUILayout.TextField ( inventory.categories[c].id );
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "X", GUILayout.Width ( 20 ) ) ) {
				tmpCat = new List.< OSCategory > ( inventory.categories );

				tmpCat.RemoveAt ( c );

				inventory.categories = tmpCat.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.EndHorizontal ();
			
			for ( var sc : int = 0; sc < inventory.categories[c].subcategories.Length; sc++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				inventory.categories[c].subcategories[sc] = EditorGUILayout.TextField ( " ", inventory.categories[c].subcategories[sc] );
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "X", GUILayout.Width ( 20 ) ) ) {
					tmpStr = new List.< String > ( inventory.categories[c].subcategories );

					tmpStr.RemoveAt ( sc );

					inventory.categories[c].subcategories = tmpStr.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal ();
			}

			EditorGUILayout.Space ();
		}

		
		if ( GUILayout.Button ( "Add category" ) ) {
			tmpCat = new List.< OSCategory > ( inventory.categories );

			tmpCat.Add ( new OSCategory () );

			inventory.categories = tmpCat.ToArray ();
		}

		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
