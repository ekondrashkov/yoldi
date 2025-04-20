"use client"

import { use, useEffect } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { useRouter } from "next/navigation"
import { EditForm } from "@/shared/components/editForm/EditForm"
import type { User } from "@/types/types"
import styles from "./page.module.scss"

export default function EditModal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { data, error } = useSWR<User>(`/api/user/${slug}`, fetcher)
  const router = useRouter()

  useEffect(() => {
    if (error) {
      router.push(`/accounts/${slug}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, slug])

  return (
    <div className={styles.modal}>
      <div className={styles.background} />
      <div className={styles.dialog}>
        {error && <p className={styles.error}>{error.message}</p>}
        {data && (
          <EditForm
            user={data}
            onCancel={() => router.push(`/accounts/${data.slug}`)}
          />
        )}
      </div>
    </div>
  )
}
