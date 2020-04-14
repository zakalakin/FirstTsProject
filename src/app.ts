//make singleton
class ProjectInput {
  formTemplate: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;

  constructor() {
    {
      this.formTemplate = document.getElementById(
        "project-input"
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById("app")! as HTMLDivElement;

      const importedNode = document.importNode(this.formTemplate.content, true);
      this.formElement = importedNode.firstElementChild as HTMLFormElement;
      this.formElement.id = "user-input";

      this.hostElement.appendChild(this.formElement);
    }
  }
}

const projectInput = new ProjectInput();
