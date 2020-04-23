import { InputComponent } from "./component/postit-input";
import { PostitListComponent } from "./component/postit-column";
import { Status } from "./models/status";

new InputComponent();
new PostitListComponent(Status.Unassigned, "cat food");
new PostitListComponent(Status.Start, "unsorted");
// new PostitListComponent(Status.Continue);
// new PostitListComponent(Status.Stop);
