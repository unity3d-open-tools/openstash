#pragma strict

public class OSSkillTree extends MonoBehaviour {
	public class Skill { 
		public var name : String = "";
		public var description : String  = "";
		public var level : int = 1;
		public var mpCost : float = 0;
		public var active : boolean = false;
		public var enabled : boolean = false;
		public var attributes : OSAttribute[] = new OSAttribute[0];

		public function GetAttributeValue ( attrName : String ) : float {
			for ( var a : OSAttribute in attributes ) {
				if ( a.name == attrName ) {
					return a.value;
				}
			}

			return -1;
		}
	}

	public class Root {
		public var name : String = "";
		public var skills :  Skill [] = new Skill [0];
	}

	public var definitions : OSDefinitions;
	public var roots : Root[] = new Root[0];
	public var eventHandler : GameObject;

	private function SetDefinitions () {
		for ( var root : Root in roots ) {
			for ( var skill : Skill in root.skills ) {
				for ( var attr : OSAttribute in skill.attributes ) {
					attr.definitions = definitions;
				}
			}
		}
	}

	private function DoCallback ( message : String ) {
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, SendMessageOptions.DontRequireReceiver );
		}
	}

	private function DoCallback ( message : String, argument : Skill ) {
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, argument, SendMessageOptions.DontRequireReceiver );
		}
	}

	public function SetActive ( skillName : String, skillState : boolean ) {
		for ( var root : Root in roots ) {
			for ( var skill : Skill in root.skills ) {
				if ( skill.name == skillName ) {
					SetActive ( skill, skillState );
					return;
				}
			}
		}
	}

	public function SetActive ( rootName : String, skillName : String, skillState : boolean ) {
		for ( var root : Root in roots ) {
			if ( root.name == rootName ) {
				for ( var skill : Skill in root.skills ) {
					if ( skill.name == skillName ) {
						SetActive ( skill, skillState );
						return;
					}
				}
			}
		}
	}
	
	public function SetActive ( skill : Skill, state : boolean ) {
		skill.active = state;
		
		if ( skill.active ) {
			DoCallback ( "OnActivateSkill", skill );
		
		} else {
			DoCallback ( "OnDeactivateSkill", skill );

		}

	}

	public function SetActiveAll ( skillState : boolean ) {
		for ( var root : Root in roots ) {
			for ( var skill : Skill in root.skills ) {
				skill.active = skillState;
			}
		}
		
		if ( skillState ) {
			DoCallback ( "OnActivateAllSkills" );
		
		} else {
			DoCallback ( "OnDeactivateAllSkills" );

		}
	}

	public function GetRoot ( rootName : String ) : Root {
		for ( var root : Root in roots ) {
			if ( root.name == rootName ) {
				return root;
			}
		}

		return null;
	}

	public function GetTotalMPCost () : float {
		var result : float = 0;

		for ( var root : Root in roots ) {
			for ( var skill : Skill in root.skills ) {
				if ( skill.active ) {
					result += skill.mpCost;
				}
			}
		}

		return result;
	}

	public function Start () {
		SetDefinitions ();

		if ( !eventHandler ) {
			eventHandler = GameObject.FindWithTag ( "EventHandler" );
		}
	}
}
