const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_MINLENGTH = value => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: value,
});
export const VALIDATOR_MIN = value => ({
  type: VALIDATOR_TYPE_MIN,
  val: value,
});

export const validate = (value, validator) => {
  let valueIsValid = true;
  for (const validate of validator) {
    if (validate.type === VALIDATOR_TYPE_REQUIRE) {
      valueIsValid = valueIsValid && value.trim().length > 0;
    }
    if (validate.type === VALIDATOR_TYPE_EMAIL) {
      valueIsValid = valueIsValid && value.includes('@');
    }
    if (validate.type === VALIDATOR_TYPE_MINLENGTH) {
      valueIsValid = valueIsValid && value.trim().length >= validate.val;
    }
    if (validate.type === VALIDATOR_TYPE_MIN) {
      valueIsValid = valueIsValid && +value >= +validate.val;
    }
  }
  return valueIsValid;
};
