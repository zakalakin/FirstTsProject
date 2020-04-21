/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/postit.ts" />
/// <reference path="../models/drag-drop.ts" />

namespace App {
  export class PostitComponent
    extends Component<HTMLUListElement, HTMLLIElement>
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
}
