import {Team} from "./teams";

export interface Match {
    matchId : number,
    team1 : Team,
    team2 : Team,
    winner : Team
}
