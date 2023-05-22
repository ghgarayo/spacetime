import { getUser } from '@/lib/auth'
import Image from 'next/image'

export default function Profile() {
  const { nome, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
      />
      <p className="max-w-[180px] text-sm leading-snug">{nome}</p>
      <a
        href="/api/auth/logout"
        className="block text-[10px] text-red-400 hover:text-red-700"
      >
        Logout
      </a>
    </div>
  )
}
