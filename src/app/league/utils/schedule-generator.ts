import { Match } from '../models/match';
import { Team } from '../models/teams';

export function generateTournamentMatches(
  anthonyDecks: Team[],
  pierreDecks: Team[],
  random: () => number = Math.random,
): Match[] {
  const anthony = shuffle(anthonyDecks, random);
  const pierre = shuffle(pierreDecks, random);
  const ordered: Array<{ team1: Team; team2: Team }> = [];
  const shifts = Array.from({ length: pierre.length - 1 }, (_, index) => index + 1)
    .filter(shift => greatestCommonDivisor(shift, pierre.length) === 1)
    .filter(shift => shift !== (anthony.length - 1) % pierre.length);

  if (anthony.length > 1 && pierre.length > 1 && shifts.length) {
    const shift = shifts[Math.floor(random() * shifts.length)] ?? shifts[0];
    for (let round = 0; round < pierre.length; round++) {
      for (let index = 0; index < anthony.length; index++) {
        ordered.push({
          team1: anthony[index],
          team2: pierre[(index + shift * round) % pierre.length],
        });
      }
    }
  } else {
    const remaining = anthony.flatMap(team1 => pierre.map(team2 => ({ team1, team2 })));
    while (remaining.length) {
      const previous = ordered.at(-1);
      const scored = remaining.map((pair, index) => ({
        index,
        penalty: (pair.team1.id === previous?.team1.id ? 1 : 0)
          + (pair.team2.id === previous?.team2.id ? 1 : 0),
        random: random(),
      })).sort((left, right) => left.penalty - right.penalty || left.random - right.random);
      ordered.push(remaining.splice(scored[0].index, 1)[0]);
    }
  }

  return ordered.map((pair, order) => ({
    matchId: `match-${String(order + 1).padStart(3, '0')}`,
    order,
    team1: pair.team1,
    team2: pair.team2,
    winner: null,
  }));
}

function shuffle<T>(values: T[], random: () => number): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

function greatestCommonDivisor(left: number, right: number): number {
  while (right) [left, right] = [right, left % right];
  return Math.abs(left);
}
