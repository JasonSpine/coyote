export interface JobOffer {
  title: string;
  publishDate: string;
  salaryTo: number;
}

type JobOffersListener = (jobOffers: JobOffer[]) => void;
export type OrderBy = 'most-recent'|'highest-salary';

export class Filters {
  private jobOffers: JobOffer[] = [];
  private updateListener: JobOffersListener|null = null;
  private orderBy: OrderBy = 'most-recent';
  private searchPhrase: string = '';
  private minimumSalary: number = 0;

  onUpdate(listener: JobOffersListener): void {
    this.updateListener = listener;
  }

  addJobOffer(jobOffer: JobOffer): void {
    this.jobOffers.push(jobOffer);
    this.update();
  }

  filter(searchPhrase: string): void {
    this.searchPhrase = searchPhrase;
    this.update();
  }

  filterBySalary(minimumSalary: number): void {
    this.minimumSalary = minimumSalary;
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

  private update(): void {
    if (this.updateListener) {
      this.updateListener(this.filteredJobOffersInOrder());
    }
  }

  private filteredJobOffersInOrder(): JobOffer[] {
    const offers = this.jobOffers
      .filter(offer => offer.title.includes(this.searchPhrase))
      .filter(offer => offer.salaryTo >= this.minimumSalary)
    ;
    this.sortInPlace(offers);
    return offers;
  }

  private sortInPlace(offers: JobOffer[]): void {
    if (this.orderBy === 'most-recent') {
      offers.sort((offer1: JobOffer, offer2: JobOffer): number => {
        return offer1.publishDate > offer2.publishDate ? -1 : 1;
      });
    } else {
      offers.sort((offer1: JobOffer, offer2: JobOffer): number => {
        return offer1.salaryTo > offer2.salaryTo ? -1 : 1;
      });
    }
  }
}
