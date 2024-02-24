export class Participant {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly jwt: string
  ) {}

  public equals(other: Participant) {
    return this.id === other.id;
  }
}

export class Role {
  constructor(public readonly name: string) {}
}
