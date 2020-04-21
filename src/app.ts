// Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  dragOverHandler(eventL: DragEvent): void;
  dropHandler(eventL: DragEvent): void;
  dragLeaveHandler(eventL: DragEvent): void;
}

//decorators
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;

  minValue?: number;
  maxValue?: number;
}

enum Status {
  Unassigned,
  Start,
  Continue,
  Stop,
}

// Project state Management
type Listener = (items: Postit[]) => void;

function validate(validatableInput: Validatable): boolean {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (validatableInput.minLength != null) {
    isValid =
      isValid &&
      validatableInput.value.toString().trim().length >=
        validatableInput.minLength;
  }

  if (validatableInput.maxLength != null) {
    isValid =
      isValid &&
      validatableInput.value.toString().trim().length <=
        validatableInput.maxLength;
  }

  if (validatableInput.minValue != null) {
    isValid = isValid && validatableInput.value >= validatableInput.minValue;
  }

  if (validatableInput.maxValue != null) {
    isValid = isValid && validatableInput.value <= validatableInput.maxValue;
  }

  return isValid;
}

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
      .getElementById(`${this.status.toString().toLocaleLowerCase()}-post-it`)!
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

class Postit {
  id: string;
  title: string;
  description: string;
  status: Status;

  constructor(t: string, d: string, status: Status) {
    this.title = t.trim();
    this.description = d.trim();
    this.status = status;
    this.id = Math.random().toString();
  }
}

class Postits {
  private listeners: Listener[] = [];

  postitList: Postit[] = [];

  hostElement?: HTMLElement;
  postitTemplate?: HTMLTemplateElement;
  postitElement?: HTMLElement;

  private static _Postits: Postits;

  private constructor() {}

  static getInstance() {
    if (this._Postits) {
      return this._Postits;
    }
    this._Postits = new Postits();

    return this._Postits;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addPostit(postit: Postit): boolean {
    const validation = this.Validation(postit);

    if (validation) {
      this.postitList.push(postit);

      this.updateListeners();
    }

    return validation;
  }

  movePostit(id: string, newStatus: Status) {
    const postit = this.postitList.filter((postit) => postit.id === id)[0];

    if (postit && postit.status !== newStatus) {
      postit.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.postitList.slice());
    }
  }

  private Validation(project: Postit): boolean {
    const titleValidatable: Validatable = {
      value: project.title,
      required: true,
      minLength: 1,
      maxLength: 50,
    };

    const descriptionValidatable: Validatable = {
      value: project.description,
      required: true,
      minLength: 1,
      maxLength: 200,
    };

    const valueValidatable: Validatable = {
      value: project.status,
      required: true,
      minValue: 0,
      maxValue: 3,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(valueValidatable)
    ) {
      return false;
    }
    return true;
  }
}

const postits = Postits.getInstance();

const projectInput = new InputComponent();
const projectList0 = new PostitListComponent(Status.Unassigned);
const projectList = new PostitListComponent(Status.Start);
const projectList2 = new PostitListComponent(Status.Continue);
const projectList3 = new PostitListComponent(Status.Stop);
