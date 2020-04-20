"use strict";
//decorators
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
}());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVk7QUFZWixJQUFLLE1BS0o7QUFMRCxXQUFLLE1BQU07SUFDVCwrQ0FBVSxDQUFBO0lBQ1YscUNBQUssQ0FBQTtJQUNMLDJDQUFRLENBQUE7SUFDUixtQ0FBSSxDQUFBO0FBQ04sQ0FBQyxFQUxJLE1BQU0sS0FBTixNQUFNLFFBS1Y7QUFLRCxTQUFTLFFBQVEsQ0FBQyxnQkFBNkI7SUFDN0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRW5CLElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1FBQzdCLE9BQU8sR0FBRyxPQUFPLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7S0FDNUU7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDdEMsT0FBTztZQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07b0JBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztLQUNoQztJQUVELElBQUksZ0JBQWdCLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtRQUN0QyxPQUFPO1lBQ0wsT0FBTztnQkFDUCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTTtvQkFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO0tBQ2hDO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1FBQ3JDLE9BQU8sR0FBRyxPQUFPLElBQUksZ0JBQWdCLENBQUMsS0FBSyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztLQUMxRTtJQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJ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QUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsRUFBRSxDQUFDO1NBQ1osQ0FBQztRQUVGLElBQ0UsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7WUFDM0IsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7WUFDakMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFDM0I7WUFDQSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF4RkQsSUF3RkM7QUFFRCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFeEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztBQUN4QyxJQUFNLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7QUFDakYsSUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELElBQU0sWUFBWSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0RCxJQUFNLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2RlY29yYXRvcnNcclxuXHJcbmludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcclxuICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gIG1heExlbmd0aD86IG51bWJlcjtcclxuXHJcbiAgbWluVmFsdWU/OiBudW1iZXI7XHJcbiAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmVudW0gU3RhdHVzIHtcclxuICBVbmFzc2lnbmVkLFxyXG4gIFN0YXJ0LFxyXG4gIENvbnRpbnVlLFxyXG4gIFN0b3AsXHJcbn1cclxuXHJcbi8vIFByb2plY3Qgc3RhdGUgTWFuYWdlbWVudFxyXG50eXBlIExpc3RlbmVyID0gKGl0ZW1zOiBQcm9qZWN0W10pID0+IHZvaWQ7XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZSh2YWxpZGF0YWJsZUlucHV0OiBWYWxpZGF0YWJsZSk6IGJvb2xlYW4ge1xyXG4gIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQucmVxdWlyZWQpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoICE9PSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPVxyXG4gICAgICBpc1ZhbGlkICYmXHJcbiAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoID49XHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGg7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGggIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9XHJcbiAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPD1cclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPj0gdmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZTtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPD0gdmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpc1ZhbGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhdXRvYmluZChfOiBhbnksIF8yOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikge1xyXG4gIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQoKSB7XHJcbiAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xyXG4gICAgICByZXR1cm4gYm91bmRGbjtcclxuICAgIH0sXHJcbiAgfTtcclxuICByZXR1cm4gYWRqRGVzY3JpcHRvcjtcclxufVxyXG5cclxuLy9tYWtlIHNpbmdsZXRvblxyXG5jbGFzcyBQcm9qZWN0SW5wdXQge1xyXG4gIGhvc3RFbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICBmb3JtVGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgZm9ybUVsZW1lbnQ6IEhUTUxGb3JtRWxlbWVudDtcclxuXHJcbiAgdGl0bGVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgdmFsdWVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpISBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIHRoaXMuZm9ybVRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwicHJvamVjdC1pbnB1dFwiXHJcbiAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IGZvcm1Ob2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLmZvcm1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgIHRoaXMuZm9ybUVsZW1lbnQgPSBmb3JtTm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRm9ybUVsZW1lbnQ7XHJcbiAgICB0aGlzLmZvcm1FbGVtZW50LmlkID0gXCJ1c2VyLWlucHV0XCI7XHJcblxyXG4gICAgdGhpcy50aXRsZUlucHV0RWxlbWVudCA9IHRoaXMuZm9ybUVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjdGl0bGVcIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudCA9IHRoaXMuZm9ybUVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjZGVzY3JpcHRpb25cIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZm9ybUVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjcGVvcGxlXCJcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICB0aGlzLmhvc3RFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybUVsZW1lbnQpO1xyXG5cclxuICAgIHRoaXMuZm9ybUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnN1Ym1pdEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1Ym1pdEhhbmRsZXIoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgUHJvamVjdChcclxuICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgK3RoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWVcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdFZhbGlkYXRpb24gPSBwcm9qZWN0cy5hZGRQcm9qZWN0KHByb2plY3QpO1xyXG5cclxuICAgIGlmIChwcm9qZWN0VmFsaWRhdGlvbikge1xyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIHRoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxlcnQoYGludmxhaWQgaW5wdXQ6ICR7XCJJbnZhbGlkIGlucHV0XCJ9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0TGlzdCB7XHJcbiAgaG9zdEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIHByb2plY3RMaXN0VGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgcHJvamVjdExpc3RFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICBzdGF0dXM6IFN0YXR1cztcclxuICBhc3NpZ25lZFByb2plY3RzOiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpISBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIHRoaXMucHJvamVjdExpc3RUZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcInByb2plY3QtbGlzdFwiXHJcbiAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IHByb2plY3RMaXN0Tm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXHJcbiAgICAgIHRoaXMucHJvamVjdExpc3RUZW1wbGF0ZS5jb250ZW50LFxyXG4gICAgICB0cnVlXHJcbiAgICApO1xyXG4gICAgdGhpcy5wcm9qZWN0TGlzdEVsZW1lbnQgPSBwcm9qZWN0TGlzdE5vZGUuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICB0aGlzLmFzc2lnbmVkUHJvamVjdHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLnByb2plY3RMaXN0RWxlbWVudC5pZCA9IGAke3RoaXMuc3RhdHVzXHJcbiAgICAgIC50b1N0cmluZygpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpfS1wb3N0LWl0YDtcclxuICAgIHRoaXMucHJvamVjdExpc3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiaDJcIlxyXG4gICAgKSEudGV4dENvbnRlbnQgPSBzdGF0dXMudG9TdHJpbmcoKTtcclxuICAgIHRoaXMuaG9zdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0TGlzdEVsZW1lbnQpO1xyXG5cclxuICAgIHByb2plY3RzLmFkZExpc3RlbmVyKChwcm9qZWN0czogUHJvamVjdFtdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlbGV2YW50UHJvamVjdHMgPSBwcm9qZWN0cy5maWx0ZXIoKHByaikgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcmouc3RhdHVzID09PSB0aGlzLnN0YXR1cztcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuYXNzaWduZWRQcm9qZWN0cyA9IHJlbGV2YW50UHJvamVjdHM7XHJcbiAgICAgIHRoaXMucmVuZGVyUHJvamVjdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJQcm9qZWN0cygpIHtcclxuICAgIGNvbnN0IHNlY3Rpb25FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICApITtcclxuICAgIGNvbnN0IGxpc3RFbCA9IHNlY3Rpb25FbC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVsXCIpWzBdIGFzIEhUTUxVTGlzdEVsZW1lbnQ7XHJcbiAgICBsaXN0RWwuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHByb2plY3RJdGVtIG9mIHRoaXMuYXNzaWduZWRQcm9qZWN0cykge1xyXG4gICAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgbGlzdEl0ZW0udGV4dENvbnRlbnQgPSBwcm9qZWN0SXRlbS50aXRsZTtcclxuICAgICAgbGlzdEVsLmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb2plY3Qge1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHN0YXR1czogU3RhdHVzO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih0OiBzdHJpbmcsIGQ6IHN0cmluZywgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIHRoaXMudGl0bGUgPSB0LnRyaW0oKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkLnRyaW0oKTtcclxuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgdGhpcy5pZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0cyB7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgcHJvamVjdExpc3Q6IFByb2plY3RbXSA9IFtdO1xyXG5cclxuICBob3N0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gIHByb2plY3RUZW1wbGF0ZT86IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgcHJvamVjdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX1Byb2plY3RzOiBQcm9qZWN0cztcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgIGlmICh0aGlzLl9Qcm9qZWN0cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5fUHJvamVjdHM7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9Qcm9qZWN0cyA9IG5ldyBQcm9qZWN0cygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9Qcm9qZWN0cztcclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyRm46IExpc3RlbmVyKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyRm4pO1xyXG4gIH1cclxuXHJcbiAgYWRkUHJvamVjdChwcm9qZWN0OiBQcm9qZWN0KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB2YWxpZGF0aW9uID0gdGhpcy5WYWxpZGF0aW9uKHByb2plY3QpO1xyXG5cclxuICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgIC8vIHRoaXMuaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgLy8gICBgJHtwcm9qZWN0LnN0YXR1cy50b1N0cmluZygpfS1wb3N0LWl0YFxyXG4gICAgICAvLyApISBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgIC8vIHRoaXMucHJvamVjdFRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIC8vICAgXCJwb3N0LWl0XCJcclxuICAgICAgLy8gKSEgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuXHJcbiAgICAgIC8vIGNvbnN0IHByb2plY3ROb2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShcclxuICAgICAgLy8gICB0aGlzLnByb2plY3RUZW1wbGF0ZS5jb250ZW50LFxyXG4gICAgICAvLyAgIHRydWVcclxuICAgICAgLy8gKTtcclxuXHJcbiAgICAgIC8vIHRoaXMucHJvamVjdEVsZW1lbnQgPSBwcm9qZWN0Tm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgLy8gdGhpcy5wcm9qZWN0RWxlbWVudC5pbm5lclRleHQgPSBgJHtwcm9qZWN0LnRpdGxlfSAtICR7cHJvamVjdC5kZXNjcmlwdGlvbn1gO1xyXG4gICAgICAvLyB0aGlzLmhvc3RFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucHJvamVjdEVsZW1lbnQpO1xyXG5cclxuICAgICAgdGhpcy5wcm9qZWN0TGlzdC5wdXNoKHByb2plY3QpO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBsaXN0ZW5lckZuIG9mIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgbGlzdGVuZXJGbih0aGlzLnByb2plY3RMaXN0LnNsaWNlKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbGlkYXRpb247XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIFZhbGlkYXRpb24ocHJvamVjdDogUHJvamVjdCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdGl0bGVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICBtYXhMZW5ndGg6IDUwLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvblZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgIG1heExlbmd0aDogMjAwLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3Quc3RhdHVzLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluVmFsdWU6IDAsXHJcbiAgICAgIG1heFZhbHVlOiAzLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgICF2YWxpZGF0ZSh0aXRsZVZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAhdmFsaWRhdGUoZGVzY3JpcHRpb25WYWxpZGF0YWJsZSkgfHxcclxuICAgICAgIXZhbGlkYXRlKHZhbHVlVmFsaWRhdGFibGUpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBwcm9qZWN0cyA9IFByb2plY3RzLmdldEluc3RhbmNlKCk7XHJcblxyXG5jb25zdCBwcm9qZWN0SW5wdXQgPSBuZXcgUHJvamVjdElucHV0KCk7XHJcbmNvbnN0IHByb2plY3RMaXN0MCA9IG5ldyBQcm9qZWN0TGlzdChTdGF0dXMuVW5hc3NpZ25lZCk7IC8vcHJvamVjdCBzdGF0ZSBpbnN0ZWFkP1xyXG5jb25zdCBwcm9qZWN0TGlzdCA9IG5ldyBQcm9qZWN0TGlzdChTdGF0dXMuU3RhcnQpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDIgPSBuZXcgUHJvamVjdExpc3QoU3RhdHVzLkNvbnRpbnVlKTtcclxuY29uc3QgcHJvamVjdExpc3QzID0gbmV3IFByb2plY3RMaXN0KFN0YXR1cy5TdG9wKTtcclxuIl19