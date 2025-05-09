import {BackendJobOfferLocation} from "../../../backend";
import {JobOffer} from "../../../jobBoard";
import {Currency, LegalForm, Rate, SubmitJobOffer, WorkExperience, WorkMode} from "../../../main";

export interface JobOfferShow {
  title: string;
  description: string|null;
  expiresInDays: number;
  locationCities: string[];
  tagNames: string[];
  workMode: WorkMode;
  legalForm: LegalForm;
  experience: WorkExperience;
  salaryRangeFrom: number|null;
  salaryRangeTo: number|null;
  salaryIsNet: boolean;
  salaryCurrency: Currency;
  salaryRate: Rate;
  companyName: string;
  companyLogoUrl: string|null;
  companyWebsiteUrl: string|null,
  companyDescription: string|null,
  companyFundingYear: number|null,
  companySizeLevel: number|null,
}

export function toJobOfferShow(jobOffer: JobOffer): JobOfferShow {
  return {
    ...jobOffer,
    locationCities: locationCities(jobOffer.locations),
  };
}

export function fromSubmitToJobOfferShow(submit: SubmitJobOffer, expiresInDays: number): JobOfferShow {
  return {
    expiresInDays,
    ...submit,
    locationCities: locationCities(submit.locations),
  };
}

function locationCities(locations: BackendJobOfferLocation[]): string[] {
  return locations
    .map(location => location.city)
    .filter(city => city !== null);
}
