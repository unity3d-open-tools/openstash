using UnityEngine;
using System.Collections;

public class OSStats : MonoBehaviour {
	public string name;
	public float hp = 100;
	public float maxHp = 100;
	public float mp = 100;
	public float maxMp = 100;
	public OSAttribute[] attributes = new OSAttribute [0];

	public float GetValue ( string attrName ) {
		foreach ( OSAttribute a in attributes ) {
			if ( a.name == attrName ) {
				return a.value;
			}
		}

		return -1;
	}
}
