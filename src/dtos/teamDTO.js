export function teamToDTO(team) {
  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    logoUrl: team.logoUrl,
    homeMatches:
      team.homeMatches?.map((match) => ({
        homeTeam: match.homeTeam.shortName,
        awayTeam: match.awayTeam.shortName,
        round: match.round,
      })) || [],
    awayMatches:
      team.awayMatches?.map((match) => ({
        homeTeam: match.homeTeam.shortName,
        awayTeam: match.awayTeam.shortName,
        round: match.round,
      })) || [],
  };
}
