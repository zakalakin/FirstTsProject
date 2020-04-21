/// <reference path = "./models/drag-drop.ts"/>
/// <reference path = "./models/postit.ts"/>
/// <reference path = "./state/postit-state.ts"/>
/// <reference path = "./decorators/autobind.ts"/>
/// <reference path = "./component/postit-input.ts"/>
/// <reference path = "./component/postit-list.ts"/>

namespace App {
  //component base class

  new InputComponent();
  new PostitListComponent(Status.Unassigned);
  new PostitListComponent(Status.Start);
  new PostitListComponent(Status.Continue);
  new PostitListComponent(Status.Stop);
}
