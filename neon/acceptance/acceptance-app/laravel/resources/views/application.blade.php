<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  var jobOffers = {!! json_encode($jobOffers); !!}
</script>

@verbatim
  <div id="vueApplication">
    <select :data-testid="sortField.testId" v-model="sortModel">
      <option v-for="option in sortField.options" :value="option.value" v-text="option.title"/>
    </select>
    <input data-testid="jobOfferSearchPhrase" v-model="state.searchPhrase">
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
      <select :data-testid="sortField.testId" v-model="sortModel">
        <option
            v-for="option in sortField.options"
            :value="option.value"
            v-text="option.title"/>
      </select>
      <button data-testid="jobOfferSearch" @click="search">
        Pokaż oferty
      </button>
    </footer>
  </div>

  <script>
    const {createApp, ref, reactive, computed} = Vue;

    createApp({
      setup() {
        const initialJobOffers = window['jobOffers'];

        const state = reactive({
          sort: 'default',
          searchPhrase: '',
          jobOffers: initialJobOffers.map(jobOffer => ({
            title: jobOffer.title,
            testId: 'jobOfferTitle',
          })),
        });

        const sortField = {
          testId: 'jobOfferSort',
          options: [
            {value: 'default', title: 'Bez sortowania'},
            {value: 'most-recent', title: 'Najnowsze'},
            {value: 'highest-salary', title: 'Najwyższe wynagrodzenie'},
          ],
        };
        const sortModel = computed({
          get() {
            return state.sort;
          },
          set(newValue) {
            state.sort = newValue;
          },
        });

        function search() {
          const offers = initialJobOffers.filter(offer => offer.title.indexOf(state.searchPhrase) > -1);
          if (sortModel.value === 'most-recent') {
            offers.sort((a, b) => {
              return a.publishDate > b.publishDate ? -1 : 1;
            });
          }
          if (sortModel.value === 'highest-salary') {
            offers.sort((a, b) => {
              return a.salaryTo > b.salaryTo ? -1 : 1;
            });
          }
          state.jobOffers = offers.map(jobOffer => ({
            title: jobOffer.title,
            testId: 'jobOfferTitle',
          }));
        }

        return {
          sortModel,
          search,
          sortField,
          state,
        };
      },
    }).mount('#vueApplication');
  </script>
@endverbatim
