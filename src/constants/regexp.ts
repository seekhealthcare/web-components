export default Object.freeze({
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  ZIP_CODE: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
  DIGITS_ONLY: /^\d+$/,
  TELEPHONE: /^[(]{0,1}[0-9]{3,3}[)]{0,1}([[0-9]{3})-([0-9]{4})$/
});
