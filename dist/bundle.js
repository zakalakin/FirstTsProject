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
/// <reference path = "./models/drag-drop.ts"/>
/// <reference path = "./models/postit.ts"/>
/// <reference path = "./state/postit-state.ts"/>
/// <reference path = "./decorators/autobind.ts"/>
var App;
(function (App) {
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
                new PostitComponent(this.element.querySelector("ul").id, postitItem);
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
            App.autobind
        ], PostitComponent.prototype, "dragStartHandler", null);
        return PostitComponent;
    }(Component));
    new InputComponent();
    new PostitListComponent(App.Status.Unassigned);
    new PostitListComponent(App.Status.Start);
    new PostitListComponent(App.Status.Continue);
    new PostitListComponent(App.Status.Stop);
})(App || (App = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJtb2RlbHMvZHJhZy1kcm9wLnRzIiwibW9kZWxzL3Bvc3RpdC50cyIsInV0aWwvdmFsaWRhdGlvbi50cyIsInN0YXRlL3Bvc3RpdC1zdGF0ZS50cyIsImRlY29yYXRvcnMvYXV0b2JpbmQudHMiLCJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFVLEdBQUcsQ0FxQlo7QUFyQkQsV0FBVSxHQUFHO0lBQ1gsSUFBWSxNQUtYO0lBTEQsV0FBWSxNQUFNO1FBQ2hCLCtDQUFVLENBQUE7UUFDVixxQ0FBSyxDQUFBO1FBQ0wsMkNBQVEsQ0FBQTtRQUNSLG1DQUFJLENBQUE7SUFDTixDQUFDLEVBTFcsTUFBTSxHQUFOLFVBQU0sS0FBTixVQUFNLFFBS2pCO0lBRUQ7UUFNRSxnQkFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQWM7WUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQUNILGFBQUM7SUFBRCxDQUFDLEFBWkQsSUFZQztJQVpZLFVBQU0sU0FZbEIsQ0FBQTtBQUNILENBQUMsRUFyQlMsR0FBRyxLQUFILEdBQUcsUUFxQlo7QUNyQkQsSUFBVSxHQUFHLENBMkNaO0FBM0NELFdBQVUsR0FBRztJQVdYLFNBQWdCLFFBQVEsQ0FBQyxnQkFBNkI7UUFDcEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRW5CLElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1lBQzdCLE9BQU87Z0JBQ0wsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3RDLE9BQU87Z0JBQ0wsT0FBTztvQkFDUCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTTt3QkFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3RDLE9BQU87Z0JBQ0wsT0FBTztvQkFDUCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTTt3QkFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3JDLE9BQU8sR0FBRyxPQUFPLElBQUksZ0JBQWdCLENBQUMsS0FBSyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztTQUMxRTtRQUVELElBQUksZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUNyQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7U0FDMUU7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBL0JlLFlBQVEsV0ErQnZCLENBQUE7QUFDSCxDQUFDLEVBM0NTLEdBQUcsS0FBSCxHQUFHLFFBMkNaO0FDM0NELCtDQUErQztBQUUvQyxJQUFVLEdBQUcsQ0EwRlo7QUExRkQsV0FBVSxHQUFHO0lBR1g7UUFXRTtZQVZRLGNBQVMsR0FBZSxFQUFFLENBQUM7WUFFbkMsZUFBVSxHQUFhLEVBQUUsQ0FBQztRQVFILENBQUM7UUFFakIsbUJBQVcsR0FBbEI7WUFDRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUN0QjtZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUU5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUVELDZCQUFXLEdBQVgsVUFBWSxVQUFvQjtZQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsMkJBQVMsR0FBVCxVQUFVLE1BQWM7WUFDdEIsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUzQyxJQUFJLFVBQVUsRUFBRTtnQkFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFN0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3hCO1lBRUQsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQztRQUVELDRCQUFVLEdBQVYsVUFBVyxFQUFVLEVBQUUsU0FBaUI7WUFDdEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZFLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQztRQUVPLGlDQUFlLEdBQXZCO1lBQ0UsS0FBeUIsVUFBYyxFQUFkLEtBQUEsSUFBSSxDQUFDLFNBQVMsRUFBZCxjQUFjLEVBQWQsSUFBYyxFQUFFO2dCQUFwQyxJQUFNLFVBQVUsU0FBQTtnQkFDbkIsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUM7UUFFTyw0QkFBVSxHQUFsQixVQUFtQixPQUFlO1lBQ2hDLElBQU0sZ0JBQWdCLEdBQWdCO2dCQUNwQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7Z0JBQ3BCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2FBQ2QsQ0FBQztZQUVGLElBQU0sc0JBQXNCLEdBQWdCO2dCQUMxQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQzFCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxHQUFHO2FBQ2YsQ0FBQztZQUVGLElBQU0sZ0JBQWdCLEdBQWdCO2dCQUNwQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3JCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFFBQVEsRUFBRSxDQUFDO2FBQ1osQ0FBQztZQUVGLElBQ0UsQ0FBQyxJQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDM0IsQ0FBQyxJQUFBLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDakMsQ0FBQyxJQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUMzQjtnQkFDQSxPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0gsY0FBQztJQUFELENBQUMsQUFwRkQsSUFvRkM7SUFwRlksV0FBTyxVQW9GbkIsQ0FBQTtJQUVZLFdBQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDL0MsQ0FBQyxFQTFGUyxHQUFHLEtBQUgsR0FBRyxRQTBGWjtBQzVGRCxJQUFVLEdBQUcsQ0FZWjtBQVpELFdBQVUsR0FBRztJQUNYLFNBQWdCLFFBQVEsQ0FBQyxDQUFNLEVBQUUsRUFBVSxFQUFFLFVBQThCO1FBQ3pFLElBQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDeEMsSUFBTSxhQUFhLEdBQXVCO1lBQ3hDLFlBQVksRUFBRSxJQUFJO1lBQ2xCLEdBQUc7Z0JBQ0QsSUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxPQUFPLENBQUM7WUFDakIsQ0FBQztTQUNGLENBQUM7UUFDRixPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBVmUsWUFBUSxXQVV2QixDQUFBO0FBQ0gsQ0FBQyxFQVpTLEdBQUcsS0FBSCxHQUFHLFFBWVo7QUNaRCwrQ0FBK0M7QUFDL0MsNENBQTRDO0FBQzVDLGlEQUFpRDtBQUNqRCxrREFBa0Q7QUFFbEQsSUFBVSxHQUFHLENBbU1aO0FBbk1ELFdBQVUsR0FBRztJQUNYLHNCQUFzQjtJQUN0QjtRQUtFLG1CQUNFLFVBQWtCLEVBQ2xCLGFBQXFCLEVBQ3JCLGFBQXNCLEVBQ3RCLFlBQXFCO1lBRXJCLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDNUMsVUFBVSxDQUNhLENBQUM7WUFFMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBTyxDQUFDO1lBRWhFLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsaUJBQXNCLENBQUM7WUFDL0MsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQzthQUNoQztZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUlPLDBCQUFNLEdBQWQsVUFBZSxhQUFzQjtZQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUNwQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUMxQyxJQUFJLENBQUMsT0FBTyxDQUNiLENBQUM7UUFDSixDQUFDO1FBQ0gsZ0JBQUM7SUFBRCxDQUFDLEFBbENELElBa0NDO0lBRUQ7UUFBNkIsa0NBQTBDO1FBS3JFO1lBQUEsWUFDRSxrQkFBTSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsU0FhbkQ7WUFYQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQ2pELFFBQVEsQ0FDVyxDQUFDO1lBQ3RCLEtBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FDdkQsY0FBYyxDQUNLLENBQUM7WUFDdEIsS0FBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUNqRCxTQUFTLENBQ1UsQ0FBQztZQUV0QixLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7O1FBQ25CLENBQUM7UUFFRCxrQ0FBUyxHQUFUO1lBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6RSxDQUFDO1FBRU8sc0NBQWEsR0FBckIsVUFBc0IsS0FBWTtZQUNoQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFBLE1BQU0sQ0FDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFDNUIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFDbEMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUM5QixDQUFDO1lBRUYsSUFBTSxnQkFBZ0IsR0FBRyxJQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkQsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUNuQztpQkFBTTtnQkFDTCxLQUFLLENBQUMsb0JBQWtCLGVBQWlCLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUE1Q0QsQ0FBNkIsU0FBUyxHQTRDckM7SUFFRDtRQUFrQyx1Q0FBc0M7UUFJdEUsNkJBQW1CLE1BQWM7WUFBakMsWUFDRSxrQkFDRSxjQUFjLEVBQ2QsS0FBSyxFQUNMLEtBQUssRUFDRixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLGFBQVUsQ0FDN0MsU0FLRjtZQVhrQixZQUFNLEdBQU4sTUFBTSxDQUFRO1lBUS9CLEtBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBRTFCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7UUFDbkIsQ0FBQztRQUdELDZDQUFlLEdBQWYsVUFBZ0IsS0FBZ0I7WUFDOUIsSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksRUFBRTtnQkFDdEUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQztnQkFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDO1FBR0QseUNBQVcsR0FBWCxVQUFZLEtBQWdCO1lBQzFCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxZQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNELElBQUEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFHRCw4Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBZ0I7WUFDL0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELHVDQUFTLEdBQVQ7WUFBQSxpQkFjQztZQWJDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXZFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFeEQsSUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQUMsTUFBZ0I7Z0JBQ25DLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUc7b0JBQ3pDLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxLQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNwQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxLQUFJLENBQUMsZUFBZSxHQUFHLGdCQUFnQixDQUFDO2dCQUN4QyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRU8sMkNBQWEsR0FBckI7WUFDRSxJQUFNLE1BQU0sR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxrQkFBZSxDQUFDO1lBQ3hELElBQU0sTUFBTSxHQUFHLFFBQVE7aUJBQ3BCLGNBQWMsQ0FDVixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGFBQVUsQ0FDdkQ7aUJBQ0QsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBRW5CLEtBQXlCLFVBQW9CLEVBQXBCLEtBQUEsSUFBSSxDQUFDLGVBQWUsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtnQkFBMUMsSUFBTSxVQUFVLFNBQUE7Z0JBQ25CLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUN2RTtRQUNILENBQUM7UUFuREQ7WUFEQyxJQUFBLFFBQVE7a0VBT1I7UUFHRDtZQURDLElBQUEsUUFBUTs4REFNUjtRQUdEO1lBREMsSUFBQSxRQUFRO21FQUlSO1FBZ0NILDBCQUFDO0tBQUEsQUF0RUQsQ0FBa0MsU0FBUyxHQXNFMUM7SUFFRDtRQUE4QixtQ0FBMEM7UUFJdEUseUJBQVksTUFBYyxFQUFFLE1BQWM7WUFBMUMsWUFDRSxrQkFBTSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLFNBTTNDO1lBSkMsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFFckIsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7UUFDdkIsQ0FBQztRQUdELDBDQUFnQixHQUFoQixVQUFpQixLQUFnQjtZQUMvQixLQUFLLENBQUMsWUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRCxLQUFLLENBQUMsWUFBYSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDN0MsQ0FBQztRQUVELHdDQUFjLEdBQWQsVUFBZSxDQUFZO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVELG1DQUFTLEdBQVQ7WUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELHVDQUFhLEdBQWI7WUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3pFLENBQUM7UUFqQkQ7WUFEQyxJQUFBLFFBQVE7K0RBSVI7UUFlSCxzQkFBQztLQUFBLEFBaENELENBQThCLFNBQVMsR0FnQ3RDO0lBRUQsSUFBSSxjQUFjLEVBQUUsQ0FBQztJQUNyQixJQUFJLG1CQUFtQixDQUFDLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLElBQUksbUJBQW1CLENBQUMsSUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxJQUFJLG1CQUFtQixDQUFDLElBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsRUFuTVMsR0FBRyxLQUFILEdBQUcsUUFtTVoiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEcmFnICYgRHJvcCBJbnRlcmZhY2VzXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRHJhZ2dhYmxlIHtcclxuICAgIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcmFnRW5kSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICB9XHJcbiAgZXhwb3J0IGludGVyZmFjZSBEcmFnVGFyZ2V0IHtcclxuICAgIGRyYWdPdmVySGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcm9wSGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGVudW0gU3RhdHVzIHtcclxuICAgIFVuYXNzaWduZWQsXHJcbiAgICBTdGFydCxcclxuICAgIENvbnRpbnVlLFxyXG4gICAgU3RvcCxcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBTdGF0dXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IodDogc3RyaW5nLCBkOiBzdHJpbmcsIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICAgIHRoaXMudGl0bGUgPSB0LnRyaW0oKTtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGQudHJpbSgpO1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgdGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gICAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gICAgbWF4TGVuZ3RoPzogbnVtYmVyO1xyXG5cclxuICAgIG1pblZhbHVlPzogbnVtYmVyO1xyXG4gICAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gdmFsaWRhdGUodmFsaWRhdGFibGVJbnB1dDogVmFsaWRhdGFibGUpOiBib29sZWFuIHtcclxuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5yZXF1aXJlZCkge1xyXG4gICAgICBpc1ZhbGlkID1cclxuICAgICAgICBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aCAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPVxyXG4gICAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA+PVxyXG4gICAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoICE9IG51bGwpIHtcclxuICAgICAgaXNWYWxpZCA9XHJcbiAgICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoIDw9XHJcbiAgICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPj0gdmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPD0gdmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNWYWxpZDtcclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi4vdXRpbC92YWxpZGF0aW9uLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgdHlwZSBMaXN0ZW5lciA9IChpdGVtczogUG9zdGl0W10pID0+IHZvaWQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXRzIHtcclxuICAgIHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lcltdID0gW107XHJcblxyXG4gICAgcG9zdGl0TGlzdDogUG9zdGl0W10gPSBbXTtcclxuXHJcbiAgICBob3N0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gICAgcG9zdGl0VGVtcGxhdGU/OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgcG9zdGl0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9Qb3N0aXRzOiBQb3N0aXRzO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgICAgaWYgKHRoaXMuX1Bvc3RpdHMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fUG9zdGl0cztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9Qb3N0aXRzID0gbmV3IFBvc3RpdHMoKTtcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyRm46IExpc3RlbmVyKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUG9zdGl0KHBvc3RpdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLlZhbGlkYXRpb24ocG9zdGl0KTtcclxuXHJcbiAgICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wb3N0aXRMaXN0LnB1c2gocG9zdGl0KTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHZhbGlkYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVBvc3RpdChpZDogc3RyaW5nLCBuZXdTdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICBjb25zdCBwb3N0aXQgPSB0aGlzLnBvc3RpdExpc3QuZmlsdGVyKChwb3N0aXQpID0+IHBvc3RpdC5pZCA9PT0gaWQpWzBdO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdCAmJiBwb3N0aXQuc3RhdHVzICE9PSBuZXdTdGF0dXMpIHtcclxuICAgICAgICBwb3N0aXQuc3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUxpc3RlbmVycygpIHtcclxuICAgICAgZm9yIChjb25zdCBsaXN0ZW5lckZuIG9mIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgbGlzdGVuZXJGbih0aGlzLnBvc3RpdExpc3Quc2xpY2UoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIFZhbGlkYXRpb24ocHJvamVjdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHRpdGxlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgICBtYXhMZW5ndGg6IDUwLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgZGVzY3JpcHRpb25WYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgICAgdmFsdWU6IHByb2plY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICAgIG1heExlbmd0aDogMjAwLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgdmFsdWVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgICAgdmFsdWU6IHByb2plY3Quc3RhdHVzLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIG1pblZhbHVlOiAwLFxyXG4gICAgICAgIG1heFZhbHVlOiAzLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgICF2YWxpZGF0ZSh0aXRsZVZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAgICF2YWxpZGF0ZShkZXNjcmlwdGlvblZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAgICF2YWxpZGF0ZSh2YWx1ZVZhbGlkYXRhYmxlKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY29uc3QgcG9zdGl0cyA9IFBvc3RpdHMuZ2V0SW5zdGFuY2UoKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgZnVuY3Rpb24gYXV0b2JpbmQoXzogYW55LCBfMjogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcclxuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICAgIGNvbnN0IGFkakRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciA9IHtcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICBnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRGbiA9IG9yaWdpbmFsTWV0aG9kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kRm47XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGFkakRlc2NyaXB0b3I7XHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcIi4vbW9kZWxzL2RyYWctZHJvcC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi9tb2RlbHMvcG9zdGl0LnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL3N0YXRlL3Bvc3RpdC1zdGF0ZS50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi9kZWNvcmF0b3JzL2F1dG9iaW5kLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgLy9jb21wb25lbnQgYmFzZSBjbGFzc1xyXG4gIGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQsIFUgZXh0ZW5kcyBIVE1MRWxlbWVudD4ge1xyXG4gICAgdGVtcGxhdGVFbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgaG9zdEVsZW1lbnQ6IFQ7XHJcbiAgICBlbGVtZW50OiBVO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICB0ZW1wYWx0ZUlkOiBzdHJpbmcsXHJcbiAgICAgIGhvc3RFbGVtZW50SWQ6IHN0cmluZyxcclxuICAgICAgaW5zZXJ0QXRTdGFydDogYm9vbGVhbixcclxuICAgICAgbmV3RWxlbWVudElkPzogc3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICB0ZW1wYWx0ZUlkXHJcbiAgICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XHJcblxyXG4gICAgICBjb25zdCBmb3JtTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZWxlbWVudCA9IGZvcm1Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIFU7XHJcbiAgICAgIGlmIChuZXdFbGVtZW50SWQpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtZW50SWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXR0YWNoKGluc2VydEF0U3RhcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGNvbmZpZ3VyZSgpOiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgYXR0YWNoKGluc2VydEF0U3RhcnQ6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXHJcbiAgICAgICAgaW5zZXJ0QXRTdGFydCA/IFwiYWZ0ZXJiZWdpblwiIDogXCJiZWZvcmVlbmRcIixcclxuICAgICAgICB0aGlzLmVsZW1lbnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsYXNzIElucHV0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRm9ybUVsZW1lbnQ+IHtcclxuICAgIHRpdGxlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB2YWx1ZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoXCJwcm9qZWN0LWlucHV0XCIsIFwiYXBwXCIsIGZhbHNlLCBcInVzZXItaW5wdXRcIik7XHJcblxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjdGl0bGVcIlxyXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNkZXNjcmlwdGlvblwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3Blb3BsZVwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnN1Ym1pdEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXRIYW5kbGVyKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgY29uc3QgcG9zdGl0ID0gbmV3IFBvc3RpdChcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgICAgK3RoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWVcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvc3RpdFZhbGlkYXRpb24gPSBwb3N0aXRzLmFkZFBvc3RpdChwb3N0aXQpO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdFZhbGlkYXRpb24pIHtcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgUG9zdGl0TGlzdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTEVsZW1lbnQ+XHJcbiAgICBpbXBsZW1lbnRzIERyYWdUYXJnZXQge1xyXG4gICAgYXNzaWduZWRQb3N0aXRzOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgICAgc3VwZXIoXHJcbiAgICAgICAgXCJwcm9qZWN0LWxpc3RcIixcclxuICAgICAgICBcImFwcFwiLFxyXG4gICAgICAgIGZhbHNlLFxyXG4gICAgICAgIGAke3N0YXR1cy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IFtdO1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSBcInRleHQvcGxhaW5cIikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgICAgbGlzdEVsLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGFibGVcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyb3BIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgY29uc3QgcG9zdGl0SWQgPSBldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xyXG4gICAgICBwb3N0aXRzLm1vdmVQb3N0aXQocG9zdGl0SWQsIHRoaXMuc3RhdHVzKTtcclxuICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJhZ0xlYXZlSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGxpc3RFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwYWJsZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmUoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5zdGF0dXMudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgdGhpcy5kcmFnT3ZlckhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCB0aGlzLmRyYWdMZWF2ZUhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgdGhpcy5kcm9wSGFuZGxlcik7XHJcblxyXG4gICAgICBwb3N0aXRzLmFkZExpc3RlbmVyKChwb3N0aXQ6IFBvc3RpdFtdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsZXZhbnRQcm9qZWN0cyA9IHBvc3RpdC5maWx0ZXIoKHByaikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHByai5zdGF0dXMgPT09IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXNzaWduZWRQb3N0aXRzID0gcmVsZXZhbnRQcm9qZWN0cztcclxuICAgICAgICB0aGlzLnJlbmRlclBvc3RpdHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJQb3N0aXRzKCkge1xyXG4gICAgICBjb25zdCBsaXN0SWQgPSBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpfS1wb3N0LWl0LWxpc3RgO1xyXG4gICAgICBjb25zdCBsaXN0RWwgPSBkb2N1bWVudFxyXG4gICAgICAgIC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICAgICApIVxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICBsaXN0RWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgbGlzdEVsLmlkID0gbGlzdElkO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBwb3N0aXRJdGVtIG9mIHRoaXMuYXNzaWduZWRQb3N0aXRzKSB7XHJcbiAgICAgICAgbmV3IFBvc3RpdENvbXBvbmVudCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpIS5pZCwgcG9zdGl0SXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsYXNzIFBvc3RpdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxIVE1MVUxpc3RFbGVtZW50LCBIVE1MTElFbGVtZW50PlxyXG4gICAgaW1wbGVtZW50cyBEcmFnZ2FibGUge1xyXG4gICAgcHJpdmF0ZSBwb3N0aXQ6IFBvc3RpdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihob3N0SWQ6IHN0cmluZywgcG9zdGl0OiBQb3N0aXQpIHtcclxuICAgICAgc3VwZXIoXCJwb3N0LWl0XCIsIGhvc3RJZCwgZmFsc2UsIHBvc3RpdC5pZCk7XHJcblxyXG4gICAgICB0aGlzLnBvc3RpdCA9IHBvc3RpdDtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICAgIHRoaXMucmVuZGVyQ29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGhpcy5wb3N0aXQuaWQpO1xyXG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnRW5kSGFuZGxlcihfOiBEcmFnRXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJEcmFnRW5kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZSgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgdGhpcy5kcmFnU3RhcnRIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIHRoaXMuZHJhZ0VuZEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckNvbnRlbnQoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIikhLnRleHRDb250ZW50ID0gdGhpcy5wb3N0aXQudGl0bGU7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5ldyBJbnB1dENvbXBvbmVudCgpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5VbmFzc2lnbmVkKTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RhcnQpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5Db250aW51ZSk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlN0b3ApO1xyXG59XHJcbiJdfQ==