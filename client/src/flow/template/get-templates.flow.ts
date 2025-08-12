import { templateService } from "../../infrastructure/services/template.service";
import { useTemplateStore } from "../../store/template.store";

export const getTemplatesFlow = async () => {
  const { setLoading, setTemplates } = useTemplateStore.getState();

  setLoading(true);

  try {
    const templates = await templateService.getAllTemplates();
    setTemplates(templates);
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const getImagensPaginatedFlow = async (
  params: {
    templateId?: string;
    beforeId?: string;
    append?: boolean;
  } = {}
) => {
  const {
    setPaginationLoading,
    setPaginatedImages,
    appendPaginatedImages,
    setCurrentTemplateId,
    clearPaginatedImages,
  } = useTemplateStore.getState();

  setPaginationLoading(true);

  try {
    // If it's a new template/explore mode or first load, clear existing data
    if (!params.beforeId && !params.append) {
      clearPaginatedImages();
      if (params.templateId) {
        setCurrentTemplateId(params.templateId);
      }
    }

    const paginationResult = await templateService.getImagensPaginated({
      templateId: params.templateId,
      beforeId: params.beforeId,
    });

    // Transform the result to match our store structure
    const transformedResult = {
      data: paginationResult.data,
      count: paginationResult.count,
      beforeId: paginationResult.beforeId,
      hasNext: paginationResult.hasNext,
      hasPrevious: paginationResult.hasPrevious,
    };

    if (params.append) {
      appendPaginatedImages(transformedResult);
    } else {
      setPaginatedImages(transformedResult);
    }

    return transformedResult;
  } catch (error) {
    console.error("Failed to fetch paginated images:", error);
    throw error;
  } finally {
    setPaginationLoading(false);
  }
};

export const loadMoreImagesFlow = async () => {
  const { paginatedImages, currentTemplateId } = useTemplateStore.getState();

  if (!paginatedImages.hasNext || !paginatedImages.beforeId) {
    return;
  }

  return getImagensPaginatedFlow({
    templateId: currentTemplateId || undefined,
    beforeId: paginatedImages.beforeId,
    append: true,
  });
};
