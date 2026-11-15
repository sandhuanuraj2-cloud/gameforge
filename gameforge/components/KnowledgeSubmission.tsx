"use client";
import { useState } from "react";
import Link from "next/link";
import { knowledgeGames } from "@/lib/game-knowledge";
import { getSupabase } from "@/lib/supabase";

export default function KnowledgeSubmission(){
 const [game,setGame]=useState(knowledgeGames[0]?.slug??"mobile-legends");
 const [name,setName]=useState("");
 const [entityType,setEntityType]=useState("hero");
 const [role,setRole]=useState("");
 const [version,setVersion]=useState("");
 const [source,setSource]=useState("");
 const [abilities,setAbilities]=useState("");
 const [equipment,setEquipment]=useState("");
 const [counters,setCounters]=useState("");
 const [notes,setNotes]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 async function submit(){
  setMessage("");
  const client=getSupabase();
  if(!client){setMessage("Database connection is not configured.");return;}
  if(name.trim().length<2){setMessage("Enter a character or item name.");return;}
  const parse=(value:string)=>value.split("\n").map(x=>x.trim()).filter(Boolean);
  setBusy(true);
  const {data:{user},error:userError}=await client.auth.getUser();
  if(userError||!user){setBusy(false);setMessage("Sign in to submit a record for review.");return;}
  const gameResult=await client.from("game_catalog").select("id").eq("slug",game).single();
  if(gameResult.error||!gameResult.data){setBusy(false);setMessage("Could not find that game in the catalog.");return;}
  const {error}=await client.from("game_entity_submissions").insert({
   game_id:gameResult.data.id,
   submitted_by:user.id,entity_type:entityType,name:name.trim(),
   claimed_game_version:version.trim()||null,source_url:source.trim()||null,
   content:{role:role.trim(),abilities:parse(abilities),equipment:parse(equipment),counters:parse(counters),notes:notes.trim()}
  });
  setBusy(false);
  setMessage(error?"Submission failed. Check the required fields and try again.":"Submitted. Your record is pending review and will not appear publicly until approved.");
  if(!error){setName("");setRole("");setVersion("");setSource("");setAbilities("");setEquipment("");setCounters("");setNotes("");}
 }
 return <main className="min-h-screen bg-[#080812] text-white"><header className="border-b border-purple-900/40 bg-[#0b0b18]"><div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><Link href="/" className="font-black tracking-widest">GAME<span className="text-purple-400">FORGE</span></Link><Link href="/knowledge" className="text-sm text-purple-300">← Knowledge library</Link></div></header><div className="mx-auto max-w-3xl px-5 py-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-purple-300">Community contribution</p><h1 className="mt-2 text-3xl font-black">Submit a character or item</h1><p className="mt-3 text-sm leading-6 text-slate-400">Add abilities, recommended equipment, counters and patch details. Submissions stay private to you and reviewers until approved; provide a source link when possible.</p><div className="mt-7 grid gap-4 rounded-2xl border border-white/10 bg-[#11111f] p-5 sm:grid-cols-2"><label className="text-xs text-slate-400">Game<select value={game} onChange={e=>setGame(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white">{knowledgeGames.map(g=><option key={g.slug} value={g.slug}>{g.name}</option>)}</select></label><label className="text-xs text-slate-400">Record type<select value={entityType} onChange={e=>setEntityType(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white">{["hero","character","weapon","item","boss","class"].map(x=><option key={x}>{x}</option>)}</select></label><label className="text-xs text-slate-400 sm:col-span-2">Name<input value={name} onChange={e=>setName(e.target.value)} maxLength={100} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white" placeholder="Character, hero or item name"/></label><label className="text-xs text-slate-400">Role / class<input value={role} onChange={e=>setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white" placeholder="Tank, mage, DPS..."/></label><label className="text-xs text-slate-400">Game version / patch<input value={version} onChange={e=>setVersion(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white" placeholder="Exact version or patch"/></label><label className="text-xs text-slate-400 sm:col-span-2">Abilities (one per line)<textarea value={abilities} onChange={e=>setAbilities(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white"/></label><label className="text-xs text-slate-400 sm:col-span-2">Equipment / build (one per line)<textarea value={equipment} onChange={e=>setEquipment(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white"/></label><label className="text-xs text-slate-400 sm:col-span-2">Counters / matchups (one per line)<textarea value={counters} onChange={e=>setCounters(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white"/></label><label className="text-xs text-slate-400 sm:col-span-2">Source URL<input value={source} onChange={e=>setSource(e.target.value)} type="url" className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white" placeholder="https://..."/></label><label className="text-xs text-slate-400 sm:col-span-2">Extra notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-[#090916] p-3 text-white"/></label><div className="sm:col-span-2"><button disabled={busy} onClick={submit} className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold disabled:opacity-50">{busy?"Submitting...":"Submit for review"}</button>{message&&<p role="status" className="mt-3 text-sm text-slate-300">{message}</p>}</div></div></div></main>
}
