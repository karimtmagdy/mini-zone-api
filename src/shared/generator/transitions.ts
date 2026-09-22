type Received = Record<string, readonly string[]>;
export const getStatus = <const T extends Received>(
  transitions: T,
): (keyof T)[] => {
  return Object.keys(transitions) as (keyof T)[];
};
// export function canTransition<T extends Received,From extends keyof T>
// (transitions: T, from: From, to: string): to is T[From][number] {
//   return transitions[from]?.includes(to);
// }
