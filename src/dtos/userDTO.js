export function userToDTO(user) {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.createdAt,
  };
}
