"use strict";
//decorators
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Status;
(function (Status) {
    Status[Status["Unassigned"] = 0] = "Unassigned";
    Status[Status["Start"] = 1] = "Start";
    Status[Status["Continue"] = 2] = "Continue";
    Status[Status["Stop"] = 3] = "Stop";
})(Status || (Status = {}));
function validate(validatableInput) {
    var isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null) {
        isValid =
            isValid &&
                validatableInput.value.toString().trim().length >=
                    validatableInput.minLength;
    }
    if (validatableInput.maxLength != null) {
        isValid =
            isValid &&
                validatableInput.value.toString().trim().length <=
                    validatableInput.maxLength;
    }
    if (validatableInput.minValue != null) {
        isValid = isValid && validatableInput.value >= validatableInput.minValue;
    }
    if (validatableInput.maxValue != null) {
        isValid = isValid && validatableInput.value <= validatableInput.maxValue;
    }
    return isValid;
}
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
//component base class
var Component = /** @class */ (function () {
    function Component(tempalteId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(tempalteId);
        this.hostElement = document.getElementById(hostElementId);
        var formNode = document.importNode(this.templateElement.content, true);
        this.element = formNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    };
    return Component;
}());
//make singleton
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "project-input", "app", false, "user-input") || this;
        _this.titleInputElement = _this.element.querySelector("#title");
        _this.descriptionInputElement = _this.element.querySelector("#description");
        _this.valueInputElement = _this.element.querySelector("#people");
        _this.element.addEventListener("submit", _this.submitHandler.bind(_this));
        return _this;
    }
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var project = new Project(this.titleInputElement.value, this.descriptionInputElement.value, +this.valueInputElement.value);
        var projectValidation = projects.addProject(project);
        if (projectValidation) {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.valueInputElement.value = "";
        }
        else {
            alert("invlaid input: " + "Invalid input");
        }
    };
    return ProjectInput;
}(Component));
var ProjectList = /** @class */ (function () {
    function ProjectList(status) {
        var _this = this;
        this.status = status;
        this.hostElement = document.getElementById("app");
        this.projectListTemplate = document.getElementById("project-list");
        var projectListNode = document.importNode(this.projectListTemplate.content, true);
        this.projectListElement = projectListNode.firstElementChild;
        this.assignedProjects = [];
        this.projectListElement.id = this.status
            .toString()
            .toLowerCase() + "-post-it";
        this.projectListElement.querySelector("h2").textContent = status.toString();
        this.hostElement.appendChild(this.projectListElement);
        projects.addListener(function (projects) {
            var relevantProjects = projects.filter(function (prj) {
                return prj.status === _this.status;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    }
    ProjectList.prototype.renderProjects = function () {
        var sectionEl = document.getElementById(this.status.toString().toLocaleLowerCase() + "-post-it");
        var listEl = sectionEl.getElementsByTagName("ul")[0];
        listEl.innerHTML = "";
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var projectItem = _a[_i];
            var listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    };
    return ProjectList;
}());
var Project = /** @class */ (function () {
    function Project(t, d, status) {
        this.title = t.trim();
        this.description = d.trim();
        this.status = status;
        this.id = Math.random();
    }
    return Project;
}());
var Projects = /** @class */ (function () {
    function Projects() {
        this.listeners = [];
        this.projectList = [];
    }
    Projects.getInstance = function () {
        if (this._Projects) {
            return this._Projects;
        }
        this._Projects = new Projects();
        return this._Projects;
    };
    Projects.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    Projects.prototype.addProject = function (project) {
        var validation = this.Validation(project);
        if (validation) {
            // this.hostElement = document.getElementById(
            //   `${project.status.toString()}-post-it`
            // )! as HTMLElement;
            // this.projectTemplate = document.getElementById(
            //   "post-it"
            // )! as HTMLTemplateElement;
            // const projectNode = document.importNode(
            //   this.projectTemplate.content,
            //   true
            // );
            // this.projectElement = projectNode.firstElementChild as HTMLElement;
            // this.projectElement.innerText = `${project.title} - ${project.description}`;
            // this.hostElement.appendChild(this.projectElement);
            this.projectList.push(project);
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listenerFn = _a[_i];
                listenerFn(this.projectList.slice());
            }
        }
        return validation;
    };
    Projects.prototype.Validation = function (project) {
        var titleValidatable = {
            value: project.title,
            required: true,
            minLength: 1,
            maxLength: 50,
        };
        var descriptionValidatable = {
            value: project.description,
            required: true,
            minLength: 1,
            maxLength: 200,
        };
        var valueValidatable = {
            value: project.status,
            required: true,
            minValue: 0,
            maxValue: 3,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(valueValidatable)) {
            return false;
        }
        return true;
    };
    return Projects;
}());
var projects = Projects.getInstance();
var projectInput = new ProjectInput();
var projectList0 = new ProjectList(Status.Unassigned); //project state instead?
var projectList = new ProjectList(Status.Start);
var projectList2 = new ProjectList(Status.Continue);
var projectList3 = new ProjectList(Status.Stop);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FBWVosSUFBSyxNQUtKO0FBTEQsV0FBSyxNQUFNO0lBQ1QsK0NBQVUsQ0FBQTtJQUNWLHFDQUFLLENBQUE7SUFDTCwyQ0FBUSxDQUFBO0lBQ1IsbUNBQUksQ0FBQTtBQUNOLENBQUMsRUFMSSxNQUFNLEtBQU4sTUFBTSxRQUtWO0FBS0QsU0FBUyxRQUFRLENBQUMsZ0JBQTZCO0lBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUM3QixPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQzVFO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ3RDLE9BQU87WUFDTCxPQUFPO2dCQUNQLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO29CQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7S0FDaEM7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDdEMsT0FBTztZQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07b0JBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztLQUNoQztJQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNyQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7S0FDMUU7SUFFRCxJQUFJLGdCQUFnQixD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LElBQU0sWUFBWSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vZGVjb3JhdG9yc1xyXG5cclxuaW50ZXJmYWNlIFZhbGlkYXRhYmxlIHtcclxuICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gIHJlcXVpcmVkPzogYm9vbGVhbjtcclxuICBtaW5MZW5ndGg/OiBudW1iZXI7XHJcbiAgbWF4TGVuZ3RoPzogbnVtYmVyO1xyXG5cclxuICBtaW5WYWx1ZT86IG51bWJlcjtcclxuICBtYXhWYWx1ZT86IG51bWJlcjtcclxufVxyXG5cclxuZW51bSBTdGF0dXMge1xyXG4gIFVuYXNzaWduZWQsXHJcbiAgU3RhcnQsXHJcbiAgQ29udGludWUsXHJcbiAgU3RvcCxcclxufVxyXG5cclxuLy8gUHJvamVjdCBzdGF0ZSBNYW5hZ2VtZW50XHJcbnR5cGUgTGlzdGVuZXIgPSAoaXRlbXM6IFByb2plY3RbXSkgPT4gdm9pZDtcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlKHZhbGlkYXRhYmxlSW5wdXQ6IFZhbGlkYXRhYmxlKTogYm9vbGVhbiB7XHJcbiAgbGV0IGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5yZXF1aXJlZCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggIT09IDA7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGggIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9XHJcbiAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPj1cclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aCAhPSBudWxsKSB7XHJcbiAgICBpc1ZhbGlkID1cclxuICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA8PVxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA+PSB2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA8PSB2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF1dG9iaW5kKF86IGFueSwgXzI6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XHJcbiAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gIGNvbnN0IGFkakRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciA9IHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldCgpIHtcclxuICAgICAgY29uc3QgYm91bmRGbiA9IG9yaWdpbmFsTWV0aG9kLmJpbmQodGhpcyk7XHJcbiAgICAgIHJldHVybiBib3VuZEZuO1xyXG4gICAgfSxcclxuICB9O1xyXG4gIHJldHVybiBhZGpEZXNjcmlwdG9yO1xyXG59XHJcblxyXG4vL2NvbXBvbmVudCBiYXNlIGNsYXNzXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQsIFUgZXh0ZW5kcyBIVE1MRWxlbWVudD4ge1xyXG4gIHRlbXBsYXRlRWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICBob3N0RWxlbWVudDogVDtcclxuICBlbGVtZW50OiBVO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHRlbXBhbHRlSWQ6IHN0cmluZyxcclxuICAgIGhvc3RFbGVtZW50SWQ6IHN0cmluZyxcclxuICAgIGluc2VydEF0U3RhcnQ6IGJvb2xlYW4sXHJcbiAgICBuZXdFbGVtZW50SWQ/OiBzdHJpbmdcclxuICApIHtcclxuICAgIHRoaXMudGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIHRlbXBhbHRlSWRcclxuICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhvc3RFbGVtZW50SWQpISBhcyBUO1xyXG5cclxuICAgIGNvbnN0IGZvcm1Ob2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgIHRoaXMuZWxlbWVudCA9IGZvcm1Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIFU7XHJcbiAgICBpZiAobmV3RWxlbWVudElkKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pZCA9IG5ld0VsZW1lbnRJZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmF0dGFjaChpbnNlcnRBdFN0YXJ0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoKGluc2VydEF0U3RhcnQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaG9zdEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxyXG4gICAgICBpbnNlcnRBdFN0YXJ0ID8gXCJhZnRlcmJlZ2luXCIgOiBcImJlZm9yZWVuZFwiLFxyXG4gICAgICB0aGlzLmVsZW1lbnRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBhYnN0cmFjdCBjb25maWd1cmUoKTogdm9pZDtcclxuICAvLyBhYnN0cmFjdCByZW5kZXJDb250ZW50KCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8vbWFrZSBzaW5nbGV0b25cclxuY2xhc3MgUHJvamVjdElucHV0IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRm9ybUVsZW1lbnQ+IHtcclxuICB0aXRsZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICBkZXNjcmlwdGlvbklucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICB2YWx1ZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihcInByb2plY3QtaW5wdXRcIiwgXCJhcHBcIiwgZmFsc2UsIFwidXNlci1pbnB1dFwiKTtcclxuXHJcbiAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3RpdGxlXCJcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjZGVzY3JpcHRpb25cIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNwZW9wbGVcIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuc3VibWl0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VibWl0SGFuZGxlcihldmVudDogRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBQcm9qZWN0KFxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICArdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0VmFsaWRhdGlvbiA9IHByb2plY3RzLmFkZFByb2plY3QocHJvamVjdCk7XHJcblxyXG4gICAgaWYgKHByb2plY3RWYWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb2plY3RMaXN0IHtcclxuICBob3N0RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgcHJvamVjdExpc3RUZW1wbGF0ZTogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICBwcm9qZWN0TGlzdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gIHN0YXR1czogU3RhdHVzO1xyXG4gIGFzc2lnbmVkUHJvamVjdHM6IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIikhIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgdGhpcy5wcm9qZWN0TGlzdFRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwicHJvamVjdC1saXN0XCJcclxuICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdExpc3ROb2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShcclxuICAgICAgdGhpcy5wcm9qZWN0TGlzdFRlbXBsYXRlLmNvbnRlbnQsXHJcbiAgICAgIHRydWVcclxuICAgICk7XHJcbiAgICB0aGlzLnByb2plY3RMaXN0RWxlbWVudCA9IHByb2plY3RMaXN0Tm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxuICAgIHRoaXMuYXNzaWduZWRQcm9qZWN0cyA9IFtdO1xyXG5cclxuICAgIHRoaXMucHJvamVjdExpc3RFbGVtZW50LmlkID0gYCR7dGhpcy5zdGF0dXNcclxuICAgICAgLnRvU3RyaW5nKClcclxuICAgICAgLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgO1xyXG4gICAgdGhpcy5wcm9qZWN0TGlzdEVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCJoMlwiXHJcbiAgICApIS50ZXh0Q29udGVudCA9IHN0YXR1cy50b1N0cmluZygpO1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RMaXN0RWxlbWVudCk7XHJcblxyXG4gICAgcHJvamVjdHMuYWRkTGlzdGVuZXIoKHByb2plY3RzOiBQcm9qZWN0W10pID0+IHtcclxuICAgICAgY29uc3QgcmVsZXZhbnRQcm9qZWN0cyA9IHByb2plY3RzLmZpbHRlcigocHJqKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByai5zdGF0dXMgPT09IHRoaXMuc3RhdHVzO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5hc3NpZ25lZFByb2plY3RzID0gcmVsZXZhbnRQcm9qZWN0cztcclxuICAgICAgdGhpcy5yZW5kZXJQcm9qZWN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbmRlclByb2plY3RzKCkge1xyXG4gICAgY29uc3Qgc2VjdGlvbkVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICkhO1xyXG4gICAgY29uc3QgbGlzdEVsID0gc2VjdGlvbkVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidWxcIilbMF0gYXMgSFRNTFVMaXN0RWxlbWVudDtcclxuICAgIGxpc3RFbC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGZvciAoY29uc3QgcHJvamVjdEl0ZW0gb2YgdGhpcy5hc3NpZ25lZFByb2plY3RzKSB7XHJcbiAgICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICBsaXN0SXRlbS50ZXh0Q29udGVudCA9IHByb2plY3RJdGVtLnRpdGxlO1xyXG4gICAgICBsaXN0RWwuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgUHJvamVjdCB7XHJcbiAgaWQ6IG51bWJlcjtcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBTdGF0dXM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHQ6IHN0cmluZywgZDogc3RyaW5nLCBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgdGhpcy50aXRsZSA9IHQudHJpbSgpO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGQudHJpbSgpO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB0aGlzLmlkID0gTWF0aC5yYW5kb20oKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb2plY3RzIHtcclxuICBwcml2YXRlIGxpc3RlbmVyczogTGlzdGVuZXJbXSA9IFtdO1xyXG5cclxuICBwcm9qZWN0TGlzdDogUHJvamVjdFtdID0gW107XHJcblxyXG4gIGhvc3RFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcbiAgcHJvamVjdFRlbXBsYXRlPzogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICBwcm9qZWN0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBfUHJvamVjdHM6IFByb2plY3RzO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgc3RhdGljIGdldEluc3RhbmNlKCkge1xyXG4gICAgaWYgKHRoaXMuX1Byb2plY3RzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9Qcm9qZWN0cztcclxuICAgIH1cclxuICAgIHRoaXMuX1Byb2plY3RzID0gbmV3IFByb2plY3RzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX1Byb2plY3RzO1xyXG4gIH1cclxuXHJcbiAgYWRkTGlzdGVuZXIobGlzdGVuZXJGbjogTGlzdGVuZXIpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XHJcbiAgfVxyXG5cclxuICBhZGRQcm9qZWN0KHByb2plY3Q6IFByb2plY3QpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLlZhbGlkYXRpb24ocHJvamVjdCk7XHJcblxyXG4gICAgaWYgKHZhbGlkYXRpb24pIHtcclxuICAgICAgLy8gdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAvLyAgIGAke3Byb2plY3Quc3RhdHVzLnRvU3RyaW5nKCl9LXBvc3QtaXRgXHJcbiAgICAgIC8vICkhIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgLy8gdGhpcy5wcm9qZWN0VGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgLy8gICBcInBvc3QtaXRcIlxyXG4gICAgICAvLyApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgICAgLy8gY29uc3QgcHJvamVjdE5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKFxyXG4gICAgICAvLyAgIHRoaXMucHJvamVjdFRlbXBsYXRlLmNvbnRlbnQsXHJcbiAgICAgIC8vICAgdHJ1ZVxyXG4gICAgICAvLyApO1xyXG5cclxuICAgICAgLy8gdGhpcy5wcm9qZWN0RWxlbWVudCA9IHByb2plY3ROb2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAvLyB0aGlzLnByb2plY3RFbGVtZW50LmlubmVyVGV4dCA9IGAke3Byb2plY3QudGl0bGV9IC0gJHtwcm9qZWN0LmRlc2NyaXB0aW9ufWA7XHJcbiAgICAgIC8vIHRoaXMuaG9zdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0RWxlbWVudCk7XHJcblxyXG4gICAgICB0aGlzLnByb2plY3RMaXN0LnB1c2gocHJvamVjdCk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyRm4gb2YgdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgICBsaXN0ZW5lckZuKHRoaXMucHJvamVjdExpc3Quc2xpY2UoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgVmFsaWRhdGlvbihwcm9qZWN0OiBQcm9qZWN0KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB0aXRsZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3QudGl0bGUsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgIG1heExlbmd0aDogNTAsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgbWF4TGVuZ3RoOiAyMDAsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZhbHVlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdC5zdGF0dXMsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5WYWx1ZTogMCxcclxuICAgICAgbWF4VmFsdWU6IDMsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChcclxuICAgICAgIXZhbGlkYXRlKHRpdGxlVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICF2YWxpZGF0ZShkZXNjcmlwdGlvblZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAhdmFsaWRhdGUodmFsdWVWYWxpZGF0YWJsZSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb2plY3RzID0gUHJvamVjdHMuZ2V0SW5zdGFuY2UoKTtcclxuXHJcbmNvbnN0IHByb2plY3RJbnB1dCA9IG5ldyBQcm9qZWN0SW5wdXQoKTtcclxuY29uc3QgcHJvamVjdExpc3QwID0gbmV3IFByb2plY3RMaXN0KFN0YXR1cy5VbmFzc2lnbmVkKTsgLy9wcm9qZWN0IHN0YXRlIGluc3RlYWQ/XHJcbmNvbnN0IHByb2plY3RMaXN0ID0gbmV3IFByb2plY3RMaXN0KFN0YXR1cy5TdGFydCk7XHJcbmNvbnN0IHByb2plY3RMaXN0MiA9IG5ldyBQcm9qZWN0TGlzdChTdGF0dXMuQ29udGludWUpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDMgPSBuZXcgUHJvamVjdExpc3QoU3RhdHVzLlN0b3ApO1xyXG4iXX0=