/// <reference path = "./models/status.ts"/>
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
