// Function to download an image from a single URL
const downloadImage = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;

    // Set a default filename based on index or use URL-based name
    const filename = url.split("/").pop();
    a.download = filename || "image";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(`Failed to download image ${url}:`, error);
  }
};

export const downloadImagesFromArray = async (
  imageUrls: string[]
): Promise<void> => {
  for (let i = 0; i < imageUrls.length; i++) {
    if (imageUrls[i]) {
      await downloadImage(imageUrls[i]);
    }
  }
};
