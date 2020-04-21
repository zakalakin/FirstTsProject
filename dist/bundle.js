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
/// <reference path = "drag-drop-interfaces.ts"/>
/// <reference path = "postit-model.ts"/>
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
    new InputComponent();
    new PostitListComponent(App.Status.Unassigned);
    new PostitListComponent(App.Status.Start);
    new PostitListComponent(App.Status.Continue);
    new PostitListComponent(App.Status.Stop);
})(App || (App = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJkcmFnLWRyb3AtaW50ZXJmYWNlcy50cyIsInBvc3RpdC1tb2RlbC50cyIsImFwcC50cyIsInBvc3RpdC1zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQVUsR0FBRyxDQXFCWjtBQXJCRCxXQUFVLEdBQUc7SUFDWCxJQUFZLE1BS1g7SUFMRCxXQUFZLE1BQU07UUFDaEIsK0NBQVUsQ0FBQTtRQUNWLHFDQUFLLENBQUE7UUFDTCwyQ0FBUSxDQUFBO1FBQ1IsbUNBQUksQ0FBQTtJQUNOLENBQUMsRUFMVyxNQUFNLEdBQU4sVUFBTSxLQUFOLFVBQU0sUUFLakI7SUFFRDtRQU1FLGdCQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBYztZQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBQ0gsYUFBQztJQUFELENBQUMsQUFaRCxJQVlDO0lBWlksVUFBTSxTQVlsQixDQUFBO0FBQ0gsQ0FBQyxFQXJCUyxHQUFHLEtBQUgsR0FBRyxRQXFCWjtBQ3JCRCxpREFBaUQ7QUFDakQseUNBQXlDO0FBRXpDLElBQVUsR0FBRyxDQXlWWjtBQXpWRCxXQUFVLEdBQUc7SUFlWCxTQUFTLFFBQVEsQ0FBQyxnQkFBNkI7UUFDN0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRW5CLElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1lBQzdCLE9BQU87Z0JBQ0wsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUss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Q0FBQztRQUNkLENBQUM7UUFDSCxjQUFDO0lBQUQsQ0FBQyxBQXBGRCxJQW9GQztJQUVELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUV0QyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQ3JCLElBQUksbUJBQW1CLENBQUMsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsSUFBSSxtQkFBbUIsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxJQUFJLG1CQUFtQixDQUFDLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLElBQUksbUJBQW1CLENBQUMsSUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxFQXpWUyxHQUFHLEtBQUgsR0FBRyxRQXlWWiIsInNvdXJjZXNDb250ZW50IjpbIi8vIERyYWcgJiBEcm9wIEludGVyZmFjZXNcclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBEcmFnZ2FibGUge1xyXG4gICAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyYWdFbmRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIH1cclxuICBleHBvcnQgaW50ZXJmYWNlIERyYWdUYXJnZXQge1xyXG4gICAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyb3BIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnRMOiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgZW51bSBTdGF0dXMge1xyXG4gICAgVW5hc3NpZ25lZCxcclxuICAgIFN0YXJ0LFxyXG4gICAgQ29udGludWUsXHJcbiAgICBTdG9wLFxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIFBvc3RpdCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBzdGF0dXM6IFN0YXR1cztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0OiBzdHJpbmcsIGQ6IHN0cmluZywgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgICAgdGhpcy50aXRsZSA9IHQudHJpbSgpO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZC50cmltKCk7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICB0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoID0gXCJkcmFnLWRyb3AtaW50ZXJmYWNlcy50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwicG9zdGl0LW1vZGVsLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgLy9kZWNvcmF0b3JzXHJcbiAgaW50ZXJmYWNlIFZhbGlkYXRhYmxlIHtcclxuICAgIHZhbHVlOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgICBtaW5MZW5ndGg/OiBudW1iZXI7XHJcbiAgICBtYXhMZW5ndGg/OiBudW1iZXI7XHJcblxyXG4gICAgbWluVmFsdWU/OiBudW1iZXI7XHJcbiAgICBtYXhWYWx1ZT86IG51bWJlcjtcclxuICB9XHJcblxyXG4gIC8vIFByb2plY3Qgc3RhdGUgTWFuYWdlbWVudFxyXG4gIHR5cGUgTGlzdGVuZXIgPSAoaXRlbXM6IFBvc3RpdFtdKSA9PiB2b2lkO1xyXG5cclxuICBmdW5jdGlvbiB2YWxpZGF0ZSh2YWxpZGF0YWJsZUlucHV0OiBWYWxpZGF0YWJsZSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0LnJlcXVpcmVkKSB7XHJcbiAgICAgIGlzVmFsaWQgPVxyXG4gICAgICAgIGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggIT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoICE9IG51bGwpIHtcclxuICAgICAgaXNWYWxpZCA9XHJcbiAgICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoID49XHJcbiAgICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGggIT0gbnVsbCkge1xyXG4gICAgICBpc1ZhbGlkID1cclxuICAgICAgICBpc1ZhbGlkICYmXHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPD1cclxuICAgICAgICAgIHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlICE9IG51bGwpIHtcclxuICAgICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA+PSB2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgaXNWYWxpZCA9IGlzVmFsaWQgJiYgdmFsaWRhdGFibGVJbnB1dC52YWx1ZSA8PSB2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXV0b2JpbmQoXzogYW55LCBfMjogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcclxuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICAgIGNvbnN0IGFkakRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciA9IHtcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICBnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRGbiA9IG9yaWdpbmFsTWV0aG9kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kRm47XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGFkakRlc2NyaXB0b3I7XHJcbiAgfVxyXG5cclxuICAvL2NvbXBvbmVudCBiYXNlIGNsYXNzXHJcbiAgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCwgVSBleHRlbmRzIEhUTUxFbGVtZW50PiB7XHJcbiAgICB0ZW1wbGF0ZUVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgICBob3N0RWxlbWVudDogVDtcclxuICAgIGVsZW1lbnQ6IFU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgIHRlbXBhbHRlSWQ6IHN0cmluZyxcclxuICAgICAgaG9zdEVsZW1lbnRJZDogc3RyaW5nLFxyXG4gICAgICBpbnNlcnRBdFN0YXJ0OiBib29sZWFuLFxyXG4gICAgICBuZXdFbGVtZW50SWQ/OiBzdHJpbmdcclxuICAgICkge1xyXG4gICAgICB0aGlzLnRlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIHRlbXBhbHRlSWRcclxuICAgICAgKSEgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuXHJcbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChob3N0RWxlbWVudElkKSEgYXMgVDtcclxuXHJcbiAgICAgIGNvbnN0IGZvcm1Ob2RlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdGhpcy5lbGVtZW50ID0gZm9ybU5vZGUuZmlyc3RFbGVtZW50Q2hpbGQgYXMgVTtcclxuICAgICAgaWYgKG5ld0VsZW1lbnRJZCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5pZCA9IG5ld0VsZW1lbnRJZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5hdHRhY2goaW5zZXJ0QXRTdGFydCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgY29uZmlndXJlKCk6IHZvaWQ7XHJcblxyXG4gICAgcHJpdmF0ZSBhdHRhY2goaW5zZXJ0QXRTdGFydDogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmhvc3RFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcclxuICAgICAgICBpbnNlcnRBdFN0YXJ0ID8gXCJhZnRlcmJlZ2luXCIgOiBcImJlZm9yZWVuZFwiLFxyXG4gICAgICAgIHRoaXMuZWxlbWVudFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxGb3JtRWxlbWVudD4ge1xyXG4gICAgdGl0bGVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBkZXNjcmlwdGlvbklucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHZhbHVlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcihcInByb2plY3QtaW5wdXRcIiwgXCJhcHBcIiwgZmFsc2UsIFwidXNlci1pbnB1dFwiKTtcclxuXHJcbiAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiN0aXRsZVwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI2Rlc2NyaXB0aW9uXCJcclxuICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjcGVvcGxlXCJcclxuICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmUoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuc3VibWl0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdEhhbmRsZXIoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBjb25zdCBwb3N0aXQgPSBuZXcgUG9zdGl0KFxyXG4gICAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSxcclxuICAgICAgICArdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgcG9zdGl0VmFsaWRhdGlvbiA9IHBvc3RpdHMuYWRkUG9zdGl0KHBvc3RpdCk7XHJcblxyXG4gICAgICBpZiAocG9zdGl0VmFsaWRhdGlvbikge1xyXG4gICAgICAgIHRoaXMudGl0bGVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KGBpbnZsYWlkIGlucHV0OiAke1wiSW52YWxpZCBpbnB1dFwifWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGFzcyBQb3N0aXRMaXN0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PEhUTUxEaXZFbGVtZW50LCBIVE1MRWxlbWVudD5cclxuICAgIGltcGxlbWVudHMgRHJhZ1RhcmdldCB7XHJcbiAgICBhc3NpZ25lZFBvc3RpdHM6IGFueVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICBzdXBlcihcclxuICAgICAgICBcInByb2plY3QtbGlzdFwiLFxyXG4gICAgICAgIFwiYXBwXCIsXHJcbiAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgYCR7c3RhdHVzLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKX0tcG9zdC1pdGBcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHRoaXMuYXNzaWduZWRQb3N0aXRzID0gW107XHJcblxyXG4gICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmRhdGFUcmFuc2ZlciAmJiBldmVudC5kYXRhVHJhbnNmZXIudHlwZXNbMF0gPT09IFwidGV4dC9wbGFpblwiKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgICBsaXN0RWwuY2xhc3NMaXN0LmFkZChcImRyb3BwYWJsZVwiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgY29uc3QgcG9zdGl0SWQgPSBldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xyXG4gICAgICBwb3N0aXRzLm1vdmVQb3N0aXQocG9zdGl0SWQsIHRoaXMuc3RhdHVzKTtcclxuICAgICAgLy8gcG9zdGl0cy5cclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgbGlzdEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wcGFibGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpIS50ZXh0Q29udGVudCA9IHRoaXMuc3RhdHVzLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHRoaXMuZHJhZ092ZXJIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgdGhpcy5kcmFnTGVhdmVIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIHRoaXMuZHJvcEhhbmRsZXIpO1xyXG5cclxuICAgICAgcG9zdGl0cy5hZGRMaXN0ZW5lcigocG9zdGl0OiBQb3N0aXRbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGV2YW50UHJvamVjdHMgPSBwb3N0aXQuZmlsdGVyKChwcmopID0+IHtcclxuICAgICAgICAgIHJldHVybiBwcmouc3RhdHVzID09PSB0aGlzLnN0YXR1cztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IHJlbGV2YW50UHJvamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJQb3N0aXRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyUG9zdGl0cygpIHtcclxuICAgICAgY29uc3QgbGlzdElkID0gYCR7dGhpcy5zdGF0dXMudG9TdHJpbmcoKX0tcG9zdC1pdC1saXN0YDtcclxuICAgICAgY29uc3QgbGlzdEVsID0gZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICAgICAgKSFcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgbGlzdEVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIGxpc3RFbC5pZCA9IGxpc3RJZDtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgcG9zdGl0SXRlbSBvZiB0aGlzLmFzc2lnbmVkUG9zdGl0cykge1xyXG4gICAgICAgIG5ldyBQb3N0aXRDb21wb25lbnQodGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSEuaWQsIHBvc3RpdEl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGFzcyBQb3N0aXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTFVMaXN0RWxlbWVudCwgSFRNTExJRWxlbWVudD5cclxuICAgIGltcGxlbWVudHMgRHJhZ2dhYmxlIHtcclxuICAgIHByaXZhdGUgcG9zdGl0OiBQb3N0aXQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaG9zdElkOiBzdHJpbmcsIHBvc3RpdDogUG9zdGl0KSB7XHJcbiAgICAgIHN1cGVyKFwicG9zdC1pdFwiLCBob3N0SWQsIGZhbHNlLCBwb3N0aXQuaWQpO1xyXG5cclxuICAgICAgdGhpcy5wb3N0aXQgPSBwb3N0aXQ7XHJcblxyXG4gICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgICB0aGlzLnJlbmRlckNvbnRlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIhLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIHRoaXMucG9zdGl0LmlkKTtcclxuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZ0VuZEhhbmRsZXIoXzogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRHJhZ0VuZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmUoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIHRoaXMuZHJhZ1N0YXJ0SGFuZGxlcik7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCB0aGlzLmRyYWdFbmRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJDb250ZW50KCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucG9zdGl0LnRpdGxlO1xyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInBcIikhLnRleHRDb250ZW50ID0gdGhpcy5wb3N0aXQuZGVzY3JpcHRpb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGFzcyBQb3N0aXRzIHtcclxuICAgIHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lcltdID0gW107XHJcblxyXG4gICAgcG9zdGl0TGlzdDogUG9zdGl0W10gPSBbXTtcclxuXHJcbiAgICBob3N0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gICAgcG9zdGl0VGVtcGxhdGU/OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgcG9zdGl0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9Qb3N0aXRzOiBQb3N0aXRzO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgICAgaWYgKHRoaXMuX1Bvc3RpdHMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fUG9zdGl0cztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9Qb3N0aXRzID0gbmV3IFBvc3RpdHMoKTtcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyRm46IExpc3RlbmVyKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUG9zdGl0KHBvc3RpdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLlZhbGlkYXRpb24ocG9zdGl0KTtcclxuXHJcbiAgICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wb3N0aXRMaXN0LnB1c2gocG9zdGl0KTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHZhbGlkYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVBvc3RpdChpZDogc3RyaW5nLCBuZXdTdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICBjb25zdCBwb3N0aXQgPSB0aGlzLnBvc3RpdExpc3QuZmlsdGVyKChwb3N0aXQpID0+IHBvc3RpdC5pZCA9PT0gaWQpWzBdO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdCAmJiBwb3N0aXQuc3RhdHVzICE9PSBuZXdTdGF0dXMpIHtcclxuICAgICAgICBwb3N0aXQuc3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUxpc3RlbmVycygpIHtcclxuICAgICAgZm9yIChjb25zdCBsaXN0ZW5lckZuIG9mIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgbGlzdGVuZXJGbih0aGlzLnBvc3RpdExpc3Quc2xpY2UoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIFZhbGlkYXRpb24ocHJvamVjdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHRpdGxlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgICBtYXhMZW5ndGg6IDUwLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgZGVzY3JpcHRpb25WYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgICAgdmFsdWU6IHByb2plY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICAgIG1heExlbmd0aDogMjAwLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgdmFsdWVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgICAgdmFsdWU6IHByb2plY3Quc3RhdHVzLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIG1pblZhbHVlOiAwLFxyXG4gICAgICAgIG1heFZhbHVlOiAzLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgICF2YWxpZGF0ZSh0aXRsZVZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAgICF2YWxpZGF0ZShkZXNjcmlwdGlvblZhbGlkYXRhYmxlKSB8fFxyXG4gICAgICAgICF2YWxpZGF0ZSh2YWx1ZVZhbGlkYXRhYmxlKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBwb3N0aXRzID0gUG9zdGl0cy5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICBuZXcgSW5wdXRDb21wb25lbnQoKTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuVW5hc3NpZ25lZCk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlN0YXJ0KTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuQ29udGludWUpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5TdG9wKTtcclxufVxyXG4iLCIiXX0=