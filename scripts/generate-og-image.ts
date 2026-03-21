import { Resvg } from "@resvg/resvg-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const docsPath = process.argv[2];

if (!docsPath) {
	console.error("Usage: bun run og-image <path-to-docs-site>");
	console.error("Example: bun run og-image ../react-socket/packages/docs");
	process.exit(1);
}

const resolved = resolve(docsPath);
const logoPath = join(resolved, "public/logo.svg");
const configPath = join(resolved, "src/config.ts");

if (!existsSync(logoPath)) {
	console.error(`Logo not found: ${logoPath}`);
	process.exit(1);
}

if (!existsSync(configPath)) {
	console.error(`Config not found: ${configPath}`);
	process.exit(1);
}

const configSrc = readFileSync(configPath, "utf-8");
const match = configSrc.match(/installCommand:\s*["'].*?install\s+(.+?)["']/);

if (!match) {
	console.error("Could not extract package name from installCommand in src/config.ts");
	process.exit(1);
}

const name = match[1];

const logoSvg = readFileSync(logoPath, "utf-8");
const innerContent = logoSvg
	.replace(/<svg[^>]*>/, "")
	.replace(/<\/svg>/, "")
	.trim();

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_SIZE = 180;
const BG_COLOR = "#0a0a0a";

const logoX = (WIDTH - LOGO_SIZE) / 2;
const logoY = 140;
const textY = logoY + LOGO_SIZE + 70;

const compositeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG_COLOR}" />
  <svg x="${logoX}" y="${logoY}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" viewBox="0 0 64 64" fill="none">
    ${innerContent}
  </svg>
  <text
    x="${WIDTH / 2}"
    y="${textY}"
    text-anchor="middle"
    font-family="Work Sans"
    font-size="48"
    font-weight="700"
    fill="white"
    letter-spacing="1"
  >${name}</text>
</svg>`;

const scriptDir = dirname(new URL(import.meta.url).pathname);
const fontPath = join(scriptDir, "WorkSans-Bold.ttf");

const resvg = new Resvg(compositeSvg, {
	fitTo: { mode: "width", value: WIDTH },
	font: {
		fontFiles: [fontPath],
		defaultFontFamily: "Work Sans",
	},
});

const pngBuffer = resvg.render().asPng();
const outputPath = join(resolved, "public/og-image.png");
writeFileSync(outputPath, pngBuffer);

console.log(`Generated ${outputPath} for "${name}"`);
