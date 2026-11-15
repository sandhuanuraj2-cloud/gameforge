"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Submission={id:string;name:string;kind:string;gameName:string;createdAt:string;content:Record<string,unknown>;version:string|null;source:string|null};
type GuideSubmission={id:string;title:string;kind:string;gameName:string;createdAt:string;content:Record<string,unknown>;version:string|null;source:string|null};

export default function KnowledgeAdmin(){
 const [checking,setChecking]=useState(true);
 const [authorized,setAuthorized]=useState(false);
 const [email,setEmail]=useState("");
 const [entities,setEntities]=useState<Submission[]>([]);
 const [guides,setGuides]=useState<GuideSubmission[]>([]);
 const [notice,setNotice]=useState("");
 const [busy,setBusy]=useState<string|null>(null);
 const [error,setError]=useState("");
 const load=useCallback(async()=>{
  const client=getSupabase(); if(!client){setError("Database connection is not configured.");setChecking(false);return;}
  const {data:{user},error:userError}=await client.auth.getUser();
  if(userError||!user){setAuthorized(false);setChecking(false);return;}
  setEmail(user.email??"");
  const {data:role,error:roleError}=await client.from("gameforge_admins").select("role").eq("user_id",user.id).maybeSingle();
  if(roleError||!role){setAuthorized(false);setChecking(false);return;}
  setAuthorized(true);
  const [entityResult,guideResult]=await Promise.all([
   client.from("game_entity_submissions").select("id,name,entity_type,content,claimed_game_version,source_url,created_at,game_catalog(name)").eq("review_status","pending").order("created_at",{ascending:true}),
   client.from("game_guide_submissions").select("id,title,kind,content,claimed_game_version,source_url,created_at,game_catalog(name)").eq("review_status","pending").order("created_at",{ascending:true})
  ]);
  if(entityResult.error||guideResult.error){setError(entityResult.error?.message??guideResult.error?.message??"Could not load submissions.");setChecking(false);return;}
  const mapGame=(v:{name:string}|{name:string}[]|null)=>Array.isArray(v)?v[0]?.name??"Unknown game":v?.name??"Unknown game";
  type EntityRow={id:string;name:string;entity_type:string;content:Record<string,unknown>|null;claimed_game_version:string|null;source_url:string|null;created_at:string;game_catalog:{name:string}|{name:string}[]|null};
  type GuideRow={id:string;title:string;kind:string;content:Record<string,unknown>|null;claimed_game_version:string|null;source_url:string|null;created_at:string;game_catalog:{name:string}|{name:string}[]|null};
  const entityRows=(entityResult.data??[]) as unknown as EntityRow[];
  const guideRows=(guideResult.data??[]) as unknown as GuideRow[];
  setEntities(entityRows.map((row)=>({id:row.id,name:row.name,kind:row.entity_type,gameName:mapGame(row.game_catalog),createdAt:row.created_at,content:row.content??{},version:row.claimed_game_version,source:row.source_url})));
  setGuides(guideRows.map((row)=>({id:row.id,title:row.title,kind:row.kind,gameName:mapGame(row.game_catalog),createdAt:row.created_at,content:row.content??{},version:row.claimed_game_version,source:row.source_url})));
  setError("");setChecking(false);
 },[]);
 useEffect(()=>{void load()},[load]);
 async function decide(type:"entity"|"guide",id:string,decision:"approved"|"rejected"){
  const client=getSupabase();if(!client)return;
  setBusy(id);setNotice("");setError("");
  const {error:reviewError}=await client.rpc(type==="entity"?"review_game_entity_submission":"review_game_guide_submission",{p_submission_id:id,p_decision:decision});
  setBusy(null);
  if(reviewError){setError(reviewError.message);return;}
  setNotice(decision==="approved"?"Approved and published.":"Submission rejected.");
  await load();
 }
 if(checking)return <main className="min-h-screen bg-[#080812] p-8 text-white">Checking administrator access…</main>;
 return <main className="min-h-screen bg-[#080812] text-white"><header className="border-b border-purple-900/40 bg-[#0b0b18]"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="font-black tracking-widest">GAME<span className="text-purple-400">FORGE</span></Link><Link href="/knowledge" className="text-sm text-purple-300">← Knowledge Library</Link></div></header><div className="mx-auto max-w-6xl px-5 py-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-purple-300">Restricted workspace</p><h1 className="mt-2 text-3xl font-black">Knowledge moderation</h1>{!authorized?<div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5"><h2 className="font-bold">Administrator access required</h2><p className="mt-2 text-sm text-slate-300">Sign in with the GAMEFORGE administrator account. If your account has not been assigned the admin role yet, the owner must activate it in the database.</p>{email&&<p className="mt-2 text-xs text-slate-500">Signed in as {email}</p>}</div>:<><p className="mt-2 text-sm text-slate-400">Signed in as {email}. Approving a submission publishes it to the public knowledge library; rejection keeps it out of public results.</p>{notice&&<p role="status" className="mt-4 rounded-lg border border-emerald-500/30 p-3 text-sm text-emerald-300">{notice}</p>}{error&&<p role="alert" className="mt-4 rounded-lg border border-red-500/30 p-3 text-sm text-red-300">{error}</p>}<section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Character and item submissions</h2><span className="text-xs text-slate-400">{entities.length} pending</span></div>{entities.length===0?<p className="mt-3 rounded-xl border border-white/10 p-5 text-sm text-slate-400">No pending character or item submissions.</p>:<div className="mt-4 grid gap-4 md:grid-cols-2">{entities.map(item=><article key={item.id} className="rounded-xl border border-white/10 bg-[#11111f] p-5"><div className="flex justify-between gap-3"><h3 className="font-bold">{item.name}</h3><span className="text-xs text-purple-300">{item.gameName}</span></div><p className="mt-1 text-xs uppercase text-slate-500">{item.kind} · {item.version??"Version not supplied"}</p><pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-xs text-slate-300">{JSON.stringify(item.content,null,2)}</pre>{item.source&&<a className="mt-3 inline-block text-xs text-purple-300 underline" href={item.source} target="_blank" rel="noreferrer">Open source</a>}<p className="mt-2 text-[11px] text-slate-500">Submitted {new Date(item.createdAt).toLocaleString()}</p><div className="mt-4 flex gap-2"><button disabled={busy===item.id} onClick={()=>void decide("entity",item.id,"approved")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold disabled:opacity-50">Approve & publish</button><button disabled={busy===item.id} onClick={()=>void decide("entity",item.id,"rejected")} className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-bold text-red-300 disabled:opacity-50">Reject</button></div></article>)}</div>}</section><section className="mt-10"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Guide submissions</h2><span className="text-xs text-slate-400">{guides.length} pending</span></div>{guides.length===0?<p className="mt-3 rounded-xl border border-white/10 p-5 text-sm text-slate-400">No pending guide submissions.</p>:<div className="mt-4 grid gap-4 md:grid-cols-2">{guides.map(item=><article key={item.id} className="rounded-xl border border-white/10 bg-[#11111f] p-5"><div className="flex justify-between gap-3"><h3 className="font-bold">{item.title}</h3><span className="text-xs text-purple-300">{item.gameName}</span></div><p className="mt-1 text-xs uppercase text-slate-500">{item.kind} · {item.version??"Version not supplied"}</p><pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-xs text-slate-300">{JSON.stringify(item.content,null,2)}</pre>{item.source&&<a className="mt-3 inline-block text-xs text-purple-300 underline" href={item.source} target="_blank" rel="noreferrer">Open source</a>}<p className="mt-2 text-[11px] text-slate-500">Submitted {new Date(item.createdAt).toLocaleString()}</p><div className="mt-4 flex gap-2"><button disabled={busy===item.id} onClick={()=>void decide("guide",item.id,"approved")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold disabled:opacity-50">Approve & publish</button><button disabled={busy===item.id} onClick={()=>void decide("guide",item.id,"rejected")} className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-bold text-red-300 disabled:opacity-50">Reject</button></div></article>)}</div>}</section></>}</div></main>
}
