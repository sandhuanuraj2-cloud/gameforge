# GAMEFORGE Community setup

The community feature uses Supabase for player accounts, channel data and real-time text chat.

## 1. Supabase project

1. Open your Supabase project and go to **Project Settings → API**.
2. Copy the Project URL and the **publishable** key (or legacy anon/public key). Never use the service-role or secret key in the browser.
3. Open **SQL Editor → New query** and run `gameforge/supabase/community-schema.sql` if it has not already been applied.

The SQL creates channels, private-channel membership, messages, row-level security policies and the invite-code join function.

## 2. Add environment variables to Vercel Preview

Use the designated Vercel project **`gameforge-hqo3`**. Open **Settings → Environment Variables** and add these for **Preview**, scoped to branch `gameforge/mvp-guides`. Preview deployments on the other duplicate GAMEFORGE projects are disabled to prevent duplicate builds.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |

Do not add a Supabase service-role or secret key to a `NEXT_PUBLIC_*` variable or commit credentials to GitHub.

## 3. Test on a Preview URL

After saving the variables and when the Vercel build quota is available, trigger a Preview build for `gameforge/mvp-guides` (not Production). Do not use an old preview URL; confirm the deployment commit matches the latest development-branch commit. Test:

1. Create an account with email and password.
2. Confirm the email if Supabase email confirmation is enabled.
3. Create a public channel and send a message.
4. Create a private channel, copy its invite code, and join it from another account.
5. Confirm that private channels and messages are not visible to unauthorized users.

## Notes

- This version supports text chat only. Voice chat may be added later.
- Supabase database access is controlled by the included row-level security policies.
- Free service plans have usage limits; check the provider dashboard as usage grows.
