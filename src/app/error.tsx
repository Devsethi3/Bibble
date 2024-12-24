"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen flex container overflow-hidden flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-rose-100 p-3 rounded-full">
              <AlertTriangleIcon className="w-10 h-10 text-rose-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p>{error.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
