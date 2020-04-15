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

  private submitHandler(event: Event) {
    event.preventDefault();

    const validInput = this.projectList.AddProject(
      this.titleInputElement.value,
      this.descriptionInputElement.value,
      this.valueInputElement.value
    );

    if (validInput[0]) {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.valueInputElement.value = "";
    } else {
      alert(`invlaid input: ${validInput[1]}`);
    }
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

  AddProject(
    title: string,
    description: string,
    value: string
  ): [boolean, string] {
    let project = new Project(title, description, value);

    if (project.isValid) {
      let projectNode = document.importNode(this.projectTemplate.content, true);
      let projectElement = projectNode.firstElementChild as HTMLElement;
      this.projectListElement.appendChild(projectElement);
    }

    return [project.isValid, project.validationMessage];
  }
}

class Project {
  _title: string;
  _description: string;
  _value: number;
  isValid = true;
  validationMessage = "";

  //   private _state: number;

  constructor(t: string, d: string, v: string) {
    if (t.trim().length === 0) {
      this.isValid = false;
      this.validationMessage = "Title is empty";
    }
    if (d.trim().length === 0) {
      this.isValid = false;
      this.validationMessage = "Description is empty";
    }
    if (v.trim().length === 0) {
      this.isValid = false;
      this.validationMessage = "Value is empty";
    }
    this._title = t.trim();
    this._description = d.trim();
    this._value = +v.trim();
  }
}

const projectInput = new ProjectInput();
// const projectList = new ProjectList();
