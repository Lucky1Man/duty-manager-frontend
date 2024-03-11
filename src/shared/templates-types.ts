import { Template } from './template';

export type TemplateFilter = (template: Template) => boolean;

export type CreateTemplate = {
  name: string;
  description: string;
};

export type UpdateTemplate = {
  id: string;
  name?: string;
  description?: string;
};
