import { ComponentPostit } from "./component-postit";
// import { autobind } from "../decorators/autobind";

export class ColumnHolderComponent extends ComponentPostit<
  HTMLDivElement,
  HTMLElement
> {
  constructor() {
    super("column-holder-template", "app", false, "column-holder");

    this.configure();
  }

  configure() {}
}
