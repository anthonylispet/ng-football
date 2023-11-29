import {League} from "./league";
import {Standing} from "./standing";
import {Fixture} from "./fixture";

export type cacheType = League[] | Standing[] | Fixture[] | null;

export class cacheData {
  data? : cacheType;
  expiration? : number;
}
