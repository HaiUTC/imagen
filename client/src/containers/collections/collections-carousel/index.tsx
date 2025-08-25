import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import styles from "./collections-carousel.module.css";

export interface CollectionsData {
  _id: string;
  status: string;
  format: string;
  imagen: string;
}

export interface CarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollToIndex: (index: number) => void;
}

interface CollectionsCarouselProps {
  collections: CollectionsData[];
  onCollectionSelect: (collection: CollectionsData) => void;
  selectedCollectionId?: string;
}

export const CollectionsCarousel = forwardRef<
  CarouselRef,
  CollectionsCarouselProps
>(({ collections, onCollectionSelect, selectedCollectionId }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to next item
  const scrollNext = () => {
    if (currentIndex < collections.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      // onCollectionSelect(transformCollection(collections[nextIndex]));
      scrollToIndex(nextIndex);
    }
  };

  // Navigate to previous item
  const scrollPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      // onCollectionSelect(transformCollection(collections[prevIndex]));
      scrollToIndex(prevIndex);
    }
  };

  // Update current index when selectedCollectionId changes
  useEffect(() => {
    const index = collections.findIndex((c) => c._id === selectedCollectionId);
    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
      scrollToIndex(index);
    }
  }, [selectedCollectionId, collections, currentIndex]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    const itemWidth = 64 + 12; // item width + gap
    const itemsVisible = Math.floor(containerWidth / itemWidth);

    // Calculate scroll position to keep the selected item visible
    const scrollLeft = Math.max(
      0,
      Math.min(
        itemWidth * index - (containerWidth - itemWidth) / 2,
        itemWidth * (collections.length - itemsVisible)
      )
    );

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  // Expose scroll methods via ref
  useImperativeHandle(ref, () => ({
    scrollNext,
    scrollPrev,
    scrollToIndex,
  }));

  // Initialize current index
  useEffect(() => {
    if (collections.length > 0) {
      const index = collections.findIndex(
        (c) => c._id === selectedCollectionId
      );
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [collections, selectedCollectionId]);

  const handleCollectionClick = (collection: CollectionsData) => {
    const index = collections.findIndex((c) => c._id === collection._id);
    if (index !== -1) {
      setCurrentIndex(index);
      onCollectionSelect(collection);
      scrollToIndex(index);
    }
  };

  return (
    <div className={styles.carousel_container}>
      <div ref={scrollContainerRef} className={styles.carousel_content}>
        {collections.map((collection) => (
          <div
            key={collection._id}
            className={`${styles.carousel_item} ${
              selectedCollectionId === collection._id ? styles.selected : ""
            }`}
            onClick={() => handleCollectionClick(collection)}
            style={{
              backgroundImage: `url(${collection.imagen})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
});
