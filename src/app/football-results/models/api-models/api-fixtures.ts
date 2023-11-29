export interface ApiFixtures {
  get:        string;
  parameters: Parameters;
  errors:     any[];
  results:    number;
  paging:     Paging;
  response:   Response[];
}

export interface Paging {
  current: number;
  total:   number;
}

export interface Parameters {
  team: string;
  last: string;
}

export interface Response {
  fixture: ApiFixture;
  league:  League;
  teams:   Teams;
  goals:   ApiGoals;
  score:   Score;
}

export interface ApiFixture {
  id:        number;
  referee:   string;
  timezone:  Timezone;
  date:      Date;
  timestamp: number;
  periods:   Periods;
  venue:     Venue;
  status:    Status;
}

export interface Periods {
  first:  number;
  second: number;
}

export interface Status {
  long:    Long;
  short:   Short;
  elapsed: number;
}

export enum Long {
  MatchFinished = "Match Finished",
}

export enum Short {
  Ft = "FT",
}

export enum Timezone {
  UTC = "UTC",
}

export interface Venue {
  id:   number;
  name: string;
  city: string;
}

export interface ApiGoals {
  home:  number | null;
  away:  number | null;
}

export interface Teams{
  home: ApiFixtureTeam ;
  away: ApiFixtureTeam;
}

export interface ApiFixtureTeam {
  id:     number;
  name:   string;
  logo:   string;
  winner?: boolean;
}

export interface League {
  id:      number;
  name:    Name;
  country: Country;
  logo:    string;
  flag:    null | string;
  season:  number;
  round:   string;
}

export enum Country {
  Germany = "Germany",
  World = "World",
}

export enum Name {
  Bundesliga = "Bundesliga",
  DFBPokal = "DFB Pokal",
  UEFAEuropaLeague = "UEFA Europa League",
}

export interface Score {
  halftime:  ApiGoals;
  fulltime:  ApiGoals;
  extratime: ApiGoals;
  penalty:   ApiGoals;
}

