export function jsonToBase64(jsonObj: object) {
  const jsonString = JSON.stringify(jsonObj);
  return Buffer.from(jsonString).toString('base64');
}
export function encodeBase64ToJson(base64String: string) {
  const jsonString = Buffer.from(base64String, 'base64').toString();
  return JSON.parse(jsonString);
}
