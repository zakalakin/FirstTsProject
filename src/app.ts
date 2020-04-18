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

    if (project.isValid) {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.valueInputElement.value = "";
    } else {
      alert(`invlaid input: ${project.validationMessage}`);
    }
  }
}

class ProjectList {
  hostElement: HTMLDivElement;
  projectListTemplate: HTMLTemplateElement;
  projectListElement: HTMLElement;

  constructor(type: "Start" | "Continue" | "Stop" | "Unsorted") {
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.projectListTemplate = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    const projectListNode = document.importNode(
      this.projectListTemplate.content,
      true
    );
    this.projectListElement = projectListNode.firstElementChild as HTMLElement;

    this.projectListElement.id = `${type.toLowerCase()}-post-it`;
    this.projectListElement.querySelector("h2")!.textContent = type;
    this.hostElement.appendChild(this.projectListElement);
  }
}

class Project {
  _title: string;
  _description: string;
  _value: number;
  isValid = true;
  validationMessage = "Your input is invalid, try harder...";

  hostElement?: HTMLElement;
  projectTemplate?: HTMLTemplateElement;
  projectElement?: HTMLElement;

  constructor(t: string, d: string, v: number) {
    this._title = t.trim();
    this._description = d.trim();
    this._value = v;

    this.Validation();

    if (this.isValid) {
      this.hostElement = document.getElementById(
        "unsorted-post-it"
      )! as HTMLElement;

      this.projectTemplate = document.getElementById(
        "post-it"
      )! as HTMLTemplateElement;

      const projectNode = document.importNode(
        this.projectTemplate.content,
        true
      );

      this.projectElement = projectNode.firstElementChild as HTMLElement;
      this.projectElement.innerText = `${this._title} - ${this._description} - ${this._value}`;
      this.hostElement.appendChild(this.projectElement);
    }
  }

  private Validation() {
    const titleValidatable: Validatable = {
      value: this._title,
      required: true,
      minLength: 1,
      maxLength: 50,
    };

    const descriptionValidatable: Validatable = {
      value: this._description,
      required: true,
      minLength: 1,
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
const projectList0 = new ProjectList("Unsorted");
const projectList = new ProjectList("Start");
const projectList2 = new ProjectList("Continue");
const projectList3 = new ProjectList("Stop");
