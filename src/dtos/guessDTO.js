export function guessToDTO(guess) {
  return {
    user: guess.user.nickname,
    match: {
      homeName: guess.match.homeTeam.name,
      homeGuess: guess.scoreHome,
      awayName: guess.match.awayTeam.name,
      awayGuess: guess.scoreAway,
    },
  };
}
