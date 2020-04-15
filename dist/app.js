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
        var validInput = this.projectList.AddProject(this.titleInputElement.value, this.descriptionInputElement.value, this.valueInputElement.value);
        if (validInput[0]) {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.valueInputElement.value = "";
        }
        else {
            alert("invlaid input: " + validInput[1]);
        }
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
        if (project.isValid) {
            var projectNode = document.importNode(this.projectTemplate.content, true);
            var projectElement = projectNode.firstElementChild;
            this.projectListElement.appendChild(projectElement);
        }
        return [project.isValid, project.validationMessage];
    };
    return ProjectList;
}());
var Project = /** @class */ (function () {
    //   private _state: number;
    function Project(t, d, v) {
        this.isValid = true;
        this.validationMessage = "";
        if (t.trim().length === 0) {
            this.isValid = false;
            this.validationMessage = "Title is empty";
        }
        if (d.trim().length === 0) {
            this.isValid = false;
            this.validationMessage = "Description is empty";
        }
        if (v.trim().length === 0) {
            this.isValid = false;
            this.validationMessage = "Value is empty";
        }
        this._title = t.trim();
        this._description = d.trim();
        this._value = +v.trim();
    }
    return Project;
}());
var projectInput = new ProjectInput();
// const projectList = new ProjectList();
