using UnityEngine;
using System.Collections;

// Bezier script by Loran (http://forum.unity3d.com/members/2144-Loran)

[System.Serializable]
public class Bezier : System.Object {
	public Vector3 p0;
	public Vector3 p1;
	public Vector3 p2;
	public Vector3 p3;

	public float ti = 0.0f;

	private Vector3 b0 = Vector3.zero;
	private Vector3 b1 = Vector3.zero;
	private Vector3 b2 = Vector3.zero;
	private Vector3 b3 = Vector3.zero;

	private float Ax;
	private float Ay;
	private float Az;

	private float Bx;
	private float By;
	private float Bz;

	private float Cx;
	private float Cy;
	private float Cz;

	// Init void v0 = 1st point, v1 = handle of the 1st point , v2 = handle of the 2nd point, v3 = 2nd point
	// handle1 = v0 + v1
	// handle2 = v3 + v2
	public Bezier(Vector3 v0, Vector3 v1, Vector3 v2, Vector3 v3) {
		p0 = v0;
		p1 = v1;
		p2 = v2;
		p3 = v3;
	}

	// 0.0 >= t <= 1.0
	public Vector3 GetPointAtTime ( float t) {
		CheckConstant();
		float t2 = t * t;
		float t3 = t * t * t;
		float x = Ax * t3 + Bx * t2 + Cx * t + p0.x;
		float y = Ay * t3 + By * t2 + Cy * t + p0.y;
		float z = Az * t3 + Bz * t2 + Cz * t + p0.z;
		return(new Vector3(x,y,z));
	}

	private void SetConstant() {
		Cx = 3 * ((p0.x + p1.x) - p0.x);
		Bx = 3 * ((p3.x + p2.x) - (p0.x + p1.x)) - Cx;
		Ax = p3.x - p0.x - Cx - Bx;

		Cy = 3 * ((p0.y + p1.y) - p0.y);
		By = 3 * ((p3.y + p2.y) - (p0.y + p1.y)) - Cy;
		Ay = p3.y - p0.y - Cy - By;

		Cz = 3 * ((p0.z + p1.z) - p0.z);
		Bz = 3 * ((p3.z + p2.z) - (p0.z + p1.z)) - Cz;
		Az = p3.z - p0.z - Cz - Bz;
	}

	// Check if p0, p1, p2 or p3 have changed
	private void CheckConstant() {
		if (p0 != b0 || p1 != b1 || p2 != b2 || p3 != b3) {
			SetConstant();
			b0 = p0;
			b1 = p1;
			b2 = p2;
			b3 = p3;
		}
	}
}
