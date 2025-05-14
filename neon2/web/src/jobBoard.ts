import {BackendJobOfferLocation} from "./backend";
import {
  ApplicationMode,
  Currency,
  HiringType,
  JobOfferFilters,
  LegalForm,
  Rate,
  SubmitJobOffer,
  WorkExperience,
  WorkMode,
} from "./main";

interface JobBoardObserver {
  (jobOffers: JobOffer[]): void;
}

export class JobBoard {
  private readonly jobOffers: JobOffer[];

  constructor(private observe: JobBoardObserver) {
    this.jobOffers = [];
  }

  count(): number {
    return this.jobOffers.length;
  }

  jobOfferCreated(jobOffer: JobOffer): void {
    this.jobOffers.push(jobOffer);
    this.updateView();
  }

  jobOfferUpdated(id: number, jobOffer: SubmitJobOffer): void {
    const originalJobOffer = this.findJobOffer(id);
    Object.assign(originalJobOffer, jobOffer);
    this.updateView();
  }

  private findJobOffer(id: number): JobOffer {
    const jobOffer = this.jobOffers.find(o => o.id === id);
    if (jobOffer) {
      return jobOffer;
    }
    throw new Error('No such job offer.');
  }

  updateView(): void {
    this.observe(copyArray<JobOffer>(this.jobOffers.filter(offer => offer.status === 'published')));
  }

  jobOfferPaid(jobOfferId: number): void {
    this.findJobOffer(jobOfferId).status = 'published';
    this.updateView();
  }

  jobOfferFilters(): JobOfferFilters {
    return {
      locations: [...new Set(this.jobOffers.flatMap(offer => jobOfferCities(offer)))],
      tags: [...new Set(this.jobOffers.flatMap(offer => offer.tagNames))],
    };
  }
}

export function jobOfferCities(jobOffer: JobOffer): string[] {
  return jobOffer.locations
    .map(location => location.city)
    .filter(city => city !== null);
}

export interface JobOffer {
  id: number;
  expiresInDays: number;
  status: 'published'|'awaitingPayment';
  isNew: boolean;
  isFavourite: boolean;
  applicationUrl: string;
  slug: string;
  canEdit: boolean;
  title: string;
  description: string|null;
  salaryRangeFrom: number|null;
  salaryRangeTo: number|null;
  salaryIsNet: boolean;
  salaryCurrency: Currency;
  salaryRate: Rate;
  locations: BackendJobOfferLocation[];
  tagNames: string[];
  workMode: WorkMode;
  legalForm: LegalForm;
  experience: WorkExperience;
  applicationMode: ApplicationMode,
  applicationEmail: string|null,
  applicationExternalAts: string|null,
  companyName: string;
  companyLogoUrl: string|null;
  companyWebsiteUrl: string|null;
  companyDescription: string|null;
  companyPhotoUrls: string[];
  companyVideoUrl: string|null;
  companySizeLevel: number|null;
  companyFundingYear: number|null;
  companyAddress: BackendJobOfferLocation|null;
  companyHiringType: HiringType;
}

function copyArray<T>(array: T[]): T[] {
  return array.map(object => ({...object}));
}
