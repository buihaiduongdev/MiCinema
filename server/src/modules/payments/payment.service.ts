export const generateVietQRUrl = (bookingId: string, amount: number) => {
  const BANK_ID = 'MB';
  const ACCOUNT_NO = '0345588112';
  const ACCOUNT_NAME = 'BUI HAI DUONG';

  const memo = `MiCinema ${bookingId}`;
  const template = 'compact2';

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return qrUrl;
};
