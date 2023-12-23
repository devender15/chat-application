import { DataTableDemo } from "@/components/data-table"


export default function Page() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-1/2 h-[80%] mx-auto">
                <h1 className="text-3xl font-semibold">Friend Requests</h1>

                <div className="mt-6">
                    <DataTableDemo type="receive" />
                </div>
            </div>
        </div>
    )
}