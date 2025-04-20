import styles from "./dialogButton.module.scss"

interface DialogButtonProps {
  colorType: "light" | "dark"
  disabled: boolean
  type: "button" | "submit"
  text: string
  onClick: (event: React.MouseEvent) => void
}

export const DialogButton = ({
  colorType,
  disabled,
  type,
  text,
  onClick,
}: DialogButtonProps) => {
  return (
    <button
      type={type}
      className={colorType === "dark" ? styles.darkBtn : styles.lightBtn}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
