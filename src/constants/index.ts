export const sampleImages = [
  "https://images.unsplash.com/photo-1647806422508-0322f33e270b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1581562444313-98be7b621dc2?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1642365585811-17521651de66?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1606225457115-9b0de873c5db?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1038&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1642776187219-4ad67f76df18?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const photoIdSizes = [
  { value: "us-51x51", country: "US", size: "51x51 mm" },
  { value: "myanmar-35x45", country: "MM", size: "35x45 mm" },
  { value: "uk-35x45", country: "UK", size: "35x45 mm" },
  { value: "canada-35x45", country: "CA", size: "35x45 mm" },
  { value: "germany-35x45", country: "DE", size: "35x45 mm" },
  { value: "france-35x45", country: "FR", size: "35x45 mm" },
  { value: "japan-35x45", country: "JP", size: "35x45 mm" },
  { value: "india-35x45", country: "IN", size: "35x45 mm" },
  { value: "brazil-50x70", country: "BR", size: "50x70 mm" },
  { value: "china-33x48", country: "CN", size: "33x48 mm" },
];

export function getSampleImagesAppendHeroText() {
  const modSampleImages = sampleImages.slice(0, 4);
  modSampleImages.splice(1, 0, "hero_text");
  return modSampleImages;
}
