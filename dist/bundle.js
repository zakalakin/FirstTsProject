!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="dist",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);var r=function(){function t(t,e,n,r){this.templateElement=document.getElementById(t),this.hostElement=document.getElementById(e);var o=document.importNode(this.templateElement.content,!0);this.element=o.firstElementChild,r&&(this.element.id=r),this.attach(n)}return t.prototype.attach=function(t){this.hostElement.insertAdjacentElement(t?"afterbegin":"beforeend",this.element)},t}();function o(t){var e=!0;return t.required&&(e=e&&0!==t.value.toString().trim().length),null!=t.minLength&&(e=e&&t.value.toString().trim().length>=t.minLength),null!=t.maxLength&&(e=e&&t.value.toString().trim().length<=t.maxLength),null!=t.minValue&&(e=e&&t.value>=t.minValue),null!=t.maxValue&&(e=e&&t.value<=t.maxValue),e}var i,s=function(){function t(){this.listeners=[],this.postitList=[]}return t.getInstance=function(){return this._Postits||(this._Postits=new t),this._Postits},t.prototype.addListener=function(t){this.listeners.push(t)},t.prototype.addPostit=function(t){var e=this.Validation(t);return e&&(this.postitList.push(t),this.updateListeners()),e},t.prototype.movePostit=function(t,e){var n=this.postitList.filter((function(e){return e.id===t}))[0];n&&n.status!==e&&(n.status=e,this.updateListeners())},t.prototype.updateListeners=function(){for(var t=0,e=this.listeners;t<e.length;t++){(0,e[t])(this.postitList.slice())}},t.prototype.Validation=function(t){var e={value:t.title,required:!1,minLength:0,maxLength:14},n={value:t.description,required:!0,minLength:1,maxLength:140},r={value:t.status,required:!0,minValue:0,maxValue:3};return!!(o(e)&&o(n)&&o(r))},t}().getInstance(),a=function(t,e,n){this.title=t.trim(),this.description=e.trim(),this.status=n,this.id=Math.random().toString()},u=(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),l=function(t){function e(){var e=t.call(this,"project-input","app",!1,"user-input")||this;return e.titleInputElement=e.element.querySelector("#title"),e.descriptionInputElement=e.element.querySelector("#description"),e.valueInputElement=e.element.querySelector("#people"),e.configure(),e}return u(e,t),e.prototype.configure=function(){this.element.addEventListener("submit",this.submitHandler.bind(this))},e.prototype.submitHandler=function(t){t.preventDefault();var e=new a(this.titleInputElement.value,this.descriptionInputElement.value,+this.valueInputElement.value);s.addPostit(e)?(this.titleInputElement.value="",this.descriptionInputElement.value="",this.valueInputElement.value=""):alert("invlaid input: Invalid input")},e}(r);function p(t,e,n){var r=n.value;return{configurable:!0,get:function(){return r.bind(this)}}}var c,d=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),f=function(t,e,n,r){var o,i=arguments.length,s=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(i<3?o(s):i>3?o(e,n,s):o(e,n))||s);return i>3&&s&&Object.defineProperty(e,n,s),s},h=function(t){function e(e,n){var r=t.call(this,"post-it",e,!1,n.id)||this;return r.postit=n,r.configure(),r.renderContent(),r}return d(e,t),e.prototype.dragStartHandler=function(t){t.dataTransfer.setData("text/plain",this.postit.id),t.dataTransfer.effectAllowed="move"},e.prototype.dragEndHandler=function(t){console.log("DragEnd")},e.prototype.configure=function(){this.element.addEventListener("dragstart",this.dragStartHandler),this.element.addEventListener("dragend",this.dragEndHandler)},e.prototype.renderContent=function(){this.element.querySelector("h2").textContent=this.postit.title,this.element.querySelector("p").textContent=this.postit.description},f([p],e.prototype,"dragStartHandler",null),e}(r),m=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),v=function(t,e,n,r){var o,i=arguments.length,s=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(i<3?o(s):i>3?o(e,n,s):o(e,n))||s);return i>3&&s&&Object.defineProperty(e,n,s),s},y=function(t){function e(e){var n=t.call(this,"project-list","app",!1,e.toString().toLowerCase()+"-post-it")||this;return n.status=e,n.assignedPostits=[],n.configure(),n}return m(e,t),e.prototype.dragOverHandler=function(t){t.dataTransfer&&"text/plain"===t.dataTransfer.types[0]&&(t.preventDefault(),this.element.querySelector("ul").classList.add("droppable"))},e.prototype.dropHandler=function(t){var e=t.dataTransfer.getData("text/plain");s.movePostit(e,this.status),this.element.querySelector("ul").classList.remove("droppable")},e.prototype.dragLeaveHandler=function(t){this.element.querySelector("ul").classList.remove("droppable")},e.prototype.configure=function(){var t=this;this.element.querySelector("h2").textContent=this.status.toString(),this.element.addEventListener("dragover",this.dragOverHandler),this.element.addEventListener("dragleave",this.dragLeaveHandler),this.element.addEventListener("drop",this.dropHandler),s.addListener((function(e){var n=e.filter((function(e){return e.status===t.status}));t.assignedPostits=n,t.renderPostits()}))},e.prototype.renderPostits=function(){var t=this.status.toString()+"-post-it-list",e=document.getElementById(this.status.toString().toLocaleLowerCase()+"-post-it").querySelector("ul");e.innerHTML="",e.id=t;for(var n=0,r=this.assignedPostits;n<r.length;n++){var o=r[n];new h(this.element.querySelector("ul").id,o)}},v([p],e.prototype,"dragOverHandler",null),v([p],e.prototype,"dropHandler",null),v([p],e.prototype,"dragLeaveHandler",null),e}(r);!function(t){t[t.Unassigned=0]="Unassigned",t[t.Start=1]="Start",t[t.Continue=2]="Continue",t[t.Stop=3]="Stop"}(c||(c={})),new l,new y(c.Unassigned),new y(c.Start),new y(c.Continue),new y(c.Stop),console.log("hello friend")}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9zcmMvRDovRG9jdW1lbnRzL0Jqc3MvQmVuY2gvS2luc3BhbiB0cmFpbmluZy90cyBkcmFnIGFuZCBkcm9wL3NyYy9jb21wb25lbnQvY29tcG9uZW50LXBvc3RpdC50cyIsIndlYnBhY2s6Ly8vL3NyYy9EOi9Eb2N1bWVudHMvQmpzcy9CZW5jaC9LaW5zcGFuIHRyYWluaW5nL3RzIGRyYWcgYW5kIGRyb3Avc3JjL3V0aWwvdmFsaWRhdGlvbi50cyIsIndlYnBhY2s6Ly8vL3NyYy9EOi9Eb2N1bWVudHMvQmpzcy9CZW5jaC9LaW5zcGFuIHRyYWluaW5nL3RzIGRyYWcgYW5kIGRyb3Avc3JjL3N0YXRlL3Bvc3RpdC1jb2x1bW4udHMiLCJ3ZWJwYWNrOi8vLy9zcmMvRDovRG9jdW1lbnRzL0Jqc3MvQmVuY2gvS2luc3BhbiB0cmFpbmluZy90cyBkcmFnIGFuZCBkcm9wL3NyYy9tb2RlbHMvcG9zdGl0LnRzIiwid2VicGFjazovLy8vc3JjL0Q6L0RvY3VtZW50cy9CanNzL0JlbmNoL0tpbnNwYW4gdHJhaW5pbmcvdHMgZHJhZyBhbmQgZHJvcC9zcmMvY29tcG9uZW50L3Bvc3RpdC1pbnB1dC50cyIsIndlYnBhY2s6Ly8vL3NyYy9EOi9Eb2N1bWVudHMvQmpzcy9CZW5jaC9LaW5zcGFuIHRyYWluaW5nL3RzIGRyYWcgYW5kIGRyb3Avc3JjL2RlY29yYXRvcnMvYXV0b2JpbmQudHMiLCJ3ZWJwYWNrOi8vLy9zcmMvRDovRG9jdW1lbnRzL0Jqc3MvQmVuY2gvS2luc3BhbiB0cmFpbmluZy90cyBkcmFnIGFuZCBkcm9wL3NyYy9tb2RlbHMvc3RhdHVzLnRzIiwid2VicGFjazovLy8vc3JjL0Q6L0RvY3VtZW50cy9CanNzL0JlbmNoL0tpbnNwYW4gdHJhaW5pbmcvdHMgZHJhZyBhbmQgZHJvcC9zcmMvY29tcG9uZW50L3Bvc3RpdC50cyIsIndlYnBhY2s6Ly8vL3NyYy9EOi9Eb2N1bWVudHMvQmpzcy9CZW5jaC9LaW5zcGFuIHRyYWluaW5nL3RzIGRyYWcgYW5kIGRyb3Avc3JjL2NvbXBvbmVudC9wb3N0aXQtbGlzdC50cyIsIndlYnBhY2s6Ly8vL3NyYy9EOi9Eb2N1bWVudHMvQmpzcy9CZW5jaC9LaW5zcGFuIHRyYWluaW5nL3RzIGRyYWcgYW5kIGRyb3Avc3JjL2FwcC50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsImQiLCJuYW1lIiwiZ2V0dGVyIiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsInIiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsInZhbHVlIiwidCIsIm1vZGUiLCJfX2VzTW9kdWxlIiwibnMiLCJjcmVhdGUiLCJrZXkiLCJiaW5kIiwibiIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsInRlbXBhbHRlSWQiLCJob3N0RWxlbWVudElkIiwiaW5zZXJ0QXRTdGFydCIsIm5ld0VsZW1lbnRJZCIsInRoaXMiLCJ0ZW1wbGF0ZUVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaG9zdEVsZW1lbnQiLCJmb3JtTm9kZSIsImltcG9ydE5vZGUiLCJjb250ZW50IiwiZWxlbWVudCIsImZpcnN0RWxlbWVudENoaWxkIiwiaWQiLCJhdHRhY2giLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJ2YWxpZGF0ZSIsInZhbGlkYXRhYmxlSW5wdXQiLCJpc1ZhbGlkIiwicmVxdWlyZWQiLCJ0b1N0cmluZyIsInRyaW0iLCJsZW5ndGgiLCJtaW5MZW5ndGgiLCJtYXhMZW5ndGgiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwicG9zdGl0cyIsImxpc3RlbmVycyIsInBvc3RpdExpc3QiLCJnZXRJbnN0YW5jZSIsIl9Qb3N0aXRzIiwiUG9zdGl0cyIsImFkZExpc3RlbmVyIiwibGlzdGVuZXJGbiIsInB1c2giLCJhZGRQb3N0aXQiLCJwb3N0aXQiLCJ2YWxpZGF0aW9uIiwiVmFsaWRhdGlvbiIsInVwZGF0ZUxpc3RlbmVycyIsIm1vdmVQb3N0aXQiLCJuZXdTdGF0dXMiLCJmaWx0ZXIiLCJzdGF0dXMiLCJzbGljZSIsInByb2plY3QiLCJ0aXRsZVZhbGlkYXRhYmxlIiwidGl0bGUiLCJkZXNjcmlwdGlvblZhbGlkYXRhYmxlIiwiZGVzY3JpcHRpb24iLCJ2YWx1ZVZhbGlkYXRhYmxlIiwiTWF0aCIsInJhbmRvbSIsInRpdGxlSW5wdXRFbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImRlc2NyaXB0aW9uSW5wdXRFbGVtZW50IiwidmFsdWVJbnB1dEVsZW1lbnQiLCJjb25maWd1cmUiLCJhZGRFdmVudExpc3RlbmVyIiwic3VibWl0SGFuZGxlciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJQb3N0aXQiLCJhbGVydCIsIkNvbXBvbmVudFBvc3RpdCIsImF1dG9iaW5kIiwiXyIsIl8yIiwiZGVzY3JpcHRvciIsIm9yaWdpbmFsTWV0aG9kIiwiY29uZmlndXJhYmxlIiwiU3RhdHVzIiwiaG9zdElkIiwicmVuZGVyQ29udGVudCIsImRyYWdTdGFydEhhbmRsZXIiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiZWZmZWN0QWxsb3dlZCIsImRyYWdFbmRIYW5kbGVyIiwiY29uc29sZSIsImxvZyIsInRleHRDb250ZW50IiwidG9Mb3dlckNhc2UiLCJhc3NpZ25lZFBvc3RpdHMiLCJkcmFnT3ZlckhhbmRsZXIiLCJ0eXBlcyIsImNsYXNzTGlzdCIsImFkZCIsImRyb3BIYW5kbGVyIiwicG9zdGl0SWQiLCJnZXREYXRhIiwicmVtb3ZlIiwiZHJhZ0xlYXZlSGFuZGxlciIsInJlbGV2YW50UHJvamVjdHMiLCJwcmoiLCJyZW5kZXJQb3N0aXRzIiwibGlzdElkIiwibGlzdEVsIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJpbm5lckhUTUwi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QW9COUIsRUFBTytCLE9BQy9CLElBQUksRUFBb0IvQixFQUFPZ0MsVUFDL0IsSUFBSSxFQUFvQmhDLEVBQU9pQyxNQUUvQnpCLFFBQVFDLElBQUkiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJkaXN0XCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRQb3N0aXQ8XHJcbiAgVCBleHRlbmRzIEhUTUxFbGVtZW50LFxyXG4gIFUgZXh0ZW5kcyBIVE1MRWxlbWVudFxyXG4+IHtcclxuICB0ZW1wbGF0ZUVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XHJcbiAgaG9zdEVsZW1lbnQ6IFQ7XHJcbiAgZWxlbWVudDogVTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0ZW1wYWx0ZUlkOiBzdHJpbmcsXHJcbiAgICBob3N0RWxlbWVudElkOiBzdHJpbmcsXHJcbiAgICBpbnNlcnRBdFN0YXJ0OiBib29sZWFuLFxyXG4gICAgbmV3RWxlbWVudElkPzogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICB0aGlzLnRlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICB0ZW1wYWx0ZUlkXHJcbiAgICApISBhcyBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChob3N0RWxlbWVudElkKSEgYXMgVDtcclxuXHJcbiAgICBjb25zdCBmb3JtTm9kZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBmb3JtTm9kZS5maXJzdEVsZW1lbnRDaGlsZCBhcyBVO1xyXG4gICAgaWYgKG5ld0VsZW1lbnRJZCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuaWQgPSBuZXdFbGVtZW50SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hdHRhY2goaW5zZXJ0QXRTdGFydCk7XHJcbiAgfVxyXG5cclxuICBhYnN0cmFjdCBjb25maWd1cmUoKTogdm9pZDtcclxuXHJcbiAgcHJpdmF0ZSBhdHRhY2goaW5zZXJ0QXRTdGFydDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXHJcbiAgICAgIGluc2VydEF0U3RhcnQgPyBcImFmdGVyYmVnaW5cIiA6IFwiYmVmb3JlZW5kXCIsXHJcbiAgICAgIHRoaXMuZWxlbWVudFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0YWJsZSB7XHJcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcclxuICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgbWluTGVuZ3RoPzogbnVtYmVyO1xyXG4gIG1heExlbmd0aD86IG51bWJlcjtcclxuXHJcbiAgbWluVmFsdWU/OiBudW1iZXI7XHJcbiAgbWF4VmFsdWU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZSh2YWxpZGF0YWJsZUlucHV0OiBWYWxpZGF0YWJsZSk6IGJvb2xlYW4ge1xyXG4gIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQucmVxdWlyZWQpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoICE9PSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbGlkYXRhYmxlSW5wdXQubWluTGVuZ3RoICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPVxyXG4gICAgICBpc1ZhbGlkICYmXHJcbiAgICAgIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoID49XHJcbiAgICAgICAgdmFsaWRhdGFibGVJbnB1dC5taW5MZW5ndGg7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGFibGVJbnB1dC5tYXhMZW5ndGggIT0gbnVsbCkge1xyXG4gICAgaXNWYWxpZCA9XHJcbiAgICAgIGlzVmFsaWQgJiZcclxuICAgICAgdmFsaWRhdGFibGVJbnB1dC52YWx1ZS50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPD1cclxuICAgICAgICB2YWxpZGF0YWJsZUlucHV0Lm1heExlbmd0aDtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1pblZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPj0gdmFsaWRhdGFibGVJbnB1dC5taW5WYWx1ZTtcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZGF0YWJsZUlucHV0Lm1heFZhbHVlICE9IG51bGwpIHtcclxuICAgIGlzVmFsaWQgPSBpc1ZhbGlkICYmIHZhbGlkYXRhYmxlSW5wdXQudmFsdWUgPD0gdmFsaWRhdGFibGVJbnB1dC5tYXhWYWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpc1ZhbGlkO1xyXG59XHJcbiIsImltcG9ydCB7IFZhbGlkYXRhYmxlIH0gZnJvbSBcIi4uL3V0aWwvdmFsaWRhdGlvblwiO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gXCIuLi91dGlsL3ZhbGlkYXRpb25cIjtcclxuaW1wb3J0IHsgUG9zdGl0IH0gZnJvbSBcIi4uL21vZGVscy9wb3N0aXRcIjtcclxuaW1wb3J0IHsgU3RhdHVzIH0gZnJvbSBcIi4uL21vZGVscy9zdGF0dXNcIjtcclxuXHJcbnR5cGUgTGlzdGVuZXIgPSAoaXRlbXM6IFBvc3RpdFtdKSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvc3RpdHMge1xyXG4gIHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lcltdID0gW107XHJcblxyXG4gIHBvc3RpdExpc3Q6IFBvc3RpdFtdID0gW107XHJcblxyXG4gIGhvc3RFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcbiAgcG9zdGl0VGVtcGxhdGU/OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xyXG4gIHBvc3RpdEVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX1Bvc3RpdHM6IFBvc3RpdHM7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XHJcbiAgICBpZiAodGhpcy5fUG9zdGl0cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5fUG9zdGl0cztcclxuICAgIH1cclxuICAgIHRoaXMuX1Bvc3RpdHMgPSBuZXcgUG9zdGl0cygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9Qb3N0aXRzO1xyXG4gIH1cclxuXHJcbiAgYWRkTGlzdGVuZXIobGlzdGVuZXJGbjogTGlzdGVuZXIpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXJGbik7XHJcbiAgfVxyXG5cclxuICBhZGRQb3N0aXQocG9zdGl0OiBQb3N0aXQpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLlZhbGlkYXRpb24ocG9zdGl0KTtcclxuXHJcbiAgICBpZiAodmFsaWRhdGlvbikge1xyXG4gICAgICB0aGlzLnBvc3RpdExpc3QucHVzaChwb3N0aXQpO1xyXG5cclxuICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvbjtcclxuICB9XHJcblxyXG4gIG1vdmVQb3N0aXQoaWQ6IHN0cmluZywgbmV3U3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIGNvbnN0IHBvc3RpdCA9IHRoaXMucG9zdGl0TGlzdC5maWx0ZXIoKHBvc3RpdCkgPT4gcG9zdGl0LmlkID09PSBpZClbMF07XHJcblxyXG4gICAgaWYgKHBvc3RpdCAmJiBwb3N0aXQuc3RhdHVzICE9PSBuZXdTdGF0dXMpIHtcclxuICAgICAgcG9zdGl0LnN0YXR1cyA9IG5ld1N0YXR1cztcclxuICAgICAgdGhpcy51cGRhdGVMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlTGlzdGVuZXJzKCkge1xyXG4gICAgZm9yIChjb25zdCBsaXN0ZW5lckZuIG9mIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgIGxpc3RlbmVyRm4odGhpcy5wb3N0aXRMaXN0LnNsaWNlKCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBWYWxpZGF0aW9uKHByb2plY3Q6IFBvc3RpdCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdGl0bGVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnRpdGxlLFxyXG4gICAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICAgIG1pbkxlbmd0aDogMCxcclxuICAgICAgbWF4TGVuZ3RoOiAxNCxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25WYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICBtYXhMZW5ndGg6IDE0MCxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdmFsdWVWYWxpZGF0YWJsZTogVmFsaWRhdGFibGUgPSB7XHJcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnN0YXR1cyxcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pblZhbHVlOiAwLFxyXG4gICAgICBtYXhWYWx1ZTogMyxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAhdmFsaWRhdGUodGl0bGVWYWxpZGF0YWJsZSkgfHxcclxuICAgICAgIXZhbGlkYXRlKGRlc2NyaXB0aW9uVmFsaWRhdGFibGUpIHx8XHJcbiAgICAgICF2YWxpZGF0ZSh2YWx1ZVZhbGlkYXRhYmxlKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBvc3RpdHMgPSBQb3N0aXRzLmdldEluc3RhbmNlKCk7XHJcbiIsImltcG9ydCB7IFN0YXR1cyB9IGZyb20gXCJzdGF0dXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3N0aXQge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHN0YXR1czogU3RhdHVzO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih0OiBzdHJpbmcsIGQ6IHN0cmluZywgc3RhdHVzOiBTdGF0dXMpIHtcclxuICAgIHRoaXMudGl0bGUgPSB0LnRyaW0oKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkLnRyaW0oKTtcclxuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgdGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50UG9zdGl0IH0gZnJvbSBcIi4vY29tcG9uZW50LXBvc3RpdFwiO1xyXG5pbXBvcnQgeyBwb3N0aXRzIH0gZnJvbSBcIi4uL3N0YXRlL3Bvc3RpdC1jb2x1bW5cIjtcclxuaW1wb3J0IHsgUG9zdGl0IH0gZnJvbSBcIi4uL21vZGVscy9wb3N0aXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudFBvc3RpdDxcclxuICBIVE1MRGl2RWxlbWVudCxcclxuICBIVE1MRm9ybUVsZW1lbnRcclxuPiB7XHJcbiAgdGl0bGVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgZGVzY3JpcHRpb25JbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgdmFsdWVJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoXCJwcm9qZWN0LWlucHV0XCIsIFwiYXBwXCIsIGZhbHNlLCBcInVzZXItaW5wdXRcIik7XHJcblxyXG4gICAgdGhpcy50aXRsZUlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiN0aXRsZVwiXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI2Rlc2NyaXB0aW9uXCJcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMudmFsdWVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjcGVvcGxlXCJcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uZmlndXJlKCkge1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgdGhpcy5zdWJtaXRIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdWJtaXRIYW5kbGVyKGV2ZW50OiBFdmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBwb3N0aXQgPSBuZXcgUG9zdGl0KFxyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uSW5wdXRFbGVtZW50LnZhbHVlLFxyXG4gICAgICArdGhpcy52YWx1ZUlucHV0RWxlbWVudC52YWx1ZVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBwb3N0aXRWYWxpZGF0aW9uID0gcG9zdGl0cy5hZGRQb3N0aXQocG9zdGl0KTtcclxuXHJcbiAgICBpZiAocG9zdGl0VmFsaWRhdGlvbikge1xyXG4gICAgICB0aGlzLnRpdGxlSW5wdXRFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbklucHV0RWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIHRoaXMudmFsdWVJbnB1dEVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxlcnQoYGludmxhaWQgaW5wdXQ6ICR7XCJJbnZhbGlkIGlucHV0XCJ9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChfOiBhbnksIF8yOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikge1xyXG4gIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICBjb25zdCBhZGpEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQoKSB7XHJcbiAgICAgIGNvbnN0IGJvdW5kRm4gPSBvcmlnaW5hbE1ldGhvZC5iaW5kKHRoaXMpO1xyXG4gICAgICByZXR1cm4gYm91bmRGbjtcclxuICAgIH0sXHJcbiAgfTtcclxuICByZXR1cm4gYWRqRGVzY3JpcHRvcjtcclxufVxyXG4iLCJleHBvcnQgZW51bSBTdGF0dXMge1xyXG4gIFVuYXNzaWduZWQsXHJcbiAgU3RhcnQsXHJcbiAgQ29udGludWUsXHJcbiAgU3RvcCxcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnRQb3N0aXQgfSBmcm9tIFwiLi9jb21wb25lbnQtcG9zdGl0XCI7XHJcbmltcG9ydCB7IGF1dG9iaW5kIH0gZnJvbSBcIi4uL2RlY29yYXRvcnMvYXV0b2JpbmRcIjtcclxuaW1wb3J0IHsgUG9zdGl0IH0gZnJvbSBcIi4uL21vZGVscy9wb3N0aXRcIjtcclxuaW1wb3J0IHsgRHJhZ2dhYmxlIH0gZnJvbSBcIi4uL21vZGVscy9kcmFnLWRyb3BcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3N0aXRDb21wb25lbnRcclxuICBleHRlbmRzIENvbXBvbmVudFBvc3RpdDxIVE1MVUxpc3RFbGVtZW50LCBIVE1MTElFbGVtZW50PlxyXG4gIGltcGxlbWVudHMgRHJhZ2dhYmxlIHtcclxuICBwcml2YXRlIHBvc3RpdDogUG9zdGl0O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihob3N0SWQ6IHN0cmluZywgcG9zdGl0OiBQb3N0aXQpIHtcclxuICAgIHN1cGVyKFwicG9zdC1pdFwiLCBob3N0SWQsIGZhbHNlLCBwb3N0aXQuaWQpO1xyXG5cclxuICAgIHRoaXMucG9zdGl0ID0gcG9zdGl0O1xyXG5cclxuICAgIHRoaXMuY29uZmlndXJlKCk7XHJcbiAgICB0aGlzLnJlbmRlckNvbnRlbnQoKTtcclxuICB9XHJcblxyXG4gIEBhdXRvYmluZFxyXG4gIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyIS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0aGlzLnBvc3RpdC5pZCk7XHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcclxuICB9XHJcblxyXG4gIGRyYWdFbmRIYW5kbGVyKF86IERyYWdFdmVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJEcmFnRW5kXCIpO1xyXG4gIH1cclxuXHJcbiAgY29uZmlndXJlKCkge1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgdGhpcy5kcmFnU3RhcnRIYW5kbGVyKTtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCB0aGlzLmRyYWdFbmRIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckNvbnRlbnQoKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucG9zdGl0LnRpdGxlO1xyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwXCIpIS50ZXh0Q29udGVudCA9IHRoaXMucG9zdGl0LmRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnRQb3N0aXQgfSBmcm9tIFwiLi9jb21wb25lbnQtcG9zdGl0XCI7XHJcbmltcG9ydCB7IFBvc3RpdENvbXBvbmVudCB9IGZyb20gXCIuL3Bvc3RpdFwiO1xyXG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gXCIuLi9kZWNvcmF0b3JzL2F1dG9iaW5kXCI7XHJcbmltcG9ydCB7IHBvc3RpdHMgfSBmcm9tIFwiLi4vc3RhdGUvcG9zdGl0LWNvbHVtblwiO1xyXG5pbXBvcnQgeyBQb3N0aXQgfSBmcm9tIFwiLi4vbW9kZWxzL3Bvc3RpdFwiO1xyXG5pbXBvcnQgeyBEcmFnVGFyZ2V0IH0gZnJvbSBcIi4uL21vZGVscy9kcmFnLWRyb3BcIjtcclxuaW1wb3J0IHsgU3RhdHVzIH0gZnJvbSBcIi4uL21vZGVscy9zdGF0dXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3N0aXRMaXN0Q29tcG9uZW50XHJcbiAgZXh0ZW5kcyBDb21wb25lbnRQb3N0aXQ8SFRNTERpdkVsZW1lbnQsIEhUTUxFbGVtZW50PlxyXG4gIGltcGxlbWVudHMgRHJhZ1RhcmdldCB7XHJcbiAgYXNzaWduZWRQb3N0aXRzOiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogU3RhdHVzKSB7XHJcbiAgICBzdXBlcihcclxuICAgICAgXCJwcm9qZWN0LWxpc3RcIixcclxuICAgICAgXCJhcHBcIixcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIGAke3N0YXR1cy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9LXBvc3QtaXRgXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYXNzaWduZWRQb3N0aXRzID0gW107XHJcblxyXG4gICAgdGhpcy5jb25maWd1cmUoKTtcclxuICB9XHJcblxyXG4gIEBhdXRvYmluZFxyXG4gIGRyYWdPdmVySGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyICYmIGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlc1swXSA9PT0gXCJ0ZXh0L3BsYWluXCIpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgY29uc3QgbGlzdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKSE7XHJcbiAgICAgIGxpc3RFbC5jbGFzc0xpc3QuYWRkKFwiZHJvcHBhYmxlXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQGF1dG9iaW5kXHJcbiAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgY29uc3QgcG9zdGl0SWQgPSBldmVudC5kYXRhVHJhbnNmZXIhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xyXG4gICAgcG9zdGl0cy5tb3ZlUG9zdGl0KHBvc3RpdElkLCB0aGlzLnN0YXR1cyk7XHJcbiAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgIGxpc3RFbC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBhYmxlXCIpO1xyXG4gIH1cclxuXHJcbiAgQGF1dG9iaW5kXHJcbiAgZHJhZ0xlYXZlSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICBjb25zdCBsaXN0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgIGxpc3RFbC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBhYmxlXCIpO1xyXG4gIH1cclxuXHJcbiAgY29uZmlndXJlKCkge1xyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSEudGV4dENvbnRlbnQgPSB0aGlzLnN0YXR1cy50b1N0cmluZygpO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgdGhpcy5kcmFnT3ZlckhhbmRsZXIpO1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgdGhpcy5kcmFnTGVhdmVIYW5kbGVyKTtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCB0aGlzLmRyb3BIYW5kbGVyKTtcclxuXHJcbiAgICBwb3N0aXRzLmFkZExpc3RlbmVyKChwb3N0aXQ6IFBvc3RpdFtdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlbGV2YW50UHJvamVjdHMgPSBwb3N0aXQuZmlsdGVyKChwcmopID0+IHtcclxuICAgICAgICByZXR1cm4gcHJqLnN0YXR1cyA9PT0gdGhpcy5zdGF0dXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmFzc2lnbmVkUG9zdGl0cyA9IHJlbGV2YW50UHJvamVjdHM7XHJcbiAgICAgIHRoaXMucmVuZGVyUG9zdGl0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbmRlclBvc3RpdHMoKSB7XHJcbiAgICBjb25zdCBsaXN0SWQgPSBgJHt0aGlzLnN0YXR1cy50b1N0cmluZygpfS1wb3N0LWl0LWxpc3RgO1xyXG4gICAgY29uc3QgbGlzdEVsID0gZG9jdW1lbnRcclxuICAgICAgLmdldEVsZW1lbnRCeUlkKGAke3RoaXMuc3RhdHVzLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKX0tcG9zdC1pdGApIVxyXG4gICAgICAucXVlcnlTZWxlY3RvcihcInVsXCIpITtcclxuICAgIGxpc3RFbC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgbGlzdEVsLmlkID0gbGlzdElkO1xyXG5cclxuICAgIGZvciAoY29uc3QgcG9zdGl0SXRlbSBvZiB0aGlzLmFzc2lnbmVkUG9zdGl0cykge1xyXG4gICAgICBuZXcgUG9zdGl0Q29tcG9uZW50KHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwidWxcIikhLmlkLCBwb3N0aXRJdGVtKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5wdXRDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnQvcG9zdGl0LWlucHV0XCI7XHJcbmltcG9ydCB7IFBvc3RpdExpc3RDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnQvcG9zdGl0LWxpc3RcIjtcclxuaW1wb3J0IHsgU3RhdHVzIH0gZnJvbSBcIi4vbW9kZWxzL3N0YXR1c1wiO1xyXG5cclxubmV3IElucHV0Q29tcG9uZW50KCk7XHJcbm5ldyBQb3N0aXRMaXN0Q29tcG9uZW50KFN0YXR1cy5VbmFzc2lnbmVkKTtcclxubmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlN0YXJ0KTtcclxubmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLkNvbnRpbnVlKTtcclxubmV3IFBvc3RpdExpc3RDb21wb25lbnQoU3RhdHVzLlN0b3ApO1xyXG5cclxuY29uc29sZS5sb2coXCJoZWxsbyBmcmllbmRcIik7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=