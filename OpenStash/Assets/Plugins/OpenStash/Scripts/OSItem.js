#pragma strict

public class OSAttribute {
	public var keyIndex : int = 0;
	public var value : float = 0;

	private var definitions : OSDefinitions;

	function OSAttribute ( definitions : OSDefinitions ) {
		this.definitions = definitions;
	}

	public function get id () : String {
		return definitions.attributes[keyIndex].id;
	}

	public function get name () : String {
		return definitions.attributes[keyIndex].name;
	}
	
	public function get suffix () : String {
		return definitions.attributes[keyIndex].suffix;
	}
}

public class OSItem extends MonoBehaviour {
	public var id : String = "New Item";
	public var description : String = "This is a new item";
	public var stackable : boolean = false;
	public var catIndex : int;
	public var subcatIndex : int;
	public var slotSize : OSPoint = new OSPoint ( 1, 1 );
	public var attributes : OSAttribute[] = new OSAttribute[0];
	public var ammunition : OSAmmunition = new OSAmmunition (); 
	public var thumbnail : Texture2D;
	public var preview : Texture2D;
	public var prefabPath : String;
	public var definitions : OSDefinitions;

	public function get category () : String {
		return definitions.categories [ catIndex ].id;
	}
	
	public function get subcategory () : String {
		return definitions.categories [ catIndex ].subcategories [ subcatIndex ];
	}

	public function ChangeAmmunition ( value : int ) {
		ammunition.value += value;
	}

	public function SetAmunition ( value : int ) {
		ammunition.value = value;
	}

	public static function ConvertFromScene ( item : OSItem ) {
		return Resources.Load ( item.prefabPath );
	}
}
