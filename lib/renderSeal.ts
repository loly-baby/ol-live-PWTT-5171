import { SealConfig } from "@/lib/types";

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function lines(input: string) {
  return input.split("\n").filter(Boolean);
}

function watermarkMarkup() {
  return `
    <g transform="rotate(-18 500 500)" opacity="0.10">
      <text x="500" y="520" text-anchor="middle" font-size="110" font-family="Arial, sans-serif" font-weight="700">
        PREVIEW
      </text>
    </g>
  `;
}

function renderCircle(config: SealConfig, width = 1000, height = 1000) {
  const color = config.color || "#D51F1F";
  const border = config.borderWidth || 18;
  const centerLines = lines(config.centerText || "SEAL");
  const logoMarkup = config.logoDataUrl
    ? `<image href="${config.logoDataUrl}" x="410" y="385" width="180" height="180" preserveAspectRatio="xMidYMid meet" />`
    : centerLines
        .map(
          (line, index) =>
            `<text x="500" y="${445 + index * 74}" text-anchor="middle" font-size="64" font-weight="700">${escapeXml(line)}</text>`
        )
        .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <path id="topArc" d="M 170 500 A 330 330 0 0 1 830 500" />
        <path id="bottomArc" d="M 830 500 A 330 330 0 0 1 170 500" />
      </defs>
      <g fill="none" stroke="${color}">
        <circle cx="500" cy="500" r="360" stroke-width="${border}" />
        <circle cx="500" cy="500" r="300" stroke-width="${Math.max(border - 8, 6)}" stroke-opacity="0.9" />
      </g>

      <g fill="${color}" font-family="${config.fontFamily}" letter-spacing="4">
        <text font-size="56" font-weight="700">
          <textPath href="#topArc" startOffset="50%" text-anchor="middle">${escapeXml(config.primaryText)}</textPath>
        </text>
        <text font-size="40" font-weight="600">
          <textPath href="#bottomArc" startOffset="50%" text-anchor="middle">${escapeXml(config.secondaryText)}</textPath>
        </text>
      </g>

      <g fill="${color}" font-family="${config.fontFamily}">
        ${logoMarkup}
        <text x="500" y="700" text-anchor="middle" font-size="28" font-weight="600">${escapeXml(config.footerText)}</text>
        <text x="500" y="740" text-anchor="middle" font-size="24">${escapeXml(config.dateText)} · ${escapeXml(config.serialText)}</text>
      </g>
      ${config.watermark ? watermarkMarkup() : ""}
    </svg>
  `;
}

function renderOval(config: SealConfig, width = 1000, height = 760) {
  const color = config.color || "#111827";
  const border = config.borderWidth || 16;
  const logoMarkup = config.logoDataUrl
    ? `<image href="${config.logoDataUrl}" x="415" y="255" width="170" height="170" preserveAspectRatio="xMidYMid meet" />`
    : `<text x="500" y="370" text-anchor="middle" font-size="68" font-weight="700">${escapeXml(config.centerText)}</text>`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <path id="ovalTop" d="M 170 380 A 330 220 0 0 1 830 380" />
        <path id="ovalBottom" d="M 830 380 A 330 220 0 0 1 170 380" />
      </defs>
      <g fill="none" stroke="${color}">
        <ellipse cx="500" cy="380" rx="380" ry="250" stroke-width="${border}" />
        <ellipse cx="500" cy="380" rx="330" ry="200" stroke-width="${Math.max(border - 7, 6)}" stroke-opacity="0.9" />
      </g>
      <g fill="${color}" font-family="${config.fontFamily}" letter-spacing="3">
        <text font-size="48" font-weight="700">
          <textPath href="#ovalTop" startOffset="50%" text-anchor="middle">${escapeXml(config.primaryText)}</textPath>
        </text>
        <text font-size="34" font-weight="600">
          <textPath href="#ovalBottom" startOffset="50%" text-anchor="middle">${escapeXml(config.secondaryText)}</textPath>
        </text>
      </g>
      <g fill="${color}" font-family="${config.fontFamily}">
        ${logoMarkup}
        <text x="500" y="565" text-anchor="middle" font-size="24">${escapeXml(config.footerText)}</text>
        <text x="500" y="600" text-anchor="middle" font-size="20">${escapeXml(config.dateText)} · ${escapeXml(config.serialText)}</text>
      </g>
      ${config.watermark ? watermarkMarkup() : ""}
    </svg>
  `;
}

