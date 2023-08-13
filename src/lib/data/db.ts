import { Redis } from "@upstash/redis";
import { getRedisApiSecrets } from "./redis";

export const db = new Redis({
  url: getRedisApiSecrets().url,
  token: getRedisApiSecrets().token,
});

export async function getUserByUserId(userId: string) {
  return db.get<User>(`user:${userId}`);
}

export async function getUsersByUserIds(userIds: string[]) {
  const users = (await Promise.all(
    userIds.map(
      (userId: string) => getUserByUserId(userId)
    )
  )).filter((value) => value) as User[];

  return users;
}

export async function getFriendIdsByUserId(userId: string) {
  return await db.smembers(`user:${userId}:friends`);
}

export async function getFriendsByUserId(userId: string) {
  const friendIds = await getFriendIdsByUserId(userId);
  const friends = getUsersByUserIds(friendIds);

  return friends;
}

export async function getFriendRequestSendersByUserId(userId: string) {
  await new Promise(r => setTimeout(r, 2000));
  const friendRequestSenderIds = (await db.smembers(
    `user:${userId}:incoming_friend_requests`,
  ));
  const friendRequestSenders = await getUsersByUserIds(friendRequestSenderIds);
  return friendRequestSenders;
}
