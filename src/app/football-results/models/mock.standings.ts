import {ApiStandings} from "./api-standings";

export const mockData= {

  "get": "standings",
  "parameters": {
  "league": "39",
    "season": "2023"
},
  "errors": [],
  "results": 1,
  "paging": {
  "current": 1,
    "total": 1
},
  "response": [
  {
    "league": {
      "id": 39,
      "name": "Premier League",
      "country": "England",
      "logo": "https:\/\/media-4.api-sports.io\/football\/leagues\/39.png",
      "flag": "https:\/\/media-4.api-sports.io\/flags\/gb.svg",
      "season": 2023,
      "standings": [
        [
          {
            "rank": 1,
            "team": {
              "id": 42,
              "name": "Arsenal",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/42.png"
            },
            "points": 30,
            "goalsDiff": 17,
            "group": "Premier League",
            "form": "WWLWD",
            "status": "same",
            "description": "Promotion - Champions League (Group Stage: )",
            "all": {
              "played": 13,
              "win": 9,
              "draw": 3,
              "lose": 1,
              "goals": {
                "for": 27,
                "against": 10
              }
            },
            "home": {
              "played": 7,
              "win": 5,
              "draw": 2,
              "lose": 0,
              "goals": {
                "for": 18,
                "against": 7
              }
            },
            "away": {
              "played": 6,
              "win": 4,
              "draw": 1,
              "lose": 1,
              "goals": {
                "for": 9,
                "against": 3
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 2,
            "team": {
              "id": 50,
              "name": "Manchester City",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/50.png"
            },
            "points": 29,
            "goalsDiff": 20,
            "group": "Premier League",
            "form": "DDWWW",
            "status": "same",
            "description": "Promotion - Champions League (Group Stage: )",
            "all": {
              "played": 13,
              "win": 9,
              "draw": 2,
              "lose": 2,
              "goals": {
                "for": 33,
                "against": 13
              }
            },
            "home": {
              "played": 6,
              "win": 5,
              "draw": 1,
              "lose": 0,
              "goals": {
                "for": 17,
                "against": 4
              }
            },
            "away": {
              "played": 7,
              "win": 4,
              "draw": 1,
              "lose": 2,
              "goals": {
                "for": 16,
                "against": 9
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 3,
            "team": {
              "id": 40,
              "name": "Liverpool",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/40.png"
            },
            "points": 28,
            "goalsDiff": 17,
            "group": "Premier League",
            "form": "DWDWW",
            "status": "same",
            "description": "Promotion - Champions League (Group Stage: )",
            "all": {
              "played": 13,
              "win": 8,
              "draw": 4,
              "lose": 1,
              "goals": {
                "for": 28,
                "against": 11
              }
            },
            "home": {
              "played": 6,
              "win": 6,
              "draw": 0,
              "lose": 0,
              "goals": {
                "for": 17,
                "against": 2
              }
            },
            "away": {
              "played": 7,
              "win": 2,
              "draw": 4,
              "lose": 1,
              "goals": {
                "for": 11,
                "against": 9
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 4,
            "team": {
              "id": 66,
              "name": "Aston Villa",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/66.png"
            },
            "points": 28,
            "goalsDiff": 13,
            "group": "Premier League",
            "form": "WWLWW",
            "status": "same",
            "description": "Promotion - Champions League (Group Stage: )",
            "all": {
              "played": 13,
              "win": 9,
              "draw": 1,
              "lose": 3,
              "goals": {
                "for": 31,
                "against": 18
              }
            },
            "home": {
              "played": 6,
              "win": 6,
              "draw": 0,
              "lose": 0,
              "goals": {
                "for": 23,
                "against": 5
              }
            },
            "away": {
              "played": 7,
              "win": 3,
              "draw": 1,
              "lose": 3,
              "goals": {
                "for": 8,
                "against": 13
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 5,
            "team": {
              "id": 47,
              "name": "Tottenham",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/47.png"
            },
            "points": 26,
            "goalsDiff": 8,
            "group": "Premier League",
            "form": "LLLWW",
            "status": "same",
            "description": "Promotion - Europa League (Group Stage: )",
            "all": {
              "played": 13,
              "win": 8,
              "draw": 2,
              "lose": 3,
              "goals": {
                "for": 25,
                "against": 17
              }
            },
            "home": {
              "played": 6,
              "win": 4,
              "draw": 0,
              "lose": 2,
              "goals": {
                "for": 10,
                "against": 8
              }
            },
            "away": {
              "played": 7,
              "win": 4,
              "draw": 2,
              "lose": 1,
              "goals": {
                "for": 15,
                "against": 9
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 6,
            "team": {
              "id": 33,
              "name": "Manchester United",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/33.png"
            },
            "points": 24,
            "goalsDiff": 0,
            "group": "Premier League",
            "form": "WWWLW",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 8,
              "draw": 0,
              "lose": 5,
              "goals": {
                "for": 16,
                "against": 16
              }
            },
            "home": {
              "played": 7,
              "win": 4,
              "draw": 0,
              "lose": 3,
              "goals": {
                "for": 8,
                "against": 10
              }
            },
            "away": {
              "played": 6,
              "win": 4,
              "draw": 0,
              "lose": 2,
              "goals": {
                "for": 8,
                "against": 6
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 7,
            "team": {
              "id": 34,
              "name": "Newcastle",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/34.png"
            },
            "points": 23,
            "goalsDiff": 17,
            "group": "Premier League",
            "form": "WLWDW",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 7,
              "draw": 2,
              "lose": 4,
              "goals": {
                "for": 31,
                "against": 14
              }
            },
            "home": {
              "played": 7,
              "win": 6,
              "draw": 0,
              "lose": 1,
              "goals": {
                "for": 18,
                "against": 4
              }
            },
            "away": {
              "played": 6,
              "win": 1,
              "draw": 2,
              "lose": 3,
              "goals": {
                "for": 13,
                "against": 10
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 8,
            "team": {
              "id": 51,
              "name": "Brighton",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/51.png"
            },
            "points": 22,
            "goalsDiff": 5,
            "group": "Premier League",
            "form": "WDDDL",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 6,
              "draw": 4,
              "lose": 3,
              "goals": {
                "for": 28,
                "against": 23
              }
            },
            "home": {
              "played": 7,
              "win": 3,
              "draw": 3,
              "lose": 1,
              "goals": {
                "for": 15,
                "against": 10
              }
            },
            "away": {
              "played": 6,
              "win": 3,
              "draw": 1,
              "lose": 2,
              "goals": {
                "for": 13,
                "against": 13
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 9,
            "team": {
              "id": 48,
              "name": "West Ham",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/48.png"
            },
            "points": 20,
            "goalsDiff": 0,
            "group": "Premier League",
            "form": "WWLLL",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 6,
              "draw": 2,
              "lose": 5,
              "goals": {
                "for": 23,
                "against": 23
              }
            },
            "home": {
              "played": 6,
              "win": 3,
              "draw": 1,
              "lose": 2,
              "goals": {
                "for": 11,
                "against": 9
              }
            },
            "away": {
              "played": 7,
              "win": 3,
              "draw": 1,
              "lose": 3,
              "goals": {
                "for": 12,
                "against": 14
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 10,
            "team": {
              "id": 49,
              "name": "Chelsea",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/49.png"
            },
            "points": 16,
            "goalsDiff": 2,
            "group": "Premier League",
            "form": "LDWLD",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 4,
              "draw": 4,
              "lose": 5,
              "goals": {
                "for": 22,
                "against": 20
              }
            },
            "home": {
              "played": 7,
              "win": 1,
              "draw": 3,
              "lose": 3,
              "goals": {
                "for": 10,
                "against": 11
              }
            },
            "away": {
              "played": 6,
              "win": 3,
              "draw": 1,
              "lose": 2,
              "goals": {
                "for": 12,
                "against": 9
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 11,
            "team": {
              "id": 55,
              "name": "Brentford",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/55.png"
            },
            "points": 16,
            "goalsDiff": 1,
            "group": "Premier League",
            "form": "LLWWW",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 4,
              "draw": 4,
              "lose": 5,
              "goals": {
                "for": 19,
                "against": 18
              }
            },
            "home": {
              "played": 7,
              "win": 2,
              "draw": 3,
              "lose": 2,
              "goals": {
                "for": 12,
                "against": 11
              }
            },
            "away": {
              "played": 6,
              "win": 2,
              "draw": 1,
              "lose": 3,
              "goals": {
                "for": 7,
                "against": 7
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 12,
            "team": {
              "id": 39,
              "name": "Wolves",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/39.png"
            },
            "points": 15,
            "goalsDiff": -5,
            "group": "Premier League",
            "form": "LWLDW",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 4,
              "draw": 3,
              "lose": 6,
              "goals": {
                "for": 18,
                "against": 23
              }
            },
            "home": {
              "played": 6,
              "win": 2,
              "draw": 2,
              "lose": 2,
              "goals": {
                "for": 9,
                "against": 12
              }
            },
            "away": {
              "played": 7,
              "win": 2,
              "draw": 1,
              "lose": 4,
              "goals": {
                "for": 9,
                "against": 11
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 13,
            "team": {
              "id": 52,
              "name": "Crystal Palace",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/52.png"
            },
            "points": 15,
            "goalsDiff": -5,
            "group": "Premier League",
            "form": "LLWLL",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 4,
              "draw": 3,
              "lose": 6,
              "goals": {
                "for": 13,
                "against": 18
              }
            },
            "home": {
              "played": 6,
              "win": 1,
              "draw": 2,
              "lose": 3,
              "goals": {
                "for": 6,
                "against": 8
              }
            },
            "away": {
              "played": 7,
              "win": 3,
              "draw": 1,
              "lose": 3,
              "goals": {
                "for": 7,
                "against": 10
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 14,
            "team": {
              "id": 36,
              "name": "Fulham",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/36.png"
            },
            "points": 15,
            "goalsDiff": -9,
            "group": "Premier League",
            "form": "WLLDL",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 4,
              "draw": 3,
              "lose": 6,
              "goals": {
                "for": 13,
                "against": 22
              }
            },
            "home": {
              "played": 6,
              "win": 3,
              "draw": 0,
              "lose": 3,
              "goals": {
                "for": 7,
                "against": 9
              }
            },
            "away": {
              "played": 7,
              "win": 1,
              "draw": 3,
              "lose": 3,
              "goals": {
                "for": 6,
                "against": 13
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 15,
            "team": {
              "id": 65,
              "name": "Nottingham Forest",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/65.png"
            },
            "points": 13,
            "goalsDiff": -5,
            "group": "Premier League",
            "form": "LLWLD",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 3,
              "draw": 4,
              "lose": 6,
              "goals": {
                "for": 16,
                "against": 21
              }
            },
            "home": {
              "played": 6,
              "win": 2,
              "draw": 3,
              "lose": 1,
              "goals": {
                "for": 10,
                "against": 8
              }
            },
            "away": {
              "played": 7,
              "win": 1,
              "draw": 1,
              "lose": 5,
              "goals": {
                "for": 6,
                "against": 13
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 16,
            "team": {
              "id": 35,
              "name": "Bournemouth",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/35.png"
            },
            "points": 12,
            "goalsDiff": -14,
            "group": "Premier League",
            "form": "WWLWL",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 3,
              "draw": 3,
              "lose": 7,
              "goals": {
                "for": 14,
                "against": 28
              }
            },
            "home": {
              "played": 7,
              "win": 2,
              "draw": 2,
              "lose": 3,
              "goals": {
                "for": 6,
                "against": 10
              }
            },
            "away": {
              "played": 6,
              "win": 1,
              "draw": 1,
              "lose": 4,
              "goals": {
                "for": 8,
                "against": 18
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 17,
            "team": {
              "id": 1359,
              "name": "Luton",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/1359.png"
            },
            "points": 9,
            "goalsDiff": -11,
            "group": "Premier League",
            "form": "WLDLD",
            "status": "same",
            "description": null,
            "all": {
              "played": 13,
              "win": 2,
              "draw": 3,
              "lose": 8,
              "goals": {
                "for": 12,
                "against": 23
              }
            },
            "home": {
              "played": 6,
              "win": 1,
              "draw": 2,
              "lose": 3,
              "goals": {
                "for": 6,
                "against": 8
              }
            },
            "away": {
              "played": 7,
              "win": 1,
              "draw": 1,
              "lose": 5,
              "goals": {
                "for": 6,
                "against": 15
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 18,
            "team": {
              "id": 62,
              "name": "Sheffield Utd",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/62.png"
            },
            "points": 5,
            "goalsDiff": -23,
            "group": "Premier League",
            "form": "LDWLL",
            "status": "same",
            "description": "Relegation - Championship",
            "all": {
              "played": 13,
              "win": 1,
              "draw": 2,
              "lose": 10,
              "goals": {
                "for": 11,
                "against": 34
              }
            },
            "home": {
              "played": 7,
              "win": 1,
              "draw": 1,
              "lose": 5,
              "goals": {
                "for": 7,
                "against": 19
              }
            },
            "away": {
              "played": 6,
              "win": 0,
              "draw": 1,
              "lose": 5,
              "goals": {
                "for": 4,
                "against": 15
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 19,
            "team": {
              "id": 45,
              "name": "Everton",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/45.png"
            },
            "points": 4,
            "goalsDiff": -6,
            "group": "Premier League",
            "form": "LWDWL",
            "status": "same",
            "description": "Relegation - Championship",
            "all": {
              "played": 13,
              "win": 4,
              "draw": 2,
              "lose": 7,
              "goals": {
                "for": 14,
                "against": 20
              }
            },
            "home": {
              "played": 7,
              "win": 1,
              "draw": 1,
              "lose": 5,
              "goals": {
                "for": 5,
                "against": 9
              }
            },
            "away": {
              "played": 6,
              "win": 3,
              "draw": 1,
              "lose": 2,
              "goals": {
                "for": 9,
                "against": 11
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          },
          {
            "rank": 20,
            "team": {
              "id": 44,
              "name": "Burnley",
              "logo": "https:\/\/media-4.api-sports.io\/football\/teams\/44.png"
            },
            "points": 4,
            "goalsDiff": -22,
            "group": "Premier League",
            "form": "LLLLL",
            "status": "same",
            "description": "Relegation - Championship",
            "all": {
              "played": 13,
              "win": 1,
              "draw": 1,
              "lose": 11,
              "goals": {
                "for": 10,
                "against": 32
              }
            },
            "home": {
              "played": 7,
              "win": 0,
              "draw": 0,
              "lose": 7,
              "goals": {
                "for": 5,
                "against": 20
              }
            },
            "away": {
              "played": 6,
              "win": 1,
              "draw": 1,
              "lose": 4,
              "goals": {
                "for": 5,
                "against": 12
              }
            },
            "update": "2023-11-27T00:00:00+00:00"
          }
        ]
      ]
    }
  }
]
}

