import {JobOffer} from "../../jobBoard";
import {LocationProvider} from "../../locationProvider/LocationProvider";
import {Country, JobOfferFilters, PaymentSummary, PricingPlan, UploadAssets, VatIdState} from "../../main";
import {PaymentNotification} from "../../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../../paymentProvider/PaymentService";
import {Toast} from "../view";
import {PlanBundle, Screen, UiController, ViewListener} from "./ui";

export interface JobBoardProperties {
  viewListener: ViewListener|null;
  jobOffers: JobOffer[];
  jobOfferFilters: JobOfferFilters;
  screen: Screen;
  toast: Toast|null;
  currentJobOfferId: number|null;
  paymentNotification: PaymentNotification|null;
  paymentStatus: PaymentStatus|null;
  planBundle: PlanBundle|null;
  pricingPlan: PricingPlan|null;
  upload: UploadAssets|null;
  applicationEmail: string|null;
  paymentSummary: PaymentSummary|null;
  paymentVatIdState: VatIdState;
  invoiceCountries: Country[]|null;
  locationProvider: LocationProvider|null;
  uiController: UiController;
}
