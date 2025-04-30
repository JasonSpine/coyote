import {Dsl} from "../../internal/dsl";
import {beforeEach, describe, saveScreenshotAfterFailedTest, test} from "../../internal/playwright";

saveScreenshotAfterFailedTest('FAILURE.png');
beforeEach(dsl => dsl.beforeEach());

describe('Payment includes VAT.', () => {
  describe('VAT is included based on country.', () => {
    test('For Poland, VAT is included.', async (dsl: Dsl) => {
      await dsl.fillInvoice({countryCode: 'PL', vatId: '1234 1234 12'});
      await dsl.assertInvoiceVatTax('included');
    });
    describe('Given a country in EU other than Poland,', () => {
      test('Given Vat-Id is provided, VAT is not included.', async (dsl: Dsl) => {
        await dsl.fillInvoice({countryCode: 'DE', vatId: '123 123 123'});
        await dsl.assertInvoiceVatTax('free');
      });
      test('Given Vat-Id is not provided, VAT is included.', async (dsl: Dsl) => {
        await dsl.fillInvoice({countryCode: 'DE', vatId: ''});
        await dsl.assertInvoiceVatTax('included');
      });
    });
    test('Given a country outside of EU, VAT is included.', async (dsl: Dsl) => {
      await dsl.fillInvoice({countryCode: 'UA', vatId: ''});
      await dsl.assertInvoiceVatTax('included');
    });
  });
});
