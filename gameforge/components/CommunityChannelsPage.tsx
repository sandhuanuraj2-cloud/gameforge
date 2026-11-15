"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { Hash, Lock, Plus, Send, LogOut, Users, UserRound, Compass, Check, RefreshCw } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Channel = { id: string; name: string; is_private: boolean; created_by: string };
type Message = { id: string; channel_id: string; user_id: string; content: string; created_at: string };

export default function CommunityChannelsPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [active, setActive] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [channelName, setChannelName] = useState("");
  const [privateChannel, setPrivateChannel] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"discover" | "joined">("discover");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, [supabase]);

  const loadDirectory = useCallback(async () => {
    if (!supabase || !session) return;
    const [channelResult, membershipResult] = await Promise.all([
      supabase.from("channels").select("id,name,is_private,created_by").order("created_at", { ascending: false }),
      supabase.from("channel_members").select("channel_id").eq("user_id", session.user.id),
    ]);
    if (channelResult.error) { setNotice(channelResult.error.message); return; }
    if (membershipResult.error) { setNotice(membershipResult.error.message); return; }
    const all = (channelResult.data || []) as Channel[];
    const ids = (membershipResult.data || []).map((row) => row.channel_id as string);
    setPublicChannels(all.filter((channel) => !channel.is_private));
    setJoinedIds(ids);
    setActive((current) => current && ids.includes(current.id)
      ? (all.find((channel) => channel.id === current.id) || current)
      : (all.find((channel) => ids.includes(channel.id)) || null));
  }, [supabase, session]);

  useEffect(() => { void loadDirectory(); }, [loadDirectory]);
  useEffect(() => {
    if (!supabase || !session) return;
    const sub = supabase.channel("community-directory-" + session.user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "channels" }, () => { void loadDirectory(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "channel_members", filter: "user_id=eq." + session.user.id }, () => { void loadDirectory(); })
      .subscribe();
    return () => { void supabase.removeChannel(sub); };
  }, [supabase, session, loadDirectory]);

  useEffect(() => {
    if (!supabase || !session || !active || !joinedIds.includes(active.id)) { setMessages([]); return; }
    let alive = true;
    setMessages([]);
    supabase.from("messages").select("*").eq("channel_id", active.id)
      .order("created_at", { ascending: true }).limit(100)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setNotice(error.message);
        else setMessages((data || []) as Message[]);
      });
    const sub = supabase.channel("chat-" + active.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: "channel_id=eq." + active.id },
        (payload) => setMessages((old) => [...old.filter((item) => item.id !== (payload.new as Message).id), payload.new as Message].slice(-100)))
      .subscribe();
    return () => { alive = false; void supabase.removeChannel(sub); };
  }, [supabase, session, active, joinedIds]);

  async function authenticate(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setNotice("");
    const result = authMode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName || email.split("@")[0] } } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setNotice(result.error.message);
    else if (authMode === "signup" && !result.data.session) setNotice("Check your email to confirm your account, then sign in.");
    setBusy(false);
  }

  async function createChannel(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !session || !channelName.trim()) return;
    setBusy(true); setNotice("");
    const { data, error } = await supabase.rpc("create_channel", { channel_name: channelName.trim().slice(0, 40), make_private: privateChannel });
    if (error) setNotice(error.message);
    else {
      const created = (Array.isArray(data) ? data[0] : data) as Channel | undefined;
      if (!created) setNotice("Channel creation returned no channel. Please try again.");
      else {
        setChannelName(""); setPrivateChannel(false); setTab("joined"); setActive(created);
        await loadDirectory(); setNotice("Channel created. It is now in your joined channels.");
      }
    }
    setBusy(false);
  }

  async function joinPublic(channel: Channel) {
    if (!supabase || !session || busy || joinedIds.includes(channel.id)) return;
    setBusy(true); setNotice("");
    const { error } = await supabase.from("channel_members").insert({ channel_id: channel.id, user_id: session.user.id });
    if (error && !error.message.toLowerCase().includes("duplicate")) setNotice(error.message);
    else {
      await loadDirectory();
      setActive(channel); setTab("joined"); setNotice("You joined #" + channel.name + ".");
    }
    setBusy(false);
  }

  async function joinInvite(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !inviteCode.trim()) return;
    setBusy(true); setNotice("");
    const { data, error } = await supabase.rpc("join_channel_by_invite", { invite: inviteCode.trim() });
    if (error) setNotice(error.message);
    else {
      setInviteCode("");
      const { data: channel, error: channelError } = await supabase.from("channels")
        .select("id,name,is_private,created_by").eq("id", data).single();
      if (channelError) setNotice("Joined, but the channel could not be loaded: " + channelError.message);
      else { await loadDirectory(); setActive(channel as Channel); setTab("joined"); setNotice("Joined private channel."); }
    }
    setBusy(false);
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !session || !active || !joinedIds.includes(active.id) || !message.trim() || sending) return;
    setSending(true); setNotice("");
    const { data, error } = await supabase.from("messages")
      .insert({ channel_id: active.id, user_id: session.user.id, content: message.trim().slice(0, 2000) }).select("*").single();
    if (error) setNotice(error.message);
    else { setMessage(""); setMessages((old) => [...old.filter((item) => item.id !== data.id), data as Message].slice(-100)); }
    setSending(false);
  }

  async function signOut() { await supabase?.auth.signOut(); setActive(null); setJoinedIds([]); setPublicChannels([]); }
  const joinedChannels = useMemo(() => {
    const all = [...publicChannels];
    if (active?.is_private && !all.some((item) => item.id === active.id)) all.unshift(active);
    return all.filter((channel) => joinedIds.includes(channel.id));
  }, [publicChannels, joinedIds, active]);
  const filteredPublic = publicChannels.filter((channel) => channel.name.toLowerCase().includes(search.toLowerCase()));

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    return <main className="min-h-screen p-6"><div className="community mx-auto max-w-2xl"><Link href="/" className="text-link">← GAMEFORGE</Link><h1 className="mt-5 text-3xl font-black">Community setup needed</h1><p className="mt-3 text-slate-300">Supabase credentials still need to be added to project settings.</p></div></main>;
  if (!supabase) return null;
  if (!session) return <main className="min-h-screen px-4 py-10"><div className="community mx-auto max-w-md"><Link href="/" className="text-link">← GAMEFORGE</Link><div className="section-kicker mt-8">GAMEFORGE Community</div><h1 className="mt-2 text-3xl font-black">{authMode === "signup" ? "Create your player account" : "Welcome back"}</h1><p className="mt-2 text-sm text-slate-400">Sign in to discover, join and create channels.</p><form onSubmit={authenticate} className="mt-6 grid gap-3">{authMode === "signup" && <input className="community-input" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />}<input className="community-input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="community-input" type="password" minLength={6} required placeholder="Password (at least 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="primary-btn w-full" disabled={busy}>{busy ? "Please wait…" : authMode === "signup" ? "Create account" : "Sign in"}</button></form><button className="mt-4 text-sm text-purple-300" onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}>{authMode === "signup" ? "Already registered? Sign in" : "New to GAMEFORGE? Create an account"}</button>{notice && <p className="mt-4 text-sm text-amber-300">{notice}</p>}</div></main>;

  return <main className="min-h-screen"><header className="topbar"><div className="container flex min-h-[68px] items-center justify-between gap-3"><Link href="/" className="brand">GAME<span>FORGE</span></Link><div className="flex items-center gap-2 text-sm"><Link href="/profile" className="secondary-btn"><UserRound size={15}/> Profile</Link><button onClick={signOut} className="secondary-btn"><LogOut size={15}/> Sign out</button></div></div></header>
    <div className="container py-6 sm:py-8"><div className="mb-5"><div className="section-kicker">Play together</div><h1 className="text-3xl font-black">Community channels</h1><p className="mt-2 text-sm text-slate-400">Discover public rooms, join your communities and chat with players.</p></div>
      {notice && <div className="mb-4 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 text-sm text-purple-100">{notice}</div>}
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section className="panel p-4"><h2 className="mb-3 font-extrabold">Create a channel</h2><form onSubmit={createChannel} className="grid gap-3"><input className="community-input" maxLength={40} required placeholder="Channel name" value={channelName} onChange={(e) => setChannelName(e.target.value)} /><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={privateChannel} onChange={(e) => setPrivateChannel(e.target.checked)} /> Private (invite only)</label><button className="primary-btn" disabled={busy}><Plus size={16}/> Create channel</button></form></section>
          <section className="panel p-4"><h2 className="mb-3 font-extrabold">Join private channel</h2><form onSubmit={joinInvite} className="grid gap-2"><input className="community-input" placeholder="Paste invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} /><button className="secondary-btn" disabled={busy || !inviteCode.trim()}>Join with invite</button></form></section>
          <section className="panel p-3">
            <div className="mb-3 flex gap-2"><button onClick={() => setTab("discover")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${tab === "discover" ? "bg-purple-500/20 text-white" : "text-slate-400"}`}><Compass size={14} className="mr-1 inline"/> Discover</button><button onClick={() => setTab("joined")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${tab === "joined" ? "bg-purple-500/20 text-white" : "text-slate-400"}`}><Check size={14} className="mr-1 inline"/> Joined ({joinedIds.length})</button></div>
            {tab === "discover" ? <><input className="community-input mb-3" placeholder="Search public channels…" value={search} onChange={(e) => setSearch(e.target.value)} />{filteredPublic.map((channel) => { const joined = joinedIds.includes(channel.id); return <div key={channel.id} className="mb-2 rounded-xl border border-white/10 bg-white/[.025] p-3"><div className="flex items-center gap-2"><Hash size={15} className="text-purple-300"/><span className="min-w-0 flex-1 truncate font-semibold">{channel.name}</span></div><div className="mt-3 flex items-center justify-between gap-2"><span className="text-xs text-slate-500">Public channel</span>{joined ? <button className="secondary-btn" onClick={() => { setActive(channel); setTab("joined"); }}><Check size={14}/> Open</button> : <button className="primary-btn" disabled={busy} onClick={() => void joinPublic(channel)}>Join channel</button>}</div></div>; })}{!filteredPublic.length && <p className="py-5 text-center text-sm text-slate-500">No public channels found.</p>}</>
            : <>{joinedChannels.map((channel) => <button key={channel.id} onClick={() => setActive(channel)} className={`channel-row ${active?.id === channel.id ? "channel-active" : ""}`}>{channel.is_private ? <Lock size={15}/> : <Hash size={15}/>}<span className="truncate">{channel.name}</span></button>)}{!joinedChannels.length && <p className="px-2 py-5 text-sm text-slate-500">You have not joined any channels yet. Open Discover to find one.</p>}</>}
            <button className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-xs text-slate-500" onClick={() => void loadDirectory()}><RefreshCw size={13}/> Refresh channel list</button>
          </section>
        </aside>
        <section className="panel flex min-h-[560px] flex-col p-4 sm:p-5">{active && joinedIds.includes(active.id) ? <><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"><div><div className="flex items-center gap-2 text-xl font-black">{active.is_private ? <Lock size={17}/> : <Hash size={17}/>} {active.name}</div><div className="mt-1 text-xs text-slate-500">{active.is_private ? "Private channel" : "Public channel"} · Joined · Text chat</div></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Member</span></div>
          <div className="flex-1 space-y-3 overflow-y-auto py-4">{messages.map((item) => <article key={item.id} className="rounded-lg bg-white/[.035] p-3"><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><div className="grid h-7 w-7 place-items-center rounded-full border border-purple-400/30 bg-slate-800 font-bold text-purple-200">{item.user_id === session.user.id ? "Y" : "P"}</div><div><div className="font-bold text-blue-200">{item.user_id === session.user.id ? "You" : "Player"}</div><div>{new Date(item.created_at).toLocaleString()}</div></div></div><p className="whitespace-pre-wrap break-words text-sm text-slate-200">{item.content}</p></article>)}{!messages.length && <div className="grid h-40 place-items-center text-center text-sm text-slate-500"><div><Users className="mx-auto mb-2"/>No messages yet. Start the conversation.</div></div>}</div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/10 pt-4"><input className="community-input min-w-0 flex-1" maxLength={2000} placeholder={"Message #" + active.name} value={message} onChange={(e) => setMessage(e.target.value)} /><button className="primary-btn" aria-label="Send message" disabled={!message.trim() || sending}><Send size={17}/></button></form>
        </> : <div className="grid flex-1 place-items-center text-center text-slate-500"><div><Users className="mx-auto mb-3" size={34}/><h2 className="font-bold text-slate-300">Find your next squad</h2><p className="mt-2 max-w-sm text-sm">Choose Discover, find a public channel and tap Join channel. Your joined rooms will appear under Joined.</p></div></div>}</section>
      </div>
    </div>
  </main>;
}
