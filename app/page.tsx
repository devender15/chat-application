"use client";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Chat from "@/components/chat";

export default function Home() {
  // const { currentUser } = useAuthContext();
  // const router = useRouter();

  // useEffect(() => {
  //     if(!currentUser) {
  //       router.push("/login");
  //     }
  // }, [currentUser])

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-between h-[calc(100vh-4rem)]">
        <div className="basis-[20%] h-full">
          <Sidebar />
        </div>
        <div className="basis-[80%] h-full">
          <Chat />
        </div>
      </main>
    </>
  );
}
