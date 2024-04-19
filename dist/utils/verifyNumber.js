export function generateRandomSixDigitNumber() {
    // Generate a random number between 100000 and 999999 (inclusive)
    const randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return randomNumber;
}
//# sourceMappingURL=verifyNumber.js.map