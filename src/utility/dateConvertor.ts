export default function (dateObj: Date | number[]): string {
  const isDate = dateObj instanceof Date;

  const year = isDate ? dateObj.getFullYear() : dateObj[0];
  const month = isDate ? dateObj.getMonth() + 1 : dateObj[1] + 1;
  const date = isDate ? dateObj.getDate() : dateObj[2];

  return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}

export function extractDateRangeStr(str: string): string {
  const dateRes = [...new Set(str.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g))];
  const timeRes = str.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g);

  const hasNo0OClock = timeRes && !timeRes?.includes('00:00:00');

  if (!dateRes) return '(未提供時間)';

  if (dateRes.length < 2) return `${dateRes[0]} ${hasNo0OClock ? timeRes?.join(' ~ ') : ''}`;

  return `${dateRes[0]} ${hasNo0OClock ? timeRes[0] : ''} ~ ${dateRes[1]} ${hasNo0OClock ? timeRes[1] : ''}`;
}
