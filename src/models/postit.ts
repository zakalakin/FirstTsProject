export class Postit {
  id: string;
  title: string;
  description: string;
  status: string;

  constructor(t: string, d: string, status: string) {
    this.title = t.trim();
    this.description = d.trim();
    this.status = status;
    this.id = Math.random().toString();
  }
}
