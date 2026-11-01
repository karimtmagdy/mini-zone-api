type Received = Record<string, readonly string[]>;

export const getStatus = <const T extends Received>(
  transitions: T,
): (keyof T)[] => {
  return Object.keys(transitions) as (keyof T)[];
};
