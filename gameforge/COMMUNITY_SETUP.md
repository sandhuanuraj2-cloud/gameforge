# GAMEFORGE Community setup

The community feature uses Supabase for player accounts, channel data and live text chat. LiveKit provides voice rooms.

## 1. Create a Supabase project

1. Create a free project at https://supabase.com/dashboard.
2. Open **Project Settings → API**.
3. Copy the Project URL and the **anon/public** key. Do not use the service-role key in the browser.
4. Open **SQL Editor → New query**.
5. Paste and run the contents of `gameforge/supabase/community-schema.sql`.

The SQL creates channels, private-channel membership, messages, row-level security policies and the invite-code join function.

## 2. Create a LiveKit project

1. Create a free project at https://cloud.livekit.io/.
2. Open the project's API keys page.
3. Copy the WebSocket URL, API key and API secret.

The API secret must remain server-side. Never add it to GitHub or a `NEXT_PUBLIC_*` variable.

## 3. Add environment variables to Vercel Preview

In the Vercel project connected to this repository, open **Settings → Environment Variables**. Add these variables for **Preview**. If you use branch-specific Preview variables, set the Git branch to `gameforge/mvp-guides`.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit WebSocket URL (starts with `wss://`) |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |

Keep the LiveKit API key and secret as encrypted/sensitive server environment variables. Only the first three values are public browser configuration.

This project has several Vercel projects linked to the same repository. Configure the variables on whichever Preview project you use to open GAMEFORGE. The other linked projects may continue to create redundant preview builds.

## 4. Test on a Preview URL

After saving the environment variables, trigger a new Preview build for branch `gameforge/mvp-guides` (not Production). Open the Preview URL and:

1. Create an account with email and password.
2. Confirm the email if Supabase email confirmation is enabled.
3. Create a public channel and send a message.
4. Create a private channel, copy its invite code, and join it from another account.
5. Join the voice room and allow microphone access.

Use HTTPS and headphones for voice testing. Browser microphone permission is required.

## Notes

- No Production deployment is required for this setup.
- The Supabase anon/public key is designed to be exposed in the browser; database access is controlled by the included row-level security policies.
- Do not paste secrets into chat or commit them to the repository.
- Free service plans have usage limits; check the provider dashboards as usage grows.
