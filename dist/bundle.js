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
/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/postit-column.ts" />
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
/// <reference path = "status.ts"/>
var App;
(function (App) {
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
/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/postit-column.ts" />
/// <reference path="../models/postit.ts" />
/// <reference path="../models/drag-drop.ts" />
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
/// <reference path = "./models/status.ts"/>
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
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/postit.ts" />
/// <reference path="../models/drag-drop.ts" />
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIiwic291cmNlcyI6WyJtb2RlbHMvc3RhdHVzLnRzIiwiY29tcG9uZW50L2Jhc2UtY29tcG9uZW50LnRzIiwiZGVjb3JhdG9ycy9hdXRvYmluZC50cyIsInV0aWwvdmFsaWRhdGlvbi50cyIsInN0YXRlL3Bvc3RpdC1jb2x1bW4udHMiLCJjb21wb25lbnQvcG9zdGl0LWlucHV0LnRzIiwibW9kZWxzL3Bvc3RpdC50cyIsIm1vZGVscy9kcmFnLWRyb3AudHMiLCJjb21wb25lbnQvcG9zdGl0LWxpc3QudHMiLCJhcHAudHMiLCJjb21wb25lbnQvcG9zdGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBVSxHQUFHLENBT1o7QUFQRCxXQUFVLEdBQUc7SUFDWCxJQUFZLE1BS1g7SUFMRCxXQUFZLE1BQU07UUFDaEIsK0NBQVUsQ0FBQTtRQUNWLHFDQUFLLENBQUE7UUFDTCwyQ0FBUSxDQUFBO1FBQ1IsbUNBQUksQ0FBQTtJQUNOLENBQUMsRUFMVyxNQUFNLEdBQU4sVUFBTSxLQUFOLFVBQU0sUUFLakI7QUFDSCxDQUFDLEVBUFMsR0FBRyxLQUFILEdBQUcsUUFPWjtBQ1BELElBQVUsR0FBRyxDQXVDWjtBQXZDRCxXQUFVLEdBQUc7SUFDWDtRQVFFLG1CQUNFLFVBQWtCLEVBQ2xCLGFBQXFCLEVBQ3JCLGFBQXNCLEVBQ3RCLFlBQXFCO1lBRXJCLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDNUMsVUFBVSxDQUNhLENBQUM7WUFFMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBTyxDQUFDO1lBRWhFLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFR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Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBZ0I7WUFDL0IsS0FBSyxDQUFDLFlBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLFlBQWEsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzdDLENBQUM7UUFFRCx3Q0FBYyxHQUFkLFVBQWUsQ0FBWTtZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxtQ0FBUyxHQUFUO1lBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFRCx1Q0FBYSxHQUFiO1lBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN6RSxDQUFDO1FBakJEO1lBREMsSUFBQSxRQUFROytEQUlSO1FBZUgsc0JBQUM7S0FBQSxBQWpDRCxDQUNVLElBQUEsU0FBUyxHQWdDbEI7SUFqQ1ksbUJBQWUsa0JBaUMzQixDQUFBO0FBQ0gsQ0FBQyxFQW5DUyxHQUFHLEtBQUgsR0FBRyxRQW1DWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBlbnVtIFN0YXR1cyB7XHJcbiAgICBVbmFzc2lnbmVkLFxyXG4gICAgU3RhcnQsXHJcbiAgICBDb250aW51ZSxcclxuICAgIFN0b3AsXHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8XHJcbiAgICBUIGV4dGVuZHMgSFRNTEVsZW1lbnQsXHJcbiAgICBVIGV4dGVuZHMgSFRNTEVsZW1lbnRcclxuICA+IHtcclxuICAgIHRlbXBsYXRlRWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcclxuICAgIGhvc3RFbGVtZW50OiBUO1xyXG4gICAgZWxlbWVudDogVTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgdGVtcGFsdGVJZDogc3RyaW5nLFxyXG4gICAgICBob3N0RWxlbWVudElkOiBzdHJpbmcsXHJcbiAgICAgIGluc2VydEF0U3RhcnQ6IGJvb2xlYW4sXHJcbiAgICAgIG5ld0VsZW1lbnRJZD86IHN0cmluZ1xyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMudGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgdGVtcGFsdGVJZFxyXG4gICAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgICAgdGhpcy5ob3N0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhvc3RFbGVtZW50SWQpISBhcyBUO1xyXG5cclxuICAgICAgY29uc3QgZm9ybU5vZGUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQgPSBmb3JtTm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBVO1xyXG4gICAgICBpZiAobmV3RWxlbWVudElkKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmlkID0gbmV3RWxlbWVudElkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmF0dGFjaChpbnNlcnRBdFN0YXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBjb25maWd1cmUoKTogdm9pZDtcclxuXHJcbiAgICBwcml2YXRlIGF0dGFjaChpbnNlcnRBdFN0YXJ0OiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuaG9zdEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxyXG4gICAgICAgIGluc2VydEF0U3RhcnQgPyBcImFmdGVyYmVnaW5cIiA6IFwiYmVmb3JlZW5kXCIsXHJcbiAgICAgICAgdGhpcy5lbGVtZW50XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChfOiBhbnksIF8yOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikge1xyXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gICAgY29uc3QgYWRqRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yID0ge1xyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIGdldCgpIHtcclxuICAgICAgICBjb25zdCBib3VuZEZuID0gb3JpZ2luYWxNZXRob2QuYmluZCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gYm91bmRGbjtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gYWRqRGVzY3JpcHRvcjtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gICAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gICAgbWF4TGVuZ3RoPzogbnVtYmVyO1xyXG5cclxuICAgIG1pblZhbHVlPzogbnVtYmVyO1xyXG4gICAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gdmFsaWRhdGUodmFsaWRhdGFibGVJbnB1dDogVmFsaWRhdGFibGUpOiBib29sZWFuIHtcclxuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5yZXF1aXJlZCkge1xyXG4gICAgICBpc1ZhbGlkID1cclxuICAgICAgICBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoICE9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pbkxlbmd0aCAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPVxyXG4gICAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0LnZhbHVlLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA+PVxyXG4gICAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWF4TGVuZ3RoICE9IG51bGwpIHtcclxuICAgICAgaXNWYWxpZCA9XHJcbiAgICAgICAgaXNWYWxpZCAmJlxyXG4gICAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoIDw9XHJcbiAgICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPj0gdmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPD0gdmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNWYWxpZDtcclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi4vdXRpbC92YWxpZGF0aW9uLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgdHlwZSBMaXN0ZW5lciA9IChpdGVtczogUG9zdGl0W10pID0+IHZvaWQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXRzIHtcclxuICAgIHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lcltdID0gW107XHJcblxyXG4gICAgcG9zdGl0TGlzdDogUG9zdGl0W10gPSBbXTtcclxuXHJcbiAgICBob3N0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gICAgcG9zdGl0VGVtcGxhdGU/OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gICAgcG9zdGl0RWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9Qb3N0aXRzOiBQb3N0aXRzO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgICAgaWYgKHRoaXMuX1Bvc3RpdHMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fUG9zdGl0cztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9Qb3N0aXRzID0gbmV3IFBvc3RpdHMoKTtcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyRm46IExpc3RlbmVyKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUG9zdGl0KHBvc3RpdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLlZhbGlkYXRpb24ocG9zdGl0KTtcclxuXHJcbiAgICAgIGlmICh2YWxpZGF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wb3N0aXRMaXN0LnB1c2gocG9zdGl0KTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHZhbGlkYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVBvc3RpdChpZDogc3RyaW5nLCBuZXdTdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICBjb25zdCBwb3N0aXQgPSB0aGlzLnBvc3RpdExpc3QuZmlsdGVyKChwb3N0aXQpID0+IHBvc3RpdC5pZCA9PT0gaWQpWzBdO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdCAmJiBwb3N0aXQuc3RhdHVzICE9PSBuZXdTdGF0dXMpIHtcclxuICAgICAgICBwb3N0aXQuc3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlzdGVuZXJzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUxpc3RlbmVycygpIHtcclxuICAgICAgZm9yIChjb25zdCBsaXN0ZW5lckZuIG9mIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgbGlzdGVuZXJGbih0aGlzLnBvc3RpdExpc3Quc2xpY2UoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIFZhbGlkYXRpb24ocHJvamVjdDogUG9zdGl0KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHRpdGxlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgICAgICBtaW5MZW5ndGg6IDAsXHJcbiAgICAgICAgbWF4TGVuZ3RoOiAxNCxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICAgIHZhbHVlOiBwcm9qZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgICBtYXhMZW5ndGg6IDE0MCxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlVmFsaWRhdGFibGU6IFZhbGlkYXRhYmxlID0ge1xyXG4gICAgICAgIHZhbHVlOiBwcm9qZWN0LnN0YXR1cyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICBtaW5WYWx1ZTogMCxcclxuICAgICAgICBtYXhWYWx1ZTogMyxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICAhdmFsaWRhdGUodGl0bGVWYWxpZGF0YWJsZSkgfHxcclxuICAgICAgICAhdmFsaWRhdGUoZGVzY3JpcHRpb25WYWxpZGF0YWJsZSkgfHxcclxuICAgICAgICAhdmFsaWRhdGUodmFsdWVWYWxpZGF0YWJsZSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNvbnN0IHBvc3RpdHMgPSBQb3N0aXRzLmdldEluc3RhbmNlKCk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UtY29tcG9uZW50LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlY29yYXRvcnMvYXV0b2JpbmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC92YWxpZGF0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N0YXRlL3Bvc3RpdC1jb2x1bW4udHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGNsYXNzIElucHV0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PFxyXG4gICAgSFRNTERpdkVsZW1lbnQsXHJcbiAgICBIVE1MRm9ybUVsZW1lbnRcclxuICA+IHtcclxuICAgIHRpdGxlSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB2YWx1ZUlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoXCJwcm9qZWN0LWlucHV0XCIsIFwiYXBwXCIsIGZhbHNlLCBcInVzZXItaW5wdXRcIik7XHJcblxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjdGl0bGVcIlxyXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNkZXNjcmlwdGlvblwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgdGhpcy52YWx1ZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3Blb3BsZVwiXHJcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCB0aGlzLnN1Ym1pdEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXRIYW5kbGVyKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgY29uc3QgcG9zdGl0ID0gbmV3IFBvc3RpdChcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQudmFsdWUsXHJcbiAgICAgICAgK3RoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWVcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvc3RpdFZhbGlkYXRpb24gPSBwb3N0aXRzLmFkZFBvc3RpdChwb3N0aXQpO1xyXG5cclxuICAgICAgaWYgKHBvc3RpdFZhbGlkYXRpb24pIHtcclxuICAgICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhbHVlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChgaW52bGFpZCBpbnB1dDogJHtcIkludmFsaWQgaW5wdXRcIn1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoID0gXCJzdGF0dXMudHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgY2xhc3MgUG9zdGl0IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIHN0YXR1czogU3RhdHVzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHQ6IHN0cmluZywgZDogc3RyaW5nLCBzdGF0dXM6IFN0YXR1cykge1xyXG4gICAgICB0aGlzLnRpdGxlID0gdC50cmltKCk7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkLnRyaW0oKTtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIHRoaXMuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIERyYWcgJiBEcm9wIEludGVyZmFjZXNcclxubmFtZXNwYWNlIEFwcCB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBEcmFnZ2FibGUge1xyXG4gICAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyYWdFbmRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIH1cclxuICBleHBvcnQgaW50ZXJmYWNlIERyYWdUYXJnZXQge1xyXG4gICAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyb3BIYW5kbGVyKGV2ZW50TDogRHJhZ0V2ZW50KTogdm9pZDtcclxuICAgIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnRMOiBEcmFnRXZlbnQpOiB2b2lkO1xyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS1jb21wb25lbnQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVjb3JhdG9ycy9hdXRvYmluZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdGF0ZS9wb3N0aXQtY29sdW1uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL21vZGVscy9wb3N0aXQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbW9kZWxzL2RyYWctZHJvcC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgQXBwIHtcclxuICBleHBvcnQgY2xhc3MgUG9zdGl0TGlzdENvbXBvbmVudFxyXG4gICAgZXh0ZW5kcyBDb21wb25lbnQ8SFRNTERpdkVsZW1lbnQsIEhUTUxFbGVtZW50PlxyXG4gICAgaW1wbGVtZW50cyBEcmFnVGFyZ2V0IHtcclxuICAgIGFzc2lnbmVkUG9zdGl0czogYW55W107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICAgIHN1cGVyKFxyXG4gICAgICAgIFwicHJvamVjdC1saXN0XCIsXHJcbiAgICAgICAgXCJhcHBcIixcclxuICAgICAgICBmYWxzZSxcclxuICAgICAgICBgJHtzdGF0dXMudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpfS1wb3N0LWl0YFxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5hc3NpZ25lZFBvc3RpdHMgPSBbXTtcclxuXHJcbiAgICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBkcmFnT3ZlckhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyICYmIGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlc1swXSA9PT0gXCJ0ZXh0L3BsYWluXCIpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGxpc3RFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICAgIGxpc3RFbC5jbGFzc0xpc3QuYWRkKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBkcm9wSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHBvc3RpdElkID0gZXZlbnQuZGF0YVRyYW5zZmVyIS5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtcclxuICAgICAgcG9zdGl0cy5tb3ZlUG9zdGl0KHBvc3RpdElkLCB0aGlzLnN0YXR1cyk7XHJcbiAgICAgIGNvbnN0IGxpc3RFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhO1xyXG4gICAgICBsaXN0RWwuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwYWJsZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgbGlzdEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wcGFibGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpIS50ZXh0Q29udGVudCA9IHRoaXMuc3RhdHVzLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHRoaXMuZHJhZ092ZXJIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgdGhpcy5kcmFnTGVhdmVIYW5kbGVyKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIHRoaXMuZHJvcEhhbmRsZXIpO1xyXG5cclxuICAgICAgcG9zdGl0cy5hZGRMaXN0ZW5lcigocG9zdGl0OiBQb3N0aXRbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGV2YW50UHJvamVjdHMgPSBwb3N0aXQuZmlsdGVyKChwcmopID0+IHtcclxuICAgICAgICAgIHJldHVybiBwcmouc3RhdHVzID09PSB0aGlzLnN0YXR1cztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IHJlbGV2YW50UHJvamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJQb3N0aXRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyUG9zdGl0cygpIHtcclxuICAgICAgY29uc3QgbGlzdElkID0gYCR7dGhpcy5zdGF0dXMudG9TdHJpbmcoKX0tcG9zdC1pdC1saXN0YDtcclxuICAgICAgY29uc3QgbGlzdEVsID0gZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICAgICAgKSFcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgICAgbGlzdEVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIGxpc3RFbC5pZCA9IGxpc3RJZDtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgcG9zdGl0SXRlbSBvZiB0aGlzLmFzc2lnbmVkUG9zdGl0cykge1xyXG4gICAgICAgIG5ldyBQb3N0aXRDb21wb25lbnQodGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSEuaWQsIHBvc3RpdEl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGggPSBcIi4vbW9kZWxzL3N0YXR1cy50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aCA9IFwiLi9jb21wb25lbnQvcG9zdGl0LWlucHV0LnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL2NvbXBvbmVudC9wb3N0aXQtbGlzdC50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIC8vY29tcG9uZW50IGJhc2UgY2xhc3NcclxuXHJcbiAgbmV3IElucHV0Q29tcG9uZW50KCk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlVuYXNzaWduZWQpO1xyXG4gIG5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5TdGFydCk7XHJcbiAgbmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLkNvbnRpbnVlKTtcclxuICBuZXcgUG9zdGl0TGlzdENvbXBvbmVudChTdGF0dXMuU3RvcCk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UtY29tcG9uZW50LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlY29yYXRvcnMvYXV0b2JpbmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbW9kZWxzL3Bvc3RpdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9tb2RlbHMvZHJhZy1kcm9wLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBBcHAge1xyXG4gIGV4cG9ydCBjbGFzcyBQb3N0aXRDb21wb25lbnRcclxuICAgIGV4dGVuZHMgQ29tcG9uZW50PEhUTUxVTGlzdEVsZW1lbnQsIEhUTUxMSUVsZW1lbnQ+XHJcbiAgICBpbXBsZW1lbnRzIERyYWdnYWJsZSB7XHJcbiAgICBwcml2YXRlIHBvc3RpdDogUG9zdGl0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGhvc3RJZDogc3RyaW5nLCBwb3N0aXQ6IFBvc3RpdCkge1xyXG4gICAgICBzdXBlcihcInBvc3QtaXRcIiwgaG9zdElkLCBmYWxzZSwgcG9zdGl0LmlkKTtcclxuXHJcbiAgICAgIHRoaXMucG9zdGl0ID0gcG9zdGl0O1xyXG5cclxuICAgICAgdGhpcy5jb25maWd1cmUoKTtcclxuICAgICAgdGhpcy5yZW5kZXJDb250ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBkcmFnU3RhcnRIYW5kbGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0aGlzLnBvc3RpdC5pZCk7XHJcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuZWZmZWN0QWxsb3dlZCA9IFwibW92ZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWdFbmRIYW5kbGVyKF86IERyYWdFdmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkRyYWdFbmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCB0aGlzLmRyYWdTdGFydEhhbmRsZXIpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgdGhpcy5kcmFnRW5kSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQ29udGVudCgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnBvc3RpdC50aXRsZTtcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucG9zdGl0LmRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=