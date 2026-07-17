import { AHeroUtility } from "./guide.model";

export interface AHeroPveFilterState {
  search: string;
  utility: AHeroUtility | '';
}