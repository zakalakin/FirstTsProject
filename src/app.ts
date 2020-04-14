//testing
//render template
//get input on submit
//validate input

//on page load?
// function showContent() {

// }

var form = document.getElementById("project-input")! as HTMLTemplateElement;
var formNode = form.content.cloneNode(true);
document.getElementById("app")?.appendChild(formNode);

var projectList = document.getElementById(
  "project-list"
)! as HTMLTemplateElement;
var projectListNode = projectList.content.cloneNode(true);
document.getElementById("app")?.appendChild(projectListNode);

// function onSubmit() {

//     let title: string;
//     let description: string;
//     let people: number;

//     const project = new ProjectInput(title, description, people);
// }

class ProjectInput {
  private _title: string;
  private _description: string;
  private _people: number;

  constructor(t: string, d: string, p: number) {
    this._title = t;
    this._description = d;
    this._people = p;
  }

  AddProjectToList() {
    console.log("lets start printing stuff");
    let projectDiv = document.createElement("div");
    let titleP = document.createElement("p");
    let descriptionP = document.createElement("p");
    let peopleP = document.createElement("p");

    let titleNode = document.createTextNode("title: " + this._title);
    let descriptionNode = document.createTextNode(
      "description: " + this._description
    );
    let peopleNode = document.createTextNode("people: " + this._people);

    titleP.appendChild(titleNode);
    descriptionP.appendChild(descriptionNode);
    peopleP.appendChild(peopleNode);

    projectDiv.appendChild(titleP);
    projectDiv.appendChild(descriptionP);
    projectDiv.appendChild(peopleP);
    console.log("lets finish printing project");

    document.getElementById("single-project")?.appendChild(projectDiv);
  }

  AddProject() {
    var project = document.getElementById(
      "single-project"
    )! as HTMLTemplateElement;

    let titleP = document.createElement("p");
    let descriptionP = document.createElement("p");
    let peopleP = document.createElement("p");

    let titleNode = document.createTextNode("title: " + this._title);
    let descriptionNode = document.createTextNode(
      "description: " + this._description
    );
    let peopleNode = document.createTextNode("people: " + this._people);

    titleP.appendChild(titleNode);
    descriptionP.appendChild(descriptionNode);
    peopleP.appendChild(peopleNode);

    project.appendChild(titleP);
    project.appendChild(descriptionP);
    project.appendChild(peopleP);

    var projectNode = project.content.cloneNode(true);

    projectNode.appendChild(project);
  }
}

const p1 = new ProjectInput(
  "catology",
  "learn all about cats, they're fun",
  235682
);
const p2 = new ProjectInput(
  "The study of medi-evil water collecting.",
  "It's well boring",
  0
);

p1.AddProjectToList();
p2.AddProjectToList();

p2.AddProject();
