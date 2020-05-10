export const updateArray = <T>(arr: Array<T>, idx: number, update: T) => [
  ...arr.slice(0, idx),
  update,
  ...arr.slice(idx + 1),
];

export const arrayWithout = <T>(arr: Array<T>, idx: number) => [
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
];
