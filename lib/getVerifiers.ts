import { addHttpsIfNotLocal } from '../utils/general';

export async function getVerifiers() {
  const res = await fetch(
    `${addHttpsIfNotLocal(process.env.NEXT_PUBLIC_VERCEL_URL)}/api/getVerifiers`
  );
  const data = await res.json();

  return data;
}
