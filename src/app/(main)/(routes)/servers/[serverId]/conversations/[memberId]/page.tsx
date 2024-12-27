import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/MediaRoom";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ memberId: string; serverId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberIdPage = async ({ params, searchParams }: PageProps) => {
  const profile = await currentProfile();
  const { memberId, serverId } = await params;
  const resolvedSearchParams = await searchParams;

  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return "error";
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  const isVideo = resolvedSearchParams?.video === "true";

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen justify-between">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {isVideo && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!isVideo && (
        <div>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MemberIdPage;
