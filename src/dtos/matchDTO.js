export function matchToDTO(match) {
  return {
    id: match.id,
    scoreHome: match.scoreHome,
    scoreAway: match.scoreAway,
    date: match.date,
    status: match.status,
    round: match.round,
    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      shortName: match.homeTeam.shortName,
      logoUrl: match.homeTeam.logoUrl,
    },
    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      shortName: match.awayTeam.shortName,
      logoUrl: match.awayTeam.logoUrl,
    },
  };
}
