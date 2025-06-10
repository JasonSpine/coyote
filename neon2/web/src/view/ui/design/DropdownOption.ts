import {IconName} from "../icons/icons";

export interface DropdownOption<T extends string> {
  value: T;
  title: string;
  icon?: IconName;
}
