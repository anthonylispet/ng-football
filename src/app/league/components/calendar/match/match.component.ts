import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Match} from "../../../models/match";
import {Player, Team} from "../../../models/teams";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {

  @Input() match!:Match;
  @Output() winnerSelected = new EventEmitter<Team|string>();

  selectWinner(event: any): void {
    const winnerId = event.target.value;
    let winner = "";
    if (winnerId !== ""){
      // @ts-ignore
      winner = winnerId == this.match?.team1.id ? this.match?.team1 : this.match?.team2;
    }
    this.winnerSelected.emit(winner);
  }

  getPlayerName(player: Player | undefined): string  {
    // @ts-ignore
    return Player[player];
  }
}
