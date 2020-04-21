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
var App;
(function (App) {
    var Status;
    (function (Status) {
        Status[Status["Unassigned"] = 0] = "Unassigned";
        Status[Status["Start"] = 1] = "Start";
        Status[Status["Continue"] = 2] = "Continue";
        Status[Status["Stop"] = 3] = "Stop";
    })(Status = App.Status || (App.Status = {}));
    var Postit = /** @class */ (function () {
        function Postit(t, d, status) {
            this.title = t.trim();
            this.description = d.trim();
            this.status = status;
            this.id = Math.random().toString();
        }
        return Postit;
    }());
    App.Postit = Postit;
})(App || (App = {}));
var App;
(function (App) {
    function validate(validatableInput) {
        var isValid = true;
        if (validatableInput.required) {
            isValid =
                isValid && validatableInput.value.toString().trim().length !== 0;
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
    App.validate = validate;
})(App || (App = {}));
/// <reference path = "../util/validation.ts"/>
var App;
(function (App) {
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
                required: false,
                minLength: 0,
                maxLength: 14,
            };
            var descriptionValidatable = {
                value: project.description,
                required: true,
                minLength: 1,
                maxLength: 140,
            };
            var valueValidatable = {
                value: project.status,
                required: true,
                minValue: 0,
                maxValue: 3,
            };
            if (!App.validate(titleValidatable) ||
                !App.validate(descriptionValidatable) ||
                !App.validate(valueValidatable)) {
                return false;
            }
            return true;
        };
        return Postits;
    }());
    App.Postits = Postits;
    App.postits = Postits.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
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
            var postit = new App.Postit(this.titleInputElement.value, this.descriptionInputElement.value, +this.valueInputElement.value);
            var postitValidation = App.postits.addPostit(postit);
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
    }(App.Component));
    App.InputComponent = InputComponent;
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
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
            var postitId = event.dataTransfer.getData("text/plain");
            App.postits.movePostit(postitId, this.status);
            var listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
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
            App.postits.addListener(function (postit) {
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
                new App.PostitComponent(this.element.querySelector("ul").id, postitItem);
            }
        };
        __decorate([
            App.autobind
        ], PostitListComponent.prototype, "dragOverHandler", null);
        __decorate([
            App.autobind
        ], PostitListComponent.prototype, "dropHandler", null);
        __decorate([
            App.autobind
        ], PostitListComponent.prototype, "dragLeaveHandler", null);
        return PostitListComponent;
    }(App.Component));
    App.PostitListComponent = PostitListComponent;
})(App || (App = {}));
/// <reference path = "./models/drag-drop.ts"/>
/// <reference path = "./models/postit.ts"/>
/// <reference path = "./state/postit-state.ts"/>
/// <reference path = "./decorators/autobind.ts"/>
/// <reference path = "./component/postit-input.ts"/>
/// <reference path = "./component/postit-list.ts"/>
var App;
(function (App) {
    //component base class
    new App.InputComponent();
    new App.PostitListComponent(App.Status.Unassigned);
    new App.PostitListComponent(App.Status.Start);
    new App.PostitListComponent(App.Status.Continue);
    new App.PostitListComponent(App.Status.Stop);
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
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
            App.autobind
        ], PostitComponent.prototype, "dragStartHandler", null);
        return PostitComponent;
    }(App.Component));
    App.PostitComponent = PostitComponent;
})(App || (App = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJtb2RlbHMvZHJhZy1kcm9wLnRzIiwibW9kZWxzL3Bvc3RpdC50cyIsInV0aWwvdmFsaWRhdGlvbi50cyIsInN0YXRlL3Bvc3RpdC1zdGF0ZS50cyIsImRlY29yYXRvcnMvYXV0b2JpbmQudHMiLCJjb21wb25lbnQvYmFzZS1jb21wb25lbnQudHMiLCJjb21wb25lbnQvcG9zdGl0LWlucHV0LnRzIiwiY29tcG9uZW50L3Bvc3RpdC1saXN0LnRzIiwiYXBwLnRzIiwiY29tcG9uZW50L3Bvc3RpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQVUsR0FBRyxDQXFCWjtBQXJCRCxXQUFVLEdBQUc7SUFDWCxJQUFZLE1BS1g7SUFMRCxXQUFZLE1BQU07UUFDaEIsK0NBQVUsQ0FBQTtRQUNWLHFDQUFLLENBQUE7UUFDTCwyQ0FBUSxDQUFBO1FBQ1IsbUNBQUksQ0FBQTtJQUNOLENBQUMsRUFMVyxNQUFNLEdBQU4sVUFBTSxLQUFOLFVBQU0sUUFLakI7SUFFRDtRQU1FLGdCQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBYztZQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBQ0gsYUFBQztJQUFELENBQUMsQUFaRCxJQVlDO0lBWlksVUFBTSxTQVlsQixDQUFBO0FBQ0gsQ0FBQyxFQXJCUyxHQUFHLEtBQUgsR0FBRyxRQXFCWjtBQ3JCRCxJQUFVLEdBQUcsQ0EyQ1o7QUEzQ0QsV0FBVSxHQUFHO0lBV1gs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Q3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVELG1DQUFTLEdBQVQ7WUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELHVDQUFhLEdBQWI7WUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3pFLENBQUM7UUFqQkQ7WUFEQyxJQUFBLFFBQVE7K0RBSVI7UUFlSCxzQkFBQztLQUFBLEFBakNELENBQ1UsSUFBQSxTQUFTLEdBZ0NsQjtJQWpDWSxtQkFBZSxrQkFpQzNCLENBQUE7QUFDSCxDQUFDLEVBbkNTLEdBQUcsS0FBSCxHQUFHLFFBbUNaIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRHJhZyAmIERyb3AgSW50ZXJmYWNlc1xyXG5uYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgaW50ZXJmYWNlIERyYWdnYWJsZSB7XHJcbiAgICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gICAgZHJhZ0VuZEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgfVxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRHJhZ1RhcmdldCB7XHJcbiAgICBkcmFnT3ZlckhhbmRsZXIoZXZlbnRMOiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gICAgZHJvcEhhbmRsZXIoZXZlbnRMOiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gICAgZHJhZ0xlYXZlSGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBlbnVtIFN0YXR1cyB7XHJcbiAgICBVbmFzc2lnbmVkLFxyXG4gICAgU3RhcnQsXHJcbiAgICBDb250aW51ZSxcclxuICAgIFN0b3AsXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgUG9zdGl0IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIHN0YXR1czogU3RhdHVzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHQ6IHN0cmluZywgZDogc3RyaW5nLCBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICB0aGlzLnRpdGxlID0gdC50cmltKCk7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkLnRyaW0oKTtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIHRoaXMuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGFibGUge1xyXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIHJlcXVpcmVkPzogYm9vbGVhbjtcclxuICAgIG1pbkxlbmd0aD86IG51bWJlcjtcclxuICAgIG1heExlbmd0aD86IG51bWJlcjtcclxuXHJcbiAgICBtaW5WYWx1ZT86IG51bWJlcjtcclxuICAgIG1heFZhbHVlPzogbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlKHZhbGlkYXRhYmxlSW5wdXQ6IFZhbGlkYXRhYmxlKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQucmVxdWlyZWQpIHtcclxuICAgICAgaXNWYWxpZCA9XHJcbiAgICAgICAgaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCAhPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGggIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID1cclxuICAgICAgICBpc1ZhbGlkICYmXHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPj1cclxuICAgICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aCAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPVxyXG4gICAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA8PVxyXG4gICAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlID49IHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlIDw9IHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcIi4uL3V0aWwvdmFsaWRhdGlvbi50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIHR5cGUgTGlzdGVuZXIgPSAoaXRlbXM6IFBvc3RpdFtdKSA9PiB2b2lkO1xyXG5cclxuICBleHBvcnQgY2xhc3MgUG9zdGl0cyB7XHJcbiAgICBwcml2YXRlIGxpc3RlbmVyczogTGlzdGVuZXJbXSA9IFtdO1xyXG5cclxuICAgIHBvc3RpdExpc3Q6IFBvc3RpdFtdID0gW107XHJcblxyXG4gICAgaG9zdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuICAgIHBvc3RpdFRlbXBsYXRlPzogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICAgIHBvc3RpdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfUG9zdGl0czogUG9zdGl0cztcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XHJcbiAgICAgIGlmICh0aGlzLl9Qb3N0aXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1Bvc3RpdHM7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fUG9zdGl0cyA9IG5ldyBQb3N0aXRzKCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fUG9zdGl0cztcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lckZuOiBMaXN0ZW5lcikge1xyXG4gICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyRm4pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBvc3RpdChwb3N0aXQ6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCB2YWxpZGF0aW9uID0gdGhpcy5WYWxpZGF0aW9uKHBvc3RpdCk7XHJcblxyXG4gICAgICBpZiAodmFsaWRhdGlvbikge1xyXG4gICAgICAgIHRoaXMucG9zdGl0TGlzdC5wdXNoKHBvc3RpdCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB2YWxpZGF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVQb3N0aXQoaWQ6IHN0cmluZywgbmV3U3RhdHVzOiBTdGF0dXMpIHtcclxuICAgICAgY29uc3QgcG9zdGl0ID0gdGhpcy5wb3N0aXRMaXN0LmZpbHRlcigocG9zdGl0KSA9PiBwb3N0aXQuaWQgPT09IGlkKVswXTtcclxuXHJcbiAgICAgIGlmIChwb3N0aXQgJiYgcG9zdGl0LnN0YXR1cyAhPT0gbmV3U3RhdHVzKSB7XHJcbiAgICAgICAgcG9zdGl0LnN0YXR1cyA9IG5ld1N0YXR1cztcclxuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RlbmVycygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMaXN0ZW5lcnMoKSB7XHJcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXJGbiBvZiB0aGlzLmxpc3RlbmVycykge1xyXG4gICAgICAgIGxpc3RlbmVyRm4odGhpcy5wb3N0aXRMaXN0LnNsaWNlKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBWYWxpZGF0aW9uKHByb2plY3Q6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCB0aXRsZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgICB2YWx1ZTogcHJvamVjdC50aXRsZSxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICAgICAgbWluTGVuZ3RoOiAwLFxyXG4gICAgICAgIG1heExlbmd0aDogMTQsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBkZXNjcmlwdGlvblZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgICB2YWx1ZTogcHJvamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgICAgbWF4TGVuZ3RoOiAxNDAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCB2YWx1ZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgICB2YWx1ZTogcHJvamVjdC5zdGF0dXMsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgbWluVmFsdWU6IDAsXHJcbiAgICAgICAgbWF4VmFsdWU6IDMsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgIXZhbGlkYXRlKHRpdGxlVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICAgIXZhbGlkYXRlKGRlc2NyaXB0aW9uVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICAgIXZhbGlkYXRlKHZhbHVlVmFsaWRhdGFibGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBjb25zdCBwb3N0aXRzID0gUG9zdGl0cy5nZXRJbnN0YW5jZSgpO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChfOiBhbnksIF8yOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikge1xyXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gICAgY29uc3QgYWRqRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yID0ge1xyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIGdldCgpIHtcclxuICAgICAgICBjb25zdCBib3VuZEZuID0gb3JpZ2luYWxNZXRob2QuYmluZCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gYm91bmRGbjtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gYWRqRGVzY3JpcHRvcjtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxcclxuICAgIFQgZXh0ZW5kcyBIVE1MRWxlbWVudCxcclxuICAgIFUgZXh0ZW5kcyBIVE1MRWxlbWVudFxyXG4gID4ge1xyXG4gICAgdGVtcGxhdGVFbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgaG9zdEVsZW1lbnQ6IFQ7XHJcbiAgICBlbGVtZW50OiBVO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICB0ZW1wYWx0ZUlkOiBzdHJpbmcsXHJcbiAgICAgIGhvc3RFbGVtZW50SWQ6IHN0cmluZyxcclxuICAgICAgaW5zZXJ0QXRTdGFydDogYm9vbGVhbixcclxuICAgICAgbmV3RWxlbWVudElkPzogc3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICB0ZW1wYWx0ZUlkXHJcbiAgICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XHJcblxyXG4gICAgICBjb25zdCBmb3JtTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZWxlbWVudCA9IGZvcm1Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIFU7XHJcbiAgICAgIGlmIChuZXdFbGVtZW50SWQpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtZW50SWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXR0YWNoKGluc2VydEF0U3RhcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGNvbmZpZ3VyZSgpOiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgYXR0YWNoKGluc2VydEF0U3RhcnQ6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXHJcbiAgICAgICAgaW5zZXJ0QXRTdGFydCA/IFwiYWZ0ZXJiZWdpblwiIDogXCJiZWZvcmVlbmRcIixcclxuICAgICAgICB0aGlzLmVsZW1lbnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UtY29tcG9uZW50LnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBjbGFzcyBJbnB1dENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxcclxuICAgIEhUTUxEaXZFbGVtZW50LFxyXG4gICAgSFRNTEZvcm1FbGVtZW50XHJcbiAgPiB7XHJcbiAgICB0aXRsZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdmFsdWVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKFwicHJvamVjdC1pbnB1dFwiLCBcImFwcFwiLCBmYWxzZSwgXCJ1c2VyLWlucHV0XCIpO1xyXG5cclxuICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3RpdGxlXCJcclxuICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjZGVzY3JpcHRpb25cIlxyXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMudmFsdWVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNwZW9wbGVcIlxyXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZSgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgdGhpcy5zdWJtaXRIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0SGFuZGxlcihldmVudDogRXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvc3RpdCA9IG5ldyBQb3N0aXQoXHJcbiAgICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICAgICt0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBjb25zdCBwb3N0aXRWYWxpZGF0aW9uID0gcG9zdGl0cy5hZGRQb3N0aXQocG9zdGl0KTtcclxuXHJcbiAgICAgIGlmIChwb3N0aXRWYWxpZGF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoYGludmxhaWQgaW5wdXQ6ICR7XCJJbnZhbGlkIGlucHV0XCJ9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UtY29tcG9uZW50LnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXRMaXN0Q29tcG9uZW50XHJcbiAgICBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTEVsZW1lbnQ+XHJcbiAgICBpbXBsZW1lbnRzIERyYWdUYXJnZXQge1xyXG4gICAgYXNzaWduZWRQb3N0aXRzOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgICAgc3VwZXIoXHJcbiAgICAgICAgXCJwcm9qZWN0LWxpc3RcIixcclxuICAgICAgICBcImFwcFwiLFxyXG4gICAgICAgIGZhbHNlLFxyXG4gICAgICAgIGAke3N0YXR1cy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IFtdO1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSBcInRleHQvcGxhaW5cIikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgICAgbGlzdEVsLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGFibGVcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyb3BIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgY29uc3QgcG9zdGl0SWQgPSBldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xyXG4gICAgICBwb3N0aXRzLm1vdmVQb3N0aXQocG9zdGl0SWQsIHRoaXMuc3RhdHVzKTtcclxuICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJhZ0xlYXZlSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGxpc3RFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwYWJsZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmUoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5zdGF0dXMudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgdGhpcy5kcmFnT3ZlckhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCB0aGlzLmRyYWdMZWF2ZUhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgdGhpcy5kcm9wSGFuZGxlcik7XHJcblxyXG4gICAgICBwb3N0aXRzLmFkZExpc3RlbmVyKChwb3N0aXQ6IFBvc3RpdFtdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsZXZhbnRQcm9qZWN0cyA9IHBvc3RpdC5maWx0ZXIoKHByaikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHByai5zdGF0dXMgPT09IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXNzaWduZWRQb3N0aXRzID0gcmVsZXZhbnRQcm9qZWN0cztcclxuICAgICAgICB0aGlzLnJlbmRlclBvc3RpdHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJQb3N0aXRzKCkge1xyXG4gICAgICBjb25zdCBsaXN0SWQgPSBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpfS1wb3N0LWl0LWxpc3RgO1xyXG4gICAgICBjb25zdCBsaXN0RWwgPSBkb2N1bWVudFxyXG4gICAgICAgIC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICAgICApIVxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICBsaXN0RWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgbGlzdEVsLmlkID0gbGlzdElkO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBwb3N0aXRJdGVtIG9mIHRoaXMuYXNzaWduZWRQb3N0aXRzKSB7XHJcbiAgICAgICAgbmV3IFBvc3RpdENvbXBvbmVudCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpIS5pZCwgcG9zdGl0SXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi9tb2RlbHMvZHJhZy1kcm9wLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL21vZGVscy9wb3N0aXQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcIi4vc3RhdGUvcG9zdGl0LXN0YXRlLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL2RlY29yYXRvcnMvYXV0b2JpbmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcIi4vY29tcG9uZW50L3Bvc3RpdC1pbnB1dC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi9jb21wb25lbnQvcG9zdGl0LWxpc3QudHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgQXBwIHtcclxuICAvL2NvbXBvbmVudCBiYXNlIGNsYXNzXHJcblxyXG4gIG5ldyBJbnB1dENvbXBvbmVudCgpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5VbmFzc2lnbmVkKTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RhcnQpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5Db250aW51ZSk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlN0b3ApO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLWNvbXBvbmVudC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgY2xhc3MgUG9zdGl0Q29tcG9uZW50XHJcbiAgICBleHRlbmRzIENvbXBvbmVudDxIVE1MVUxpc3RFbGVtZW50LCBIVE1MTElFbGVtZW50PlxyXG4gICAgaW1wbGVtZW50cyBEcmFnZ2FibGUge1xyXG4gICAgcHJpdmF0ZSBwb3N0aXQ6IFBvc3RpdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihob3N0SWQ6IHN0cmluZywgcG9zdGl0OiBQb3N0aXQpIHtcclxuICAgICAgc3VwZXIoXCJwb3N0LWl0XCIsIGhvc3RJZCwgZmFsc2UsIHBvc3RpdC5pZCk7XHJcblxyXG4gICAgICB0aGlzLnBvc3RpdCA9IHBvc3RpdDtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICAgIHRoaXMucmVuZGVyQ29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGhpcy5wb3N0aXQuaWQpO1xyXG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnRW5kSGFuZGxlcihfOiBEcmFnRXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJEcmFnRW5kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZSgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgdGhpcy5kcmFnU3RhcnRIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIHRoaXMuZHJhZ0VuZEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckNvbnRlbnQoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5wb3N0aXQudGl0bGU7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19