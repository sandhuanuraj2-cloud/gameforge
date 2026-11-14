import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {AccessToken} from "livekit-server-sdk";
export async function POST(req:NextRequest){
 try{
  const auth=req.headers.get("authorization")||"", bearer=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!bearer)return NextResponse.json({error:"Sign in required"},{status:401});
  const {NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_ANON_KEY:key,LIVEKIT_API_KEY:apiKey,LIVEKIT_API_SECRET:secret,NEXT_PUBLIC_LIVEKIT_URL:serverUrl}=process.env;
  if(!url||!key||!apiKey||!secret||!serverUrl)return NextResponse.json({error:"Voice service is not configured yet"},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false}});
  const {data:{user},error}=await supabase.auth.getUser(bearer);
  if(error||!user)return NextResponse.json({error:"Invalid session"},{status:401});
  const {channelId}=await req.json();
  if(!/^[0-9a-f-]{36}$/i.test(String(channelId||"")))return NextResponse.json({error:"Invalid channel"},{status:400});
  const token=new AccessToken(apiKey,secret,{identity:user.id,ttl:"1h"});
  token.addGrant({roomJoin:true,room:"gameforge-"+channelId,canPublish:true,canSubscribe:true});
  return NextResponse.json({token:await token.toJwt(),serverUrl});
 }catch{return NextResponse.json({error:"Could not create voice token"},{status:500});}
}