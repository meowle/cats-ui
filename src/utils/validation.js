export function getErrorValidation(value, validations) {
  const error =
    value && (validations || []).find(({ regex }) => !value.match(regex));

  return (error && error.description) || null;
}
