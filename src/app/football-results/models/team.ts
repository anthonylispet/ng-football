export class Team {
  id:   number;
  name: string;
  logo: string;

  constructor(apiTeam:Team){
    this.id = apiTeam.id;
    this.name= apiTeam.name;
    this.logo=apiTeam.logo;
  }
}
