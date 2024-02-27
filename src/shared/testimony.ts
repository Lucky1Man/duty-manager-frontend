export class Testimony {
  constructor(
    public readonly id: string,
    public readonly witnessId: string,
    public readonly witnessFullName: string,
    public readonly executionFactId: string,
    public readonly templateName: string,
    public readonly timestamp: string
  ) {}
}
