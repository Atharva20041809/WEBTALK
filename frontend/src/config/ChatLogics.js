export const getSender = (loggedUser, users) => {
  if (!users || users.length === 0) return "";
  return users[0]?.userId === loggedUser?.id ? users[1]?.user?.username : users[0]?.user?.username;
};

export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length === 0) return null;
  return users[0]?.userId === loggedUser?.id ? users[1]?.user : users[0]?.user;
};
