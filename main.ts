// ai-excited-01 entrypoint.
//
// The entry is a single static image: a photorealistic brass clockwork
// spider erupting out of a burst pocket watch on a watchmaker's bench.
// There is nothing to render at run time — this program just places the
// finished image where the harness expects it, byte for byte.
//
// Standard library only; no network, no dependencies.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The image sits next to this file in the repo.
const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");

// The harness sets MAKEFUN_OUTPUT_DIR when it runs us; fall back to the
// conventional /output path so a plain `node main.ts` works too.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TARGET = join(OUT_DIR, "entry.png");

if (!existsSync(SOURCE)) {
  throw new Error(`entry image not found: ${SOURCE}`);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SOURCE, TARGET);

// The harness runs the program twice and expects identical bytes both
// times, so confirm the copy actually landed whole before we report it.
const sourceBytes = statSync(SOURCE).size;
const targetBytes = statSync(TARGET).size;
if (sourceBytes !== targetBytes) {
  throw new Error(
    `copy mismatch: source is ${sourceBytes} bytes, target is ${targetBytes} bytes`,
  );
}

console.log(`wrote ${TARGET} (${targetBytes} bytes)`);
