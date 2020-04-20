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

//make singleton
class ProjectInput {
  hostElement: HTMLDivElement;
  formTemplate: HTMLTemplateElement;
  formElement: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  valueInputElement: HTMLInputElement;

  constructor() {
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.formTemplate = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    const formNode = document.importNode(this.formTemplate.content, true);
    this.formElement = formNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.valueInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.hostElement.appendChild(this.formElement);

    this.formElement.addEventListener("submit", this.submitHandler.bind(this));
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

class ProjectList {
  hostElement: HTMLDivElement;
  projectListTemplate: HTMLTemplateElement;
  projectListElement: HTMLElement;
  status: Status;
  assignedProjects: any[];

  constructor(status: Status) {
    this.status = status;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.projectListTemplate = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    const projectListNode = document.importNode(
      this.projectListTemplate.content,
      true
    );
    this.projectListElement = projectListNode.firstElementChild as HTMLElement;
    this.assignedProjects = [];

    this.projectListElement.id = `${this.status
      .toString()
      .toLowerCase()}-post-it`;
    this.projectListElement.querySelector(
      "h2"
    )!.textContent = status.toString();
    this.hostElement.appendChild(this.projectListElement);

    projects.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.status.toString().toLocaleLowerCase()}-post-it`
    )!;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
  }
}

class Project {
  id: number;
  title: string;
  description: string;
  status: Status;

  constructor(t: string, d: string, status: Status) {
    this.title = t.trim();
    this.description = d.trim();
    this.status = status;
    this.id = Math.random();
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
      this.hostElement = document.getElementById(
        `${project.status.toString()}-post-it`
      )! as HTMLElement;

      this.projectTemplate = document.getElementById(
        "post-it"
      )! as HTMLTemplateElement;

      const projectNode = document.importNode(
        this.projectTemplate.content,
        true
      );

      this.projectElement = projectNode.firstElementChild as HTMLElement;
      this.projectElement.innerText = `${project.title} - ${project.description}`;
      this.hostElement.appendChild(this.projectElement);

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
const projectList0 = new ProjectList(Status.Unassigned); //project state instead?
const projectList = new ProjectList(Status.Start);
const projectList2 = new ProjectList(Status.Continue);
const projectList3 = new ProjectList(Status.Stop);
