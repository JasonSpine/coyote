import {BackendJobOfferLocation} from "../../../backend";
import {JobOffer} from "../../../jobBoard";
import {Currency, LegalForm, Rate, SubmitJobOffer, WorkExperience, WorkMode} from "../../../main";
import {parseWorkMode} from "../../../workMode";

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
  companyWebsiteUrl: string|null;
  companyDescription: string|null;
  companyFundingYear: number|null;
  companySizeLevel: number|null;
  applyExternally: boolean;
}

export function toJobOfferShow(jobOffer: JobOffer): JobOfferShow {
  return {
    ...jobOffer,
    applyExternally: jobOffer.applicationMode === 'external-ats',
    locationCities: locationCities(jobOffer.locations),
  };
}

export function fromSubmitToJobOfferShow(submit: SubmitJobOffer, expiresInDays: number): JobOfferShow {
  return {
    expiresInDays,
    ...submit,
    applyExternally: submit.applicationMode === 'external-ats',
    locationCities: locationCities(submit.locations),
    workMode: parseWorkMode(submit.workModeRemoteRange),
  };
}

function locationCities(locations: BackendJobOfferLocation[]): string[] {
  return locations
    .map(location => location.city)
    .filter(city => city !== null);
}
