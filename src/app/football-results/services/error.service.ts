import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _errorSubject = new Subject<string |null>();
  error$ = this._errorSubject.asObservable();

  constructor() { }

  setCurrentError(error:string){
    this._errorSubject.next(error);
  }

  flush(){
    this._errorSubject.next(null);
  }
}
