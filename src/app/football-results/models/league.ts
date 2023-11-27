export class League {
  country: string ;
  name: string;
  apiId:number;
  currentSeason?:number;

  constructor(country:string, name :string,apiId:number,currentSeason:number){
    this.country = country;
    this.name=name;
    this.apiId=apiId;
    this.currentSeason = currentSeason;
  }
}

