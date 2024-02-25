import { Copy, Check } from "lucide-react";

import { useState } from "react";

import { motion as m } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoteBubbleProps {
  self: boolean;
  text: string;
  className?: string;
}

export default function NoteBubble({ self, text, className }: NoteBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.2,
      }}
      className={cn(
        "w-full rounded-full p-2 bg-gradient-to-r from-violet-400/65 to-pink-300/80 flex justify-between items-center gap-x-4",
        className
      )}
    >
      <p className="text-white text-sm">
        {self ? (
          <span className="font-semibold">
            You sent: <span className="font-normal">{text}</span>{" "}
          </span>
        ) : (
          text
        )}
      </p>
      <button onClick={handleCopyToClipboard} disabled={copied}>
        {copied ? (
          <Check className="text-white" size={15} />
        ) : (
          <Copy className="text-white" size={15} />
        )}
      </button>
    </m.div>
  );
}
