import { Box, InlineStack } from "@shopify/polaris";
import { useEffect, useCallback, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import styles from "./library.module.css";
import { ImagenLibraryPreview } from "./preview";
import { useImagenStore } from "../../../store/imagen.store";
import { useTemplateStore } from "../../../store/template.store";
import {
  getTemplatesFlow,
  getImagensPaginatedFlow,
  loadMoreImagesFlow,
} from "../../../flow/template/get-templates.flow";

export interface LibraryProps {
  isSticky: boolean;
}

export const Library: React.FC<LibraryProps> = ({ isSticky }) => {
  const { generatedImages } = useImagenStore();
  const {
    templates,
    paginatedImages,
    currentTemplateId,
    setCurrentTemplateId,
    paginationLoading,
  } = useTemplateStore();

  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const masonryRef = useRef<HTMLDivElement>(null);

  const calculateGridRowSpan = useCallback(
    (imageHeight: number, imageWidth: number) => {
      if (!masonryRef.current) return 20;

      // Get the actual computed styles
      const computedStyle = window.getComputedStyle(masonryRef.current);
      const gap = parseInt(computedStyle.gap) || 10;
      const gridAutoRows = parseInt(computedStyle.gridAutoRows) || 10;

      // Get the actual column width by measuring the grid
      const containerWidth = masonryRef.current.offsetWidth;
      const paddingLeft = parseInt(computedStyle.paddingLeft) || 10;
      const paddingRight = parseInt(computedStyle.paddingRight) || 10;
      const availableWidth = containerWidth - paddingLeft - paddingRight;

      // Calculate number of columns based on current grid setup
      const gridColumns = computedStyle.gridTemplateColumns;
      let columnCount = 5; // default

      if (gridColumns.includes("repeat(")) {
        const match = gridColumns.match(
          /repeat\((\d+),|repeat\(auto-fill,.*minmax\((\d+)px/
        );
        if (match) {
          if (match[1]) {
            columnCount = parseInt(match[1]);
          } else if (match[2]) {
            const minColumnWidth = parseInt(match[2]);
            columnCount = Math.floor(
              (availableWidth + gap) / (minColumnWidth + gap)
            );
          }
        }
      }

      // Calculate actual column width
      const columnWidth =
        (availableWidth - gap * (columnCount - 1)) / columnCount;

      // Calculate the aspect ratio and determine the height needed
      const aspectRatio = imageHeight / imageWidth;
      const neededHeight = columnWidth * aspectRatio;

      // Calculate how many grid rows this image needs
      const rowSpan = Math.ceil(neededHeight / (gridAutoRows * 2));
      return Math.max(rowSpan, 1);
    },
    []
  );

  const handleImageLoad = useCallback(
    (imageUrl: string, naturalHeight: number, naturalWidth: number) => {
      const rowSpan = calculateGridRowSpan(naturalHeight, naturalWidth);
      setImageHeights((prev) => ({
        ...prev,
        [imageUrl]: rowSpan,
      }));
    },
    [calculateGridRowSpan]
  );

  const allGeneratedImages = [
    ...generatedImages.generate.images,
    ...generatedImages.edit.images,
  ];

  // Keep the generated images separate for fallback
  const loadMore = useCallback(async () => {
    if (paginationLoading || !paginatedImages.hasNext) return;
    await loadMoreImagesFlow();
  }, [paginationLoading, paginatedImages.hasNext]);

  useEffect(() => {
    getTemplatesFlow();
    // Fetch explore images by default (all images without template filter)
    getImagensPaginatedFlow();
  }, []);

  const handleExploreClick = async () => {
    setCurrentTemplateId(null);
    await getImagensPaginatedFlow({ templateId: undefined });
  };

  const handleTemplateClick = async (templateId: string) => {
    setCurrentTemplateId(templateId);
    await getImagensPaginatedFlow({ templateId });
  };

  return (
    <Box paddingBlock="1000">
      <div
        className={styles.container}
        style={{ top: isSticky ? "65px" : "120px" }}
      >
        <InlineStack gap="200">
          <Box paddingInlineEnd="100">
            <InlineStack gap="150">
              <button className={styles.search}>{svgIcon(ICONS.SEARCH)}</button>
              <button
                className={`${styles.button} ${
                  !currentTemplateId ? styles.button_selected : ""
                }`}
                onClick={handleExploreClick}
              >
                Explore
              </button>
            </InlineStack>
          </Box>
          <Box borderInlineEndWidth="025" borderColor="border-hover"></Box>
          <Box paddingInlineStart="100">
            <InlineStack gap="200">
              {templates.map((template) => (
                <button
                  key={template._id}
                  className={`${styles.button} ${
                    currentTemplateId === template._id
                      ? styles.button_selected
                      : ""
                  }`}
                  onClick={() => handleTemplateClick(template._id)}
                >
                  {template.name}
                </button>
              ))}
            </InlineStack>
          </Box>
        </InlineStack>
      </div>

      <Box>
        {paginatedImages.data.length > 0 ? (
          <InfiniteScroll
            dataLength={paginatedImages.data.length}
            next={loadMore}
            hasMore={paginatedImages.hasNext}
            loader={
              <div className={styles.loadingIndicator}>
                <p>Loading more images...</p>
              </div>
            }
            endMessage={
              <div className={styles.endMessage}>
                <p>You've seen all images!</p>
              </div>
            }
            scrollThreshold={0.9}
            scrollableTarget="scroll-container"
          >
            <div ref={masonryRef} className={styles.masonry}>
              {paginatedImages.data
                .filter((imagen) => imagen.status === "SUCCESS")
                .map((imagen) => {
                  const imageUrl = imagen.imagen; // Get last image
                  const gridRowSpan = imageHeights[imageUrl] || 20; // Default span

                  return (
                    <div
                      key={imagen._id}
                      className={styles.masonryItem}
                      style={{
                        gridRowEnd: `span ${gridRowSpan}`,
                      }}
                    >
                      <ImagenLibraryPreview
                        src={imageUrl}
                        imagenId={imagen._id}
                        templateId={currentTemplateId}
                        updatedAt={imagen.updatedAt}
                        onImageLoad={handleImageLoad}
                      />
                    </div>
                  );
                })}
            </div>
          </InfiniteScroll>
        ) : allGeneratedImages.length > 0 ? (
          <div ref={masonryRef} className={styles.masonry}>
            {allGeneratedImages.map((imageUrl, index) => {
              const gridRowSpan = imageHeights[imageUrl] || 20; // Default span

              // Try to find which generated image set this image belongs to
              const generateId = generatedImages.generate.images.includes(
                imageUrl
              )
                ? generatedImages.generate.id
                : null;
              const editId = generatedImages.edit.images.includes(imageUrl)
                ? generatedImages.edit.id
                : null;
              const imagenId = generateId || editId;

              return (
                <div
                  key={`generated-${index}`}
                  className={styles.masonryItem}
                  style={{
                    gridRowEnd: `span ${gridRowSpan}`,
                  }}
                >
                  <ImagenLibraryPreview
                    src={imageUrl}
                    imagenId={imagenId || undefined}
                    onImageLoad={handleImageLoad}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No images available</p>
          </div>
        )}
      </Box>
    </Box>
  );
};
