import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/contexts/socket";

export const StatusIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-gray-600 border-none text-white">
        Offline
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 border-none text-white">
      Online
    </Badge>
  );
};
