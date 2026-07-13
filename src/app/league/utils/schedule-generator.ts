import { Match } from '../models/match';
import { Team } from '../models/teams';

interface ScheduledPair {
  team1: Team;
  team2: Team;
  randomOrder: number;
}

export function generateTournamentMatches(
  anthonyDecks: Team[],
  pierreDecks: Team[],
  random: () => number = Math.random,
): Match[] {
  const remaining: ScheduledPair[] = anthonyDecks.flatMap(team1 => pierreDecks.map(team2 => ({
    team1,
    team2,
    randomOrder: random(),
  })));
  const ordered: ScheduledPair[] = [];
  const anthonyLastPlayedAt = new Map<string, number>();
  const pierreLastPlayedAt = new Map<string, number>();
  const canAlternateAnthony = anthonyDecks.length > 1;
  const canAlternatePierre = pierreDecks.length > 1;

  const arrangeNextMatch = (allowImmediateRepeat: boolean): boolean => {
    if (!remaining.length) return true;

    const previous = ordered.at(-1);
    const candidates = remaining.map((pair, index) => ({
      pair,
      index,
      repeatPenalty: Number(canAlternateAnthony && pair.team1.id === previous?.team1.id)
        + Number(canAlternatePierre && pair.team2.id === previous?.team2.id),
      idleScore: (ordered.length - (anthonyLastPlayedAt.get(pair.team1.id) ?? -1))
        + (ordered.length - (pierreLastPlayedAt.get(pair.team2.id) ?? -1)),
      onwardOptions: remaining.filter(other =>
        other !== pair
        && (!canAlternateAnthony || other.team1.id !== pair.team1.id)
        && (!canAlternatePierre || other.team2.id !== pair.team2.id),
      ).length,
    }))
      .filter(candidate => allowImmediateRepeat || candidate.repeatPenalty === 0)
      .sort((left, right) =>
        left.repeatPenalty - right.repeatPenalty
        || right.idleScore - left.idleScore
        || left.onwardOptions - right.onwardOptions
        || left.pair.randomOrder - right.pair.randomOrder,
      );

    for (const candidate of candidates) {
      const [pair] = remaining.splice(candidate.index, 1);
      const previousAnthonyPlay = anthonyLastPlayedAt.get(pair.team1.id);
      const previousPierrePlay = pierreLastPlayedAt.get(pair.team2.id);

      anthonyLastPlayedAt.set(pair.team1.id, ordered.length);
      pierreLastPlayedAt.set(pair.team2.id, ordered.length);
      ordered.push(pair);

      if (arrangeNextMatch(allowImmediateRepeat)) return true;

      ordered.pop();
      remaining.splice(candidate.index, 0, pair);
      restoreLastPlay(anthonyLastPlayedAt, pair.team1.id, previousAnthonyPlay);
      restoreLastPlay(pierreLastPlayedAt, pair.team2.id, previousPierrePlay);
    }

    return false;
  };

  if (!arrangeNextMatch(false) && !arrangeNextMatch(true)) {
    throw new Error('Impossible de générer un calendrier sans répétition immédiate.');
  }

  return ordered.map((pair, order) => ({
    matchId: `match-${String(order + 1).padStart(3, '0')}`,
    order,
    team1: pair.team1,
    team2: pair.team2,
    winner: null,
  }));
}

function restoreLastPlay(lastPlayedAt: Map<string, number>, teamId: string, previousPlay: number | undefined): void {
  if (previousPlay === undefined) {
    lastPlayedAt.delete(teamId);
    return;
  }

  lastPlayedAt.set(teamId, previousPlay);
}
