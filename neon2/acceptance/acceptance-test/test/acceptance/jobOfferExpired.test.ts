import {Dsl} from "../../internal/dsl";
import {beforeEach, describe, saveScreenshotAfterFailedTest, test} from "../../internal/playwright";

saveScreenshotAfterFailedTest('FAILURE.png');
beforeEach(dsl => dsl.beforeEach());

describe('An expired job offer is not listed in search, but can still be accessed.', () => {
  test('An expired job offer is not listed in search.', async (dsl: Dsl) => {
    await dsl.publishJobOffer({title: 'Expired', expired: true});
    await dsl.assertJobOfferIsNotListed({jobOfferTitle: 'Expired'});
  });
  test('An expired job offer can be accessed directly.', async (dsl: Dsl) => {
    await dsl.publishJobOffer({title: 'Expired', expired: true});
    await dsl.assertJobOfferMineListed({jobOfferTitle: 'Expired'});
  });
});
