import {Dsl} from "../../internal/dsl";
import {beforeEach, describe, saveScreenshotAfterFailedTest, test} from "../../internal/playwright";

saveScreenshotAfterFailedTest('FAILURE.png');
beforeEach(dsl => dsl.beforeEach());

describe('Job offer contains various job offer fields.', () => {
  test('Job offer has job description.', async (dsl: Dsl) => {
    await dsl.publishJobOffer({title: 'Offer', description: 'Young, dynamic team'});
    await dsl.assertJobOfferField({jobOfferTitle: 'Offer', expectedDescription: 'Young, dynamic team'});
  });
});
