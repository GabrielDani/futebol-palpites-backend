export function userToDTO(user) {
  return {
    id: user.id,
    nickname: user.nickname,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function groupsToDTO(data) {
  return {
    groups:
      data.groups?.map((g) => ({
        id: g.group.id,
        name: g.group.name,
        isPublic: g.group.isPublic,
        creator: g.group.creator.nickname,
        members: g.group._count.members,
      })) || [],
  };
}

export function guessesToDTO(data) {
  return {
    guesses:
      data.guesses?.map((guess) => ({
        matchId: guess.match.id,
        homeTeam: guess.match.homeTeam.shortName,
        scoreHome: guess.scoreHome,
        awayTeam: guess.match.awayTeam.shortName,
        scoreAway: guess.scoreAway,
      })) || [],
  };
}
