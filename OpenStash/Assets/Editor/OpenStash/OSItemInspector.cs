using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(OSItem))]
public class OSItemInspector : Editor {
	private bool resourceWarning = false;
	
	public override void OnInspectorGUI () {
		OSItem item = (OSItem) target;
		
		// Meta
		EditorGUILayout.LabelField ( "Id", EditorStyles.boldLabel );
		item.id = EditorGUILayout.TextField ( "Name", item.id );
		item.description = EditorGUILayout.TextField ( "Description", item.description );
		item.definitions = (OSDefinitions) EditorGUILayout.ObjectField ( "Definitions", item.definitions, typeof ( OSDefinitions ), false );
		
		if ( !item.definitions ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "You need to link an OSDefinitions prefab with this item", EditorStyles.boldLabel );
			GUI.color = Color.white;

		} else {
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
			
			EditorGUILayout.BeginHorizontal ();

			EditorGUILayout.TextField ( "Path", item.prefabPath );

			if ( !item.gameObject.activeInHierarchy ) {
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
					string path = AssetDatabase.GetAssetPath ( item.gameObject );
					if ( path.Contains ( "Assets/Resources/" ) ) {
						path = path.Replace ( "Assets/Resources/", "" );
						path = path.Replace ( ".prefab", "" );

						item.prefabPath = path;
						
						resourceWarning = false;
					
					} else {
						resourceWarning = true;
					
					}
				}
				GUI.backgroundColor = Color.white;
			}

			EditorGUILayout.EndHorizontal ();

			if ( resourceWarning ) {
				item.prefabPath = "";
				GUI.color = Color.red;
				EditorGUILayout.LabelField ( "Object not in /Resources folder!", EditorStyles.boldLabel );
				GUI.color = Color.white;
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
			
			for ( int i = 0; i < item.attributes.Length; i++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					List< OSAttribute > tmpAttr = new List< OSAttribute > ( item.attributes );

					tmpAttr.RemoveAt ( i );

					item.attributes = tmpAttr.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
				
				item.attributes[i].definitions = item.definitions;
				item.attributes[i].index = EditorGUILayout.Popup ( item.attributes[i].index, item.definitions.GetAttributeStrings () );
				item.attributes[i].value = EditorGUILayout.FloatField ( item.attributes[i].value );
				EditorGUILayout.LabelField ( item.attributes[i].suffix, GUILayout.Width ( 80 ) );
				
				EditorGUILayout.EndHorizontal ();
			}
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				List< OSAttribute > tmpAttr = new List< OSAttribute > ( item.attributes );

				tmpAttr.Add ( new OSAttribute ( item.definitions ) );

				item.attributes = tmpAttr.ToArray ();
			}
			GUI.backgroundColor = Color.white;

			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();
		
			// Sounds
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Sounds", EditorStyles.boldLabel );
			EditorGUILayout.BeginHorizontal ();
			
			EditorGUILayout.BeginVertical ();
			
			for ( int i = 0; i < item.sounds.Length; i++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					List< AudioClip > tmpSound = new List< AudioClip > ( item.sounds );

					tmpSound.RemoveAt ( i );

					item.sounds = tmpSound.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
				
				item.sounds[i] = (AudioClip) EditorGUILayout.ObjectField ( item.sounds[i], typeof ( AudioClip ), false );
				
				EditorGUILayout.EndHorizontal ();
			}
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				List< AudioClip > tmpSound = new List< AudioClip > ( item.sounds );

				tmpSound.Add ( null );

				item.sounds = tmpSound.ToArray ();
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
				item.ammunition.index = EditorGUILayout.Popup ( "Type", item.ammunition.index, item.definitions.GetAmmunitionStrings() );
				item.ammunition.value = EditorGUILayout.IntField ( "Amount", item.ammunition.value );
				item.ammunition.max = EditorGUILayout.IntField ( "Maximum", item.ammunition.max );
				item.ammunition.spread = EditorGUILayout.IntField ( "Spread", item.ammunition.spread );
				item.ammunition.item = item;
			}

			// Textures
			EditorGUILayout.Space ();
			EditorGUILayout.LabelField ( "Textures", EditorStyles.boldLabel );

			item.thumbnail = (Texture2D) EditorGUILayout.ObjectField ( "Thumbnail", item.thumbnail as Object, typeof ( Texture2D ), false );
			item.preview = (Texture2D) EditorGUILayout.ObjectField ( "Preview", item.preview as Object, typeof ( Texture2D ), false );

			if ( GUI.changed ) {
				OSInventoryInspector.SavePrefab ( target );
			}

		}
	}
}
