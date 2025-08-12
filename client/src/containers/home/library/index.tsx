import { Box, InlineStack } from "@shopify/polaris";
import { useEffect, useCallback, useRef, useState } from "react";
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const masonryRef = useRef<HTMLDivElement>(null);

  const calculateGridRowSpan = useCallback((imageHeight: number, imageWidth: number) => {
    if (!masonryRef.current) return 20;
    
    // Get the actual column width from the computed styles
    const computedStyle = window.getComputedStyle(masonryRef.current);
    const gap = parseInt(computedStyle.gap) || 12;
    const gridAutoRows = parseInt(computedStyle.gridAutoRows) || 10;
    
    // Calculate the aspect ratio and determine the height needed
    const aspectRatio = imageHeight / imageWidth;
    const columnWidth = 250; // Base width from minmax
    const neededHeight = columnWidth * aspectRatio;
    
    // Calculate how many grid rows this image needs
    const rowSpan = Math.ceil((neededHeight + gap) / (gridAutoRows + gap));
    return Math.max(rowSpan, 1);
  }, []);

  const handleImageLoad = useCallback((imageUrl: string, naturalHeight: number, naturalWidth: number) => {
    const rowSpan = calculateGridRowSpan(naturalHeight, naturalWidth);
    setImageHeights(prev => ({
      ...prev,
      [imageUrl]: rowSpan
    }));
  }, [calculateGridRowSpan]);

  const allGeneratedImages = [
    ...generatedImages.generate.images,
    ...generatedImages.edit.images,
  ];

  // Keep the generated images separate for fallback

  const loadMore = useCallback(async () => {
    if (paginationLoading || !paginatedImages.hasNext) return;
    await loadMoreImagesFlow();
  }, [paginationLoading, paginatedImages.hasNext]);

  // Intersection Observer for infinite scroll
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (paginationLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && paginatedImages.hasNext) {
          loadMore();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [paginationLoading, paginatedImages.hasNext, loadMore]
  );

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
        <div ref={masonryRef} className={styles.masonry}>
          {paginatedImages.data.length > 0 ? (
            paginatedImages.data
              .filter((imagen) => imagen.imagens && imagen.imagens.length > 0)
              .map((imagen, index) => {
                const isLast = index === paginatedImages.data.length - 1;
                const imageUrl = imagen.imagens[imagen.imagens.length - 1]; // Get last image
                const gridRowSpan = imageHeights[imageUrl] || 20; // Default span
                
                return (
                  <div
                    key={`template-${imagen._id}-${index}`}
                    className={styles.masonryItem}
                    style={{
                      gridRowEnd: `span ${gridRowSpan}`
                    }}
                    ref={
                      isLast && paginatedImages.hasNext
                        ? lastImageElementRef
                        : null
                    }
                  >
                    <ImagenLibraryPreview 
                      src={imageUrl} 
                      imagenId={imagen._id}
                      templateId={currentTemplateId}
                      onImageLoad={handleImageLoad}
                    />
                  </div>
                );
              })
          ) : allGeneratedImages.length > 0 ? (
            allGeneratedImages.map((imageUrl, index) => {
              const gridRowSpan = imageHeights[imageUrl] || 20; // Default span
              
              // Try to find which generated image set this image belongs to
              const generateId = generatedImages.generate.images.includes(imageUrl) 
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
                    gridRowEnd: `span ${gridRowSpan}`
                  }}
                >
                  <ImagenLibraryPreview 
                    src={imageUrl} 
                    imagenId={imagenId || undefined}
                    onImageLoad={handleImageLoad}
                  />
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <p>No images available</p>
            </div>
          )}
          {paginationLoading && (
            <div className={styles.loadingIndicator}>
              <p>Loading more images...</p>
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
};
