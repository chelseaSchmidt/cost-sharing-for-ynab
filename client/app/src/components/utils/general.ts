export const toId = <T, I>(item: T & { id: I }) => item.id;

export const isDefined = <T>(value: T) => value !== null && value !== undefined;

export const isNumber = <T>(value: T): value is T & number => typeof value === 'number';

export const isNonNullObject = <T>(value: T): value is T & object =>
  typeof value === 'object' && value !== null;

export const hasResponseAndStatus = <T>(
  value: T,
): value is T & { response: { status: number } } => {
  return (
    isNonNullObject(value) &&
    'response' in value &&
    isNonNullObject(value.response) &&
    'status' in value.response &&
    typeof value.response.status === 'number'
  );
};

export const hasMessage = <T>(value: T): value is T & { message: string } =>
  isNonNullObject(value) && 'message' in value && typeof value.message === 'string';
