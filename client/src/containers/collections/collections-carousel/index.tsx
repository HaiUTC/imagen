import { useState } from "react";
import styles from "./collections-carousel.module.css";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsCarouselProps {
  collections: CollectionsData[];
  onCollectionSelect: (collection: CollectionsData) => void;
  selectedCollectionId?: string;
}

export const CollectionsCarousel: React.FC<CollectionsCarouselProps> = ({
  collections,
  onCollectionSelect,
  selectedCollectionId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (e.currentTarget as HTMLElement).offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (e.currentTarget as HTMLElement).offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCollectionClick = (collection: CollectionsData) => {
    onCollectionSelect(collection);
  };

  return (
    <div className={styles.carousel_container}>
      <div
        className={styles.carousel_content}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {collections.map((collection) => (
          <div
            key={collection.taskId}
            className={`${styles.carousel_item} ${
              selectedCollectionId === collection.taskId ? styles.selected : ""
            }`}
            onClick={() => handleCollectionClick(collection)}
            style={{
              backgroundImage: `url(${
                collection.imagens[collection.imagens.length - 1] ||
                collection.referenceImage[collection.referenceImage.length - 1]
              })`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
