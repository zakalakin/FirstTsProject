"use strict";
//testing
//render template
//get input on submit
//validate input
var _a, _b;
//on page load?
// function showContent() {
// }
var form = document.getElementById("project-input");
var formNode = form.content.cloneNode(true);
(_a = document.getElementById("app")) === null || _a === void 0 ? void 0 : _a.appendChild(formNode);
var projectList = document.getElementById("project-list");
var projectListNode = projectList.content.cloneNode(true);
(_b = document.getElementById("app")) === null || _b === void 0 ? void 0 : _b.appendChild(projectListNode);
// function onSubmit() {
//     let title: string;
//     let description: string;
//     let people: number;
//     const project = new ProjectInput(title, description, people);
// }
var ProjectInput = /** @class */ (function () {
    function ProjectInput(t, d, p) {
        this._title = t;
        this._description = d;
        this._people = p;
    }
    ProjectInput.prototype.AddProjectToList = function () {
        var _a;
        console.log("lets start printing stuff");
        var projectDiv = document.createElement("div");
        var titleP = document.createElement("p");
        var descriptionP = document.createElement("p");
        var peopleP = document.createElement("p");
        var titleNode = document.createTextNode("title: " + this._title);
        var descriptionNode = document.createTextNode("description: " + this._description);
        var peopleNode = document.createTextNode("people: " + this._people);
        titleP.appendChild(titleNode);
        descriptionP.appendChild(descriptionNode);
        peopleP.appendChild(peopleNode);
        projectDiv.appendChild(titleP);
        projectDiv.appendChild(descriptionP);
        projectDiv.appendChild(peopleP);
        console.log("lets finish printing project");
        (_a = document.getElementById("single-project")) === null || _a === void 0 ? void 0 : _a.appendChild(projectDiv);
    };
    ProjectInput.prototype.AddProject = function () {
        var project = document.getElementById("single-project");
        var titleP = document.createElement("p");
        var descriptionP = document.createElement("p");
        var peopleP = document.createElement("p");
        var titleNode = document.createTextNode("title: " + this._title);
        var descriptionNode = document.createTextNode("description: " + this._description);
        var peopleNode = document.createTextNode("people: " + this._people);
        titleP.appendChild(titleNode);
        descriptionP.appendChild(descriptionNode);
        peopleP.appendChild(peopleNode);
        project.appendChild(titleP);
        project.appendChild(descriptionP);
        project.appendChild(peopleP);
        var projectNode = project.content.cloneNode(true);
        projectNode.appendChild(project);
    };
    return ProjectInput;
}());
var p1 = new ProjectInput("catology", "learn all about cats, they're fun", 235682);
var p2 = new ProjectInput("The study of medi-evil water collecting.", "It's well boring", 0);
p1.AddProjectToList();
p2.AddProjectToList();
p2.AddProject();
