"use client";

import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "@/components/ActionTooltip";
import { useModal } from "@/hooks/use-modal-store";

const NavigationAction = () => {
  const {onOpen} = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button onClick={() => onOpen("createServer")} className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-white group-hover:bg-primary">
            <Plus
              className="group-hover:text-white transition text-primary"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
