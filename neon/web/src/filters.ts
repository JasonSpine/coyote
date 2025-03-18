export interface JobOffer {
  title: string;
  url: string;
  publishDate: string;
  salaryTo: number|null;
  salaryFrom: number|null;
  salaryCurrency: Currency|null;
  salaryIsNet: boolean|null;
  salaryRate: Rate|null;
  workMode: WorkMode;
  locations: string[];
  companyName: string|null;
  companyLogoUrl: string|null;
  tagNames: string[];
  legalForm: LegalForm;
}

export type WorkMode = 'fullyRemote'|'stationary'|'hybrid';
export type LegalForm = 'fullTime'|'contract'|'partTime';
export type Currency = 'PLN'|'EUR'|'USD'|'GBP'|'CHF';
export type Rate = 'hourly'|'monthly'|'weekly'|'yearly';

type JobOffersListener = (jobOffers: JobOffer[]) => void;
export type OrderBy = 'most-recent'|'highest-salary'|'lowest-salary';

type Predicate<T> = (argument: T) => boolean;
type Function<I, O> = (argument: I) => O;

export class Filters {
  private jobOffers: JobOffer[] = [];
  private updateListener: JobOffersListener|null = null;
  private orderBy: OrderBy = 'most-recent';
  private _searchPhrase: string = '';
  private minimumSalary: number = 0;
  private workModeRemote: boolean = false;
  private workModeHybrid: boolean = false;
  private locations: string[] = [];
  private tags: string[] = [];

  clearFilters(): void {
    this._searchPhrase = '';
    this.locations = [];
    this.tags = [];
    this.minimumSalary = 0;
    this.workModeRemote = false;
    this.workModeHybrid = false;
    this.orderBy = 'most-recent';
    this.update();
  }

  onUpdate(listener: JobOffersListener): void {
    this.updateListener = listener;
  }

  addJobOffer(jobOffer: JobOffer): void {
    this.jobOffers.push(jobOffer);
    this.update();
  }

  filter(searchPhrase: string): void {
    this._searchPhrase = searchPhrase;
    this.update();
  }

  filterBySalary(minimumSalary: number): void {
    this.minimumSalary = minimumSalary;
    this.update();
  }

  filterByWorkModeRemote(workModeRemote: boolean): void {
    this.workModeRemote = workModeRemote;
    this.update();
  }

  filterByWorkModeHybrid(workModeHybrid: boolean): void {
    this.workModeHybrid = workModeHybrid;
    this.update();
  }

  filterByLocation(locations: string[]): void {
    this.locations = locations;
    this.update();
  }

  filterByTags(tags: string[]): void {
    this.tags = tags;
    this.update();
  }

  sortByPublishDate(): void {
    this.sort('most-recent');
  }

  sortByHighestSalary(): void {
    this.sort('highest-salary');
  }

  sort(order: OrderBy): void {
    this.orderBy = order;
    this.update();
  }

  availableLocations(): string[] {
    return this.flatMap(offer => offer.locations);
  }

  availableTags(): string[] {
    return this.flatMap(offer => offer.tagNames);
  }

  private flatMap(simplifier: Function<JobOffer, string[]>): string[] {
    return [...new Set(this.jobOffers.flatMap(simplifier))];
  }

  availableSalaries(): number[] {
    return [5000, 10000, 15000, 20000, 25000, 30000];
  }

  searchPhrase(): string {
    return this._searchPhrase;
  }

  private update(): void {
    if (this.updateListener) {
      this.updateListener(this.filteredJobOffersInOrder());
    }
  }

  private filteredJobOffersInOrder(): JobOffer[] {
    const offers = this.jobOffers
      .filter(offer => offer.title.toLowerCase().includes(this._searchPhrase.toLowerCase()))
      .filter(offer => offer.salaryTo >= this.minimumSalary)
      .filter(offer => this.matchesByLocation(offer))
      .filter(offer => this.matchesByTag(offer))
      .filter(offer => this.matchesByWorkMode(offer));
    this.sortInPlace(offers);
    return offers;
  }

  private matchesByLocation(offer: JobOffer): boolean {
    return this.matchesByPredicate(this.locations, location => offer.locations.includes(location));
  }

  private matchesByTag(offer: JobOffer): boolean {
    return this.matchesByPredicate(this.tags, tag => offer.tagNames.includes(tag));
  }

  private matchesByPredicate(options: string[], predicate: Predicate<string>): boolean {
    if (options.length === 0) {
      return true;
    }
    return options.filter(predicate).length > 0;
  }

  private matchesByWorkMode(offer: JobOffer): boolean {
    const list = this.workModes();
    if (list.length === 0) {
      return true;
    }
    return list.includes(offer.workMode);
  }

  private workModes(): WorkMode[] {
    const list: WorkMode[] = [];
    if (this.workModeHybrid) {
      list.push('hybrid');
    }
    if (this.workModeRemote) {
      list.push('fullyRemote');
    }
    return list;
  }

  private sortInPlace(offers: JobOffer[]): void {
    if (this.orderBy === 'most-recent') {
      offers.sort((offer1: JobOffer, offer2: JobOffer): number => {
        return offer1.publishDate > offer2.publishDate ? -1 : 1;
      });
    }
    if (this.orderBy === 'highest-salary') {
      offers.sort((offer1: JobOffer, offer2: JobOffer): number => {
        return offer1.salaryTo > offer2.salaryTo ? -1 : 1;
      });
    }
    if (this.orderBy === 'lowest-salary') {
      offers.sort((offer1: JobOffer, offer2: JobOffer): number => {
        return offer1.salaryTo < offer2.salaryTo ? -1 : 1;
      });
    }
  }

  count(): number {
    let count = 0;
    if (this._searchPhrase.length > 0) {
      count++;
    }
    if (this.locations.length > 0) {
      count++;
    }
    if (this.workModeRemote) {
      count++;
    }
    if (this.workModeHybrid) {
      count++;
    }
    if (this.tags.length > 0) {
      count++;
    }
    if (this.minimumSalary > 0) {
      count++;
    }
    return count;
  }
}
