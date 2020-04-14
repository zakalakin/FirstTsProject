"use strict";
//make singleton
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        {
            this.formTemplate = document.getElementById("project-input");
            this.hostElement = document.getElementById("app");
            var importedNode = document.importNode(this.formTemplate.content, true);
            this.formElement = importedNode.firstElementChild;
            this.formElement.id = "user-input";
            this.hostElement.appendChild(this.formElement);
        }
    }
    return ProjectInput;
}());
var projectInput = new ProjectInput();
