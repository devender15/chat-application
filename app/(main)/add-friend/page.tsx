import SendFriendRequestForm from "@/components/forms/send-friend-request-form"


export default function Page() {
    return <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/2 mx-auto h-[80%]">
            <h2 className="text-3xl font-semibold">Add a new friend</h2>
            <p className="text-gray-500 dark:text-gray-400">
                Add a new friend by email address.
            </p>

            <div className="mt-8">
                <SendFriendRequestForm />
            </div>
        </div>
    </div>
}