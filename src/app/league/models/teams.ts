export interface Team {
    id : number
    name:   string;
    player: Player;
}

export enum Player {
    A = "Anthony",
    P = "Pierre"
}
