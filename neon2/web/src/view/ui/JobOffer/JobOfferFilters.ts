import {JobOfferFilter} from "../../../jobOfferFilter";

export function emptyJobOfferFilter(): JobOfferFilter {
  return {
    legalForms: [],
    locations: [],
    searchPhrase: '',
    sort: 'promoted',
    tags: [],
    workExperiences: [],
    workModes: [],
  };
}
