import {IconName} from "../icons/icons";

export interface DropdownOption<T> {
  value: T;
  title: string;
  icon?: IconName;
}
