import InitialModal from "@/components/modals/InitialModal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

const GetStartedPage = async () => {
  const profile = (await initialProfile()) as Profile | null;

  if (!profile) {
    return <div>No profile found. Please create a profile.</div>;
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <>
      <InitialModal />
    </>
  );
};

export default GetStartedPage;
