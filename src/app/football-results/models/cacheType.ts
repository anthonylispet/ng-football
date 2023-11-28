import {League} from "./league";

export type cacheType = League[] | null;

export class cacheData {
  data? : cacheType;
  expiration? : number;
}
