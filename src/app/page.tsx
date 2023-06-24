import { db } from '@/lib/db';
import Image from 'next/image'

export default async function Home() {
  await db.set("Hello", "World");
  return <div>

  </div>
}
