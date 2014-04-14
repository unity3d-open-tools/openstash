#pragma strict

import System.Collections.Generic;

@CustomEditor ( OSItem )
public class OSItemInspector extends Editor {
	override function OnInspectorGUI () {
		var item : OSItem = target as OSItem;
		
		// Meta
		EditorGUILayout.LabelField ( "Id", EditorStyles.boldLabel );
		item.id = EditorGUILayout.TextField ( "Name", item.id );
		item.description = EditorGUILayout.TextField ( "Description", item.description );
		item.definitions = EditorGUILayout.ObjectField ( "Definitions", item.definitions, typeof ( OSDefinitions ), false ) as OSDefinitions;
		
		if ( !item.definitions ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "You need to link an OSDefinitions prefab with this item", EditorStyles.boldLabel );
			GUI.color = Color.white;

		} else {

			// Prefab path
			if ( !Application.isPlaying ) {
				EditorGUILayout.BeginHorizontal ();
				var str : String = "Get prefab path";
				if ( !String.IsNullOrEmpty ( item.prefabPath ) ) { str = item.prefabPath; }
				if ( GUILayout.Button ( str ) ) {
					var path : String = AssetDatabase.GetAssetPath ( item.gameObject );
					path = path.Replace ( "Assets/Resources/", "" );
					path = path.Replace ( ".prefab", "" );

					item.prefabPath = path;
				}
				EditorGUILayout.EndHorizontal ();
			}

			// Category
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Category", EditorStyles.boldLabel );

			item.catIndex = EditorGUILayout.Popup ( "Category", item.catIndex, item.definitions.GetCategoryStrings () );
			
			if ( item.subcatIndex >= item.definitions.categories [ item.catIndex ].subcategories.Length ) {
				item.subcatIndex = 0;
			}
			
			item.subcatIndex = EditorGUILayout.Popup ( "Subcategory", item.subcatIndex, item.definitions.categories [ item.catIndex ].subcategories );
			
			// Slot
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Slot properties", EditorStyles.boldLabel );
			item.stackable = EditorGUILayout.Toggle ( "Stackable", item.stackable );
			item.canDrop = EditorGUILayout.Toggle ( "Can drop", item.canDrop );
			
			item.slotSize.x = EditorGUILayout.IntField ( "Width", item.slotSize.x );
			item.slotSize.y = EditorGUILayout.IntField ( "Height", item.slotSize.y );

			if ( item.slotSize.x < 1 ) { item.slotSize.x = 1; }
			if ( item.slotSize.y < 1 ) { item.slotSize.y = 1; }

			// Attributes
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Attributes", EditorStyles.boldLabel );
			EditorGUILayout.BeginHorizontal ();
			
			EditorGUILayout.BeginVertical ();
			
			for ( var i : int = 0; i < item.attributes.Length; i++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					var tmpAttr : List.< OSAttribute > = new List.< OSAttribute > ( item.attributes );

					tmpAttr.RemoveAt ( i );

					item.attributes = tmpAttr.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
				
				item.attributes[i].item = item;
				item.attributes[i].index = EditorGUILayout.Popup ( item.attributes[i].index, item.definitions.GetAttributeStrings () );
				item.attributes[i].value = EditorGUILayout.FloatField ( item.attributes[i].value );

				
				EditorGUILayout.EndHorizontal ();
			}
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpAttr = new List.< OSAttribute > ( item.attributes );

				tmpAttr.Add ( new OSAttribute ( item ) );

				item.attributes = tmpAttr.ToArray ();
			}
			GUI.backgroundColor = Color.white;

			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();
			
			// Ammunition
			EditorGUILayout.Space ();
		
			EditorGUILayout.BeginHorizontal ();	
			EditorGUILayout.LabelField ( "Ammunition", EditorStyles.boldLabel, GUILayout.Width ( 80 ) );
			item.ammunition.enabled = EditorGUILayout.Toggle ( item.ammunition.enabled );
			EditorGUILayout.EndHorizontal ();

			if ( item.ammunition.enabled ) {
				item.ammunition.name = EditorGUILayout.TextField ( "Name", item.ammunition.name );
				item.ammunition.value = EditorGUILayout.IntField ( "Amount", item.ammunition.value );
			}

			// Textures
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Textures", EditorStyles.boldLabel );

			item.thumbnail = EditorGUILayout.ObjectField ( "Thumbnail", item.thumbnail as Object, typeof ( Texture2D ), false ) as Texture2D;
			item.preview = EditorGUILayout.ObjectField ( "Preview", item.preview as Object, typeof ( Texture2D ), false ) as Texture2D;

			if ( GUI.changed ) {
				OSInventoryInspector.SavePrefab ( target );
			}

		}
	}
}
