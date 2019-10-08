export default {
  minLength(params) {
    return ['minLength', params.min];
  },
  maxLength(params) {
    return ['maxLength', params.max];
  },
};
