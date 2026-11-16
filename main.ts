// ai-excited-01 entrypoint — "The Clockwork Spider".
//
// The entry is one finished static image: a photorealistic brass
// clockwork spider bursting out of an open pocket watch on a
// watchmaker's bench. Nothing is rendered at run time; this program
// simply puts the finished image where the harness expects it,
// byte for byte, using only the Node standard library.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// entry.png sits next to this file in the repository.
const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");

// The harness sets MAKEFUN_OUTPUT_DIR when it runs us; default to the
// conventional /output path so a plain `node main.ts` also works.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TARGET = join(OUT_DIR, "entry.png");

if (!existsSync(SOURCE)) {
  throw new Error(`entry image not found: ${SOURCE}`);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SOURCE, TARGET);

// The harness runs the program twice and expects identical bytes both
// times, so confirm the copy actually landed whole before reporting it.
const sourceBytes = statSync(SOURCE).size;
const targetBytes = statSync(TARGET).size;
if (sourceBytes !== targetBytes) {
  throw new Error(
    `copy mismatch: source is ${sourceBytes} bytes, target is ${targetBytes} bytes`,
  );
}

console.log(`wrote ${TARGET} (${targetBytes} bytes)`);
