import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})
export class FixturesComponent implements OnInit{


  constructor(private route:ActivatedRoute) {
   }

  ngOnInit(): void {
    let teamId = this.route.snapshot.paramMap.get("teamId");
  }

}
