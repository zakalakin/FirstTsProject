import { ComponentPostit } from "./component-postit";
import { PostitComponent } from "./postit";
import { autobind } from "../decorators/autobind";
import { postits } from "../state/postit-column";
import { Postit } from "../models/postit";
import { DragTarget } from "../models/drag-drop";
import { Status } from "../models/status";

export class PostitListComponent
  extends ComponentPostit<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedPostits: any[];

  constructor(public status: Status) {
    super(
      "project-list",
      "app",
      false,
      `${status.toString().toLowerCase()}-post-it`
    );

    this.assignedPostits = [];

    this.configure();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const postitId = event.dataTransfer!.getData("text/plain");
    postits.movePostit(postitId, this.status);
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.querySelector("h2")!.textContent = this.status.toString();

    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    postits.addListener((postit: Postit[]) => {
      const relevantProjects = postit.filter((prj) => {
        return prj.status === this.status;
      });
      this.assignedPostits = relevantProjects;
      this.renderPostits();
    });
  }

  private renderPostits() {
    const listId = `${this.status.toString()}-post-it-list`;
    const listEl = document
      .getElementById(`${this.status.toString().toLocaleLowerCase()}-post-it`)!
      .querySelector("ul")!;
    listEl.innerHTML = "";
    listEl.id = listId;

    for (const postitItem of this.assignedPostits) {
      new PostitComponent(this.element.querySelector("ul")!.id, postitItem);
    }
  }
}