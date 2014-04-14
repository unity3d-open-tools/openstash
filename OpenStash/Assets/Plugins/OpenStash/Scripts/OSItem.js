#pragma strict

public class OSAttribute {
	public var index : int = 0;
	public var value : float = 0;
	public var item : OSItem;

	function OSAttribute ( item : OSItem ) {
		this.item = item;
	}

	public function get id () : String {
		return item.definitions.attributes[index].id;
	}

	public function get name () : String {
		return item.definitions.attributes[index].name;
	}
	
	public function get suffix () : String {
		return item.definitions.attributes[index].suffix;
	}
}

public class OSItem extends MonoBehaviour {
	public var id : String = "New Item";
	public var description : String = "This is a new item";
	public var stackable : boolean = false;
	public var canDrop : boolean = true;
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

	public function GetAttribute ( id : String ) : float {
		for ( var i : int = 0; i < attributes.Length; i++ ) {
			if ( attributes[i].id == id ) {
				return attributes[i].value;
			}
		}

		return -1;
	}

	public function AdoptValues ( item : OSItem ) {
		this.ammunition.value = item.ammunition.value;

		for ( var i : int = 0; i < item.attributes.Length; i++ ) {
			this.attributes[i].value = item.attributes[i].value;
		}
	}

	public static function ConvertFromScene ( item : OSItem ) {
		return Resources.Load ( item.prefabPath );
	}
}
