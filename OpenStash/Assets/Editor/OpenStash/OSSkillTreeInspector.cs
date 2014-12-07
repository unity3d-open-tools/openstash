using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(OSSkillTree))]
public class OSSkillTreeInspector : Editor {
	private int rootIndex = 0;
	
	public override void OnInspectorGUI () {
		OSSkillTree tree = (OSSkillTree) target;
		
		tree.definitions = (OSDefinitions) EditorGUILayout.ObjectField ( "Definitions", tree.definitions, typeof ( OSDefinitions ), false );
		
		if ( !tree.definitions ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "You need to link an OSDefinitions prefab with this item", EditorStyles.boldLabel );
			GUI.color = Color.white;

		} else {
			tree.eventHandler = (GameObject) EditorGUILayout.ObjectField ( "Event handler", tree.eventHandler, typeof ( GameObject ), true );
			
			EditorGUILayout.Space ();

			string[] rootStrings = new string [tree.roots.Length];

			for ( int i = 0; i < rootStrings.Length; i++ ) {
				rootStrings[i] = tree.roots[i].name;
			}

			EditorGUILayout.BeginHorizontal ();
			
			rootIndex = EditorGUILayout.Popup ( "Root", rootIndex, rootStrings );
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				if ( tree.roots.Length > 1 ) {
					List< OSSkillTree.Root > tmp = new List< OSSkillTree.Root > ( tree.roots );
		
					tmp.RemoveAt ( rootIndex );

					tree.roots = tmp.ToArray ();
					
					rootIndex = Mathf.Clamp ( 0, tree.roots.Length - 1, rootIndex );
				}
			}
			GUI.backgroundColor = Color.white;

			EditorGUILayout.EndHorizontal ();
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				List< OSSkillTree.Root > tmp = new List< OSSkillTree.Root > ( tree.roots );
	
				OSSkillTree.Root newRoot = new OSSkillTree.Root ();
				newRoot.name = "New Root";
				tmp.Add ( newRoot );

				rootIndex = tree.roots.Length;

				tree.roots = tmp.ToArray ();
			}
			GUI.backgroundColor = Color.white;

			if ( tree.roots.Length < 1 ) {
				return;
			}

			GUILayout.Space ( 20 );
			
			tree.roots[rootIndex].name = EditorGUILayout.TextField ( "Name", tree.roots[rootIndex].name );

			EditorGUILayout.Space ();
			
			EditorGUILayout.LabelField ( "Skills" );

			EditorGUILayout.BeginHorizontal ();

			GUILayout.Space ( 20 );

			EditorGUILayout.BeginVertical ();

			foreach ( OSSkillTree.Skill skill in tree.roots[rootIndex].skills ) {
				skill.name = EditorGUILayout.TextField ( "Name", skill.name );
				skill.description = EditorGUILayout.TextField ( "Description", skill.description );
				skill.level = EditorGUILayout.IntField ( "Level", skill.level );
				skill.mpCost = EditorGUILayout.FloatField ( "MP Cost", skill.mpCost );
				skill.active = EditorGUILayout.Toggle ( "Active", skill.active );
				skill.enabled = EditorGUILayout.Toggle ( "Enabled", skill.enabled );
				
				EditorGUILayout.Space ();
				
				EditorGUILayout.LabelField ( "Attributes", GUILayout.Width ( 100 ) );

				EditorGUILayout.BeginHorizontal ();

				GUILayout.Space ( 20 );

				EditorGUILayout.BeginVertical ();

				int i = 0;

				foreach ( OSAttribute attr in skill.attributes ) {
					EditorGUILayout.BeginHorizontal ();
					
					attr.definitions = tree.definitions;
					attr.index = EditorGUILayout.Popup ( attr.index, tree.definitions.GetAttributeStrings () );
					attr.value = EditorGUILayout.FloatField ( attr.value );
					EditorGUILayout.LabelField ( attr.suffix, GUILayout.Width ( 80 ) );
					
					GUI.backgroundColor = Color.red;
					if ( GUILayout.Button ( "x" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
						List< OSAttribute > tmpAttr = new List< OSAttribute > ( skill.attributes );

						tmpAttr.RemoveAt ( i );

						skill.attributes = tmpAttr.ToArray ();
						return;
					}
					GUI.backgroundColor = Color.white;
					
					EditorGUILayout.EndHorizontal ();

					i++;
				}
				
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "+" , GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					List< OSAttribute > tmpAttr = new List< OSAttribute > ( skill.attributes );

					tmpAttr.Add ( new OSAttribute ( tree.definitions ) );

					skill.attributes = tmpAttr.ToArray ();
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndVertical ();
				
				EditorGUILayout.EndHorizontal ();

				GUILayout.Space ( 20 );
			}
			
			EditorGUILayout.EndVertical ();
			
			EditorGUILayout.EndHorizontal ();
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				List< OSSkillTree.Skill > skillTmp = new List< OSSkillTree.Skill > ( tree.roots[rootIndex].skills );
	
				OSSkillTree.Skill newSkill = new OSSkillTree.Skill ();
				newSkill.name = "New Skill";
				skillTmp.Add ( newSkill );

				tree.roots[rootIndex].skills = skillTmp.ToArray ();
			}
			GUI.backgroundColor = Color.white;
		}
		
		if ( GUI.changed ) {
			OSInventoryInspector.SavePrefab ( target );
		}
	}
}
