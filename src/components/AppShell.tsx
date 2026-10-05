"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
const links=[["/dashboard","Daily drops"],["/levels","Learning levels"],["/private","Private area"],["/profile","Profile"],["/wallet","Wallet"],["/settings","Settings"]];
export default function AppShell({title,tierLabel,children}:{title:string;tierLabel:string;children:ReactNode}){
 const path=usePathname();const router=useRouter();
 async function logout(){await supabase.auth.signOut();router.replace("/login");}
 return <div className="member-shell"><header className="member-header"><Link href="/" className="member-brand"><b>R</b><span>RICH MODE<small>ACADEMY</small></span></Link><nav aria-label="Site navigation"><Link href="/academy">Academy</Link><Link href="/plans">Plans</Link><a href="https://pf.richmodeacademy.com">Launch PoolForge ↗</a></nav><button className="btn" onClick={logout}>Sign out</button></header><div className="member-layout"><aside className="member-sidebar"><span className="eyebrow">YOUR LEARNING SPACE</span><nav aria-label="Member navigation">{links.map(([href,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined}>{label}<span>↗</span></Link>)}</nav><Link href="/plans" className="badge">{tierLabel} membership</Link></aside><main className="member-content"><div className="member-heading"><span className="eyebrow">RICH MODE ACADEMY</span><h1>{title}</h1></div>{children}</main></div><footer className="member-footer">Build knowledge. Make considered decisions.<Link href="/">Back to Rich Mode</Link></footer></div>;
}
