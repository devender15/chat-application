import ShowRequestsData from "@/components/show-requests-data";

export default function Page() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[70%] h-[80%] mx-auto">
        <h1 className="text-3xl font-semibold">Friend Requests</h1>

        <div className="mt-6 w-full">
          <ShowRequestsData />
        </div>
      </div>
    </div>
  );
}
