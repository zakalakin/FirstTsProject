/// <reference path = "../util/validation.ts"/>

namespace App {
  type Listener = (items: Postit[]) => void;

  export class Postits {
    private listeners: Listener[] = [];

    postitList: Postit[] = [];

    hostElement?: HTMLElement;
    postitTemplate?: HTMLTemplateElement;
    postitElement?: HTMLElement;

    private static _Postits: Postits;

    private constructor() {}

    static getInstance() {
      if (this._Postits) {
        return this._Postits;
      }
      this._Postits = new Postits();

      return this._Postits;
    }

    addListener(listenerFn: Listener) {
      this.listeners.push(listenerFn);
    }

    addPostit(postit: Postit): boolean {
      const validation = this.Validation(postit);

      if (validation) {
        this.postitList.push(postit);

        this.updateListeners();
      }

      return validation;
    }

    movePostit(id: string, newStatus: Status) {
      const postit = this.postitList.filter((postit) => postit.id === id)[0];

      if (postit && postit.status !== newStatus) {
        postit.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.postitList.slice());
      }
    }

    private Validation(project: Postit): boolean {
      const titleValidatable: Validatable = {
        value: project.title,
        required: false,
        minLength: 0,
        maxLength: 14,
      };

      const descriptionValidatable: Validatable = {
        value: project.description,
        required: true,
        minLength: 1,
        maxLength: 140,
      };

      const valueValidatable: Validatable = {
        value: project.status,
        required: true,
        minValue: 0,
        maxValue: 3,
      };

      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(valueValidatable)
      ) {
        return false;
      }
      return true;
    }
  }

  export const postits = Postits.getInstance();
}
