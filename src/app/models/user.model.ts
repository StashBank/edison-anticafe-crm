
export class User {
  public id: string;
  public login: string;
  public email: string;
  public phone: string;
  public isAdmin: boolean;
  public active: boolean;

  get name(): string {
    return this.login;
  }

  constructor(args) {
    this.id = args && args.id;
    this.login = args && args.login;
    this.email = args && args.email;
    this.phone = args && args.phone;
    this.isAdmin = args && args.isAdmin;
    this.active = args && args.active;
  }
}
