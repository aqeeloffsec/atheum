import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, getSubscription }, cookies }) => {
  const { session, user } = await safeGetSession()
  let subscription = null;

  if (session) {
      subscription = await getSubscription();
  }

  return {
    session,
    user,
    subscription,
    cookies: cookies.getAll(),
  }
}