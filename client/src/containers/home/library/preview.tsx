import { Box, InlineStack, Text } from "@shopify/polaris";
import styles from "./library.module.css";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ImagenLibraryPreviewProps {
  src: string;
  imagenId?: string;
  templateId?: string | null;
  onImageLoad?: (
    imageUrl: string,
    naturalHeight: number,
    naturalWidth: number
  ) => void;
}

export const ImagenLibraryPreview: React.FC<ImagenLibraryPreviewProps> = ({
  src,
  imagenId,
  templateId,
  onImageLoad,
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (onImageLoad) {
      onImageLoad(src, img.naturalHeight, img.naturalWidth);
    }
  };

  const handleClick = () => {
    if (imagenId) {
      const url = templateId
        ? `/i/${imagenId}?templateId=${templateId}`
        : `/i/${imagenId}`;
      navigate(url);
    }
  };

  return (
    <div
      className={styles.preview}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
    >
      <img src={src} alt="imagen-library-preview" onLoad={handleImageLoad} />
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
