export function matchToDTO(match) {
  return {
    id: match.id,
    homeTeam: {
      id: match.homeTeam.id,
      shortName: match.homeTeam.shortName,
    },
    awayTeam: {
      id: match.awayTeam.id,
      shortName: match.awayTeam.shortName,
    },
    round: match.round,
  };
}
