import styles from "./imagen-preview.module.css";
import { ImagenPreviewAnimation } from "../imagen-preview-animation";
import { EmptyImagePreview } from "./empty";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImagenStore } from "../../../../store/imagen.store";

interface ImageGenPreviewProps {
  images?: string[];
  loading?: boolean;
}

export const ImageGenPreview: React.FC<ImageGenPreviewProps> = ({
  images,
  loading,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(images?.[0] || "");
  const navigate = useNavigate();
  const { generatedImages, format } = useImagenStore();

  const handleImageClick = (imageUrl: string) => {
    // Find the imagen ID for this image
    const currentGenerated = format ? generatedImages[format] : null;
    if (currentGenerated && currentGenerated.images.includes(imageUrl) && currentGenerated.id) {
      navigate(`/i/${currentGenerated.id}`);
    }
  };

  useEffect(() => {
    setSelectedImage(images?.[0] || "");
  }, [images]);

  return (
    <div
      className={`${styles.imagen_preview_container} ${
        images?.length ? styles.imagen_preview_container_large : ""
      }`}
    >
      <div className={styles.imagen_preview_content}>
        {images?.length ? (
          <div className={styles.imagen_preview_image}>
            <div className={styles.imagen_preview_image_container}>
              <img
                src={selectedImage || images?.[0]}
                className={`${styles.imagen_preview_image_img} ${
                  loading ? styles.imagen_preview_image_img_loading : ""
                }`}
                onClick={() => !loading && handleImageClick(selectedImage || images?.[0] || "")}
                style={{ cursor: loading ? "default" : "pointer" }}
              />

              {loading && <ImagenPreviewAnimation />}
            </div>
            <div className={styles.gallery}>
              {images.length > 1 &&
                images?.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.gallery_item} ${
                      selectedImage === image
                        ? styles.gallery_item_selected
                        : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      className={`${styles.imagen_preview_image_img} ${
                        loading ? styles.imagen_preview_image_img_loading : ""
                      }`}
                      onClick={() => setSelectedImage(image)}
                      onDoubleClick={() => !loading && handleImageClick(image)}
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <EmptyImagePreview />
        )}
      </div>
    </div>
  );
};
