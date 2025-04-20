import Link from "next/link"
import Image from "next/image"
import { getInitials } from "@/shared/utils/utils"
import type { User } from "@/types/types"
import styles from "./profile.module.scss"

interface ProfileProps {
  user: User
}

export const Profile = ({ user }: ProfileProps) => {
  return (
    <Link
      className={styles.profile}
      href={`/accounts/${user.slug}`}
      title={user.name}
    >
      <div className={styles.nameAndInitials}>
        <span className={styles.name}>{user.name}</span>
        {user?.image?.url ? (
          <div className={styles.imageWrapper}>
            <Image
              src={user.image.url}
              alt={user.name}
              width={user.image.width ? Number(user.image.width) : 50}
              height={user.image.height ? Number(user.image.height) : 50}
              className={styles.image}
            />
          </div>
        ) : (
          <div className={styles.initials}>{getInitials(user.name)}</div>
        )}
      </div>
    </Link>
  )
}
