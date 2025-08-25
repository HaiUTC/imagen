import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CollectionsImagePreview } from "./collections-image-preview";
import { CollectionsDetails } from "./collections-details";
import {
  CollectionsCarousel,
  type CarouselRef,
  type CollectionsData,
} from "./collections-carousel";
import { getImagensPaginatedFlow } from "../../flow/template/get-templates.flow";
import { useTemplateStore } from "../../store/template.store";
import styles from "./collections.module.css";
import { GenerateField } from "../home/generate-field";
import { Box } from "@shopify/polaris";
import { CollectionGeneratingFloat } from "./collection-generating-float";
import { useImagenDetailStore, useImagenStore } from "../../store/imagen.store";
import { getImagenFlow } from "../../flow/template/get-imagen.flow";

export const CollectionsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { id: imagenId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  const { imagenDetail, loading } = useImagenDetailStore();
  const { paginatedImages } = useTemplateStore();

  const [imagePreviewSelected, setImagePreviewSelected] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isSticky, setIsSticky] = useState<boolean>(true);
  const carouselRef = useRef<CarouselRef>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<boolean>(false);
  const dataLoadedRef = useRef<string>(""); // Track loaded templateId
  const { clearData } = useImagenStore.getState();

  // Event handlers
  const handleBackClick = () => {
    navigate("/");
  };

  const handleCollectionSelect = (collection: CollectionsData) => {
    navigate(`/i/${collection._id}`);
    getImagenFlow(collection._id);
    setSelectedCollectionId(collection._id);
    setImagePreviewSelected(collection.imagen);
  };

  useEffect(() => clearData, []);

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

  // Reset initialization when imagenId changes (navigating to different image)
  useEffect(() => {
    initializedRef.current = false;
  }, [imagenId]);

  // Reset data loaded ref when templateId changes
  useEffect(() => {
    dataLoadedRef.current = "";
    initializedRef.current = false;

    if (imagenId) {
      getImagenFlow(imagenId);
    }
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
  const displayData = imagenDetail;
  const imagePreview = imagePreviewSelected || displayData?.imagens[0] || "";

  if (!displayData?.imagens) {
    return (
      <div className={styles.collections_container}>
        <div className={styles.empty_state}>
          <p>No collections found. Generate some images first!</p>
          <button onClick={() => navigate("/imagen")}>Generate Images</button>
        </div>
      </div>
    );
  }

  if (loading && !imagenDetail?.imagens.length) {
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

  const collections = paginatedImages.data.map((imagen) => ({
    _id: imagen._id,
    status: imagen.status,
    format: imagen.format,
    imagen: imagen.imagen,
  }));

  return (
    <Box>
      <GenerateField
        labelHidden
        isSticky={isSticky}
        setIsSticky={setIsSticky}
      />
      <div className={styles.collections_container}>
        {!displayData ? (
          <div className={styles.loading_state}>
            <p>Not found data</p>
          </div>
        ) : (
          <Fragment>
            <div ref={mainImageRef} className={styles.main_preview}>
              <CollectionsImagePreview
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
          </Fragment>
        )}

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
