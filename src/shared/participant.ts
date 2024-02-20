export class Participant {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly jwt: string
  ) {}
}

class Role {
  constructor(public readonly name: string) {}
}
