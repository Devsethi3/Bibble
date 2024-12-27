"use client";

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

interface Emoji {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="p-1.5 mr-2 mt-0.5 rounded-md dark:bg-zinc-800 bg-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200"
          title="Select Emoji"
        >
          <Smile className="h-5 w-5 md:h-6 md:w-6 text-zinc-700 hover:text-zinc-600 dark:text-zinc-300/60" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        sideOffset={isMobile ? 10 : 40}
        className="bg-transparent border-none shadow-none w-full md:w-[352px] drop-shadow-none max-h-[90vh] overflow-hidden lg:mb-16 mb-0"
        align="start"
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: Emoji) => onChange(emoji.native)}
            previewPosition="none"
            skinTonePosition="none"
            perLine={isMobile ? 7 : 8}
            maxFrequentRows={isMobile ? 2 : 3}
            // navPosition={isMobile ? "bottom" : "top"}
            emojiSize={isMobile ? 22 : 24}
            emojiButtonSize={isMobile ? 28 : 32}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
