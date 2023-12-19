import { intitalProfile } from "@/lib/initial-profile";

export default function Home() {
  const profile = intitalProfile();

  if (profile) {
    console.log(profile);
  } else {
    console.log("no profile");
  }

  return <div>home</div>;
}
