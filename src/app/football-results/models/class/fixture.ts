import {Team} from "./team";
import {ApiFixtureTeam, ApiGoals} from "../api-models/api-fixtures";

export class Fixture{
  homeTeam!:Team;
  awayTeam!:Team;
  goals!:Goals;

  constructor(homeApiTeam: ApiFixtureTeam,awayApiTeam: ApiFixtureTeam,goals:ApiGoals){
    this.homeTeam= new Team(homeApiTeam);
    this.awayTeam= new Team(awayApiTeam);
    this.goals=new Goals(goals)
  }
}

export class Goals{
  home: number | null;
  away: number | null;

  constructor(goals:ApiGoals){
    this.home = goals.home;
    this.away= goals.away;
  }
}
