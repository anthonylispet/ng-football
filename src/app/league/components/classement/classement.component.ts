import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Subject} from "rxjs";

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss']
})
export class ClassementComponent implements OnInit,OnDestroy{

  private destroyed$: Subject<boolean> = new Subject();

  constructor(private db:AngularFireDatabase){}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
