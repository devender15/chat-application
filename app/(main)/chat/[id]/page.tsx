import { Input } from "@/components/ui/input"

export default function Page() {
    return (
        <div className="px-10 py-6 flex flex-col justify-center items-center gap-y-2 w-full h-full">
        <div className="bg-gray-800 rounded-sm shadow-md p-4 w-full h-full max-h-full overflow-y-auto">
          <div className="w-full space-y-2 text-white">
            <div className="flex justify-start">
              <p className="max-w-[40%] break-words p-2 rounded-sm bg-green-800">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur quisquam possimus ab, reprehenderit delectus quos asperiores blanditiis, unde repellendus assumenda voluptatibus rerum. Deserunt nisi rem voluptatibus facilis ipsam quas maxime suscipit, provident odio, explicabo tenetur corrupti laborum repellendus nemo, totam iusto eaque temporibus quibusdam animi omnis atque saepe voluptatem. Dolor blanditiis at cupiditate! Ratione eveniet quia quae perspiciatis, voluptate dicta quas possimus laboriosam error dolorem dolores cumque! Repellendus itaque cumque illo magni ad pariatur accusamus minima, non maiores iste sit nemo possimus sapiente eligendi. Facilis, minus inventore magnam, blanditiis nulla earum sunt sint vero repellat distinctio fugiat, sequi excepturi similique.</p>
            </div>
            <div className="flex justify-start">
              <p className="max-w-[40%] break-words p-2 rounded-sm bg-green-800">Lorem, ipsum dolor sit amet</p>
            </div>
            <div className=" flex justify-end">
              <p className="max-w-[40%] break-words bg-gray-900 p-2 rounded-sm">laborum repellendus nemo, totam iusto eaque temporibus quibusdam animi omnis atque saepe voluptatem. Dolor blanditiis at cupiditate! Ratione eveniet quia quae perspiciatis, voluptate dicta quas possimus laboriosam error dolorem dolores cumque! Repellendus itaque cumque illo magni ad pariatur accusamus minima, non maiores iste sit nemo possimus sapiente eligendi. Facilis, minus inventore magnam, blanditiis nulla earum sunt sint vero repellat distinctio fugiat, sequi excepturi similique</p>
            </div>
            <div className="flex justify-end">
              <p className="max-w-[40%] break-words p-2 rounded-sm bg-gray-900">Lorem, ipsum dolor sit amet</p>
            </div>
          </div>
        </div>
  
        <div className="w-[80%] mx-auto">
          <Input type="text" placeholder="Type something..." />
        </div>
      </div>
    )
}