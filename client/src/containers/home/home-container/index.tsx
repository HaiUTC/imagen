import styles from "./home-container.module.css";

interface HomeContainerProps {
  children: React.ReactNode;
}

export const HomeContainer: React.FC<HomeContainerProps> = ({ children }) => {
  return <div className={styles.home_container}>{children}</div>;
};
