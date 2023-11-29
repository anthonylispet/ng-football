import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

constructor(private errorService:ErrorService) {}
  get currentError():Observable<string |null>{
    return this.errorService.error$;
  }
}
