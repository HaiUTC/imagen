import { Box, InlineStack, Text } from "@shopify/polaris";
import styles from "./library.module.css";
import { Fragment, useState } from "react";

interface ImagenLibraryPreviewProps {
  src: string;
}

export const ImagenLibraryPreview: React.FC<ImagenLibraryPreviewProps> = ({
  src,
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={styles.preview}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img src={src} alt="imagen-library-preview" />
      {isHover && (
        <Fragment>
          <Box
            position="absolute"
            insetBlockEnd="0"
            insetInlineStart="0"
            width="100%"
            minHeight="100%"
            background="bg-inverse"
            opacity="0.5"
          ></Box>
          <Box
            position="absolute"
            insetBlockEnd="300"
            insetInlineStart="150"
            width="100%"
            zIndex="999"
          >
            <InlineStack blockAlign="center" align="start" gap="200">
              <img
                className={styles.avatar}
                src="https://lh3.googleusercontent.com/a/ACg8ocJ7Nk_vjYZCa7LE-oBYwLZAmZllrqQx_Btvbi-LnUWcGWE=s96-c"
                alt="avatar"
              />
              <Box>
                <Text as="h6" variant="bodySm">
                  <span>Soul</span>
                </Text>
                <Text as="span" variant="bodySm">
                  <span>10m ago</span>
                </Text>
              </Box>
            </InlineStack>
          </Box>
        </Fragment>
      )}
    </div>
  );
};
