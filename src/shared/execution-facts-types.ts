import { ExecutionFact } from './execution-fact';

export type ExecutionFactLoadParameters = {
  from: Date;
  to: Date;
};

export type ExecutionFactFilter = (executionFact: ExecutionFact) => boolean;

export type FactsLoadParametersApplier = (loadParams: ExecutionFactLoadParameters) => void;

export type RecordExecutionFact = {
  templateId: string;
  description: string;
  instant: boolean;
};