import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    </>
  );
};

export default Loading;
