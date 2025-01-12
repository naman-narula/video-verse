import crypto from 'node:crypto'

const EXPIRATION_TIME = 60 * 5 // 5 minutes


async function generateLink(filepath: string) {
  const expires = Math.floor(Date.now() / 1000) + EXPIRATION_TIME;

  const signature = crypto
    .createHmac('sha256', process.env.TOKEN)
    .update(`${filepath}${expires}`)
    .digest('hex');
  return `http://localhost:${process.env.PORT}/video/link/${filepath}?expires=${expires}&signature=${signature}`;
}

function verifyLink(filename: string, expires: string, signature: string): boolean {

  const currentTime = Math.floor(Date.now() / 1000);
  if (!expires || parseInt(expires as string, 10) < currentTime) {
    console.log("link expired")
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.TOKEN)
    .update(`${filename}${expires}`)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.log("Invalid link");
    return false;
  }
  return true;
}

export { generateLink, verifyLink };