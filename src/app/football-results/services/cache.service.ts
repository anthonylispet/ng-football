import { Injectable } from '@angular/core';
import {cacheData,cacheType} from "../models/class/cach-data";

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  get(key: string): cacheType {
    const storedDataJSON = localStorage.getItem(key);
    if (storedDataJSON) {
      const storedData = JSON.parse(storedDataJSON);
      if (storedData && storedData.expiration > Date.now()) {
        return storedData.data;
      }
    }
    return null
  }


  set(key: string, data: cacheType, expirationMs: number): void {
    const expiration = Date.now() + expirationMs;
    const cachedData = { data: data, expiration: expiration } as cacheData;
    // @ts-ignore
    localStorage.setItem(key, JSON.stringify(cachedData));
  }
}
