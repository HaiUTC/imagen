import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CollectionsImagePreview } from "./collections-image-preview";
import { CollectionsDetails } from "./collections-details";
import { CollectionsCarousel, type CarouselRef } from "./collections-carousel";
import { getImagensPaginatedFlow } from "../../flow/template/get-templates.flow";
import { useTemplateStore } from "../../store/template.store";
import type { PaginatedImagen } from "../../domain/ports/template-service.port";
import styles from "./collections.module.css";
import { GenerateField } from "../home/generate-field";
import { Box } from "@shopify/polaris";
import { CollectionGeneratingFloat } from "./collection-generating-float";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsContainerProps {
  data?: CollectionsData;
}

export const CollectionsContainer: React.FC<CollectionsContainerProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const { id: imagenId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');
  const { paginatedImages, paginationLoading } = useTemplateStore();

  const [selectedData, setSelectedData] = useState<CollectionsData | null>(
    null
  );
  const [imagePreviewSelected, setImagePreviewSelected] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isSticky, setIsSticky] = useState<boolean>(true);
  const carouselRef = useRef<CarouselRef>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<boolean>(false);
  const dataLoadedRef = useRef<string>(""); // Track loaded templateId

  // Transform PaginatedImagen to CollectionsData
  const transformToCollectionsData = (
    imagen: PaginatedImagen
  ): CollectionsData => ({
    format: imagen.format,
    taskId: imagen.taskId,
    prompt: imagen.data.prompt,
    magicPrompt: imagen.data.magic_prompt || "",
    aspectRatio: imagen.data.aspectRatio || "1:1",
    referenceImage: imagen.data.reference || [],
    imagens: imagen.imagens,
  });

  // Event handlers
  const handleBackClick = () => {
    navigate("/");
  };

  const handleCollectionSelect = (collection: CollectionsData) => {
    setSelectedData(collection);
    setSelectedCollectionId(collection.taskId);
    setImagePreviewSelected(collection.imagens[0]);
  };

  // Initialize data on component mount
  useEffect(() => {
    const currentKey = templateId || "explore";
    
    // Only load if we haven't already loaded this templateId/explore mode
    if (dataLoadedRef.current !== currentKey) {
      const initializeData = async () => {
        try {
          // Load paginated images based on templateId if provided
          if (templateId) {
            await getImagensPaginatedFlow({ templateId });
          } else {
            // Load all images for explore mode
            await getImagensPaginatedFlow();
          }
          dataLoadedRef.current = currentKey;
        } catch (error) {
          console.error("Failed to load initial collections data:", error);
        }
      };

      initializeData();
    }
  }, [templateId]);

  // Set selected data when images are loaded
  useEffect(() => {
    if (paginatedImages.data.length > 0 && !initializedRef.current) {
      // If we have an imagenId, try to find that specific imagen
      if (imagenId) {
        const targetImagen = paginatedImages.data.find(img => img._id === imagenId);
        if (targetImagen) {
          const targetData = transformToCollectionsData(targetImagen);
          setSelectedData(targetData);
          setSelectedCollectionId(targetData.taskId);
          setImagePreviewSelected(targetData.imagens[0]);
          initializedRef.current = true;
        } else {
          // If specific imagen not found, fallback to first image
          const firstImage = transformToCollectionsData(paginatedImages.data[0]);
          setSelectedData(firstImage);
          setSelectedCollectionId(firstImage.taskId);
          initializedRef.current = true;
        }
      } else {
        // No specific ID, just use the first one
        const firstImage = transformToCollectionsData(paginatedImages.data[0]);
        setSelectedData(firstImage);
        setSelectedCollectionId(firstImage.taskId);
        initializedRef.current = true;
      }
    }
  }, [paginatedImages.data, imagenId]);

  // Reset initialization when imagenId changes (navigating to different image)
  useEffect(() => {
    initializedRef.current = false;
    setSelectedData(null);
  }, [imagenId]);
  
  // Reset data loaded ref when templateId changes
  useEffect(() => {
    dataLoadedRef.current = "";
    initializedRef.current = false;
  }, [templateId]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          carouselRef.current.scrollPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          carouselRef.current.scrollNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Use provided data or fallback to first paginated image
  const displayData = data || selectedData;
  const imagePreview =
    imagePreviewSelected ||
    displayData?.imagens[0] ||
    displayData?.referenceImage[0] ||
    "";

  if (!displayData && paginatedImages.data.length === 0 && !paginationLoading) {
    return (
      <div className={styles.collections_container}>
        <div className={styles.empty_state}>
          <p>No collections found. Generate some images first!</p>
          <button onClick={() => navigate("/imagen")}>Generate Images</button>
        </div>
      </div>
    );
  }

  if (paginationLoading && paginatedImages.data.length === 0) {
    return (
      <div className={styles.collections_container}>
        <div className={styles.loading_state}>
          <p>Loading collections...</p>
        </div>
      </div>
    );
  }

  // If we still don't have displayData at this point, return empty state
  if (!displayData) {
    return (
      <div className={styles.collections_container}>
        <div className={styles.empty_state}>
          <p>No collection selected</p>
        </div>
      </div>
    );
  }

  const collections = paginatedImages.data.map(transformToCollectionsData);

  return (
    <Box>
      <GenerateField
        labelHidden
        isSticky={isSticky}
        setIsSticky={setIsSticky}
      />
      <div className={styles.collections_container}>
        <div ref={mainImageRef} className={styles.main_preview}>
          <CollectionsImagePreview
            data={displayData}
            imagePreview={imagePreview}
            onBackClick={handleBackClick}
          />
        </div>

        <div className={styles.details_panel}>
          <CollectionsDetails
            data={displayData}
            imagePreview={imagePreview}
            setImagePreviewSelected={setImagePreviewSelected}
            setIsSticky={setIsSticky}
          />
        </div>

        <CollectionsCarousel
          ref={carouselRef}
          collections={collections}
          onCollectionSelect={handleCollectionSelect}
          selectedCollectionId={selectedCollectionId}
        />
      </div>

      <CollectionGeneratingFloat />
    </Box>
  );
};

export default CollectionsContainer;
