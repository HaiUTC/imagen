import {
  Text,
  InlineStack,
  Divider,
  Box,
  InlineGrid,
  Tooltip,
  Button,
  Spinner,
} from "@shopify/polaris";
import { Fragment, useState } from "react";
import styles from "./collections-details.module.css";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import { useImagenStore, type ImagenValue } from "../../../store/imagen.store";
import { urlToFile } from "../../../libs/utils/url-2-file";
import { NatureIcon } from "@shopify/polaris-icons";
import { upscaleAllImagesFlow } from "../../../flow/imagen/imagen.dowload.flow";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsDetailsProps {
  data: CollectionsData;
  imagePreview: string;
  setImagePreviewSelected: (image: string) => void;
  setIsSticky: (isSticky: boolean) => void;
}

export const CollectionsDetails: React.FC<CollectionsDetailsProps> = ({
  data,
  imagePreview,
  setImagePreviewSelected,
  setIsSticky,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<number>(0);
  const { loadingDownload, onChangeDataValue, setFormat } = useImagenStore();

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsCopied(index);
    setTimeout(() => {
      setIsCopied(0);
    }, 2000);
  };

  const handleOnChangeValue = (value: string) => {
    onChangeDataValue("generate", "prompt", value);
    setIsSticky(false);
  };

  const handleChangeImageReference = async (
    image: string,
    format: keyof ImagenValue
  ) => {
    if (image) {
      const file = await urlToFile(image, "image.png");
      onChangeDataValue(format, "image", [file]);
      setFormat(format);
      setIsSticky(false);
    }
  };

  return (
    <div className={styles.details_container}>
      {/* User Info */}
      <div className={styles.user_info}>
        <img
          src="https://lh3.googleusercontent.com/a/ACg8ocJ7Nk_vjYZCa7LE-oBYwLZAmZllrqQx_Btvbi-LnUWcGWE=s96-c"
          alt="User avatar"
          className={styles.user_avatar}
        />
        <div className={styles.user_details}>
          <Text as="h6" variant="bodyMd">
            Rain
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            8d ago
          </Text>
        </div>
      </div>

      <Box paddingBlockEnd="500">
        <Text as="h6" variant="bodyMd" fontWeight="semibold">
          Image edit
        </Text>
        <Box paddingBlock="300">
          <InlineGrid columns={{ xs: 2, sm: 2, md: 2 }} gap="300">
            <button
              className={styles.button_edit}
              onClick={() =>
                handleChangeImageReference(imagePreview, "generate")
              }
            >
              <div>
                <p>Reference</p>
              </div>
            </button>
            <button
              className={styles.button_edit}
              onClick={() => handleChangeImageReference(imagePreview, "edit")}
            >
              <div>
                <p>Edit</p>
              </div>
            </button>
          </InlineGrid>
        </Box>
      </Box>

      {/* Prompt Section */}
      <div className={styles.prompt_section}>
        <div className={styles.section_header}>
          <Text as="h6" variant="bodyMd" fontWeight="semibold">
            Prompt
          </Text>
          <InlineStack gap="300">
            <Tooltip content={isCopied ? "Copied" : "Copy"} dismissOnMouseOut>
              <button
                className={styles.button}
                onClick={() => handleCopyText(data.prompt, 1)}
              >
                {isCopied === 1 ? svgIcon(ICONS.TICK) : svgIcon(ICONS.COPY)}
              </button>
            </Tooltip>
            <Tooltip content="Add" dismissOnMouseOut>
              <button
                className={styles.button}
                onClick={() => handleOnChangeValue(data.prompt)}
              >
                {svgIcon(ICONS.ADD)}
              </button>
            </Tooltip>
          </InlineStack>
        </div>
        <div className={styles.prompt_content}>
          <Text as="span" variant="bodyMd">
            {data.prompt}
          </Text>
        </div>
      </div>

      {/* Magic Prompt Section */}
      <div className={styles.prompt_section}>
        <div className={styles.section_header}>
          <Text as="h6" variant="bodyMd" fontWeight="semibold">
            Magic Prompt
          </Text>
          <InlineStack gap="300">
            <Tooltip content={isCopied ? "Copied" : "Copy"} dismissOnMouseOut>
              <button
                className={styles.button}
                onClick={() => handleCopyText(data.magicPrompt, 2)}
              >
                {isCopied === 2 ? svgIcon(ICONS.TICK) : svgIcon(ICONS.COPY)}
              </button>
            </Tooltip>
            <Tooltip content="Add" dismissOnMouseOut>
              <button
                className={styles.button}
                onClick={() => handleOnChangeValue(data.magicPrompt)}
              >
                {svgIcon(ICONS.ADD)}
              </button>
            </Tooltip>
          </InlineStack>
        </div>
        <div className={styles.prompt_content}>
          <div
            className={
              isExpanded ? styles.prompt_text : styles.prompt_text_truncated
            }
          >
            <Text as="span" variant="bodyMd">
              {data.magicPrompt}
            </Text>
          </div>
          <div>
            <button
              className={styles.more_less_button}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Less" : "More"}
            </button>
          </div>
        </div>
      </div>

      {/* Reference Images */}
      {data.referenceImage.length > 0 && (
        <div className={styles.images_section}>
          <Text as="h6" variant="bodyMd" fontWeight="semibold">
            Reference Images
          </Text>
          <div className={styles.images_grid}>
            {data.referenceImage.map((imageUrl, index) => (
              <div key={index} className={styles.grid_image_wrapper}>
                <img
                  src={imageUrl}
                  alt={`Reference ${index}`}
                  loading="lazy"
                  className={styles.grid_image}
                  onClick={() => setImagePreviewSelected(imageUrl)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {/* Generated Images */}
      <Box paddingBlock="500">
        {data.imagens.length > 0 && (
          <div className={styles.images_section}>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h6" variant="bodyMd" fontWeight="semibold">
                Generated Images
              </Text>

              <button
                className={styles.button_download}
                onClick={() => upscaleAllImagesFlow(data.taskId)}
              >
                {loadingDownload ? (
                  <Spinner size="small" />
                ) : (
                  svgIcon(ICONS.DOWNLOAD)
                )}

                <span>Download</span>
              </button>

              {/* {data.imagens.length < 5 && (
              )} */}
            </InlineStack>
            <div className={styles.images_grid}>
              {data.imagens.map((imageUrl, index) => (
                <div key={index} className={styles.grid_image_wrapper}>
                  <img
                    src={imageUrl}
                    alt={`Generated ${index}`}
                    loading="lazy"
                    className={styles.grid_image}
                    onClick={() => setImagePreviewSelected(imageUrl)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Box>

      <Divider />

      <Box paddingBlock="500">
        <InlineGrid columns={{ xs: 2, sm: 2, md: 2 }} gap="300">
          <Box>
            <Text as="h6" variant="bodyMd" fontWeight="semibold">
              Model
            </Text>
            <Box paddingBlock="200">
              <Text as="span" variant="bodyMd">
                {data.format.charAt(0).toUpperCase() + data.format.slice(1)}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text as="h6" variant="bodyMd" fontWeight="semibold">
              Resolution
            </Text>
            <Box paddingBlock="200">
              <Text as="span" variant="bodyMd">
                {data.aspectRatio}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text as="h6" variant="bodyMd" fontWeight="semibold">
              Seed
            </Text>
            <Box paddingBlock="200">
              <Text as="span" variant="bodyMd">
                {data.taskId}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text as="h6" variant="bodyMd" fontWeight="semibold">
              Date created
            </Text>
            <Box paddingBlock="200">
              <Text as="span" variant="bodyMd">
                {new Date().toLocaleDateString()} {new Date().getHours()}:
                {new Date().getMinutes()}{" "}
                {new Date().getHours() > 12 ? "PM" : "AM"}
              </Text>
            </Box>
          </Box>
        </InlineGrid>
      </Box>
    </div>
  );
};
