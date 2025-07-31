import styles from "./imagen-container.module.css";

interface ImagenContainerProps {
  children: React.ReactNode;
}

export const ImagenContainer: React.FC<ImagenContainerProps> = ({
  children,
}) => {
  return <div className={styles.imagen_container}>{children}</div>;
};
