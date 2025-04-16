import {Dsl} from "../../internal/dsl";
import {beforeEach, describe, test} from "../../internal/playwright";

beforeEach(dsl => dsl.beforeEach());

describe('Plan bundles can not be redeemed by unauthorized http request.', () => {
  test('Given no plan bundle, when an unauthorized redeem request is performed, the job offer is not published.', async (dsl: Dsl) => {
    const title = dsl.encodeName('Cheating offer');
    const jobOfferCreatedId = await dsl.http!.createJobOfferReturnId(title, 'premium');
    await dsl.http!.redeemBundle(jobOfferCreatedId, newUserId());
    await dsl.resetClient();
    await dsl.assertJobOfferIsNotListed({jobOfferTitle: 'Cheating offer'});
  });

  test('Given an empty plan bundle, when an unauthorized redeem request is performed, the job offer is not published.', async (dsl: Dsl) => {
    await setupEmptyPlanBundle(dsl);
    const jobOfferCreatedId = await createJobOfferPaid(dsl, 'Cheating offer');
    await dsl.http!.redeemBundle(jobOfferCreatedId, dsl.userId());
    await dsl.resetClient();
    await dsl.assertJobOfferIsNotListed({jobOfferTitle: 'Cheating offer'});
  });
});

async function setupEmptyPlanBundle(dsl: Dsl): Promise<void> {
  await dsl.publishJobOffer({title: 'Purchase a bundle', plan: 'strategic'});
  await dsl.publishJobOffer({title: 'Empty the bundle 1', payment: 'redeem-bundle'});
  await dsl.publishJobOffer({title: 'Empty the bundle 2', payment: 'redeem-bundle'});
}

async function createJobOfferPaid(dsl: Dsl, name: string) {
  const title = dsl.encodeName(name);
  return await dsl.http!.createJobOfferReturnId(title, 'premium');
}

function newUserId(): number {
  return parseInt(Math.random().toString().substring(2));
}
