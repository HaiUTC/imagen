import { useState, useEffect } from "react";
import { useImagenStore } from "../../../store/imagen.store";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import styles from "./collection-generating-float.module.css";
import { useNavigate } from "react-router-dom";
import { Icon } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";

interface CollectionGeneratingFloatProps {}

export const CollectionGeneratingFloat: React.FC<
  CollectionGeneratingFloatProps
> = () => {
  const { loadingGenerate, format, generatedImages, streamingStatus } =
    useImagenStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleImageClick = (id: string) => {
    if (id) {
      navigate(`/i/${id}`);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  useEffect(() => {
    if (loadingGenerate) {
      setDisplayImages([]);
    } else if (generatedImages[format]?.images?.length > 0) {
      setDisplayImages(generatedImages[format].images);
    }
  }, [loadingGenerate, generatedImages, format]);

  useEffect(() => {
    if (!loadingGenerate && displayImages.length > 0) {
      setIsExpanded(true);
    }
  }, [loadingGenerate, displayImages]);

  if (!loadingGenerate && displayImages.length === 0) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderImageSlots = () => {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      const hasImage = displayImages[i];
      slots.push(
        <div
          key={i}
          className={`${styles.image_slot} ${
            hasImage ? styles.has_image : ""
          } ${loadingGenerate ? styles.loading : ""}`}
        >
          {loadingGenerate ? (
            <div className={styles.loading_spinner}>
              <video
                src="/loading.webm"
                autoPlay
                loop
                muted
                className={styles.flying_icon}
              />
            </div>
          ) : hasImage ? (
            <img
              src={hasImage}
              alt={`Generated image ${i + 1}`}
              onClick={() => handleImageClick(generatedImages[format].id)}
              className={styles.generated_image}
            />
          ) : null}
        </div>
      );
    }
    return slots;
  };

  return (
    <div
      className={`${styles.float_container} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
    >
      <div className={styles.header} onClick={toggleExpanded}>
        <div className={styles.header_content}>
          <div className={styles.icon_wrapper}>
            {svgIcon(format === "generate" ? ICONS.GENERATE : ICONS.EDIT)}
          </div>
          <span className={styles.heading_text}>
            {loadingGenerate
              ? streamingStatus?.step === "analytic_request"
                ? "Analytic request"
                : streamingStatus?.step === "magic_processing"
                ? "Magic processing"
                : streamingStatus?.step === "generate_image"
                ? `Generating image ${streamingStatus?.progress || 0}%`
                : "Waiting in the slow queue..."
              : displayImages.length > 0
              ? "Generation complete!"
              : "Ready to generate"}
          </span>
        </div>
        <div className={styles.header_actions}>
          <div
            className={`${styles.expand_icon} ${
              isExpanded ? styles.expanded : ""
            }`}
          >
            {svgIcon(ICONS.NARROW_DOWN)}
          </div>
          <button
            className={styles.close_button}
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon source={XIcon} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.images_grid}>{renderImageSlots()}</div>
        </div>
      )}
    </div>
  );
};
