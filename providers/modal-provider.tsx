import MessageFileModal from "@/components/modals/message-file.modal";
import CreateGroup from "@/components/modals/create-group";

export default function ModalProvider() {
  return (
    <>
      <MessageFileModal />
      <CreateGroup />
    </>
  );
}
