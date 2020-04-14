"use strict";
//make singleton
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        {
            this.hostElement = document.getElementById("app");
            this.formTemplate = document.getElementById("project-input");
            var formNode = document.importNode(this.formTemplate.content, true);
            this.formElement = formNode.firstElementChild;
            this.formElement.id = "user-input";
            this.hostElement.appendChild(this.formElement);
        }
    }
    return ProjectInput;
}());
var ProjectList = /** @class */ (function () {
    function ProjectList() {
        this.hostElement = document.getElementById("app");
        this.projectListTemplate = document.getElementById("project-list");
        var projectListNode = document.importNode(this.projectListTemplate.content, true);
        this.projectListElement = projectListNode.firstElementChild;
        this.hostElement.appendChild(this.projectListElement);
        this.projectTemplate = document.getElementById("single-project");
    }
    ProjectList.prototype.AddProject = function (id) {
        var projectNode = document.importNode(this.projectTemplate.content, true);
        var projectElement = projectNode.firstElementChild;
        projectElement.id = id;
        this.projectListElement.appendChild(projectElement);
    };
    return ProjectList;
}());
// class Project {
//
//     constructor(){
//         this.hostElement = document.getElementById("app")! as HTMLDivElement;
//     }
// }
var projectInput = new ProjectInput();
var projectList = new ProjectList();
projectList.AddProject("cat");
projectList.AddProject("dog");
projectList.AddProject("mouse");
