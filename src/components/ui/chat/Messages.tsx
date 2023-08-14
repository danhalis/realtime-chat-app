"use client";
import { PusherEvent, pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  userId: string;
  chatId: string;
  userAvatar?: string | null;
  friendAvatar?: string | null;
  initialMessages: Message[];
}
function Messages({
  userId,
  chatId,
  userAvatar,
  friendAvatar,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channelName = `chat_${chatId}_messages`;

    const onMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    pusherClient.subscribe(channelName);
    pusherClient.bind(PusherEvent.NewMessages, onMessage);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind(PusherEvent.NewMessages, onMessage);
    };
  }, []);

  return (
    <section
      id="messages"
      className="
      flex flex-1 flex-col justify-end gap-4
      p-3
      h-full overflow-y-auto
      "
    >
      <div ref={bottomRef} />
      {messages.map((message, index) => {
        const messageFromUser = message.senderId === userId;
        const nextMessageFromUser =
          messages[index + 1]?.senderId === message.senderId;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timeStamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": messageFromUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-ws mx-2",
                  {
                    "order-1 items-end": messageFromUser,
                    "order-2 items-start": !messageFromUser,
                  }
                )}
              >
                <span
                  className={cn("inline-block px-4 py-2 rounded-lg", {
                    "text-white bg-indigo-600": messageFromUser,
                    "text-gray-900 bg-gray-200": !messageFromUser,
                    "rounded-br-none": messageFromUser && !nextMessageFromUser,
                    "rounded-bl-none": !messageFromUser && !nextMessageFromUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {format(message.timeStamp, "HH:mm")}
                  </span>
                </span>
              </div>
              <Image
                className={cn("rounded-full", {
                  "order-1": !messageFromUser,
                  "order-2": messageFromUser,
                  invisible: nextMessageFromUser,
                })}
                src={messageFromUser ? userAvatar ?? "" : friendAvatar ?? ""}
                width={30}
                height={30}
                alt="Profile Picture"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Messages;
