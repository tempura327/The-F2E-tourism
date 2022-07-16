export default function (dateObj: Date): string {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();

  return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}
