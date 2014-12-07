using UnityEngine;
using System.Collections;

public class OSSkillTree : MonoBehaviour {
	[System.Serializable]
public class Skill { 
		public string name = "";
		public string description  = "";
		public int level = 1;
		public float mpCost = 0;
		public bool active = false;
		public bool enabled = false;
		public OSAttribute[] attributes = new OSAttribute[0];

		public float GetAttributeValue ( string attrName ) {
			foreach ( OSAttribute a in attributes ) {
				if ( a.name == attrName ) {
					return a.value;
				}
			}

			return -1;
		}
	}

	[System.Serializable]
public class Root {
		public string name = "";
		public Skill [] skills = new Skill [0];
	}

	public OSDefinitions definitions;
	public Root[] roots = new Root[0];
	public GameObject eventHandler;

	private void SetDefinitions () {
		foreach ( Root root in roots ) {
			foreach ( Skill skill in root.skills ) {
				foreach ( OSAttribute attr in skill.attributes ) {
					attr.definitions = definitions;
				}
			}
		}
	}

	private void DoCallback ( string message ) {
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, SendMessageOptions.DontRequireReceiver );
		}
	}

	private void DoCallback ( string message, Skill argument ) {
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, argument, SendMessageOptions.DontRequireReceiver );
		}
	}

	public void SetActive ( string skillName, bool skillState ) {
		foreach ( Root root in roots ) {
			foreach ( Skill skill in root.skills ) {
				if ( skill.name == skillName ) {
					SetActive ( skill, skillState );
					return;
				}
			}
		}
	}

	public void SetActive ( string rootName, string skillName, bool skillState ) {
		foreach ( Root root in roots ) {
			if ( root.name == rootName ) {
				foreach ( Skill skill in root.skills ) {
					if ( skill.name == skillName ) {
						SetActive ( skill, skillState );
						return;
					}
				}
			}
		}
	}
	
	public void SetActive ( Skill skill, bool state ) {
		skill.active = state;
		
		if ( skill.active ) {
			DoCallback ( "OnActivateSkill", skill );
		
		} else {
			DoCallback ( "OnDeactivateSkill", skill );

		}

	}

	public void SetActiveAll ( bool skillState ) {
		foreach ( Root root in roots ) {
			foreach ( Skill skill in root.skills ) {
				skill.active = skillState;
			}
		}
		
		if ( skillState ) {
			DoCallback ( "OnActivateAllSkills" );
		
		} else {
			DoCallback ( "OnDeactivateAllSkills" );

		}
	}

	public Root GetRoot ( string rootName ) {
		foreach ( Root root in roots ) {
			if ( root.name == rootName ) {
				return root;
			}
		}

		return null;
	}

	public float GetTotalMPCost () {
		float result = 0;

		foreach ( Root root in roots ) {
			foreach ( Skill skill in root.skills ) {
				if ( skill.active ) {
					result += skill.mpCost;
				}
			}
		}

		return result;
	}

	public void Start () {
		SetDefinitions ();

		if ( !eventHandler ) {
			eventHandler = GameObject.FindWithTag ( "EventHandler" );
		}
	}
}
