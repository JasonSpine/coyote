import {Dsl} from "../../internal/dsl";
import {beforeEach, describe, test} from "../../internal/playwright";

beforeEach(dsl => dsl.beforeEach());

describe('Plan bundles can not be redeemed by unauthorized http request.', () => {
  test('Given an unpublished job offer, when an unauthorized redeem request is performed, the job offer is not published.', async (dsl: Dsl) => {
    const title = dsl.encodeName('Cheating offer');
    const jobOfferCreatedId = await dsl.http!.createJobOfferReturnId(title, 'premium');
    await dsl.http!.redeemBundle(jobOfferCreatedId, userId());
    await dsl.resetClient();
    await dsl.assertJobOfferIsNotListed({jobOfferTitle: 'Cheating offer'});
  });
});

function userId(): number {
  return parseInt(Math.random().toString().substring(2));
}
