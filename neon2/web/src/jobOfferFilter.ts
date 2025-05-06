import {LegalForm, WorkExperience, WorkMode} from "./main";

export interface JobOfferFilter {
  searchPhrase: string,
  tags: string[],
  locations: string[],
  workModes: WorkMode[],
  legalForms: LegalForm[],
  workExperiences: WorkExperience[],
  sort: OrderBy,
}

export type OrderBy = 'promoted'|'most-recent'|'highest-salary'|'lowest-salary';
