/// <reference path = "drag-drop-interfaces.ts"/>
/// <reference path = "postit-model.ts"/>
/// <reference path = "postit-state.ts"/>

namespace App {
  function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };
    return adjDescriptor;
  }

  //component base class
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      tempalteId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        tempalteId
      )! as HTMLTemplateElement;

      this.hostElement = document.getElementById(hostElementId)! as T;

      const formNode = document.importNode(this.templateElement.content, true);
      this.element = formNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    abstract configure(): void;

    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtStart ? "afterbegin" : "beforeend",
        this.element
      );
    }
  }

  class InputComponent extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    valueInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", false, "user-input");

      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.valueInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler.bind(this));
    }

    private submitHandler(event: Event) {
      event.preventDefault();

      const postit = new Postit(
        this.titleInputElement.value,
        this.descriptionInputElement.value,
        +this.valueInputElement.value
      );

      const postitValidation = postits.addPostit(postit);

      if (postitValidation) {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.valueInputElement.value = "";
      } else {
        alert(`invlaid input: ${"Invalid input"}`);
      }
    }
  }

  class PostitListComponent extends Component<HTMLDivElement, HTMLElement>
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
      // console.log(event.dataTransfer!.getData("text/plain"));
      // console.log(event);
      // console.log(event.target);

      const postitId = event.dataTransfer!.getData("text/plain");
      postits.movePostit(postitId, this.status);
      // postits.
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
        .getElementById(
          `${this.status.toString().toLocaleLowerCase()}-post-it`
        )!
        .querySelector("ul")!;
      listEl.innerHTML = "";
      listEl.id = listId;

      for (const postitItem of this.assignedPostits) {
        new PostitComponent(this.element.querySelector("ul")!.id, postitItem);
      }
    }
  }

  class PostitComponent extends Component<HTMLUListElement, HTMLLIElement>
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

  new InputComponent();
  new PostitListComponent(Status.Unassigned);
  new PostitListComponent(Status.Start);
  new PostitListComponent(Status.Continue);
  new PostitListComponent(Status.Stop);
}
