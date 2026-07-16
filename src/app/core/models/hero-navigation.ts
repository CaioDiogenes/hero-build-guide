import { Hero } from "./hero.model";

export interface HeroNavigation {
    hero: Hero;
    previousHero?: Hero;
    nextHero?: Hero;
}