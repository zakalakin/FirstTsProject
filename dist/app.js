"use strict";
//make singleton
var ProjectInput = /** @class */ (function () {
    //   private _title: string;
    //   private _description: string;
    //   private _people: number;
    //   constructor(t: string, d: string, p: number) {
    //     this._title = t;
    //     this._description = d;
    //     this._people = p;
    //   }
    function ProjectInput() {
        this.formElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        var formContent = this.formElement.content.cloneNode(true);
        this.hostElement.appendChild(formContent);
    }
    return ProjectInput;
}());
var projectInput = new ProjectInput();
