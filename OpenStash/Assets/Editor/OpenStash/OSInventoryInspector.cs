using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor (typeof(OSInventory))]
public class OSInventoryInspector : Editor {
	private OSSlot selected;

	public static void SavePrefab ( UnityEngine.Object target ) {
		GameObject selectedGameObject;
		PrefabType selectedPrefabType;
		GameObject parentGameObject;
		UnityEngine.Object prefabParent;
		     
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

	public override void OnInspectorGUI () {
		OSInventory inventory = (OSInventory) target;
		inventory.definitions = (OSDefinitions) EditorGUILayout.ObjectField ( "Definitions", inventory.definitions, typeof ( OSDefinitions ), false );
		
		if ( !inventory.definitions ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "You need to link an OSDefinitions prefab with this inventory", EditorStyles.boldLabel );
			GUI.color = Color.white;
			return;
		}
		
		EditorGUILayout.Space ();
		
		EditorGUILayout.LabelField ( "Currency amounts", EditorStyles.boldLabel );

		for ( int i = 0; i < inventory.definitions.currencies.Length; i++ ) {
			OSCurrency def = inventory.definitions.currencies[i];
			
			EditorGUILayout.BeginHorizontal ();

			inventory.CheckCurrency ( i );

			int oldAmount = inventory.GetCurrencyAmount ( def.name );
			int newAmount = EditorGUILayout.IntField ( def.name, oldAmount );
		
			if ( oldAmount != newAmount ) {
				inventory.SetCurrencyAmount ( def.name, newAmount );
			}			

			EditorGUILayout.EndHorizontal ();
		}
		
		EditorGUILayout.Space ();

		Event evt = Event.current;

		inventory.grid.inventory = inventory;

		// Grid
		OSSlot slot = null;
		int slotSize = 60;
		bool mouseDown = evt.type == EventType.MouseDown;
		bool keyLeft = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.LeftArrow;
		bool keyRight = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.RightArrow;
		bool keyUp = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.UpArrow;
		bool keyDown = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.DownArrow;
		bool keyTab = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.Tab;
		bool keyBackspace = evt.type == EventType.KeyDown && evt.keyCode == KeyCode.Backspace;

		EditorGUILayout.BeginHorizontal ();
		
		GUILayout.Space ( 34 );
		inventory.grid.width = EditorGUILayout.IntField ( inventory.grid.width, GUILayout.Width ( 30 ) );

		EditorGUILayout.EndHorizontal ();
		
		GUILayout.Space ( 4 );
		
		EditorGUILayout.BeginHorizontal ();
	
		inventory.grid.height = EditorGUILayout.IntField ( inventory.grid.height, GUILayout.Width ( 30 ) );
	
		Rect rect = EditorGUILayout.GetControlRect ( GUILayout.Width ( slotSize * inventory.grid.width ), GUILayout.Height ( slotSize * inventory.grid.height ) );	
		int xPos = (int)rect.x;
		int yPos = (int)rect.y;
		bool [ , ] skip = inventory.grid.GetSkippedSlots();
	
		if ( mouseDown && !rect.Contains ( evt.mousePosition ) ) {
			selected = null;
		}


		for ( int x = 0; x < inventory.grid.width; x++ ) {
			for ( int y = 0; y < inventory.grid.height; y++ ) {
				if ( skip [ x, y ] == true ) {
					continue;
				
				} else {
					Texture2D tex = null;
					OSItem item;
					Rect slotRect; 
					slot = inventory.GetSlot ( x, y ); 
					
					xPos = (int)rect.x + x * slotSize;
					yPos = (int)rect.y + y * slotSize;

					if ( slot != null && slot.item && !slot.hidden ) {
						item = slot.item;
						tex = item.preview;
						slotRect = new Rect ( xPos, yPos, slotSize * slot.scale.x, slotSize * slot.scale.y );

						if ( slot == selected ) {
							GUI.backgroundColor = Color.green;
							GUI.SetNextControlName ( "Selected" );

						}

						GUI.Box ( slotRect, "" );
						GUI.backgroundColor = Color.white;
						
						if ( tex ) {
							GUI.DrawTexture ( slotRect, tex );
						}
						
						if ( slot.quantity > 1 ) {
							GUI.Label ( new Rect ( xPos + 4, yPos + slot.scale.y * slotSize - 20, slot.scale.x * slotSize, 20 ), slot.quantity.ToString() );
						}
						
						if ( slotRect.Contains ( evt.mousePosition ) && mouseDown ) {
							selected = slot;
						}

					} else {
						slotRect = new Rect ( xPos, yPos, slotSize, slotSize );
						
						if ( slotRect.Contains ( evt.mousePosition ) && mouseDown ) {
							selected = null;
						}
						
						GUI.Box ( slotRect, "" );
					}

				}
				
			}

		}

		EditorGUILayout.BeginVertical ();	
		
		if ( selected != null && selected.item ) {
			EditorGUILayout.LabelField ( selected.item.id, EditorStyles.boldLabel );
			EditorGUILayout.LabelField ( selected.item.description );

			EditorGUILayout.Space ();

			foreach ( OSAttribute attribute in selected.item.attributes ) {
				EditorGUILayout.BeginHorizontal ();
				
				EditorGUILayout.LabelField ( attribute.name + ":", GUILayout.Width ( 80 ) );
				EditorGUILayout.LabelField ( attribute.value + " " + attribute.suffix, GUILayout.Width ( 80 ) );
				
				EditorGUILayout.EndHorizontal ();
			}
			
			EditorGUILayout.Space ();
			
			EditorGUILayout.LabelField ( "[ " + selected.item.category + " : " + selected.item.subcategory + " ]" );
		}
		
		EditorGUILayout.EndVertical ();

		EditorGUILayout.EndHorizontal ();

		EditorGUILayout.Space ();

		OSItem addItem = null;
		addItem = (OSItem) EditorGUILayout.ObjectField ( "Add item", addItem, typeof(OSItem), true );

		if ( addItem ) {
			inventory.AddItem ( addItem );
		}

		GUI.backgroundColor = Color.red;
		if ( GUILayout.Button ( "Clear inventory" ) ) {
			inventory.slots.Clear ();
		}
		GUI.backgroundColor = Color.white;

		// ^ Move slot
		if ( selected != null && selected.item ) {
			if ( keyLeft ) {
				inventory.grid.Move ( selected, selected.x - 1, selected.y );
				evt.Use ();
			
			} else if ( keyRight ) {
				inventory.grid.Move ( selected, selected.x + 1, selected.y );
				evt.Use ();


			} else if ( keyDown ) {
				inventory.grid.Move ( selected, selected.x, selected.y + 1 );
				evt.Use ();

			
			} else if ( keyUp ) {
				inventory.grid.Move ( selected, selected.x, selected.y - 1 );
				evt.Use ();

			} else if ( keyBackspace ) {
				inventory.RemoveItem ( selected.item );
				evt.Use ();
			
			}

		}
		
		if ( keyTab ) {
			evt.Use ();
			
			if ( selected != null && selected.item ) {
				int i = inventory.GetItemIndex ( selected.item );

				if ( i < inventory.slots.Count - 1 ) {
					i++;
				} else {
					i = 0;
				}

				selected = inventory.slots[i];

			} else if ( inventory.slots.Count > 0 ) {
				selected = inventory.slots[0];

			}
			
			GUI.FocusControl ( "Selected" );


		}

		Repaint ();
		
		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
