import { Box, InlineStack } from "@shopify/polaris";
import { ICONS, svgIcon } from "../../../../libs/constants/icons";
import { ImageGenPreviewDownload } from "./download";
import styles from "./imagen-preview-actions.module.css";
import { ImageGenPreviewTemplate } from "./template";

export const ImageGenPreviewActions: React.FC = () => {
  return (
    <Box width="100%" paddingBlockEnd="400">
      <InlineStack align="center" blockAlign="center" wrap={false} gap="200">
        <button className={styles.button}>
          {svgIcon(ICONS.UNDO)}
          {svgIcon(ICONS.REDO)}
        </button>
        <button className={styles.button}>{svgIcon(ICONS.PREVIEW)}</button>
        <button className={styles.button}>
          {svgIcon(ICONS.VIDEO)} Animate
        </button>
        <ImageGenPreviewTemplate />
        <ImageGenPreviewDownload />
        <button className={styles.button}>
          {svgIcon(ICONS.DELETE)} Delete
        </button>
      </InlineStack>
    </Box>
  );
};
