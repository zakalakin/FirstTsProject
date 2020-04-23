import { Validatable } from "../util/validation";
import { validate } from "../util/validation";
import { Postit } from "../models/postit";
import { PostitListComponent } from "../component/postit-column";

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

    if (postit.status === "") {
      postit.status = "unsorted";
    }

    if (validation) {
      this.postitList.push(postit);
      this.updateListeners();

      const colEl = document.getElementById(
        `${postit.status.toLowerCase().replace(" ", "-")}-column`
      );

      if (!colEl) {
        new PostitListComponent(postit.status);
        this.updateListeners();
      }
    }

    return validation;
  }

  movePostit(id: string, newStatus: string) {
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
      required: false,
      minLength: 0,
      maxLength: 30,
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
