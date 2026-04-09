export type SealShape = "circle" | "oval" | "square" | "horizontal" | "badge";

export type SealConfig = {
  templateId: string;
  title: string;
  shape: SealShape;
  primaryText: string;
  secondaryText: string;
  centerText: string;
  footerText: string;
  dateText: string;
  serialText: string;
  color: string;
  borderWidth: number;
  fontFamily: string;
  logoDataUrl?: string;
  watermark?: boolean;
};

export type SealTemplate = {
  id: string;
  name: string;
  category: "Packaging" | "Documents" | "Branding";
  description: string;
  config: SealConfig;
};

export type SavedStamp = {
  id: string;
  name: string;
  imagePath: string;
  sourceType: string;
  createdAt?: string;
};

export type StampPlacement = {
  id: string;
  x: number;
  y: number;
  width: number;
  opacity: number;
  rotation: number;
  page: number;
  previewWidth: number;
  previewHeight: number;
  stampDataUrl: string;
};
