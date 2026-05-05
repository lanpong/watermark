export default async function download(dataUrl, fileName) {
  if (navigator.share && navigator.canShare) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file] });
      }
    } catch {
      // fallback to normal download
    }
  }

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(blobUrl);
}
