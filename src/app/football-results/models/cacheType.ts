import {League} from "./league";
import {Standing} from "./standing";

export type cacheType = League[] | Standing[] | null;

export class cacheData {
  data? : cacheType;
  expiration? : number;
}
