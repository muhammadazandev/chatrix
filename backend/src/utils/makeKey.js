function makeKey(userA, userB) {
  const [a, b] = [userA.toString(), userB.toString()].sort();
  return `${a}_${b}`;
}

export default makeKey;
