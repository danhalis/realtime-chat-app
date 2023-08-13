"use client"
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "../Button";
import { SendHorizonal } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  chatId: string;
}

function MessageInput({ chatId }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/chat/messages/send", { text: text, chatId: chatId });
      setText("");
      textareaRef.current?.focus();
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="
      flex space-x-2 items-center
      px-4 pt-4 mb-2
      border-t border-gray-200
      sm:mb-0
      "
    >
      <TextareaAutosize
        className="
        block w-full resize-none
        border-0
        text-gray-900 placeholder:text-gray-400 bg-transparent
        rounded-lg
        shadow-sm
        ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600
        sm:py-1.5 sm:leading-6
        "
        ref={textareaRef}
        placeholder="Say somehing ..."
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button className="self-end" isLoading={isLoading} type="submit" onClick={sendMessage}>
        <SendHorizonal />
      </Button>
    </section>
  );
}

export default MessageInput;
