namespace App {
  export enum Status {
    Unassigned,
    Start,
    Continue,
    Stop,
  }

  export class Postit {
    id: string;
    title: string;
    description: string;
    status: Status;

    constructor(t: string, d: string, status: Status) {
      this.title = t.trim();
      this.description = d.trim();
      this.status = status;
      this.id = Math.random().toString();
    }
  }
}
