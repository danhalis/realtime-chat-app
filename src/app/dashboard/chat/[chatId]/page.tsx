import MessageInput from "@/components/ui/chat/MessageInput";
import Messages from "@/components/ui/chat/Messages";
import { db } from "@/lib/data/db";
import { getChatId, getUserIdsFromChatId } from "@/lib/utils";
import { messagesValidator } from "@/lib/validations/message";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const messages = await db.zrange<Message[]>(`chat:${chatId}:messages`, 0, -1);
    console.log(messages);
    // const reversedMessages = messages.reverse();
    const validatedMessages = messagesValidator.parse(messages);
    return validatedMessages;
  } catch (error) {
    console.log(error)
    notFound();
  }
}

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = getUserIdsFromChatId(chatId);
  console.log(userId1, userId2);

  if (user.id !== userId1 && user.id !== userId2) {

    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = await db.get<User>(`user:${chatPartnerId}`);
  if (!chatPartner) {
    console.log("Partner not found")
    notFound();
  }
  const initialMessages = await getChatMessages(chatId);

  return (
    <main
      className="
        flex flex-col flex-1 justify-between
        h-full max-h-[calc(100vh-6rem)]
      "
    >
      <section
        className="
          flex sm:items-center justify-between
          py-3
          border-b-2 border-gray-200
        "
      >
        <div className="relative flex items-center space-x-4">
          <Image
            className="rounded-full w-8 h-8 sm:w-12 sm:h-12"
            src={chatPartner.image}
            width={48}
            height={48}
            alt={`${chatPartner.name}'s profile image`}
          />

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 text-gray-700 font-semibold">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </section>
      <Messages
        userId={session.user.id}
        userAvatar={session.user.image}
        friendAvatar={chatPartner.image}
        initialMessages={initialMessages}
      />
      <MessageInput chatId={getChatId(userId1, userId2)} />
    </main> 
  );
}

export default ChatPage;
