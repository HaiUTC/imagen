import styles from "./option/option.module.css";

interface ImagenSideBarLogoProps {
  onClick: () => void;
}

export const ImagenSideBarLogo: React.FC<ImagenSideBarLogoProps> = ({
  onClick,
}) => {
  return (
    <div className={styles.logo_container}>
      <div className={styles.logo} onClick={onClick}>
        <img
          width={35}
          height={35}
          src="https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/favicon.png"
          alt="Logo"
        />
      </div>
    </div>
  );
};
