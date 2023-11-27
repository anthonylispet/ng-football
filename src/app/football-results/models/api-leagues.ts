export interface ApiLeague {
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
  current: string;
}

export interface Response {
  league:  League;
  country: Country;
  seasons: Season[];
}

export interface Country {
  name: string;
  code: null | string;
  flag: null | string;
}

export interface League {
  id:   number;
  name: string;
  type: Type;
  logo: string;
}

export enum Type {
  Cup = "Cup",
  League = "League",
}

export interface Season {
  year:     number;
  start:    Date;
  end:      Date;
  current:  boolean;
  coverage: Coverage;
}

export interface Coverage {
  fixtures:    Fixtures;
  standings:   boolean;
  players:     boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards:   boolean;
  injuries:    boolean;
  predictions: boolean;
  odds:        boolean;
}

export interface Fixtures {
  events:              boolean;
  lineups:             boolean;
  statistics_fixtures: boolean;
  statistics_players:  boolean;
}
