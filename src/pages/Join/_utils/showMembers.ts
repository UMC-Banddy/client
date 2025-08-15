export const showMembers = (members: string[]) => {
  return members.length === 1
    ? members[0]
    : members.length > 3
    ? `${members.slice(0, 2).join(", ")}, 외 ${members.length - 2}명`
    : members.join(", ");
};
