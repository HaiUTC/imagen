import { BlockStack, Box, Text } from "@shopify/polaris";
import styles from "./option.module.css";
import { svgIcon } from "../../../../libs/constants/icons";

export interface OptionImagenDetailProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const OptionImagenDetail: React.FC<OptionImagenDetailProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`${styles.option} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <Box paddingBlock="300" width="100%">
        <BlockStack align="center" inlineAlign="center" gap="200">
          {svgIcon(icon)}
          <Text as="span" alignment="center">
            {label}
          </Text>
        </BlockStack>
      </Box>
    </div>
  );
};
