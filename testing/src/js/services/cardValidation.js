export default class CardValidation {
  validateCard(number) {
    if (!number || number.length < 13) {
      return false;
    }
    return this.luhnAlgorithm(number);
  }

  luhnAlgorithm(number) {
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}