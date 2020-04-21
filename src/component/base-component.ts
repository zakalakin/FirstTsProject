namespace App {
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      tempalteId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        tempalteId
      )! as HTMLTemplateElement;

      this.hostElement = document.getElementById(hostElementId)! as T;

      const formNode = document.importNode(this.templateElement.content, true);
      this.element = formNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    abstract configure(): void;

    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtStart ? "afterbegin" : "beforeend",
        this.element
      );
    }
  }
}
