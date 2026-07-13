import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Match } from '../../../models/match';
import { getPlayerName, PlayerCode, Team } from '../../../models/teams';

@Component({
  standalone: false,
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
  @Input({ required: true }) match!: Match;
  @Input() saving = false;
  @Input() readonly = false;
  @Output() winnerSelected = new EventEmitter<Team | null>();

  selectWinner(team: Team): void {
    if (!this.saving && !this.readonly) {
      this.winnerSelected.emit(team);
    }
  }

  clearWinner(): void {
    if (!this.saving && !this.readonly) {
      this.winnerSelected.emit(null);
    }
  }

  playerName(player: PlayerCode): string {
    return getPlayerName(player);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
