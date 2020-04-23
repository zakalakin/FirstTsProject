import { ComponentPostit } from "./component-postit";
import { autobind } from "../decorators/autobind";
import { Postit } from "../models/postit";
import { Draggable } from "../models/drag-drop";

export class PostitComponent
  extends ComponentPostit<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private postit: Postit;

  constructor(hostId: string, postit: Postit) {
    super("post-it", hostId, false, postit.id);

    this.postit = postit;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.postit.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.postit.title;
    this.element.querySelector("p")!.textContent = this.postit.description;
  }
}
