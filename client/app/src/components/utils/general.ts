export const toId = <T, I>(item: T & { id: I }) => item.id;

export const isDefined = <T>(value: T) => value !== null && value !== undefined;
