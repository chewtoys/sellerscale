/* eslint-disable import/prefer-default-export */
import messages from './validation-messages';

export function fieldErrorsComputed() {
  const $v = this.validation;
  const translationPrefix = this.formSchema.translationPrefix || '';

  return Object.keys($v.$params).reduce((errorsList, validator) => {
    if (!$v[validator]) {
      const createMessage = messages[validator];
      const fieldName = this.$t(`form_field.${translationPrefix}${this.name}`);

      if (!createMessage) {
        errorsList.push(this.$t(`validation_errors.${validator}`, { fieldName }) || 'ERROR_MESSAGE');
      } else {
        const [id, count, data] = createMessage(
          $v.$params[validator],
          fieldName,
        );

        const message = `validation_errors.${id}`;

        if (count) {
          errorsList.push(this.$tc(message, count, { fieldName, ...(data || {}) }));
        } else {
          errorsList.push(this.$t(message, { fieldName, ...(data || {}) }));
        }
      }
    }

    return errorsList;
  }, []);
}
