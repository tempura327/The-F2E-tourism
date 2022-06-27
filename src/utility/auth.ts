import JsSHA from 'jssha';

export default function getAuthorization(): any {
  const AppID = '83592d8c997f4933ae965e60e5995a2d';
  const AppKey = 'OPt8cbnBt_P461mggB8qbzrZiDc';
  const timeString = new Date().toUTCString();
  const ShaObj = new JsSHA('SHA-1', 'TEXT');

  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update(`x-date: ${timeString}`);

  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;

  return { Authorization, 'X-Date': timeString };
}
