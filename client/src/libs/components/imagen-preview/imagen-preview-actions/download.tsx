import { Box, InlineStack, Spinner, Text } from "@shopify/polaris";
import { useRef, useState } from "react";
import { ICONS, svgIcon } from "../../../constants/icons";
import { Popover, type PopoverRefResponse } from "../../popover";
import styles from "./imagen-preview-actions.module.css";
import { imagenDownloadFlow } from "../../../../flow/imagen/imagen.dowload.flow";
import { useImagenStore } from "../../../../store/imagen.store";

export const ImageGenPreviewDownload: React.FC = () => {
  const popoverRef = useRef<PopoverRefResponse>(null);
  const [active, setActive] = useState<boolean>(false);
  const { loadingDownload, isDownloaded, generatedImages, format } =
    useImagenStore();

  const handleDownload = (number: string) => {
    if (
      (number === "all" && isDownloaded) ||
      !generatedImages[format].images.length
    ) {
      return;
    }

    imagenDownloadFlow(number);
  };

  const [downloadSettings, setDownloadSettings] = useState<string>("1");

  const handleTogglePopover = () => {
    setActive(!active);
    popoverRef.current?.togglePopover();
  };

  const handleChangeDownloadSettings = (value: string) => {
    setDownloadSettings(value);
  };

  return (
    <Popover
      title="Download settings"
      ref={popoverRef}
      preventCloseOnChildOverlayClick={true}
      onClose={handleTogglePopover}
      activator={
        <button className={styles.button} onClick={handleTogglePopover}>
          {svgIcon(ICONS.DOWNLOAD)} Download
          <svg
            width="8"
            height="5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.download}
            style={{
              transform: `rotate(${active ? "180deg" : "0deg"})`,
            }}
          >
            <path
              d="M.71 1.71L3.3 4.3c.39.39 1.02.39 1.41 0L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C.52 0 .08 1.08.71 1.71z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      }
    >
      <Box width="320px">
        <Box padding="300" borderColor="border" borderBlockEndWidth="025">
          <Text as="h5" variant="headingMd">
            Download settings
          </Text>
        </Box>
        <Box padding="300">
          <InlineStack gap="500">
            <Box width="100%">
              <Box paddingBlockEnd="300">
                <Text as="span" variant="bodyLg">
                  Download image
                </Text>
              </Box>

              <InlineStack wrap={false} gap="300">
                <div
                  className={`${styles.image_format} ${
                    downloadSettings === "1" ? styles.active : ""
                  }`}
                  onClick={() => handleChangeDownloadSettings("1")}
                >
                  <span>1</span>
                </div>
                <div
                  className={`${styles.image_format} ${
                    downloadSettings === "2" ? styles.active : ""
                  }`}
                  onClick={() => handleChangeDownloadSettings("2")}
                >
                  <span>2</span>
                </div>
                <div
                  className={`${styles.image_format} ${
                    downloadSettings === "3" ? styles.active : ""
                  }`}
                  onClick={() => handleChangeDownloadSettings("3")}
                >
                  <span>3</span>
                </div>
                <div
                  className={`${styles.image_format} ${
                    downloadSettings === "4" ? styles.active : ""
                  }`}
                  onClick={() => handleChangeDownloadSettings("4")}
                >
                  <span>4</span>
                </div>
                <div
                  className={`${styles.image_format} ${
                    downloadSettings === "all" ? styles.active : ""
                  }`}
                  onClick={() => handleChangeDownloadSettings("all")}
                >
                  <span>All</span>
                </div>
              </InlineStack>
            </Box>
          </InlineStack>
        </Box>

        <Box paddingInline="300" paddingBlockEnd="200" paddingBlockStart="400">
          <button
            className={styles.submit}
            onClick={() => handleDownload(downloadSettings)}
          >
            {loadingDownload ? <Spinner size="small" /> : <span>Download</span>}
          </button>
        </Box>
      </Box>
    </Popover>
  );
};
