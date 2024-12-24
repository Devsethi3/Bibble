import { db } from "./db";
import { Conversation, Member, Profile } from "@prisma/client";

type FullConversation = Conversation & {
  memberOne: Member & {
    profile: Profile;
  };
  memberTwo: Member & {
    profile: Profile;
  };
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<FullConversation | null> => {
  try {
    if (!memberOneId || !memberTwoId) {
      throw new Error("Both member IDs are required");
    }

    if (memberOneId === memberTwoId) {
      throw new Error("Cannot create conversation with yourself");
    }

    // Check if members exist
    const validMembers = await db.member.findMany({
      where: {
        id: {
          in: [memberOneId, memberTwoId],
        },
      },
    });

    if (validMembers.length !== 2) {
      throw new Error("One or both members not found");
    }

    let conversation = await findConversation(memberOneId, memberTwoId);

    if (!conversation) {
      conversation = await findConversation(memberTwoId, memberOneId);
    }

    if (!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
  } catch (error) {
    console.error("[GET_OR_CREATE_CONVERSATION_ERROR]", error);
    throw error;
  }
};

const findConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<FullConversation | null> => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error("[FIND_CONVERSATION_ERROR]", error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<FullConversation> => {
  try {
    const conversation = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error("[CREATE_CONVERSATION_ERROR]", error);
    throw error;
  }
};

// Is this 