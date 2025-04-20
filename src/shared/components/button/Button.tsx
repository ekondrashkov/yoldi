import Image from "next/image"
import styles from "./button.module.scss"
import Link from "next/link"

interface ButtonProps {
  text: string
  disabled?: boolean
  imageSrc?: string
  imageSecondSrc?: string
  link?: string
  onClick?: () => void | Promise<void>
}

export const Button = ({
  text,
  disabled,
  imageSrc,
  imageSecondSrc,
  link,
  onClick,
}: ButtonProps) => {
  return link ? (
    <Link href={link} className={styles.button}>
      {imageSrc && (
        <Image
          className={styles.icon}
          src={`/${imageSrc}`}
          alt=""
          width={25}
          height={25}
        />
      )}
      {text}
      {imageSecondSrc && (
        <Image
          className={styles.icon}
          src={`/${imageSecondSrc}`}
          alt=""
          width={25}
          height={25}
        />
      )}
    </Link>
  ) : (
    <button className={styles.button} disabled={!!disabled} onClick={onClick}>
      {imageSrc && (
        <Image
          className={styles.icon}
          src={`/${imageSrc}`}
          alt=""
          width={25}
          height={25}
        />
      )}
      {text}
      {imageSecondSrc && (
        <Image
          className={styles.icon}
          src={`/${imageSecondSrc}`}
          alt=""
          width={25}
          height={25}
        />
      )}
    </button>
  )
}
