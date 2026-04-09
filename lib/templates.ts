import { SealTemplate } from "@/lib/types";

const baseCircle = {
  shape: "circle" as const,
  borderWidth: 18,
  fontFamily: "Georgia, serif",
  color: "#D51F1F",
  footerText: "TRANSPARENT EXPORT",
  dateText: "2026-04-02",
  serialText: "NO. 0001",
  logoDataUrl: ""
};

const baseRect = {
  shape: "square" as const,
  borderWidth: 16,
  fontFamily: "'Times New Roman', serif",
  color: "#D51F1F",
  footerText: "READY TO USE",
  dateText: "2026-04-02",
  serialText: "DOC-001",
  logoDataUrl: ""
};

const baseHorizontal = {
  shape: "horizontal" as const,
  borderWidth: 12,
  fontFamily: "Arial, sans-serif",
  color: "#1F4ED8",
  footerText: "DIGITAL STAMP",
  dateText: "2026-04-02",
  serialText: "HX-100",
  logoDataUrl: ""
};

export const SEAL_TEMPLATES: SealTemplate[] = [
  {
    id: "thank-you-round",
    name: "Thank You Seal",
    category: "Packaging",
    description: "For thank-you notes and package inserts.",
    config: {
      templateId: "thank-you-round",
      title: "Thank You Seal",
      ...baseCircle,
      primaryText: "THANK YOU",
      secondaryText: "PACKED WITH CARE",
      centerText: "SMALL\nBUSINESS"
    }
  },
  {
    id: "handmade-round",
    name: "Handmade Seal",
    category: "Packaging",
    description: "For handmade and artisan goods.",
    config: {
      templateId: "handmade-round",
      title: "Handmade Seal",
      ...baseCircle,
      primaryText: "HANDMADE",
      secondaryText: "WITH LOVE",
      centerText: "CRAFTED\nBY HAND"
    }
  },
  {
    id: "premium-badge",
    name: "Premium Badge",
    category: "Branding",
    description: "A classic premium product mark.",
    config: {
      templateId: "premium-badge",
      title: "Premium Badge",
      shape: "badge",
      borderWidth: 18,
      fontFamily: "Georgia, serif",
      color: "#111827",
      primaryText: "PREMIUM",
      secondaryText: "QUALITY",
      centerText: "EST.\n2026",
      footerText: "SIGNATURE COLLECTION",
      dateText: "2026",
      serialText: "BRAND-01",
      logoDataUrl: ""
    }
  },
  {
    id: "approved-doc",
    name: "Approved Document Stamp",
    category: "Documents",
    description: "For document workflow markers.",
    config: {
      templateId: "approved-doc",
      title: "Approved",
      ...baseRect,
      primaryText: "APPROVED",
      secondaryText: "INTERNAL USE",
      centerText: "PASSED"
    }
  },
  {
    id: "paid-doc",
    name: "Paid Stamp",
    category: "Documents",
    description: "For invoices and receipts.",
    config: {
      templateId: "paid-doc",
      title: "Paid Stamp",
      ...baseRect,
      primaryText: "PAID",
      secondaryText: "IN FULL",
      centerText: "RECEIVED"
    }
  },
  {
    id: "received-horizontal",
    name: "Received Stamp",
    category: "Documents",
    description: "Wide stamp for received paperwork.",
    config: {
      templateId: "received-horizontal",
      title: "Received",
      ...baseHorizontal,
      primaryText: "RECEIVED",
      secondaryText: "DOCUMENT CONTROL",
      centerText: "OK"
    }
  },
  {
    id: "invoice-seal",
    name: "Invoice Stamp",
    category: "Documents",
    description: "For invoices, payment notices, and office paperwork.",
    config: {
      templateId: "invoice-seal",
      title: "Invoice Stamp",
      ...baseCircle,
      primaryText: "INVOICE",
      secondaryText: "READY FOR PAYMENT",
      centerText: "PAID\nSOON"
    }
  },
  {
    id: "packed-care",
    name: "Packed With Care",
    category: "Packaging",
    description: "Small business packaging seal.",
    config: {
      templateId: "packed-care",
      title: "Packed With Care",
      ...baseCircle,
      primaryText: "PACKED",
      secondaryText: "WITH CARE",
      centerText: "FOR\nYOU"
    }
  },
  {
    id: "checked-square",
    name: "Checked Stamp",
    category: "Packaging",
    description: "For quality check and fulfillment flow.",
    config: {
      templateId: "checked-square",
      title: "Checked Stamp",
      ...baseRect,
      primaryText: "CHECKED",
      secondaryText: "QUALITY VERIFIED",
      centerText: "OK"
    }
  },
  {
    id: "gift-ready",
    name: "Gift Ready Seal",
    category: "Packaging",
    description: "A simple gift packaging mark.",
    config: {
      templateId: "gift-ready",
      title: "Gift Ready",
      ...baseCircle,
      primaryText: "GIFT READY",
      secondaryText: "SPECIAL EDITION",
      centerText: "WRAPPED"
    }
  },
  {
    id: "limited-edition",
    name: "Limited Edition",
    category: "Branding",
    description: "Luxury / drop / creator collection stamp.",
    config: {
      templateId: "limited-edition",
      title: "Limited Edition",
      ...baseCircle,
      color: "#8B1C1C",
      primaryText: "LIMITED",
      secondaryText: "EDITION",
      centerText: "DROP\n01"
    }
  },
  {
    id: "official-brand",
    name: "Official Brand Seal",
    category: "Branding",
    description: "Non-official branding style seal.",
    config: {
      templateId: "official-brand",
      title: "Official Brand Seal",
      shape: "oval",
      borderWidth: 16,
      fontFamily: "Georgia, serif",
      color: "#111827",
      primaryText: "OFFICIAL BRAND",
      secondaryText: "SIGNATURE MARK",
      centerText: "BRAND",
      footerText: "NOT FOR LEGAL USE",
      dateText: "EST. 2026",
      serialText: "BR-020",
      logoDataUrl: ""
    }
  },
  {
    id: "creator-badge",
    name: "Creator Badge",
    category: "Branding",
    description: "For creators and digital products.",
    config: {
      templateId: "creator-badge",
      title: "Creator Badge",
      shape: "badge",
      borderWidth: 16,
      fontFamily: "Arial, sans-serif",
      color: "#2563EB",
      primaryText: "CREATOR",
      secondaryText: "VERIFIED DESIGN",
      centerText: "BADGE",
      footerText: "DIGITAL PRODUCT",
      dateText: "2026",
      serialText: "CR-100",
      logoDataUrl: ""
    }
  },
  {
    id: "copy-stamp",
    name: "Copy Stamp",
    category: "Documents",
    description: "Simple internal document copy mark.",
    config: {
      templateId: "copy-stamp",
      title: "Copy Stamp",
      ...baseRect,
      primaryText: "COPY",
      secondaryText: "INTERNAL ARCHIVE",
      centerText: "FILED"
    }
  },
  {
    id: "draft-stamp",
    name: "Draft Stamp",
    category: "Documents",
    description: "Draft stage marker for work-in-progress files.",
    config: {
      templateId: "draft-stamp",
      title: "Draft Stamp",
      ...baseRect,
      primaryText: "DRAFT",
      secondaryText: "WORK IN PROGRESS",
      centerText: "REV A"
    }
  },
  {
    id: "completed-stamp",
    name: "Completed Stamp",
    category: "Documents",
    description: "Finalized status marker.",
    config: {
      templateId: "completed-stamp",
      title: "Completed Stamp",
      ...baseRect,
      primaryText: "COMPLETED",
      secondaryText: "FINAL",
      centerText: "DONE"
    }
  },
  {
    id: "established-brand",
    name: "Established Since Seal",
    category: "Branding",
    description: "Vintage style brand stamp.",
    config: {
      templateId: "established-brand",
      title: "Established Brand",
      ...baseCircle,
      color: "#1F2937",
      primaryText: "ESTABLISHED",
      secondaryText: "SIGNATURE BRAND",
      centerText: "SINCE\n2026"
    }
  },
  {
    id: "exclusive-mark",
    name: "Exclusive Mark",
    category: "Branding",
    description: "Premium limited drop visual stamp.",
    config: {
      templateId: "exclusive-mark",
      title: "Exclusive Mark",
      shape: "badge",
      borderWidth: 18,
      fontFamily: "Georgia, serif",
      color: "#7C2D12",
      primaryText: "EXCLUSIVE",
      secondaryText: "COLLECTION",
      centerText: "MARK",
      footerText: "CREATOR DROP",
      dateText: "2026",
      serialText: "EX-777",
      logoDataUrl: ""
    }
  },
  {
    id: "small-business",
    name: "Small Business Seal",
    category: "Packaging",
    description: "Warm packaging seal for small shops.",
    config: {
      templateId: "small-business",
      title: "Small Business Seal",
      ...baseCircle,
      primaryText: "SMALL BUSINESS",
      secondaryText: "THANK YOU FOR SUPPORTING",
      centerText: "THANK\nYOU"
    }
  },
  {
    id: "verified-design",
    name: "Verified Design Mark",
    category: "Branding",
    description: "For creator packs, docs, and brand assets.",
    config: {
      templateId: "verified-design",
      title: "Verified Design",
      shape: "horizontal",
      borderWidth: 12,
      fontFamily: "Arial, sans-serif",
      color: "#0F172A",
      primaryText: "VERIFIED DESIGN",
      secondaryText: "DIGITAL ASSET",
      centerText: "V",
      footerText: "SEAL MVP",
      dateText: "2026-04-02",
      serialText: "VD-200",
      logoDataUrl: ""
    }
  }
];

export function getTemplateById(templateId: string) {
  return SEAL_TEMPLATES.find((item) => item.id === templateId) ?? SEAL_TEMPLATES[0];
}
