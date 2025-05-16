import {CanEdit} from "../ui";

export class Policy {
  constructor(private isAuthenticated: boolean, private canEdit: CanEdit) {}

  createCreateJobOffer(): boolean {
    return this.isAuthenticated;
  }

  canEditJobOffer(jobOfferId: number): boolean {
    return this.isAuthenticated && this.canEdit(jobOfferId);
  }
}
