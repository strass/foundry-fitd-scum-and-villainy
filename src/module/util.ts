export const updateArray = <T>(arr: Array<T>, idx: number, update: T) => [
  ...arr.slice(0, idx),
  update,
  ...arr.slice(idx + 1),
];

export const arrayWith = <T>(arr: Array<T>, newValue: T) => [...arr, newValue];

export const arrayWithout = <T>(arr: Array<T>, idx: number) => [
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
];

export const toggleRange = (clickedValue, currentValue) =>
  clickedValue === currentValue ? clickedValue - 1 : clickedValue;
