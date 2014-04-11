#pragma strict

public class OSGrid {
	public var slots : int[,] = new int[0,0];

	function OSGrid ( width : int, height : int ) {
		slots = new int [ width, height ];
	}

	private function CheckSlot ( x : int, y : int ) : boolean {
		if ( x >= slots.GetLength(0) ) {
			Debug.LogError ( "OSGrid | This grid only has up to x index " + ( slots.GetLength(0) - 1 ) + ". You requested " + y );
			return false;
		
		} else if ( y >= slots.GetLength(1) ) {
			Debug.LogError ( "OSGrid | This grid only has up to y index " + ( slots.GetLength(1) - 1 ) + ". You requested " + y );
			return false;
		
		} else {
			return true;
	
		}	
	}

	public function SetDimensions ( width : int, height : int ) {
		var tmpSlots : int[,] = slots;

		slots = new int [ width, height ];

		if ( tmpSlots ) {
			for ( var x : int = 0; x < width; x++ ) {
				for ( var y : int = 0; y < height; y++ ) {
					
				}
			}
		}
	}

	public function GetWidth () : int {
		return slots.GetLength (0);
	}
	
	public function GetHeight () : int {
		return slots.GetLength (1);
	}

	public function GetSlot ( x : int, y : int ) : int {
		if ( CheckSlot ( x, y ) ) {
			return slots [ x, y ];
			
		} else {
			return -1;

		}
	}

	public function SetSlot ( x : int, y : int, i : int ) {
		if ( CheckSlot ( x, y ) ) {
			slots [ x, y ] = i;
		}
	}
}
