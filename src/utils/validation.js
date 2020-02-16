export function getErrorValidation(value, validations) {
  const error = (validations || []).find(({ regex }) => !value.match(regex));

  return (error && error.description) || null;
}
