import styles from "./profileSceleton.module.scss"

export const ProfileSceleton = () => {
  return (
    <div className={styles.about}>
      <div className={styles.userInfo}>
        <div className={styles.nameAndEmail}>
          <h3 className={styles.name} />
          <span className={styles.email} />
        </div>
      </div>
      <div className={styles.bio}>
        <div className={styles.text} />
        <div className={styles.text} />
        <div className={styles.text} />
        <div className={styles.textShort} />
      </div>
    </div>
  )
}
