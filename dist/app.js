"use strict";
//testing
//render template
//get input on submit
//validate input
var _a;
//on page load?
// function showContent() {
// }
var form = document.getElementById("project-input");
var formNode = form.content.cloneNode(true);
(_a = document.getElementById("app")) === null || _a === void 0 ? void 0 : _a.appendChild(formNode);
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
    return ProjectInput;
}());
