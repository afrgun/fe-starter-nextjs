import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "./guideline/lint/eslint.boundaries.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Architecture boundaries (see guideline/lint/README.md).
  ...boundaries,
  // Next.js: client code must never pull in server-only modules.
  {
    files: ["src/features/*/presentation/client/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/server/**", "@/core/di/server-ports", "@/core/http/server-http", "**/infrastructure/**", "axios"],
          message: "Client components must not import server-only modules or adapters (references/nextjs.md § 13).",
        }],
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Guideline pack is documentation + tooling, not app source.
    "guideline/**",
  ]),
]);

export default eslintConfig;
