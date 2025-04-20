import styles from "./accountsSceleton.module.scss"

const DATA = new Array(10).fill(null)

export const AccountsSceleton = () => {
  return (
    <ul className={styles.list}>
      {DATA.map((_, index) => (
        <li key={index} className={styles.item}>
          <div className={styles.initials} />
          <div className={styles.nameAndEmail}>
            <span className={styles.name} />
            <span className={styles.email} />
          </div>
        </li>
      ))}
    </ul>
  )
}
