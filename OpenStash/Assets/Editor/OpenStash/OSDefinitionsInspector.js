
#pragma strict

@CustomEditor ( OSDefinitions )
public class OSDefinitionsInspector extends Editor {
	override function OnInspectorGUI () {
		var definitions : OSDefinitions = target as OSDefinitions;

		// Categories
		EditorGUILayout.LabelField ( "Categories", EditorStyles.boldLabel );
		
		var tmpCat : List.< OSCategory >;
		var tmpStr : List.< String >;

		for ( var c : int = 0; c < definitions.categories.Length; c++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpCat = new List.< OSCategory > ( definitions.categories );

				tmpCat.RemoveAt ( c );

				definitions.categories = tmpCat.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			definitions.categories[c].id = EditorGUILayout.TextField ( definitions.categories[c].id );
			
			EditorGUILayout.EndHorizontal ();
			
			for ( var sc : int = 0; sc < definitions.categories[c].subcategories.Length; sc++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				GUILayout.Space ( 104 );
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					tmpStr = new List.< String > ( definitions.categories[c].subcategories );

					tmpStr.RemoveAt ( sc );

					definitions.categories[c].subcategories = tmpStr.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
			
				definitions.categories[c].subcategories[sc] = EditorGUILayout.TextField ( definitions.categories[c].subcategories[sc] );
				
				EditorGUILayout.EndHorizontal ();
				
			}
			
			EditorGUILayout.BeginHorizontal ();
			GUILayout.Space ( 104 );
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpStr = new List.< String > ( definitions.categories[c].subcategories );

				tmpStr.Add ( "Subcategory" );

				definitions.categories[c].subcategories = tmpStr.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
		}

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpCat = new List.< OSCategory > ( definitions.categories );

			tmpCat.Add ( new OSCategory () );

			definitions.categories = tmpCat.ToArray ();
		}
		GUI.backgroundColor = Color.white;
	
		EditorGUILayout.Space ();
		
		// Attributes
		EditorGUILayout.LabelField ( "Attributes", EditorStyles.boldLabel );

		var tmpAttr : List.< OSAttributeDefinition >;

		for ( var a : int = 0; a < definitions.attributes.Length; a++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpAttr = new List.< OSAttributeDefinition > ( definitions.attributes );

				tmpAttr.RemoveAt ( c );

				definitions.attributes = tmpAttr.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.BeginVertical ();

			definitions.attributes[a].id = EditorGUILayout.TextField ( definitions.attributes[a].id );
			
			EditorGUILayout.BeginHorizontal ();
			EditorGUILayout.LabelField ( "Name", GUILayout.Width ( 100 ) ); 
			definitions.attributes[a].name = EditorGUILayout.TextField ( definitions.attributes[a].name );
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.BeginHorizontal ();
			EditorGUILayout.LabelField ( "Suffix", GUILayout.Width ( 100 ) ); 
			definitions.attributes[a].suffix = EditorGUILayout.TextField ( definitions.attributes[a].suffix );
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
			
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpAttr = new List.< OSAttributeDefinition > ( definitions.attributes );

			tmpAttr.Add ( new OSAttributeDefinition () );

			definitions.attributes = tmpAttr.ToArray ();
		}
		GUI.backgroundColor = Color.white;

		if ( GUI.changed ) {
			OSInventoryInspector.SavePrefab ( target );
		}
	}
}
		
