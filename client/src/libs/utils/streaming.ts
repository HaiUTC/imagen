export const streamingResponse = async (
  body: ReadableStream<Uint8Array<ArrayBufferLike>> | null,
  onEvent: (event: any) => void
) => {
  if (!body) {
    throw new Error("Streaming not supported");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.substring(6));
            onEvent(data);
          } catch (e) {
            console.warn("Failed to parse streaming data:", e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
