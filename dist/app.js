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
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "project-input", "app", false, "user-input") || this;
        _this.titleInputElement = _this.element.querySelector("#title");
        _this.descriptionInputElement = _this.element.querySelector("#description");
        _this.valueInputElement = _this.element.querySelector("#people");
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    };
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
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(status) {
        var _this = _super.call(this, "project-list", "app", false, status.toString().toLowerCase() + "-post-it") || this;
        _this.status = status;
        _this.assignedProjects = [];
        _this.configure();
        projects.addListener(function (projects) {
            var relevantProjects = projects.filter(function (prj) {
                return prj.status === _this.status;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
        return _this;
    }
    ProjectList.prototype.configure = function () {
        this.element.querySelector("h2").textContent = this.status.toString();
    };
    ProjectList.prototype.renderProjects = function () {
        var listId = this.status.toString() + "-post-it-list";
        var listEl = document
            .getElementById(this.status.toString().toLocaleLowerCase() + "-post-it")
            .querySelector("ul");
        listEl.innerHTML = "";
        listEl.id = listId;
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var projectItem = _a[_i];
            new ProjectComponent(this.element.querySelector("ul").id, projectItem);
        }
    };
    return ProjectList;
}(Component));
var ProjectComponent = /** @class */ (function (_super) {
    __extends(ProjectComponent, _super);
    function ProjectComponent(hostId, project) {
        var _this = _super.call(this, "post-it", hostId, false, project.id) || this;
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectComponent.prototype.configure = function () { };
    ProjectComponent.prototype.renderContent = function () {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("p").textContent = this.project.description;
    };
    return ProjectComponent;
}(Component));
var Project = /** @class */ (function () {
    function Project(t, d, status) {
        this.title = t.trim();
        this.description = d.trim();
        this.status = status;
        this.id = Math.random().toString();
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
var projectList0 = new ProjectList(Status.Unassigned);
var projectList = new ProjectList(Status.Start);
var projectList2 = new ProjectList(Status.Continue);
var projectList3 = new ProjectList(Status.Stop);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FBWVosSUFBSyxNQUtKO0FBTEQsV0FBSyxNQUFNO0lBQ1QsK0NBQVUsQ0FBQTtJQUNWLHFDQUFLLENBQUE7SUFDTCwyQ0FBUSxDQUFBO0lBQ1IsbUNBQUksQ0FBQTtBQUNOLENBQUMsRUFMSSxNQUFNLEtBQU4sTUFBTSxRQUtWO0FBS0QsU0FBUyxRQUFRLENBQUMsZ0JBQTZCO0lBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUM3QixPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQzVFO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ3RDLE9BQU87WUFDTCxPQUFPO2dCQUNQLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO29CQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7S0FDaEM7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDdEMsT0FBTztZQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07b0JBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztLQUNoQztJQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNyQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7S0FDMUU7SUFFRCxJQUFJLGdCQUFnQixD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QVUsQ0FBQyxDQUFDO0FBQ3hELElBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxJQUFNLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQsSUFBTSxZQUFZLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy9kZWNvcmF0b3JzXHJcblxyXG5pbnRlcmZhY2UgVmFsaWRhdGFibGUge1xyXG4gIHZhbHVlOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gIG1pbkxlbmd0aD86IG51bWJlcjtcclxuICBtYXhMZW5ndGg/OiBudW1iZXI7XHJcblxyXG4gIG1pblZhbHVlPzogbnVtYmVyO1xyXG4gIG1heFZhbHVlPzogbnVtYmVyO1xyXG59XHJcblxyXG5lbnVtIFN0YXR1cyB7XHJcbiAgVW5hc3NpZ25lZCxcclxuICBTdGFydCxcclxuICBDb250aW51ZSxcclxuICBTdG9wLFxyXG59XHJcblxyXG4vLyBQcm9qZWN0IHN0YXRlIE1hbmFnZW1lbnRcclxudHlwZSBMaXN0ZW5lciA9IChpdGVtczogUHJvamVjdFtdKSA9PiB2b2lkO1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGUodmFsaWRhdGFibGVJbnB1dDogVmFsaWRhdGFibGUpOiBib29sZWFuIHtcclxuICBsZXQgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0LnJlcXVpcmVkKSB7XHJcbiAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCAhPT0gMDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aCAhPSBudWxsKSB7XHJcbiAgICBpc1ZhbGlkID1cclxuICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA+PVxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPVxyXG4gICAgICBpc1ZhbGlkICYmXHJcbiAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoIDw9XHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGg7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlID49IHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWU7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlIDw9IHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNWYWxpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gYXV0b2JpbmQoXzogYW55LCBfMjogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcclxuICBjb25zdCBvcmlnaW5hbE1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XHJcbiAgY29uc3QgYWRqRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yID0ge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0KCkge1xyXG4gICAgICBjb25zdCBib3VuZEZuID0gb3JpZ2luYWxNZXRob2QuYmluZCh0aGlzKTtcclxuICAgICAgcmV0dXJuIGJvdW5kRm47XHJcbiAgICB9LFxyXG4gIH07XHJcbiAgcmV0dXJuIGFkakRlc2NyaXB0b3I7XHJcbn1cclxuXHJcbi8vY29tcG9uZW50IGJhc2UgY2xhc3NcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCwgVSBleHRlbmRzIEhUTUxFbGVtZW50PiB7XHJcbiAgdGVtcGxhdGVFbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gIGhvc3RFbGVtZW50OiBUO1xyXG4gIGVsZW1lbnQ6IFU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdGVtcGFsdGVJZDogc3RyaW5nLFxyXG4gICAgaG9zdEVsZW1lbnRJZDogc3RyaW5nLFxyXG4gICAgaW5zZXJ0QXRTdGFydDogYm9vbGVhbixcclxuICAgIG5ld0VsZW1lbnRJZD86IHN0cmluZ1xyXG4gICkge1xyXG4gICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgdGVtcGFsdGVJZFxyXG4gICAgKSEgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuXHJcbiAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XHJcblxyXG4gICAgY29uc3QgZm9ybU5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZm9ybU5vZGUuZmlyc3RFbGVtZW50Q2hpbGQgYXMgVTtcclxuICAgIGlmIChuZXdFbGVtZW50SWQpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmlkID0gbmV3RWxlbWVudElkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXR0YWNoKGluc2VydEF0U3RhcnQpO1xyXG4gIH1cclxuXHJcbiAgYWJzdHJhY3QgY29uZmlndXJlKCk6IHZvaWQ7XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoKGluc2VydEF0U3RhcnQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaG9zdEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxyXG4gICAgICBpbnNlcnRBdFN0YXJ0ID8gXCJhZnRlcmJlZ2luXCIgOiBcImJlZm9yZWVuZFwiLFxyXG4gICAgICB0aGlzLmVsZW1lbnRcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0SW5wdXQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxGb3JtRWxlbWVudD4ge1xyXG4gIHRpdGxlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGRlc2NyaXB0aW9uSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHZhbHVlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFwicHJvamVjdC1pbnB1dFwiLCBcImFwcFwiLCBmYWxzZSwgXCJ1c2VyLWlucHV0XCIpO1xyXG5cclxuICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjdGl0bGVcIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNkZXNjcmlwdGlvblwiXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3Blb3BsZVwiXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb25maWd1cmUoKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuc3VibWl0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VibWl0SGFuZGxlcihldmVudDogRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBQcm9qZWN0KFxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICArdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0VmFsaWRhdGlvbiA9IHByb2plY3RzLmFkZFByb2plY3QocHJvamVjdCk7XHJcblxyXG4gICAgaWYgKHByb2plY3RWYWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb2plY3RMaXN0IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRWxlbWVudD4ge1xyXG4gIGFzc2lnbmVkUHJvamVjdHM6IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIHN1cGVyKFxyXG4gICAgICBcInByb2plY3QtbGlzdFwiLFxyXG4gICAgICBcImFwcFwiLFxyXG4gICAgICBmYWxzZSxcclxuICAgICAgYCR7c3RhdHVzLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5hc3NpZ25lZFByb2plY3RzID0gW107XHJcblxyXG4gICAgdGhpcy5jb25maWd1cmUoKTtcclxuXHJcbiAgICBwcm9qZWN0cy5hZGRMaXN0ZW5lcigocHJvamVjdHM6IFByb2plY3RbXSkgPT4ge1xyXG4gICAgICBjb25zdCByZWxldmFudFByb2plY3RzID0gcHJvamVjdHMuZmlsdGVyKChwcmopID0+IHtcclxuICAgICAgICByZXR1cm4gcHJqLnN0YXR1cyA9PT0gdGhpcy5zdGF0dXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmFzc2lnbmVkUHJvamVjdHMgPSByZWxldmFudFByb2plY3RzO1xyXG4gICAgICB0aGlzLnJlbmRlclByb2plY3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5zdGF0dXMudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyUHJvamVjdHMoKSB7XHJcbiAgICBjb25zdCBsaXN0SWQgPSBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpfS1wb3N0LWl0LWxpc3RgO1xyXG4gICAgY29uc3QgbGlzdEVsID0gZG9jdW1lbnRcclxuICAgICAgLmdldEVsZW1lbnRCeUlkKGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKX0tcG9zdC1pdGApIVxyXG4gICAgICAucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgIGxpc3RFbC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgbGlzdEVsLmlkID0gbGlzdElkO1xyXG5cclxuICAgIGZvciAoY29uc3QgcHJvamVjdEl0ZW0gb2YgdGhpcy5hc3NpZ25lZFByb2plY3RzKSB7XHJcbiAgICAgIG5ldyBQcm9qZWN0Q29tcG9uZW50KHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhLmlkLCBwcm9qZWN0SXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxVTGlzdEVsZW1lbnQsIEhUTUxMSUVsZW1lbnQ+IHtcclxuICBwcml2YXRlIHByb2plY3Q6IFByb2plY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGhvc3RJZDogc3RyaW5nLCBwcm9qZWN0OiBQcm9qZWN0KSB7XHJcbiAgICBzdXBlcihcInBvc3QtaXRcIiwgaG9zdElkLCBmYWxzZSwgcHJvamVjdC5pZCk7XHJcblxyXG4gICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuXHJcbiAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgdGhpcy5yZW5kZXJDb250ZW50KCk7XHJcbiAgfVxyXG4gIGNvbmZpZ3VyZSgpIHt9XHJcblxyXG4gIHJlbmRlckNvbnRlbnQoKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucHJvamVjdC50aXRsZTtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnByb2plY3QuZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBzdGF0dXM6IFN0YXR1cztcclxuXHJcbiAgY29uc3RydWN0b3IodDogc3RyaW5nLCBkOiBzdHJpbmcsIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICB0aGlzLnRpdGxlID0gdC50cmltKCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZC50cmltKCk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHRoaXMuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0cyB7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgcHJvamVjdExpc3Q6IFByb2plY3RbXSA9IFtdO1xyXG5cclxuICBob3N0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gIHByb2plY3RUZW1wbGF0ZT86IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgcHJvamVjdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX1Byb2plY3RzOiBQcm9qZWN0cztcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgIGlmICh0aGlzLl9Qcm9qZWN0cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5fUHJvamVjdHM7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9Qcm9qZWN0cyA9IG5ldyBQcm9qZWN0cygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9Qcm9qZWN0cztcclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyRm46IExpc3RlbmVyKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyRm4pO1xyXG4gIH1cclxuXHJcbiAgYWRkUHJvamVjdChwcm9qZWN0OiBQcm9qZWN0KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB2YWxpZGF0aW9uID0gdGhpcy5WYWxpZGF0aW9uKHByb2plY3QpO1xyXG5cclxuICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMucHJvamVjdExpc3QucHVzaChwcm9qZWN0KTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXJGbiBvZiB0aGlzLmxpc3RlbmVycykge1xyXG4gICAgICAgIGxpc3RlbmVyRm4odGhpcy5wcm9qZWN0TGlzdC5zbGljZSgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWxpZGF0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBWYWxpZGF0aW9uKHByb2plY3Q6IFByb2plY3QpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHRpdGxlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdC50aXRsZSxcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgbWF4TGVuZ3RoOiA1MCxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25WYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICBtYXhMZW5ndGg6IDIwMCxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdmFsdWVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnN0YXR1cyxcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pblZhbHVlOiAwLFxyXG4gICAgICBtYXhWYWx1ZTogMyxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAhdmFsaWRhdGUodGl0bGVWYWxpZGF0YWJsZSkgfHxcclxuICAgICAgIXZhbGlkYXRlKGRlc2NyaXB0aW9uVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICF2YWxpZGF0ZSh2YWx1ZVZhbGlkYXRhYmxlKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcHJvamVjdHMgPSBQcm9qZWN0cy5nZXRJbnN0YW5jZSgpO1xyXG5cclxuY29uc3QgcHJvamVjdElucHV0ID0gbmV3IFByb2plY3RJbnB1dCgpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDAgPSBuZXcgUHJvamVjdExpc3QoU3RhdHVzLlVuYXNzaWduZWQpO1xyXG5jb25zdCBwcm9qZWN0TGlzdCA9IG5ldyBQcm9qZWN0TGlzdChTdGF0dXMuU3RhcnQpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDIgPSBuZXcgUHJvamVjdExpc3QoU3RhdHVzLkNvbnRpbnVlKTtcclxuY29uc3QgcHJvamVjdExpc3QzID0gbmV3IFByb2plY3RMaXN0KFN0YXR1cy5TdG9wKTtcclxuIl19