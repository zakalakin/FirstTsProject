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
    // Project state Management
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
/// <reference path = "validation.ts"/>
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
/// <reference path = "drag-drop-interfaces.ts"/>
/// <reference path = "postit-model.ts"/>
/// <reference path = "postit-state.ts"/>
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
            // console.log(event.dataTransfer!.getData("text/plain"));
            // console.log(event);
            // console.log(event.target);
            var postitId = event.dataTransfer.getData("text/plain");
            App.postits.movePostit(postitId, this.status);
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
    new InputComponent();
    new PostitListComponent(App.Status.Unassigned);
    new PostitListComponent(App.Status.Start);
    new PostitListComponent(App.Status.Continue);
    new PostitListComponent(App.Status.Stop);
})(App || (App = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJkcmFnLWRyb3AtaW50ZXJmYWNlcy50cyIsInBvc3RpdC1tb2RlbC50cyIsInZhbGlkYXRpb24udHMiLCJwb3N0aXQtc3RhdGUudHMiLCJhcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFVLEdBQUcsQ0FxQlo7QUFyQkQsV0FBVSxHQUFHO0lBQ1gsSUFBWSxNQUtYO0lBTEQsV0FBWSxNQUFNO1FBQ2hCLCtDQUFVLENBQUE7UUFDVixxQ0FBSyxDQUFBO1FBQ0wsMkNBQVEsQ0FBQTtRQUNSLG1DQUFJLENBQUE7SUFDTixDQUFDLEVBTFcsTUFBTSxHQUFOLFVBQU0sS0FBTixVQUFNLFFBS2pCO0lBRUQ7UUFNRSxnQkFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQWM7WUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQUNILGFBQUM7SUFBRCxDQUFDLEFBWkQsSUFZQztJQVpZLFVBQU0sU0FZbEIsQ0FBQTtBQUNILENBQUMsRUFyQlMsR0FBRyxLQUFILEdBQUcsUUFxQlo7QUNyQkQsSUFBVSxHQUFHLENBNkNaO0FBN0NELFdBQVUsR0FBRztJQVdYLDJCQUEyQjtJQUUzQixTQUFnQixRQUFRLENBQUMsZ0JBQTZCO1FBQ3BELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUVuQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtZQUM3QixPQUFPO2dCQUNMLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxL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QkFBZ0IsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsdUNBQWEsR0FBYjtZQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDekUsQ0FBQztRQWpCRDtZQURDLFFBQVE7K0RBSVI7UUFlSCxzQkFBQztLQUFBLEFBaENELENBQThCLFNBQVMsR0FnQ3RDO0lBRUQsSUFBSSxjQUFjLEVBQUUsQ0FBQztJQUNyQixJQUFJLG1CQUFtQixDQUFDLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLElBQUksbUJBQW1CLENBQUMsSUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxJQUFJLG1CQUFtQixDQUFDLElBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsRUFsTlMsR0FBRyxLQUFILEdBQUcsUUFrTloiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEcmFnICYgRHJvcCBJbnRlcmZhY2VzXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRHJhZ2dhYmxlIHtcclxuICAgIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcmFnRW5kSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICB9XHJcbiAgZXhwb3J0IGludGVyZmFjZSBEcmFnVGFyZ2V0IHtcclxuICAgIGRyYWdPdmVySGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcm9wSGFuZGxlcihldmVudEw6IERyYWdFdmVudCk6IHZvaWQ7XHJcbiAgICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGVudW0gU3RhdHVzIHtcclxuICAgIFVuYXNzaWduZWQsXHJcbiAgICBTdGFydCxcclxuICAgIENvbnRpbnVlLFxyXG4gICAgU3RvcCxcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgc3RhdHVzOiBTdGF0dXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IodDogc3RyaW5nLCBkOiBzdHJpbmcsIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICAgIHRoaXMudGl0bGUgPSB0LnRyaW0oKTtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGQudHJpbSgpO1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgdGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gICAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gICAgbWF4TGVuZ3RoPzogbnVtYmVyO1xyXG5cclxuICAgIG1pblZhbHVlPzogbnVtYmVyO1xyXG4gICAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvLyBQcm9qZWN0IHN0YXRlIE1hbmFnZW1lbnRcclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlKHZhbGlkYXRhYmxlSW5wdXQ6IFZhbGlkYXRhYmxlKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQucmVxdWlyZWQpIHtcclxuICAgICAgaXNWYWxpZCA9XHJcbiAgICAgICAgaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCAhPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGggIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID1cclxuICAgICAgICBpc1ZhbGlkICYmXHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPj1cclxuICAgICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aCAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPVxyXG4gICAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA8PVxyXG4gICAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlID49IHZhbGlkYXRhYmxlSW5wdXQubWluVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID0gaXNWYWxpZCAmJiB2YWxpZGF0YWJsZUlucHV0LnZhbHVlIDw9IHZhbGlkYXRhYmxlSW5wdXQubWF4VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcInZhbGlkYXRpb24udHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgQXBwIHtcclxuICB0eXBlIExpc3RlbmVyID0gKGl0ZW1zOiBQb3N0aXRbXSkgPT4gdm9pZDtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFBvc3RpdHMge1xyXG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgICBwb3N0aXRMaXN0OiBQb3N0aXRbXSA9IFtdO1xyXG5cclxuICAgIGhvc3RFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcbiAgICBwb3N0aXRUZW1wbGF0ZT86IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgICBwb3N0aXRFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1Bvc3RpdHM6IFBvc3RpdHM7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc3RhdGljIGdldEluc3RhbmNlKCkge1xyXG4gICAgICBpZiAodGhpcy5fUG9zdGl0cykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX1Bvc3RpdHMgPSBuZXcgUG9zdGl0cygpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX1Bvc3RpdHM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXJGbjogTGlzdGVuZXIpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lckZuKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQb3N0aXQocG9zdGl0OiBQb3N0aXQpOiBib29sZWFuIHtcclxuICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMuVmFsaWRhdGlvbihwb3N0aXQpO1xyXG5cclxuICAgICAgaWYgKHZhbGlkYXRpb24pIHtcclxuICAgICAgICB0aGlzLnBvc3RpdExpc3QucHVzaChwb3N0aXQpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RlbmVycygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdmFsaWRhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUG9zdGl0KGlkOiBzdHJpbmcsIG5ld1N0YXR1czogU3RhdHVzKSB7XHJcbiAgICAgIGNvbnN0IHBvc3RpdCA9IHRoaXMucG9zdGl0TGlzdC5maWx0ZXIoKHBvc3RpdCkgPT4gcG9zdGl0LmlkID09PSBpZClbMF07XHJcblxyXG4gICAgICBpZiAocG9zdGl0ICYmIHBvc3RpdC5zdGF0dXMgIT09IG5ld1N0YXR1cykge1xyXG4gICAgICAgIHBvc3RpdC5zdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTGlzdGVuZXJzKCkge1xyXG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyRm4gb2YgdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgICBsaXN0ZW5lckZuKHRoaXMucG9zdGl0TGlzdC5zbGljZSgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgVmFsaWRhdGlvbihwcm9qZWN0OiBQb3N0aXQpOiBib29sZWFuIHtcclxuICAgICAgY29uc3QgdGl0bGVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgICAgdmFsdWU6IHByb2plY3QudGl0bGUsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICAgIG1heExlbmd0aDogNTAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBkZXNjcmlwdGlvblZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgICB2YWx1ZTogcHJvamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgICAgbWF4TGVuZ3RoOiAyMDAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCB2YWx1ZVZhbGlkYXRhYmxlOiBWYWxpZGF0YWJsZSA9IHtcclxuICAgICAgICB2YWx1ZTogcHJvamVjdC5zdGF0dXMsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgbWluVmFsdWU6IDAsXHJcbiAgICAgICAgbWF4VmFsdWU6IDMsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgIXZhbGlkYXRlKHRpdGxlVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICAgIXZhbGlkYXRlKGRlc2NyaXB0aW9uVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICAgIXZhbGlkYXRlKHZhbHVlVmFsaWRhdGFibGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBjb25zdCBwb3N0aXRzID0gUG9zdGl0cy5nZXRJbnN0YW5jZSgpO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcImRyYWctZHJvcC1pbnRlcmZhY2VzLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoID0gXCJwb3N0aXQtbW9kZWwudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcInBvc3RpdC1zdGF0ZS50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGZ1bmN0aW9uIGF1dG9iaW5kKF86IGFueSwgXzI6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XHJcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XHJcbiAgICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBib3VuZEZuO1xyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICAgIHJldHVybiBhZGpEZXNjcmlwdG9yO1xyXG4gIH1cclxuXHJcbiAgLy9jb21wb25lbnQgYmFzZSBjbGFzc1xyXG4gIGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQsIFUgZXh0ZW5kcyBIVE1MRWxlbWVudD4ge1xyXG4gICAgdGVtcGxhdGVFbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgaG9zdEVsZW1lbnQ6IFQ7XHJcbiAgICBlbGVtZW50OiBVO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICB0ZW1wYWx0ZUlkOiBzdHJpbmcsXHJcbiAgICAgIGhvc3RFbGVtZW50SWQ6IHN0cmluZyxcclxuICAgICAgaW5zZXJ0QXRTdGFydDogYm9vbGVhbixcclxuICAgICAgbmV3RWxlbWVudElkPzogc3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICB0ZW1wYWx0ZUlkXHJcbiAgICAgICkhIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcblxyXG4gICAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaG9zdEVsZW1lbnRJZCkhIGFzIFQ7XHJcblxyXG4gICAgICBjb25zdCBmb3JtTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZWxlbWVudCA9IGZvcm1Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIFU7XHJcbiAgICAgIGlmIChuZXdFbGVtZW50SWQpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtZW50SWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXR0YWNoKGluc2VydEF0U3RhcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGNvbmZpZ3VyZSgpOiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgYXR0YWNoKGluc2VydEF0U3RhcnQ6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXHJcbiAgICAgICAgaW5zZXJ0QXRTdGFydCA/IFwiYWZ0ZXJiZWdpblwiIDogXCJiZWZvcmVlbmRcIixcclxuICAgICAgICB0aGlzLmVsZW1lbnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsYXNzIElucHV0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRm9ybUVsZW1lbnQ+IHtcclxuICAgIHRpdGxlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB2YWx1ZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoXCJwcm9qZWN0LWlucHV0XCIsIFwiYXBwXCIsIGZhbHNlLCBcInVzZXItaW5wdXRcIik7XHJcblxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjdGl0bGVcIlxyXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNkZXNjcmlwdGlvblwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3Blb3BsZVwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnN1Ym1pdEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXRIYW5kbGVyKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgY29uc3QgcG9zdGl0ID0gbmV3IFBvc3RpdChcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgICAgK3RoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWVcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvc3RpdFZhbGlkYXRpb24gPSBwb3N0aXRzLmFkZFBvc3RpdChwb3N0aXQpO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdFZhbGlkYXRpb24pIHtcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgUG9zdGl0TGlzdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxIVE1MRGl2RWxlbWVudCwgSFRNTEVsZW1lbnQ+XHJcbiAgICBpbXBsZW1lbnRzIERyYWdUYXJnZXQge1xyXG4gICAgYXNzaWduZWRQb3N0aXRzOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgICAgc3VwZXIoXHJcbiAgICAgICAgXCJwcm9qZWN0LWxpc3RcIixcclxuICAgICAgICBcImFwcFwiLFxyXG4gICAgICAgIGZhbHNlLFxyXG4gICAgICAgIGAke3N0YXR1cy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IFtdO1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdID09PSBcInRleHQvcGxhaW5cIikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgICAgbGlzdEVsLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGFibGVcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyb3BIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKFwidGV4dC9wbGFpblwiKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgICAgIGNvbnN0IHBvc3RpdElkID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtcclxuICAgICAgcG9zdGl0cy5tb3ZlUG9zdGl0KHBvc3RpdElkLCB0aGlzLnN0YXR1cyk7XHJcbiAgICAgIC8vIHBvc3RpdHMuXHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBkcmFnTGVhdmVIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZSgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnN0YXR1cy50b1N0cmluZygpO1xyXG5cclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCB0aGlzLmRyYWdPdmVySGFuZGxlcik7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIHRoaXMuZHJhZ0xlYXZlSGFuZGxlcik7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCB0aGlzLmRyb3BIYW5kbGVyKTtcclxuXHJcbiAgICAgIHBvc3RpdHMuYWRkTGlzdGVuZXIoKHBvc3RpdDogUG9zdGl0W10pID0+IHtcclxuICAgICAgICBjb25zdCByZWxldmFudFByb2plY3RzID0gcG9zdGl0LmZpbHRlcigocHJqKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gcHJqLnN0YXR1cyA9PT0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hc3NpZ25lZFBvc3RpdHMgPSByZWxldmFudFByb2plY3RzO1xyXG4gICAgICAgIHRoaXMucmVuZGVyUG9zdGl0cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlclBvc3RpdHMoKSB7XHJcbiAgICAgIGNvbnN0IGxpc3RJZCA9IGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCl9LXBvc3QtaXQtbGlzdGA7XHJcbiAgICAgIGNvbnN0IGxpc3RFbCA9IGRvY3VtZW50XHJcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgYCR7dGhpcy5zdGF0dXMudG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpfS1wb3N0LWl0YFxyXG4gICAgICAgICkhXHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsaXN0RWwuaWQgPSBsaXN0SWQ7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHBvc3RpdEl0ZW0gb2YgdGhpcy5hc3NpZ25lZFBvc3RpdHMpIHtcclxuICAgICAgICBuZXcgUG9zdGl0Q29tcG9uZW50KHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhLmlkLCBwb3N0aXRJdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgUG9zdGl0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxVTGlzdEVsZW1lbnQsIEhUTUxMSUVsZW1lbnQ+XHJcbiAgICBpbXBsZW1lbnRzIERyYWdnYWJsZSB7XHJcbiAgICBwcml2YXRlIHBvc3RpdDogUG9zdGl0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGhvc3RJZDogc3RyaW5nLCBwb3N0aXQ6IFBvc3RpdCkge1xyXG4gICAgICBzdXBlcihcInBvc3QtaXRcIiwgaG9zdElkLCBmYWxzZSwgcG9zdGl0LmlkKTtcclxuXHJcbiAgICAgIHRoaXMucG9zdGl0ID0gcG9zdGl0O1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgICAgdGhpcy5yZW5kZXJDb250ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0aGlzLnBvc3RpdC5pZCk7XHJcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuZWZmZWN0QWxsb3dlZCA9IFwibW92ZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWdFbmRIYW5kbGVyKF86IERyYWdFdmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkRyYWdFbmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCB0aGlzLmRyYWdTdGFydEhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgdGhpcy5kcmFnRW5kSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQ29udGVudCgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC50aXRsZTtcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucG9zdGl0LmRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3IElucHV0Q29tcG9uZW50KCk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlVuYXNzaWduZWQpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5TdGFydCk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLkNvbnRpbnVlKTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RvcCk7XHJcbn1cclxuIl19