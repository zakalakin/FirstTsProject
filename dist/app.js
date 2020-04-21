"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var InputComponent = /** @class */ (function (_super) {
    __extends(InputComponent, _super);
    function InputComponent() {
        var _this = _super.call(this, "project-input", "app", false, "user-input") || this;
        _this.titleInputElement = _this.element.querySelector("#title");
        _this.descriptionInputElement = _this.element.querySelector("#description");
        _this.valueInputElement = _this.element.querySelector("#people");
        _this.configure();
        return _this;
    }
    InputComponent.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    };
    InputComponent.prototype.submitHandler = function (event) {
        event.preventDefault();
        var postit = new Postit(this.titleInputElement.value, this.descriptionInputElement.value, +this.valueInputElement.value);
        var postitValidation = postits.addPostit(postit);
        if (postitValidation) {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.valueInputElement.value = "";
        }
        else {
            alert("invlaid input: " + "Invalid input");
        }
    };
    return InputComponent;
}(Component));
var PostitListComponent = /** @class */ (function (_super) {
    __extends(PostitListComponent, _super);
    function PostitListComponent(status) {
        var _this = _super.call(this, "project-list", "app", false, status.toString().toLowerCase() + "-post-it") || this;
        _this.status = status;
        _this.assignedPostits = [];
        _this.configure();
        return _this;
    }
    PostitListComponent.prototype.dragOverHandler = function (event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            var listEl = this.element.querySelector("ul");
            listEl.classList.add("droppable");
        }
    };
    PostitListComponent.prototype.dropHandler = function (event) {
        console.log(event.dataTransfer.getData("text/plain"));
        console.log(event);
        console.log(event.target);
        // postits.
    };
    PostitListComponent.prototype.dragLeaveHandler = function (event) {
        var listEl = this.element.querySelector("ul");
        listEl.classList.remove("droppable");
    };
    PostitListComponent.prototype.configure = function () {
        var _this = this;
        this.element.querySelector("h2").textContent = this.status.toString();
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        postits.addListener(function (postit) {
            var relevantProjects = postit.filter(function (prj) {
                return prj.status === _this.status;
            });
            _this.assignedPostits = relevantProjects;
            _this.renderPostits();
        });
    };
    PostitListComponent.prototype.renderPostits = function () {
        var listId = this.status.toString() + "-post-it-list";
        var listEl = document
            .getElementById(this.status.toString().toLocaleLowerCase() + "-post-it")
            .querySelector("ul");
        listEl.innerHTML = "";
        listEl.id = listId;
        for (var _i = 0, _a = this.assignedPostits; _i < _a.length; _i++) {
            var postitItem = _a[_i];
            new PostitComponent(this.element.querySelector("ul").id, postitItem);
        }
    };
    __decorate([
        autobind
    ], PostitListComponent.prototype, "dragOverHandler", null);
    __decorate([
        autobind
    ], PostitListComponent.prototype, "dragLeaveHandler", null);
    return PostitListComponent;
}(Component));
var PostitComponent = /** @class */ (function (_super) {
    __extends(PostitComponent, _super);
    function PostitComponent(hostId, postit) {
        var _this = _super.call(this, "post-it", hostId, false, postit.id) || this;
        _this.postit = postit;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    PostitComponent.prototype.dragStartHandler = function (event) {
        event.dataTransfer.setData("text/plain", this.postit.id);
        event.dataTransfer.effectAllowed = "move";
    };
    PostitComponent.prototype.dragEndHandler = function (_) {
        console.log("DragEnd");
    };
    PostitComponent.prototype.configure = function () {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    };
    PostitComponent.prototype.renderContent = function () {
        this.element.querySelector("h2").textContent = this.postit.title;
        this.element.querySelector("p").textContent = this.postit.description;
    };
    __decorate([
        autobind
    ], PostitComponent.prototype, "dragStartHandler", null);
    return PostitComponent;
}(Component));
var Postit = /** @class */ (function () {
    function Postit(t, d, status) {
        this.title = t.trim();
        this.description = d.trim();
        this.status = status;
        this.id = Math.random().toString();
    }
    return Postit;
}());
var Postits = /** @class */ (function () {
    function Postits() {
        this.listeners = [];
        this.postitList = [];
    }
    Postits.getInstance = function () {
        if (this._Postits) {
            return this._Postits;
        }
        this._Postits = new Postits();
        return this._Postits;
    };
    Postits.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    Postits.prototype.addPostit = function (postit) {
        var validation = this.Validation(postit);
        if (validation) {
            this.postitList.push(postit);
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listenerFn = _a[_i];
                listenerFn(this.postitList.slice());
            }
        }
        return validation;
    };
    Postits.prototype.Validation = function (project) {
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
    return Postits;
}());
var postits = Postits.getInstance();
var projectInput = new InputComponent();
var projectList0 = new PostitListComponent(Status.Unassigned);
var projectList = new PostitListComponent(Status.Start);
var projectList2 = new PostitListComponent(Status.Continue);
var projectList3 = new PostitListComponent(Status.Stop);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsSUFBSyxNQUtKO0FBTEQsV0FBSyxNQUFNO0lBQ1QsK0NBQVUsQ0FBQTtJQUNWLHFDQUFLLENBQUE7SUFDTCwyQ0FBUSxDQUFBO0lBQ1IsbUNBQUksQ0FBQTtBQUNOLENBQUMsRUFMSSxNQUFNLEtBQU4sTUFBTSxRQUtWO0FBS0QsU0FBUyxRQUFRLENBQUMsZ0JBQTZCO0lBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUM3QixPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQzVFO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ3RDLE9BQU87WUFDTCxPQUFPO2dCQUNQLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO29CQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7S0FDaEM7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDdEMsT0FBTztZQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07b0JBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztLQUNoQztJQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNyQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7S0FDMUU7SUFFRCxJQUFJLGdCQUFnQixDQUFD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RSxPQUFPLENBQUMsTUFBTTtZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLENBQUM7U0FDWixDQUFDO1FBRUYsSUFDRSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMzQixDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQztZQUNqQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUMzQjtZQUNBLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQXZFRCxJQXVFQztBQUVELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUV0QyxJQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQzFDLElBQU0sWUFBWSxHQUFHLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hFLElBQU0sV0FBVyxHQUFHLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFELElBQU0sWUFBWSxHQUFHLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlELElBQU0sWUFBWSxHQUFHLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRHJhZyAmIERyb3AgSW50ZXJmYWNlc1xyXG5pbnRlcmZhY2UgRHJhZ2dhYmxlIHtcclxuICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIGRyYWdFbmRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkO1xyXG59XHJcbmludGVyZmFjZSBEcmFnVGFyZ2V0IHtcclxuICBkcmFnT3ZlckhhbmRsZXIoZXZlbnRMOiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIGRyb3BIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxufVxyXG5cclxuLy9kZWNvcmF0b3JzXHJcbmludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcclxuICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gIG1heExlbmd0aD86IG51bWJlcjtcclxuXHJcbiAgbWluVmFsdWU/OiBudW1iZXI7XHJcbiAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmVudW0gU3RhdHVzIHtcclxuICBVbmFzc2lnbmVkLFxyXG4gIFN0YXJ0LFxyXG4gIENvbnRpbnVlLFxyXG4gIFN0b3AsXHJcbn1cclxuXHJcbi8vIFByb2plY3Qgc3RhdGUgTWFuYWdlbWVudFxyXG50eXBlIExpc3RlbmVyID0gKGl0ZW1zOiBQb3N0aXRbXSkgPT4gdm9pZDtcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlKHZhbGlkYXRhYmxlSW5wdXQ6IFZhbGlkYXRhYmxlKTogYm9vbGVhbiB7XHJcbiAgbGV0IGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5yZXF1aXJlZCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggIT09IDA7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGggIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9XHJcbiAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPj1cclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aCAhPSBudWxsKSB7XHJcbiAgICBpc1ZhbGlkID1cclxuICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA8PVxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA+PSB2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA8PSB2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF1dG9iaW5kKF86IGFueSwgXzI6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XHJcbiAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gIGNvbnN0IGFkakRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciA9IHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldCgpIHtcclxuICAgICAgY29uc3QgYm91bmRGbiA9IG9yaWdpbmFsTWV0aG9kLmJpbmQodGhpcyk7XHJcbiAgICAgIHJldHVybiBib3VuZEZuO1xyXG4gICAgfSxcclxuICB9O1xyXG4gIHJldHVybiBhZGpEZXNjcmlwdG9yO1xyXG59XHJcblxyXG4vL2NvbXBvbmVudCBiYXNlIGNsYXNzXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQsIFUgZXh0ZW5kcyBIVE1MRWxlbWVudD4ge1xyXG4gIHRlbXBsYXRlRWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICBob3N0RWxlbWVudDogVDtcclxuICBlbGVtZW50OiBVO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHRlbXBhbHRlSWQ6IHN0cmluZyxcclxuICAgIGhvc3RFbGVtZW50SWQ6IHN0cmluZyxcclxuICAgIGluc2VydEF0U3RhcnQ6IGJvb2xlYW4sXHJcbiAgICBuZXdFbGVtZW50SWQ/OiBzdHJpbmdcclxuICApIHtcclxuICAgIHRoaXMudGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIHRlbXBhbHRlSWRcclxuICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhvc3RFbGVtZW50SWQpISBhcyBUO1xyXG5cclxuICAgIGNvbnN0IGZvcm1Ob2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgIHRoaXMuZWxlbWVudCA9IGZvcm1Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIFU7XHJcbiAgICBpZiAobmV3RWxlbWVudElkKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pZCA9IG5ld0VsZW1lbnRJZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmF0dGFjaChpbnNlcnRBdFN0YXJ0KTtcclxuICB9XHJcblxyXG4gIGFic3RyYWN0IGNvbmZpZ3VyZSgpOiB2b2lkO1xyXG5cclxuICBwcml2YXRlIGF0dGFjaChpbnNlcnRBdFN0YXJ0OiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmhvc3RFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcclxuICAgICAgaW5zZXJ0QXRTdGFydCA/IFwiYWZ0ZXJiZWdpblwiIDogXCJiZWZvcmVlbmRcIixcclxuICAgICAgdGhpcy5lbGVtZW50XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxGb3JtRWxlbWVudD4ge1xyXG4gIHRpdGxlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGRlc2NyaXB0aW9uSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHZhbHVlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFwicHJvamVjdC1pbnB1dFwiLCBcImFwcFwiLCBmYWxzZSwgXCJ1c2VyLWlucHV0XCIpO1xyXG5cclxuICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjdGl0bGVcIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNkZXNjcmlwdGlvblwiXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3Blb3BsZVwiXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb25maWd1cmUoKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuc3VibWl0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VibWl0SGFuZGxlcihldmVudDogRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgcG9zdGl0ID0gbmV3IFBvc3RpdChcclxuICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgK3RoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWVcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcG9zdGl0VmFsaWRhdGlvbiA9IHBvc3RpdHMuYWRkUG9zdGl0KHBvc3RpdCk7XHJcblxyXG4gICAgaWYgKHBvc3RpdFZhbGlkYXRpb24pIHtcclxuICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsZXJ0KGBpbnZsYWlkIGlucHV0OiAke1wiSW52YWxpZCBpbnB1dFwifWApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgUG9zdGl0TGlzdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTEVsZW1lbnQ+XHJcbiAgaW1wbGVtZW50cyBEcmFnVGFyZ2V0IHtcclxuICBhc3NpZ25lZFBvc3RpdHM6IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIHN1cGVyKFxyXG4gICAgICBcInByb2plY3QtbGlzdFwiLFxyXG4gICAgICBcImFwcFwiLFxyXG4gICAgICBmYWxzZSxcclxuICAgICAgYCR7c3RhdHVzLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5hc3NpZ25lZFBvc3RpdHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gIH1cclxuXHJcbiAgQGF1dG9iaW5kXHJcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSBcInRleHQvcGxhaW5cIikge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgbGlzdEVsLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGFibGVcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcm9wSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpKTtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgLy8gcG9zdGl0cy5cclxuICB9XHJcblxyXG4gIEBhdXRvYmluZFxyXG4gIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwYWJsZVwiKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5zdGF0dXMudG9TdHJpbmcoKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHRoaXMuZHJhZ092ZXJIYW5kbGVyKTtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIHRoaXMuZHJhZ0xlYXZlSGFuZGxlcik7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgdGhpcy5kcm9wSGFuZGxlcik7XHJcblxyXG4gICAgcG9zdGl0cy5hZGRMaXN0ZW5lcigocG9zdGl0OiBQb3N0aXRbXSkgPT4ge1xyXG4gICAgICBjb25zdCByZWxldmFudFByb2plY3RzID0gcG9zdGl0LmZpbHRlcigocHJqKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByai5zdGF0dXMgPT09IHRoaXMuc3RhdHVzO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5hc3NpZ25lZFBvc3RpdHMgPSByZWxldmFudFByb2plY3RzO1xyXG4gICAgICB0aGlzLnJlbmRlclBvc3RpdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJQb3N0aXRzKCkge1xyXG4gICAgY29uc3QgbGlzdElkID0gYCR7dGhpcy5zdGF0dXMudG9TdHJpbmcoKX0tcG9zdC1pdC1saXN0YDtcclxuICAgIGNvbnN0IGxpc3RFbCA9IGRvY3VtZW50XHJcbiAgICAgIC5nZXRFbGVtZW50QnlJZChgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCl9LXBvc3QtaXRgKSFcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICBsaXN0RWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGxpc3RFbC5pZCA9IGxpc3RJZDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHBvc3RpdEl0ZW0gb2YgdGhpcy5hc3NpZ25lZFBvc3RpdHMpIHtcclxuICAgICAgbmV3IFBvc3RpdENvbXBvbmVudCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpIS5pZCwgcG9zdGl0SXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQb3N0aXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTFVMaXN0RWxlbWVudCwgSFRNTExJRWxlbWVudD5cclxuICBpbXBsZW1lbnRzIERyYWdnYWJsZSB7XHJcbiAgcHJpdmF0ZSBwb3N0aXQ6IFBvc3RpdDtcclxuXHJcbiAgY29uc3RydWN0b3IoaG9zdElkOiBzdHJpbmcsIHBvc3RpdDogUG9zdGl0KSB7XHJcbiAgICBzdXBlcihcInBvc3QtaXRcIiwgaG9zdElkLCBmYWxzZSwgcG9zdGl0LmlkKTtcclxuXHJcbiAgICB0aGlzLnBvc3RpdCA9IHBvc3RpdDtcclxuXHJcbiAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgdGhpcy5yZW5kZXJDb250ZW50KCk7XHJcbiAgfVxyXG5cclxuICBAYXV0b2JpbmRcclxuICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGhpcy5wb3N0aXQuaWQpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XHJcbiAgfVxyXG5cclxuICBkcmFnRW5kSGFuZGxlcihfOiBEcmFnRXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiRHJhZ0VuZFwiKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlcik7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgdGhpcy5kcmFnRW5kSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICByZW5kZXJDb250ZW50KCkge1xyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC50aXRsZTtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC5kZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvc3RpdCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBTdGF0dXM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHQ6IHN0cmluZywgZDogc3RyaW5nLCBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgdGhpcy50aXRsZSA9IHQudHJpbSgpO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGQudHJpbSgpO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgUG9zdGl0cyB7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgcG9zdGl0TGlzdDogUG9zdGl0W10gPSBbXTtcclxuXHJcbiAgaG9zdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuICBwb3N0aXRUZW1wbGF0ZT86IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgcG9zdGl0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBfUG9zdGl0czogUG9zdGl0cztcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgIGlmICh0aGlzLl9Qb3N0aXRzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fUG9zdGl0cyA9IG5ldyBQb3N0aXRzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX1Bvc3RpdHM7XHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcihsaXN0ZW5lckZuOiBMaXN0ZW5lcikge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lckZuKTtcclxuICB9XHJcblxyXG4gIGFkZFBvc3RpdChwb3N0aXQ6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMuVmFsaWRhdGlvbihwb3N0aXQpO1xyXG5cclxuICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMucG9zdGl0TGlzdC5wdXNoKHBvc3RpdCk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyRm4gb2YgdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgICBsaXN0ZW5lckZuKHRoaXMucG9zdGl0TGlzdC5zbGljZSgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWxpZGF0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBWYWxpZGF0aW9uKHByb2plY3Q6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdGl0bGVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICBtYXhMZW5ndGg6IDUwLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvblZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgIG1heExlbmd0aDogMjAwLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3Quc3RhdHVzLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluVmFsdWU6IDAsXHJcbiAgICAgIG1heFZhbHVlOiAzLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgICF2YWxpZGF0ZSh0aXRsZVZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAhdmFsaWRhdGUoZGVzY3JpcHRpb25WYWxpZGF0YWJsZSkgfHxcclxuICAgICAgIXZhbGlkYXRlKHZhbHVlVmFsaWRhdGFibGUpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBwb3N0aXRzID0gUG9zdGl0cy5nZXRJbnN0YW5jZSgpO1xyXG5cclxuY29uc3QgcHJvamVjdElucHV0ID0gbmV3IElucHV0Q29tcG9uZW50KCk7XHJcbmNvbnN0IHByb2plY3RMaXN0MCA9IG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5VbmFzc2lnbmVkKTtcclxuY29uc3QgcHJvamVjdExpc3QgPSBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RhcnQpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDIgPSBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuQ29udGludWUpO1xyXG5jb25zdCBwcm9qZWN0TGlzdDMgPSBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RvcCk7XHJcbiJdfQ==