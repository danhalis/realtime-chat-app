import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}

export function getChatId(userId1: string, userId2: string) {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function getUserIdsFromChatId(chatId: string) {
  return chatId.split("--");
}
