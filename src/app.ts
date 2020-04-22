import { InputComponent } from "./component/postit-input";
import { PostitListComponent } from "./component/postit-list";
import { Status } from "./models/status";

new InputComponent();
new PostitListComponent(Status.Unassigned);
new PostitListComponent(Status.Start);
new PostitListComponent(Status.Continue);
new PostitListComponent(Status.Stop);
