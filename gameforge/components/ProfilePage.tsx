"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Save, UserRound } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

type PlayerProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
};

export default function ProfilePage() {
  const supabase = useMemo(() => getSupabase(), []);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (alive) setSession(nextSession);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) { setLoading(false); return; }
    let alive = true;
    setLoading(true);
    supabase.from("profiles").select("id,username,display_name,avatar_url,bio")
      .eq("id", session.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setNotice("Profile could not be loaded: " + error.message);
        if (data) {
          const row = data as PlayerProfile;
          setProfile(row);
          setUsername(row.username);
          setDisplayName(row.display_name);
          setAvatarUrl(row.avatar_url || "");
          setBio(row.bio || "");
        } else {
          const suggested = (session.user.email?.split("@")[0] || "player").replace(/[^A-Za-z0-9_]/g, "").slice(0, 16) || "player";
          setUsername(suggested + "_" + session.user.id.slice(0, 4));
          setDisplayName(String(session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "Player").slice(0, 40));
          setBio("");
          setAvatarUrl("");
        }
        setLoading(false);
      });
    return () => { alive = false; };
  }, [supabase, session]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !session) return;
    setSaving(true);
    setNotice("");
    const cleanUsername = username.trim();
    const cleanDisplayName = displayName.trim();
    const cleanAvatar = avatarUrl.trim();
    if (!/^[A-Za-z0-9_]{3,24}$/.test(cleanUsername)) {
      setNotice("Username must be 3–24 characters using letters, numbers or underscores.");
      setSaving(false);
      return;
    }
    if (!cleanDisplayName || cleanDisplayName.length > 40) {
      setNotice("Display name must be between 1 and 40 characters.");
      setSaving(false);
      return;
    }
    if (cleanAvatar && !/^https:\/\//i.test(cleanAvatar)) {
      setNotice("Profile picture URL must start with https://.");
      setSaving(false);
      return;
    }
    const values = {
      id: session.user.id,
      username: cleanUsername,
      display_name: cleanDisplayName,
      avatar_url: cleanAvatar || null,
      bio: bio.trim().slice(0, 160),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("profiles")
      .upsert(values, { onConflict: "id" })
      .select("id,username,display_name,avatar_url,bio")
      .single();
    if (error) setNotice(error.code === "23505" ? "That username is already taken. Choose another." : error.message);
    else {
      setProfile(data as PlayerProfile);
      setNotice("Player profile saved.");
      router.refresh();
    }
    setSaving(false);
  }

  if (!supabase) return <main className="min-h-screen p-6"><p>Supabase is not configured for this preview.</p></main>;
  if (loading) return <main className="min-h-screen p-6 text-slate-300">Loading player profile…</main>;
  if (!session) return <main className="min-h-screen px-5 py-12"><div className="community mx-auto max-w-md"><h1 className="text-3xl font-black">Sign in required</h1><p className="mt-2 text-slate-400">Sign in to create and edit your GAMEFORGE player profile.</p><Link className="primary-btn mt-5 inline-flex" href="/community">Go to community sign in</Link></div></main>;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="community mx-auto max-w-2xl">
        <Link href="/community" className="text-link inline-flex items-center gap-2"><ArrowLeft size={16}/> Back to community</Link>
        <div className="mt-7 section-kicker">PLAYER IDENTITY</div>
        <h1 className="mt-2 text-3xl font-black">Your player profile</h1>
        <p className="mt-2 text-sm text-slate-400">Choose how other GAMEFORGE players see you.</p>

        <section className="panel mt-6 p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-purple-400/40 bg-slate-800 text-purple-200"
              style={avatarUrl.trim() ? { backgroundImage: `url("${avatarUrl.trim()}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
              {!avatarUrl.trim() && <UserRound size={34}/>}
            </div>
            <div><div className="font-bold">{displayName || "Your player name"}</div><div className="text-sm text-slate-400">@{username || "username"}</div><div className="mt-1 text-xs text-slate-500">Profile preview</div></div>
          </div>

          <form onSubmit={saveProfile} className="grid gap-4">
            <label className="grid gap-2 text-sm text-slate-300">Username
              <input className="community-input" minLength={3} maxLength={24} required value={username} onChange={e => setUsername(e.target.value)} placeholder="player_name"/>
              <span className="text-xs text-slate-500">3–24 letters, numbers or underscores. Must be unique.</span>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">Display name
              <input className="community-input" maxLength={40} required value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How players see your name"/>
            </label>
            <label className="grid gap-2 text-sm text-slate-300"><span className="flex items-center gap-2"><Camera size={15}/> Profile picture URL</span>
              <input className="community-input" type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png"/>
              <span className="text-xs text-slate-500">Use a public HTTPS image link. Image upload is not enabled yet.</span>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">About you
              <textarea className="community-input min-h-24 resize-y" maxLength={160} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell other players a little about yourself…" />
              <span className="text-right text-xs text-slate-500">{bio.length}/160</span>
            </label>
            <div className="text-xs text-slate-500">Account: {session.user.email}</div>
            <button className="primary-btn w-full" disabled={saving}><Save size={16}/>{saving ? "Saving…" : profile ? "Save profile changes" : "Create player profile"}</button>
          </form>
          {notice && <p role="status" className="mt-4 text-sm text-amber-300">{notice}</p>}
        </section>
      </div>
    </main>
  );
}
