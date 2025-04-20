import styles from "./container.module.scss"

interface ContainerProps {
  children?: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  return <div className={styles.container}>{children}</div>
}
