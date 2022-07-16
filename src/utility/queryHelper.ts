import getAuthorization from '@/utility/auth';

export default async function (url: string): Promise<any> {
  const res = await fetch(`${url}`, {
    method: 'GET',
    headers: getAuthorization(),
  });

  return res.json();
}
