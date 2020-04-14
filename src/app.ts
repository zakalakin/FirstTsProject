//make singleton
class ProjectInput {
  hostElement: HTMLDivElement;
  formTemplate: HTMLTemplateElement;
  formElement: HTMLFormElement;

  constructor() {
    {
      this.hostElement = document.getElementById("app")! as HTMLDivElement;
      this.formTemplate = document.getElementById(
        "project-input"
      )! as HTMLTemplateElement;

      const formNode = document.importNode(this.formTemplate.content, true);
      this.formElement = formNode.firstElementChild as HTMLFormElement;
      this.formElement.id = "user-input";

      this.hostElement.appendChild(this.formElement);
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

  AddProject(id: string) {
    let projectNode = document.importNode(this.projectTemplate.content, true);
    let projectElement = projectNode.firstElementChild as HTMLElement;
    projectElement.id = id;
    this.projectListElement.appendChild(projectElement);
  }
}

// class Project {
//

//     constructor(){
//         this.hostElement = document.getElementById("app")! as HTMLDivElement;

//     }
// }

const projectInput = new ProjectInput();
const projectList = new ProjectList();
projectList.AddProject("cat");
projectList.AddProject("dog");
projectList.AddProject("mouse");
