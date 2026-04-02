// Lightweight client-side image compressor
// Usage: const dataUrl = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
export async function compressImage(
  file: File,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options || {};

  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  const dataUrl = await fileToDataURL(file);

  // Create an image element to measure and draw
  const img = await loadImage(dataUrl);

  // Calculate target dimensions while preserving aspect ratio
  let { width, height } = img;
  const ratio = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / ratio);
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * ratio);
  }

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Fill white background for JPEG to avoid transparency issues
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to JPEG data URL with given quality
  const compressed = canvas.toDataURL("image/jpeg", quality);
  return compressed;
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
