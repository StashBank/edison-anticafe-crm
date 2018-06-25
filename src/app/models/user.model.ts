
export class User {
  public id: string;
  public name: string;

  constructor(args) {
    this.id = args && args.id;
    this.name = args && args.login;
  }
}
