import { imagenService } from "../../infrastructure/services/imagen.service";
import { useImagenStore, type StreamingStatus } from "../../store/imagen.store";

export const generateImageFlow = async () => {
  const {
    data,
    setLoadingGenerate,
    setGeneratedImages,
    setTaskIdGenerated,
    isStreamingEnabled,
    setStreamingStatus,
  } = useImagenStore.getState();

  const formData = new FormData();

  setLoadingGenerate(true);
  setStreamingStatus(null);

  try {
    formData.append("prompt", data.generate.prompt);
    formData.append("n", data.generate.n.toString());
    formData.append("aspect_ratio", data.generate.aspect_ratio);
    formData.append("style", data.generate.style);
    if (data.generate.image) {
      data.generate.image.forEach((image) => {
        formData.append("images", image);
      });
    }
    if (data.generate.perspective) {
      formData.append("perspectives", data.generate.perspective);
    }

    if (isStreamingEnabled) {
      // Use streaming version
      let finalResult: any = null;

      await imagenService.generateImageStreaming(formData, (event) => {
        console.log("Streaming event:", event);

        if (event.type === "final_result") {
          finalResult = event;
          return;
        }

        const streamingStatus: StreamingStatus = {
          step: event.step,
          type: event.type,
          progress: event.progress,
          message: getStepMessage(event.step, event.type, event.data),
          data: event.data,
        };

        setStreamingStatus(streamingStatus);

        if (event.type === "workflow_complete" && event.data) {
          setTaskIdGenerated(event.data.taskId || "");
          setGeneratedImages("generate", {
            images: event.data.images || [],
            id: event.data.imagenId || "",
            taskId: event.data.taskId || "",
          });
        }
      });

      // Handle final result if it wasn't processed in the event handler
      if (finalResult) {
        setTaskIdGenerated(finalResult.taskId || "");
        setGeneratedImages("generate", {
          images: finalResult.images || [],
          id: finalResult.id || "",
          taskId: finalResult.taskId || "",
        });
      }
    } else {
      // Use traditional version
      const { images, taskId, id } = await imagenService.generateImage(
        formData
      );
      setTaskIdGenerated(taskId);
      setGeneratedImages("generate", {
        images,
        id,
        taskId,
      });
    }
  } catch (error) {
    console.error("Error in generateImageFlow:", error);
    setStreamingStatus({
      step: "workflow",
      type: "workflow_error",
      progress: 0,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  } finally {
    setLoadingGenerate(false);
    // Clear streaming status after a delay
    setTimeout(() => setStreamingStatus(null), 3000);
  }
};

const getStepMessage = (step: string, type: string, data?: any): string => {
  const messages: Record<string, Record<string, string>> = {
    analytic_image: {
      step_start: "Analyzing and uploading images to S3...",
      step_complete: "Image analysis complete ✓",
    },
    magic_processing: {
      step_start: "Generating magic prompt...",
      step_complete: "Magic prompt generated ✓",
    },
    generate_image: {
      step_start: "Starting image generation...",
      step_progress:
        data?.message || `Generating images... ${data?.process || 0}%`,
      step_complete: "Image generation complete ✓",
    },
    workflow: {
      workflow_complete: "Generation workflow completed successfully ✓",
      workflow_error: "Generation workflow failed ✗",
    },
  };

  return messages[step]?.[type] || `${step} - ${type}`;
};
