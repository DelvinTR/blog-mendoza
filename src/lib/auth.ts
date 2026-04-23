import { cookies } from 'next/headers';

const COOKIE_NAME = 'blog_admin_session';
const COOKIE_VALUE = 'authenticated';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === COOKIE_VALUE;
}
