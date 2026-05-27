
/**
 * Generic transition rules config type
 */
export type TransitionRules<Status extends string> = {
  readonly [K in Status]: readonly Status[];
};

/**
 * Reusable function factory to create a type-safe transition validator
 */
export function createTransitionValidator<Status extends string>(
  transitions: Record<Status, readonly Status[]>,
) {
  return function isValid(currentStatus: Status, newStatus: Status): boolean {
    const allowed = transitions[currentStatus];
    return (allowed as readonly Status[]).includes(newStatus);
  };
}

/**
 * Transition Validation Utility for any Entity Statuses.
 *
 * Checks if newStatus is allowed from currentStatus.
 * Fully type-safe (no any) and prevents invalid transitions.
 *
 * Explicitly implements:
 *   const allowed = transitions[currentStatus];
 *   allowed.includes(newStatus)
 */
export function isValidTransition<Status extends string>(
  transitions: Record<Status, readonly Status[]>,
  currentStatus: Status,
  newStatus: Status,
): boolean {
  const allowed = transitions[currentStatus];
  return (allowed as readonly Status[]).includes(newStatus);
}


