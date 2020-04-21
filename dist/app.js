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
        // console.log(event.dataTransfer!.getData("text/plain"));
        // console.log(event);
        // console.log(event.target);
        var postitId = event.dataTransfer.getData("text/plain");
        postits.movePostit(postitId, this.status);
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
    ], PostitListComponent.prototype, "dropHandler", null);
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
            this.updateListeners();
        }
        return validation;
    };
    Postits.prototype.movePostit = function (id, newStatus) {
        var postit = this.postitList.filter(function (postit) { return postit.id === id; })[0];
        if (postit && postit.status !== newStatus) {
            postit.status = newStatus;
            this.updateListeners();
        }
    };
    Postits.prototype.updateListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(this.postitList.slice());
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsSUFBSyxNQUtKO0FBTEQsV0FBSyxNQUFNO0lBQ1QsK0NBQVUsQ0FBQTtJQUNWLHFDQUFLLENBQUE7SUFDTCwyQ0FBUSxDQUFBO0lBQ1IsbUNBQUksQ0FBQTtBQUNOLENBQUMsRUFMSSxNQUFNLEtBQU4sTUFBTSxRQUtWO0FBS0QsU0FBUyxRQUFRLENBQUMsZ0JBQTZCO0lBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUM3QixPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQzVFO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ3RDLE9BQU87WUFDTCxPQUFPO2dCQUNQLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO29CQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7S0FDaEM7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDdEMsT0FBTztZQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07b0JBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztLQUNoQztJQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNyQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7S0FDMUU7SUFFRCxJQUFJLGdCQUFnQixDQUFD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LG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5RCxJQUFNLFlBQVksR0FBRyxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERyYWcgJiBEcm9wIEludGVyZmFjZXNcclxuaW50ZXJmYWNlIERyYWdnYWJsZSB7XHJcbiAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICBkcmFnRW5kSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxufVxyXG5pbnRlcmZhY2UgRHJhZ1RhcmdldCB7XHJcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICBkcm9wSGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgZHJhZ0xlYXZlSGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8vZGVjb3JhdG9yc1xyXG5pbnRlcmZhY2UgVmFsaWRhdGFibGUge1xyXG4gIHZhbHVlOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gIG1pbkxlbmd0aD86IG51bWJlcjtcclxuICBtYXhMZW5ndGg/OiBudW1iZXI7XHJcblxyXG4gIG1pblZhbHVlPzogbnVtYmVyO1xyXG4gIG1heFZhbHVlPzogbnVtYmVyO1xyXG59XHJcblxyXG5lbnVtIFN0YXR1cyB7XHJcbiAgVW5hc3NpZ25lZCxcclxuICBTdGFydCxcclxuICBDb250aW51ZSxcclxuICBTdG9wLFxyXG59XHJcblxyXG4vLyBQcm9qZWN0IHN0YXRlIE1hbmFnZW1lbnRcclxudHlwZSBMaXN0ZW5lciA9IChpdGVtczogUG9zdGl0W10pID0+IHZvaWQ7XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZSh2YWxpZGF0YWJsZUlucHV0OiBWYWxpZGF0YWJsZSk6IGJvb2xlYW4ge1xyXG4gIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQucmVxdWlyZWQpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoICE9PSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPVxyXG4gICAgICBpc1ZhbGlkICYmXHJcbiAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoID49XHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGg7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGggIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9XHJcbiAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPD1cclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPj0gdmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZTtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPD0gdmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpc1ZhbGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhdXRvYmluZChfOiBhbnksIF8yOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikge1xyXG4gIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQoKSB7XHJcbiAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xyXG4gICAgICByZXR1cm4gYm91bmRGbjtcclxuICAgIH0sXHJcbiAgfTtcclxuICByZXR1cm4gYWRqRGVzY3JpcHRvcjtcclxufVxyXG5cclxuLy9jb21wb25lbnQgYmFzZSBjbGFzc1xyXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50LCBVIGV4dGVuZHMgSFRNTEVsZW1lbnQ+IHtcclxuICB0ZW1wbGF0ZUVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgaG9zdEVsZW1lbnQ6IFQ7XHJcbiAgZWxlbWVudDogVTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0ZW1wYWx0ZUlkOiBzdHJpbmcsXHJcbiAgICBob3N0RWxlbWVudElkOiBzdHJpbmcsXHJcbiAgICBpbnNlcnRBdFN0YXJ0OiBib29sZWFuLFxyXG4gICAgbmV3RWxlbWVudElkPzogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICB0aGlzLnRlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICB0ZW1wYWx0ZUlkXHJcbiAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChob3N0RWxlbWVudElkKSEgYXMgVDtcclxuXHJcbiAgICBjb25zdCBmb3JtTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBmb3JtTm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBVO1xyXG4gICAgaWYgKG5ld0VsZW1lbnRJZCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtZW50SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hdHRhY2goaW5zZXJ0QXRTdGFydCk7XHJcbiAgfVxyXG5cclxuICBhYnN0cmFjdCBjb25maWd1cmUoKTogdm9pZDtcclxuXHJcbiAgcHJpdmF0ZSBhdHRhY2goaW5zZXJ0QXRTdGFydDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXHJcbiAgICAgIGluc2VydEF0U3RhcnQgPyBcImFmdGVyYmVnaW5cIiA6IFwiYmVmb3JlZW5kXCIsXHJcbiAgICAgIHRoaXMuZWxlbWVudFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIElucHV0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRm9ybUVsZW1lbnQ+IHtcclxuICB0aXRsZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICBkZXNjcmlwdGlvbklucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICB2YWx1ZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihcInByb2plY3QtaW5wdXRcIiwgXCJhcHBcIiwgZmFsc2UsIFwidXNlci1pbnB1dFwiKTtcclxuXHJcbiAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3RpdGxlXCJcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjZGVzY3JpcHRpb25cIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNwZW9wbGVcIlxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgfVxyXG5cclxuICBjb25maWd1cmUoKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnN1Ym1pdEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1Ym1pdEhhbmRsZXIoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHBvc3RpdCA9IG5ldyBQb3N0aXQoXHJcbiAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgICt0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHBvc3RpdFZhbGlkYXRpb24gPSBwb3N0aXRzLmFkZFBvc3RpdChwb3N0aXQpO1xyXG5cclxuICAgIGlmIChwb3N0aXRWYWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvc3RpdExpc3RDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxFbGVtZW50PlxyXG4gIGltcGxlbWVudHMgRHJhZ1RhcmdldCB7XHJcbiAgYXNzaWduZWRQb3N0aXRzOiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICBzdXBlcihcclxuICAgICAgXCJwcm9qZWN0LWxpc3RcIixcclxuICAgICAgXCJhcHBcIixcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIGAke3N0YXR1cy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYXNzaWduZWRQb3N0aXRzID0gW107XHJcblxyXG4gICAgdGhpcy5jb25maWd1cmUoKTtcclxuICB9XHJcblxyXG4gIEBhdXRvYmluZFxyXG4gIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyICYmIGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlc1swXSA9PT0gXCJ0ZXh0L3BsYWluXCIpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5jbGFzc0xpc3QuYWRkKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQGF1dG9iaW5kXHJcbiAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKFwidGV4dC9wbGFpblwiKSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhldmVudC50YXJnZXQpO1xyXG5cclxuICAgIGNvbnN0IHBvc3RpdElkID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtcclxuICAgIHBvc3RpdHMubW92ZVBvc3RpdChwb3N0aXRJZCwgdGhpcy5zdGF0dXMpO1xyXG4gICAgLy8gcG9zdGl0cy5cclxuICB9XHJcblxyXG4gIEBhdXRvYmluZFxyXG4gIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwYWJsZVwiKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5zdGF0dXMudG9TdHJpbmcoKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHRoaXMuZHJhZ092ZXJIYW5kbGVyKTtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIHRoaXMuZHJhZ0xlYXZlSGFuZGxlcik7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgdGhpcy5kcm9wSGFuZGxlcik7XHJcblxyXG4gICAgcG9zdGl0cy5hZGRMaXN0ZW5lcigocG9zdGl0OiBQb3N0aXRbXSkgPT4ge1xyXG4gICAgICBjb25zdCByZWxldmFudFByb2plY3RzID0gcG9zdGl0LmZpbHRlcigocHJqKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByai5zdGF0dXMgPT09IHRoaXMuc3RhdHVzO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5hc3NpZ25lZFBvc3RpdHMgPSByZWxldmFudFByb2plY3RzO1xyXG4gICAgICB0aGlzLnJlbmRlclBvc3RpdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJQb3N0aXRzKCkge1xyXG4gICAgY29uc3QgbGlzdElkID0gYCR7dGhpcy5zdGF0dXMudG9TdHJpbmcoKX0tcG9zdC1pdC1saXN0YDtcclxuICAgIGNvbnN0IGxpc3RFbCA9IGRvY3VtZW50XHJcbiAgICAgIC5nZXRFbGVtZW50QnlJZChgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCl9LXBvc3QtaXRgKSFcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICBsaXN0RWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGxpc3RFbC5pZCA9IGxpc3RJZDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHBvc3RpdEl0ZW0gb2YgdGhpcy5hc3NpZ25lZFBvc3RpdHMpIHtcclxuICAgICAgbmV3IFBvc3RpdENvbXBvbmVudCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpIS5pZCwgcG9zdGl0SXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQb3N0aXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTFVMaXN0RWxlbWVudCwgSFRNTExJRWxlbWVudD5cclxuICBpbXBsZW1lbnRzIERyYWdnYWJsZSB7XHJcbiAgcHJpdmF0ZSBwb3N0aXQ6IFBvc3RpdDtcclxuXHJcbiAgY29uc3RydWN0b3IoaG9zdElkOiBzdHJpbmcsIHBvc3RpdDogUG9zdGl0KSB7XHJcbiAgICBzdXBlcihcInBvc3QtaXRcIiwgaG9zdElkLCBmYWxzZSwgcG9zdGl0LmlkKTtcclxuXHJcbiAgICB0aGlzLnBvc3RpdCA9IHBvc3RpdDtcclxuXHJcbiAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgdGhpcy5yZW5kZXJDb250ZW50KCk7XHJcbiAgfVxyXG5cclxuICBAYXV0b2JpbmRcclxuICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGhpcy5wb3N0aXQuaWQpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XHJcbiAgfVxyXG5cclxuICBkcmFnRW5kSGFuZGxlcihfOiBEcmFnRXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiRHJhZ0VuZFwiKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlcik7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgdGhpcy5kcmFnRW5kSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICByZW5kZXJDb250ZW50KCkge1xyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC50aXRsZTtcclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC5kZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvc3RpdCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBTdGF0dXM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHQ6IHN0cmluZywgZDogc3RyaW5nLCBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgdGhpcy50aXRsZSA9IHQudHJpbSgpO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGQudHJpbSgpO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgUG9zdGl0cyB7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgcG9zdGl0TGlzdDogUG9zdGl0W10gPSBbXTtcclxuXHJcbiAgaG9zdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuICBwb3N0aXRUZW1wbGF0ZT86IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgcG9zdGl0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBfUG9zdGl0czogUG9zdGl0cztcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgIGlmICh0aGlzLl9Qb3N0aXRzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fUG9zdGl0cyA9IG5ldyBQb3N0aXRzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX1Bvc3RpdHM7XHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcihsaXN0ZW5lckZuOiBMaXN0ZW5lcikge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lckZuKTtcclxuICB9XHJcblxyXG4gIGFkZFBvc3RpdChwb3N0aXQ6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMuVmFsaWRhdGlvbihwb3N0aXQpO1xyXG5cclxuICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgIHRoaXMucG9zdGl0TGlzdC5wdXNoKHBvc3RpdCk7XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZUxpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWxpZGF0aW9uO1xyXG4gIH1cclxuXHJcbiAgbW92ZVBvc3RpdChpZDogc3RyaW5nLCBuZXdTdGF0dXM6IFN0YXR1cykge1xyXG4gICAgY29uc3QgcG9zdGl0ID0gdGhpcy5wb3N0aXRMaXN0LmZpbHRlcigocG9zdGl0KSA9PiBwb3N0aXQuaWQgPT09IGlkKVswXTtcclxuXHJcbiAgICBpZiAocG9zdGl0ICYmIHBvc3RpdC5zdGF0dXMgIT09IG5ld1N0YXR1cykge1xyXG4gICAgICBwb3N0aXQuc3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gICAgICB0aGlzLnVwZGF0ZUxpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVMaXN0ZW5lcnMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyRm4gb2YgdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgbGlzdGVuZXJGbih0aGlzLnBvc3RpdExpc3Quc2xpY2UoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIFZhbGlkYXRpb24ocHJvamVjdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB0aXRsZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgdmFsdWU6IHByb2plY3QudGl0bGUsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgIG1heExlbmd0aDogNTAsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgbWF4TGVuZ3RoOiAyMDAsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZhbHVlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdC5zdGF0dXMsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICBtaW5WYWx1ZTogMCxcclxuICAgICAgbWF4VmFsdWU6IDMsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChcclxuICAgICAgIXZhbGlkYXRlKHRpdGxlVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICF2YWxpZGF0ZShkZXNjcmlwdGlvblZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAhdmFsaWRhdGUodmFsdWVWYWxpZGF0YWJsZSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHBvc3RpdHMgPSBQb3N0aXRzLmdldEluc3RhbmNlKCk7XHJcblxyXG5jb25zdCBwcm9qZWN0SW5wdXQgPSBuZXcgSW5wdXRDb21wb25lbnQoKTtcclxuY29uc3QgcHJvamVjdExpc3QwID0gbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlVuYXNzaWduZWQpO1xyXG5jb25zdCBwcm9qZWN0TGlzdCA9IG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5TdGFydCk7XHJcbmNvbnN0IHByb2plY3RMaXN0MiA9IG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5Db250aW51ZSk7XHJcbmNvbnN0IHByb2plY3RMaXN0MyA9IG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5TdG9wKTtcclxuIl19