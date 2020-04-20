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
type Listener = (items: Project[]) => void;

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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const project = new Project(
      this.titleInputElement.value,
      this.descriptionInputElement.value,
      +this.valueInputElement.value
    );

    const projectValidation = projects.addProject(project);

    if (projectValidation) {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.valueInputElement.value = "";
    } else {
      alert(`invlaid input: ${"Invalid input"}`);
    }
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: any[];

  constructor(public status: Status) {
    super(
      "project-list",
      "app",
      false,
      `${status.toString().toLowerCase()}-post-it`
    );

    this.assignedProjects = [];

    this.configure();

    projects.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        return prj.status === this.status;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  configure() {
    this.element.querySelector("h2")!.textContent = this.status.toString();
  }

  private renderProjects() {
    const listId = `${this.status.toString()}-post-it-list`;
    const listEl = document
      .getElementById(`${this.status.toString().toLocaleLowerCase()}-post-it`)!
      .querySelector("ul")!;
    listEl.innerHTML = "";
    listEl.id = listId;

    for (const projectItem of this.assignedProjects) {
      new ProjectComponent(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

class ProjectComponent extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("post-it", hostId, false, project.id);

    this.project = project;

    this.configure();
    this.renderContent();
  }
  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class Project {
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

class Projects {
  private listeners: Listener[] = [];

  projectList: Project[] = [];

  hostElement?: HTMLElement;
  projectTemplate?: HTMLTemplateElement;
  projectElement?: HTMLElement;

  private static _Projects: Projects;

  private constructor() {}

  static getInstance() {
    if (this._Projects) {
      return this._Projects;
    }
    this._Projects = new Projects();

    return this._Projects;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(project: Project): boolean {
    const validation = this.Validation(project);

    if (validation) {
      this.projectList.push(project);

      for (const listenerFn of this.listeners) {
        listenerFn(this.projectList.slice());
      }
    }

    return validation;
  }

  private Validation(project: Project): boolean {
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

const projects = Projects.getInstance();

const projectInput = new ProjectInput();
const projectList0 = new ProjectList(Status.Unassigned);
const projectList = new ProjectList(Status.Start);
const projectList2 = new ProjectList(Status.Continue);
const projectList3 = new ProjectList(Status.Stop);
