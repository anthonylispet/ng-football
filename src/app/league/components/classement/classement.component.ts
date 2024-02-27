import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {ClassementService} from "../../services/classement.service";
import {Classement} from "../../models/classement";

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss']
})
export class ClassementComponent implements OnInit,OnDestroy{

  private destroyed$: Subject<boolean> = new Subject();

  constructor(private classementService: ClassementService){}

  ngOnInit(): void {
    this.classementService.getClassement().pipe(takeUntil(this.destroyed$)).subscribe((classement) => {
      console.log('Classement:', classement);
      this.classementService.setCurrentClassement(classement);
    });
  }

  get currentClassement(): Observable<Classement[] | null>{
    return this.classementService.currentClassement$;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
