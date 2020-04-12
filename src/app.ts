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
}
