import {Team} from "./team";
import {All, ApiStanding} from "../api-models/api-standings";

export class Standing {
  rank : number;
  points: number;
  goalsDiff : number;
  team?: Team;
  all? : GamesPlayed;

  constructor(apiStanding:ApiStanding){
    this.rank=apiStanding.rank;
    this.points= apiStanding.points;
    this.goalsDiff = apiStanding.goalsDiff;
    this.team= new Team(apiStanding.team);
    this.all = new GamesPlayed(apiStanding.all);
  }
}

export class GamesPlayed {
  played: number;
  win:    number;
  draw:   number;
  lose:   number;

  constructor(apiGamesPlayed:All){
    this.played= apiGamesPlayed.played;
    this.win = apiGamesPlayed.win;
    this.draw= apiGamesPlayed.draw;
    this.lose = apiGamesPlayed.lose;
  }
}
