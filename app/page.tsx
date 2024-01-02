import { intitalProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default function Home() {

  const profile = intitalProfile();

  if(!profile) redirect('/login');

  return <div>home</div>;
}
