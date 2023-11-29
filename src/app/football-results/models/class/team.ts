import {ApiFixtureTeam} from "../api-models/api-fixtures";
import {ApiTeam} from "../api-models/api-standings";

export class Team {
  id:   number;
  name: string;
  logo: string;

  constructor(apiTeam:ApiTeam|ApiFixtureTeam){
    this.id = apiTeam.id;
    this.name= apiTeam.name;
    this.logo=apiTeam.logo;
  }
}
