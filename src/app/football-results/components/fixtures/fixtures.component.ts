import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FixturesService} from "../../services/fixtures.service";
import {Fixture} from "../../models/class/fixture";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})
export class FixturesComponent implements OnInit, OnDestroy{

  private teamId!: string | null;
  private destroyed$: Subject<boolean> = new Subject();

  fixtures: Fixture[]=[];
  constructor(private route:ActivatedRoute,private fixtureService: FixturesService) {
   }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get("teamId");
    if (this.teamId != null) {
      this.fixtureService.getFixtures(this.teamId).pipe(takeUntil(this.destroyed$)).subscribe(fixtures => {
        this.fixtures = fixtures;
      })
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
