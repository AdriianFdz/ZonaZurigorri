import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);


// Desactiva el warning de setState sincrónico en useEffect
const customReactRules = {
  "react/no-sync-effects": "off",
};

// Añade las reglas personalizadas al export
eslintConfig[eslintConfig.length - 1].rules = {
  ...eslintConfig[eslintConfig.length - 1].rules,
  ...customRules,
  ...customReactRules,
};

export default eslintConfig;
