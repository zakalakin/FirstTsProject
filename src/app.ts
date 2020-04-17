//decorators

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;

  minValue?: number;
  maxValue?: number;
}

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
      +this.valueInputElement.value
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
    value: number
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
  validationMessage = "Some of your input is invalid, try again.";

  constructor(t: string, d: string, v: number) {
    this._title = t.trim();
    this._description = d.trim();
    this._value = v;

    const titleValidatable: Validatable = {
      value: this._title,
      required: true,
      minLength: 1,
      maxLength: 50,
    };

    const descriptionValidatable: Validatable = {
      value: this._description,
      required: false,
      minLength: 0,
      maxLength: 200,
    };

    const valueValidatable: Validatable = {
      value: this._value,
      required: false,
      minValue: 0,
      maxValue: 99,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(valueValidatable)
    ) {
      this.isValid = false;
    }
  }
}

const projectInput = new ProjectInput();
// const projectList = new ProjectList();
