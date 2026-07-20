export async function downloadFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(blobUrl);
}
