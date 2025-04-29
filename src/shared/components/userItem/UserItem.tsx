import Link from "next/link"
import Image from "next/image"
import { getInitials } from "@/shared/utils/utils"
import type { User } from "@/types/types"
import styles from "./userItem.module.scss"

export const UserItem = (user: Readonly<User>) => {
  return (
    <li key={user.id} className={styles.item}>
      <Link href={`/accounts/${user.slug}`} className={styles.link}>
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
        <div className={styles.nameAndEmail}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
      </Link>
    </li>
  )
}
