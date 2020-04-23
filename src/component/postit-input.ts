import { ComponentPostit } from "./component-postit";
import { postits } from "../state/postits";
import { Postit } from "../models/postit";

export class InputComponent extends ComponentPostit<
  HTMLDivElement,
  HTMLFormElement
> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  valueInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", false, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.valueInputElement = this.element.querySelector(
      "#status"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  private submitHandler(event: Event) {
    event.preventDefault();

    const postit = new Postit(
      this.titleInputElement.value,
      this.descriptionInputElement.value,
      this.valueInputElement.value.toUpperCase()
    );

    const postitValidation = postits.addPostit(postit);

    if (postitValidation) {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.valueInputElement.value = "";
    } else {
      alert(`invlaid input: ${"Invalid input"}`);
    }
  }
}
