import { Testimony } from './testimony';

export class ExecutionFact {
  constructor(
    public readonly id: string ='',
    public readonly startTime: Date = new Date(),
    public readonly finishTime: Date | null = null,
    public readonly executorFullName: string ='',
    public readonly executorId: string ='',
    public readonly templateName: string ='',
    public readonly testimonies: Testimony[] = [],
    public readonly description: string ='' 
  ) {}
}
