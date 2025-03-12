import {createApp, reactive} from "vue";
import {Filters, OrderBy} from "./filters";

interface BackendJobOffer {
  title: string;
  salaryTo: number;
  publishDate: string;
}

interface VueJobOffer {
  title: string;
  testId: string;
}

const app = createApp({
  template: `
    <select :data-testid="sortField.testId" v-model="state.sort">
      <option v-for="option in sortField.options" :value="option.value" v-text="option.title"/>
    </select>
    <input data-testid="jobOfferSearchPhrase" v-model="state.searchPhrase">
    <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
    <button data-testid="jobOfferSearch" @click="search">
      Szukaj
    </button>
    <ul>
      <li
        v-for="jobOffer in state.jobOffers"
        :data-testid="jobOffer.testId"
        v-text="jobOffer.title"/>
    </ul>
    <footer>
      <select :data-testid="sortField.testId" v-model="state.sort">
        <option
          v-for="option in sortField.options"
          :value="option.value"
          v-text="option.title"/>
      </select>
      <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
      <button data-testid="jobOfferSearch" @click="search">
        Pokaż oferty
      </button>
    </footer>
  `,
  setup() {
    const initialJobOffers: BackendJobOffer[] = window['jobOffers'];

    const state = reactive({
      jobOffers: [] as VueJobOffer[],
      searchPhrase: '',
      minimumSalary: 0,
      sort: 'most-recent' as OrderBy,
    });

    const filters = new Filters();
    filters.onUpdate(jobOffers => {
      state.jobOffers = jobOffers.map(jobOffer => ({
        title: jobOffer.title,
        testId: 'jobOfferTitle',
      }));
    });

    initialJobOffers.forEach(jobOffer => {
      filters.addJobOffer({
        title: jobOffer.title,
        salaryTo: jobOffer.salaryTo,
        publishDate: jobOffer.publishDate,
      });
    });

    const sortField = {
      type: 'singleSelect',
      testId: 'jobOfferSort',
      options: [
        {value: 'most-recent', title: 'Najnowsze'},
        {value: 'highest-salary', title: 'Najwyższe wynagrodzenie'},
      ],
    };

    function search(): void {
      filters.filter(state.searchPhrase);
      filters.filterBySalary(state.minimumSalary);
      filters.sort(state.sort);
    }

    return {search, sortField, state};
  },
});
app.mount('#vueApplication');
