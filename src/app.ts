//decorators
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

  projectList: ProjectList;

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

    this.projectList = new ProjectList();
  }

  submitHandler(event: Event) {
    event.preventDefault();
    console.log("submit handler");

    this.projectList.AddProject(
      this.titleInputElement.innerText,
      this.descriptionInputElement.innerText,
      this.valueInputElement.innerText
    );
  }
}

class ProjectList {
  hostElement: HTMLDivElement;
  projectListTemplate: HTMLTemplateElement;
  projectListElement: HTMLElement;
  projectTemplate: HTMLTemplateElement;

  constructor() {
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.projectListTemplate = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    const projectListNode = document.importNode(
      this.projectListTemplate.content,
      true
    );
    this.projectListElement = projectListNode.firstElementChild as HTMLElement;
    this.hostElement.appendChild(this.projectListElement);

    this.projectTemplate = document.getElementById(
      "single-project"
    )! as HTMLTemplateElement;
  }

  AddProject(title: string, description: string, value: string) {
    let project = new Project(title, description, value);
    let projectNode = document.importNode(this.projectTemplate.content, true);
    let projectElement = projectNode.firstElementChild as HTMLElement;
    this.projectListElement.appendChild(projectElement);
  }
}

class Project {
  _title: string;
  _description: string;
  _value: number;

  //   private _state: number;

  constructor(t: string, d: string, v: string) {
    this._title = t;
    this._description = d;
    this._value = +v;
  }
}

const projectInput = new ProjectInput();
// const projectList = new ProjectList();
