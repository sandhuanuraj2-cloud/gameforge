"use client";
import {useEffect,useRef,useState} from "react";
import {Room,RoomEvent,Participant} from "livekit-client";
import {Headphones,Mic,MicOff,PhoneOff,Users} from "lucide-react";
export default function VoiceRoom({channelId,channelName,accessToken}:{channelId:string;channelName:string;accessToken:string}){
 const roomRef=useRef<Room|null>(null),[connected,setConnected]=useState(false),[muted,setMuted]=useState(false),[busy,setBusy]=useState(false),[people,setPeople]=useState<string[]>([]);
 useEffect(()=>()=>{roomRef.current?.disconnect()},[]);
 const refresh=(room:Room)=>setPeople([room.localParticipant,...Array.from(room.remoteParticipants.values())].map((p:Participant)=>p.name||p.identity));
 async function join(){
  setBusy(true);
  try{
   const res=await fetch("/api/voice-token",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+accessToken},body:JSON.stringify({channelId})});
   const data=await res.json();if(!res.ok)throw new Error(data.error||"Voice connection failed");
   const room=new Room({adaptiveStream:true,dynacast:true});
   room.on(RoomEvent.ParticipantConnected,()=>refresh(room));room.on(RoomEvent.ParticipantDisconnected,()=>refresh(room));
   room.on(RoomEvent.Disconnected,()=>{setConnected(false);setPeople([]);roomRef.current=null});
   await room.connect(data.serverUrl,data.token);await room.localParticipant.setMicrophoneEnabled(true);
   roomRef.current=room;setConnected(true);setMuted(false);refresh(room);
  }catch(e){alert(e instanceof Error?e.message:"Voice connection failed")}finally{setBusy(false)}
 }
 async function mute(){if(!roomRef.current)return;const next=!muted;await roomRef.current.localParticipant.setMicrophoneEnabled(!next);setMuted(next)}
 function leave(){roomRef.current?.disconnect();roomRef.current=null;setConnected(false);setPeople([]);setMuted(false)}
 return <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/[.06] p-4">
  <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Headphones size={18} className="text-blue-300"/><div><b>Voice room</b><div className="text-xs text-slate-400">{channelName}</div></div></div>
  {connected?<div className="flex gap-2"><button className="secondary-btn" onClick={mute}>{muted?<MicOff size={16}/>:<Mic size={16}/>} {muted?"Unmute":"Mute"}</button><button className="danger-btn" onClick={leave}><PhoneOff size={16}/> Leave</button></div>:<button className="primary-btn" disabled={busy} onClick={join}>{busy?"Connecting…":"Join voice"}</button>}</div>
  {connected&&<div className="mt-3 flex items-center gap-2 text-sm text-slate-300"><Users size={15}/>{people.length} connected: {people.join(", ")}</div>}
  <p className="mt-2 text-xs text-slate-500">Allow microphone access when prompted. Headphones help prevent echo.</p>
 </div>;
}