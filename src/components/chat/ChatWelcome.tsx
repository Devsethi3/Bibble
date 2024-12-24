import { Hash } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-8">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-secondary/40 flex items-center justify-center">
          <Hash className="h-12 w-12 dark:text-white text-zinc-700" />
        </div>
      )}
      <div className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {type === "channel"
            ? `This is the start of the #${name} channel`
            : `This is the start of your conversation with ${name}`}
        </p>
      </div>
    </div>
  );
};

export default ChatWelcome;
