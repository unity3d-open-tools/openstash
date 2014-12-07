using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(OSFirearm))]
[System.Serializable]
public class OSFirearmInspector : Editor {
	public override void OnInspectorGUI () {
		OSFirearm firearm = (OSFirearm) target;

		if ( !firearm.item ) {
			firearm.item = firearm.GetComponent< OSItem > ();

			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "There is no OSItem component on this object!", EditorStyles.boldLabel );
			GUI.color = Color.white;
			return;
		}
		
		EditorGUILayout.LabelField ( "Properties", EditorStyles.boldLabel );

		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Inherited attributes", EditorStyles.boldLabel );

		firearm.accuracyIndex = EditorGUILayout.Popup ( "Accuracy", firearm.accuracyIndex, firearm.item.GetAttributeStrings () );
		firearm.damageIndex = EditorGUILayout.Popup ( "Damage", firearm.damageIndex, firearm.item.GetAttributeStrings () );
		firearm.firingRateIndex = EditorGUILayout.Popup ( "Firing rate", firearm.firingRateIndex, firearm.item.GetAttributeStrings () );
		firearm.rangeIndex = EditorGUILayout.Popup ( "Range", firearm.rangeIndex, firearm.item.GetAttributeStrings () );
		firearm.reloadSpeedIndex = EditorGUILayout.Popup ( "Reload speed", firearm.reloadSpeedIndex, firearm.item.GetAttributeStrings () );
		firearm.capacityIndex = EditorGUILayout.Popup ( "Capacity", firearm.capacityIndex, firearm.item.GetAttributeStrings () );

		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Inherited sounds", EditorStyles.boldLabel );

		firearm.firingSoundIndex = EditorGUILayout.Popup ( "Fire", firearm.firingSoundIndex, firearm.item.GetSoundStrings () );
		firearm.emptySoundIndex = EditorGUILayout.Popup ( "Empty", firearm.emptySoundIndex, firearm.item.GetSoundStrings () );
		firearm.reloadSoundIndex = EditorGUILayout.Popup ( "Reload", firearm.reloadSoundIndex, firearm.item.GetSoundStrings () );
		firearm.equippingSoundIndex = EditorGUILayout.Popup ( "Equip", firearm.equippingSoundIndex, firearm.item.GetSoundStrings () );
		firearm.holsteringSoundIndex = EditorGUILayout.Popup ( "Holster", firearm.holsteringSoundIndex, firearm.item.GetSoundStrings () );
		
		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Inherited animations", EditorStyles.boldLabel );

		if ( firearm.animation ) {
			List< string > animationNames = new List< string  > ();

			foreach ( AnimationState state in firearm.animation ) {
				animationNames.Add ( state.name );
			}

			firearm.firingAnimationIndex = EditorGUILayout.Popup ( "Equip", firearm.equippingAnimationIndex, animationNames.ToArray () );
			firearm.firingAnimationIndex = EditorGUILayout.Popup ( "Holster", firearm.holsteringAnimationIndex, animationNames.ToArray () );
			firearm.firingAnimationIndex = EditorGUILayout.Popup ( "Fire", firearm.firingAnimationIndex, animationNames.ToArray () );
			firearm.firingAnimationIndex = EditorGUILayout.Popup ( "Reload", firearm.reloadingAnimationIndex, animationNames.ToArray () );
		
		} else {
			EditorGUILayout.LabelField ( "No animations on this item!" );
		
		}
	}
}