function renderSquare(config: SealConfig, width = 1000, height = 1000) {
  const color = config.color || "#D51F1F";
  const border = config.borderWidth || 16;
  const centerLines = lines(config.centerText || "OK");
  const logoMarkup = config.logoDataUrl
    ? `<image href="${config.logoDataUrl}" x="390" y="365" width="220" height="220" preserveAspectRatio="xMidYMid meet" />`
    : centerLines
        .map(
          (line, index) =>
            `<text x="500" y="${420 + index * 84}" text-anchor="middle" font-size="72" font-weight="800">${escapeXml(line)}</text>`
        )
        .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <g fill="none" stroke="${color}">
        <rect x="140" y="140" width="720" height="720" rx="20" stroke-width="${border}" />
        <rect x="195" y="195" width="610" height="610" rx="12" stroke-width="${Math.max(border - 6, 6)}" stroke-opacity="0.9" />
      </g>
      <g fill="${color}" font-family="${config.fontFamily}">
        <text x="500" y="300" text-anchor="middle" font-size="74" font-weight="800">${escapeXml(config.primaryText)}</text>
        <text x="500" y="360" text-anchor="middle" font-size="32" font-weight="600">${escapeXml(config.secondaryText)}</text>
        ${logoMarkup}
        <text x="500" y="785" text-anchor="middle" font-size="24">${escapeXml(config.dateText)} · ${escapeXml(config.serialText)}</text>
      </g>
      ${config.watermark ? watermarkMarkup() : ""}
    </svg>
  `;
}

function renderHorizontal(config: SealConfig, width = 1200, height = 600) {
  const color = config.color || "#2563EB";
  const border = config.borderWidth || 12;
  const logoMarkup = config.logoDataUrl
    ? `<image href="${config.logoDataUrl}" x="860" y="175" width="150" height="150" preserveAspectRatio="xMidYMid meet" />`
    : `<text x="930" y="335" text-anchor="middle" font-size="96" font-weight="800">${escapeXml(config.centerText)}</text>`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <g fill="none" stroke="${color}">
        <rect x="70" y="90" width="1060" height="420" rx="24" stroke-width="${border}" />
        <rect x="105" y="125" width="990" height="350" rx="18" stroke-width="${Math.max(border - 5, 5)}" stroke-opacity="0.9" />
      </g>
      <g fill="${color}" font-family="${config.fontFamily}">
        <text x="230" y="265" font-size="82" font-weight="800">${escapeXml(config.primaryText)}</text>
        <text x="230" y="325" font-size="30" font-weight="600">${escapeXml(config.secondaryText)}</text>
        <text x="230" y="385" font-size="22">${escapeXml(config.footerText)}</text>
        <text x="230" y="425" font-size="20">${escapeXml(config.dateText)} · ${escapeXml(config.serialText)}</text>
        ${logoMarkup}
      </g>
      ${config.watermark ? watermarkMarkup() : ""}
    </svg>
  `;
}

function renderBadge(config: SealConfig, width = 1000, height = 1000) {
  const color = config.color || "#111827";
  const border = config.borderWidth || 18;
  const pointsOuter = "500,100 640,155 785,155 845,300 900,440 845,585 785,730 640,845 500,900 360,845 215,730 155,585 100,440 155,300 215,155 360,155";
  const pointsInner = "500,170 620,215 730,215 785,325 830,440 785,555 730,665 620,785 500,830 380,785 270,665 215,555 170,440 215,325 270,215 380,215";
  const logoMarkup = config.logoDataUrl
    ? `<image href="${config.logoDataUrl}" x="395" y="370" width="210" height="210" preserveAspectRatio="xMidYMid meet" />`
    : lines(config.centerText || "BADGE")
        .map(
          (line, index) =>
            `<text x="500" y="${430 + index * 86}" text-anchor="middle" font-size="72" font-weight="800">${escapeXml(line)}</text>`
        )
        .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <g fill="none" stroke="${color}">
        <polygon points="${pointsOuter}" stroke-width="${border}" />
        <polygon points="${pointsInner}" stroke-width="${Math.max(border - 7, 6)}" stroke-opacity="0.9" />
      </g>
      <g fill="${color}" font-family="${config.fontFamily}">
        <text x="500" y="280" text-anchor="middle" font-size="60" font-weight="800">${escapeXml(config.primaryText)}</text>
        <text x="500" y="338" text-anchor="middle" font-size="32" font-weight="600">${escapeXml(config.secondaryText)}</text>
        ${logoMarkup}
        <text x="500" y="760" text-anchor="middle" font-size="24">${escapeXml(config.footerText)}</text>
        <text x="500" y="800" text-anchor="middle" font-size="20">${escapeXml(config.dateText)} · ${escapeXml(config.serialText)}</text>
      </g>
      ${config.watermark ? watermarkMarkup() : ""}
    </svg>
  `;
}

export function renderSealSvg(config: SealConfig) {
  switch (config.shape) {
    case "oval":
      return renderOval(config);
    case "square":
      return renderSquare(config);
    case "horizontal":
      return renderHorizontal(config);
    case "badge":
      return renderBadge(config);
    case "circle":
    default:
      return renderCircle(config);
  }
}
