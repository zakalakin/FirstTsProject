//make singleton
class ProjectInput {
  formElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;

  //   private _title: string;
  //   private _description: string;
  //   private _people: number;

  //   constructor(t: string, d: string, p: number) {
  //     this._title = t;
  //     this._description = d;
  //     this._people = p;
  //   }

  constructor() {
    this.formElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const formContent = this.formElement.content.cloneNode(true);
    this.hostElement.appendChild(formContent);
  }
}

const projectInput = new ProjectInput();
