// PreviewImage.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./modal-preview.module.css";
import type { ImageGenerated } from "../../../store/generate-image.store";

export interface ModalPreviewAction {
  label: string;
  status: "default" | "primary" | "danger";
  onAction: (
    selectedImageId: number | null,
    onClosePreview: () => void
  ) => void;
}

export interface ModalPreviewProps {
  images: ImageGenerated[];
  columns?: number;
  actions?: ModalPreviewAction[];
  imageStyles?: React.CSSProperties;
}

export const ModalPreview: React.FC<ModalPreviewProps> = ({
  images,
  columns,
  actions,
  imageStyles,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Create a mapping from image ID to array index
  const imageIdToIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    images.forEach((img, index) => {
      map.set(img.id, index);
    });
    return map;
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImageId) {
        closePreview();
      }
    };

    if (showOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImageId, showOverlay]);

  const openPreview = (id: number) => {
    setSelectedImageId(id);
    setShowOverlay(true);
    setTimeout(() => setIsAnimating(true), 20);
  };

  const closePreview = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowOverlay(false);
      setSelectedImageId(null);
    }, 200);
  };

  const getImageStyles = (imageId: number) => {
    const isSelected = selectedImageId === imageId;

    if (!isSelected) {
      return {};
    }

    // Use the mapping to get the correct array index
    const imageIndex = imageIdToIndexMap.get(imageId);
    if (imageIndex === undefined) return {};

    const img = imageRefs.current[imageIndex];
    if (!img) return {};

    const rect = img.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxWidth = vw * 0.8;
    const maxHeight = vh * 0.8;
    const scaleX = maxWidth / rect.width;
    const scaleY = maxHeight / rect.height;
    const scale = Math.min(scaleX, scaleY);

    const translateX = vw / 2 - (rect.left + rect.width / 2);
    const translateY = vh / 2 - (rect.top + rect.height / 2);

    return {
      transform: isAnimating
        ? `translate(${translateX}px, ${translateY}px) scale(${scale})`
        : "none",
      zIndex: isAnimating ? 1002 : 1,
      borderRadius: isAnimating ? "1px" : "4px",
      transition:
        "transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1), border-radius 0.2s ease",
      boxShadow: "none",
    };
  };

  const handleOverlayClick = () => {
    closePreview();
  };

  const handleImageClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImageId) {
      openPreview(id);
    } else {
      closePreview();
    }
  };

  return (
    <div
      className={`${styles["preview-container"]} ${
        showOverlay ? styles["modal-active"] : ""
      }`}
    >
      <div
        className={styles["image-grid"]}
        style={{ "--column-grid-mp": columns || 4 } as React.CSSProperties}
      >
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`${styles["image-wrapper"]} ${
              selectedImageId === img.id ? styles["selected"] : ""
            }`}
          >
            <img
              src={img.url}
              alt={`Image ${img.id}`}
              className={`${styles["grid-image"]} ${
                selectedImageId === img.id ? styles["selected"] : ""
              }`}
              onClick={(e) => handleImageClick(img.id, e)}
              ref={(el) => {
                imageRefs.current[idx] = el;
              }}
              style={{ ...getImageStyles(img.id), ...imageStyles }}
            />
          </div>
        ))}
        {/* Overlay with proper z-index */}
        {showOverlay && (
          <div
            className={`${styles["modal-overlay"]} ${
              isAnimating ? styles["active"] : ""
            }`}
            onClick={handleOverlayClick}
          />
        )}

        {/* Button below image when modal is open */}
        {showOverlay && actions && actions.length && (
          <div
            className={`${styles["modal-button"]} ${
              isAnimating ? styles["active"] : ""
            }`}
          >
            {actions?.map((action, index) => (
              <button
                key={index}
                className={`${styles.button} ${styles[action.status]}`}
                onClick={() => action.onAction(selectedImageId, closePreview)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
