export class Participant {
  constructor(
    public readonly id: string = 'placeholder',
    public readonly fullName: string = 'placeholder',
    public readonly email: string = 'placeholder',
    public readonly role: Role = new Role('Participant'),
    public readonly jwt: string = 'placeholder'
  ) {}

  public equals(other: Participant) {
    return this.id === other.id;
  }
}

export class Role {
  constructor(public readonly name: string) {}
}
