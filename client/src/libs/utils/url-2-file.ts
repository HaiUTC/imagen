export async function urlToFile(
  url: string,
  filename: string,
  mimeType = "image/jpeg"
): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}
