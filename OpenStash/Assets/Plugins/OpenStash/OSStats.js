#pragma strict

public class OSStats extends MonoBehaviour {
	public var name : String;
	public var hp : float = 100;
	public var maxHp : float = 100;
	public var mp : float = 100;
	public var maxMp : float = 100;
	public var attributes : OSAttribute[] = new OSAttribute [0];

	public function GetValue ( attrName : String ) : int {
		for ( var a : OSAttribute in attributes ) {
			if ( a.name == attrName ) {
				return a.value;
			}
		}

		return -1;
	}
}
