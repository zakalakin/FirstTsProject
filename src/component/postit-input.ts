/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/postit-column.ts" />

namespace App {
  export class InputComponent extends Component<
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
        "#people"
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
        +this.valueInputElement.value
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
}
