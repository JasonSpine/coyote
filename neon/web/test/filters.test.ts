import {Filters, JobOffer} from "../src/filters";
import {assertEquals, assertTrue, test} from "./assertion";

function addJobOffer(filters: Filters, {title, publishDate, salaryTo}: { title: string, publishDate?: string, salaryTo?: number }): void {
  filters.addJobOffer({
    title,
    publishDate: publishDate || '2000-01-01',
    salaryTo: salaryTo || 1000,
  });
}

test('job offer update listener is called, when job offer is added', () => {
  const filters = new Filters();
  let wasCalled = false;
  filters.onUpdate(jobOffer => {
    wasCalled = true;
  });
  addJobOffer(filters, {title: 'Java Developer'});
  assertTrue(wasCalled);
});

test('job offers are passed to job offer update listener', () => {
  const filters = new Filters();
  filters.onUpdate(jobOffers => {
    assertEquals('Java Developer', jobOffers[0].title);
  });
  addJobOffer(filters, {title: 'Java Developer'});
});

test('previous job offers are passed to job offer update listener', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'Kotlin Developer'});
  filters.onUpdate(jobOffers => {
    assertEquals(['Kotlin Developer', 'Java Developer'], titles(jobOffers));
  });
  addJobOffer(filters, {title: 'Java Developer'});
});

test('update listener is called, when sort is updated', () => {
  const filters = new Filters();
  let wasCalled = false;
  filters.onUpdate(jobOffer => {
    wasCalled = true;
  });
  filters.sortByPublishDate();
  assertTrue(wasCalled);
});

function titles(jobOffers: JobOffer[]): string[] {
  return jobOffers.map(o => o.title);
}

test('job offers are sorted by publish date', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'Java Developer', publishDate: '2000-01-01'});
  addJobOffer(filters, {title: 'Kotlin Developer', publishDate: '2002-02-02'});
  filters.onUpdate(jobOffers => {
    assertEquals(['Kotlin Developer', 'Java Developer'], titles(jobOffers));
  });
  filters.sortByPublishDate();
});

test('job offers are sorted by highest salary', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'JS Developer', salaryTo: 1000});
  addJobOffer(filters, {title: 'Java Developer', salaryTo: 1200});
  filters.onUpdate(jobOffers => {
    assertEquals(['Java Developer', 'JS Developer'], titles(jobOffers));
  });
  filters.sortByHighestSalary();
});

test('filter by search phrase calls listener', () => {
  const filters = new Filters();
  let wasCalled = false;
  filters.onUpdate(jobOffer => {
    wasCalled = true;
  });
  filters.filter('');
  assertTrue(wasCalled);
});

test('job offers are filtered by search phrase', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'Python Developer'});
  addJobOffer(filters, {title: 'Java Developer'});
  filters.onUpdate(jobOffers => {
    assertEquals(['Python Developer'], titles(jobOffers));
  });
  filters.filter('Python');
});

test('job offers are filtered by minimal salary', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'Python Developer', salaryTo: 1000});
  addJobOffer(filters, {title: 'Java Developer', salaryTo: 1200});
  filters.onUpdate(jobOffers => {
    assertEquals(['Java Developer'], titles(jobOffers));
  });
  filters.filterBySalary(1100);
});

test('filtering job offer by exact salary does not filter it out', () => {
  const filters = new Filters();
  addJobOffer(filters, {title: 'Java Developer', salaryTo: 1200});
  filters.onUpdate(jobOffers => {
    assertEquals(['Java Developer'], titles(jobOffers));
  });
  filters.filterBySalary(1200);
});
