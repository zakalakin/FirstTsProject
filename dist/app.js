"use strict";
//decorators
function autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
//make singleton
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.hostElement = document.getElementById("app");
        this.formTemplate = document.getElementById("project-input");
        var formNode = document.importNode(this.formTemplate.content, true);
        this.formElement = formNode.firstElementChild;
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.valueInputElement = this.formElement.querySelector("#people");
        this.hostElement.appendChild(this.formElement);
        this.formElement.addEventListener("submit", this.submitHandler.bind(this));
        this.projectList = new ProjectList();
    }
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        console.log("submit handler");
        this.projectList.AddProject(this.titleInputElement.innerText, this.descriptionInputElement.innerText, this.valueInputElement.innerText);
    };
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
    ProjectList.prototype.AddProject = function (title, description, value) {
        var project = new Project(title, description, value);
        var projectNode = document.importNode(this.projectTemplate.content, true);
        var projectElement = projectNode.firstElementChild;
        this.projectListElement.appendChild(projectElement);
    };
    return ProjectList;
}());
var Project = /** @class */ (function () {
    //   private _state: number;
    function Project(t, d, v) {
        this._title = t;
        this._description = d;
        this._value = +v;
    }
    return Project;
}());
var projectInput = new ProjectInput();
// const projectList = new ProjectList();
