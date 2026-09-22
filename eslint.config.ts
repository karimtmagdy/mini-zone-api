// import type { ESLintConfig } from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
export default [
  {
    plugins: {
      boundaries: boundaries,
    },

    settings: {
      "import/resolver": {
        typescript: true,
      },
      "boundaries/elements": [
        // Main Layer
        { type: "main-entities", pattern: "src/main/entities/**/*" },
        { type: "main-services", pattern: "src/main/services/**/*" },
        { type: "main-shared", pattern: "src/main/shared/**/*" },
        { type: "main-types", pattern: "src/main/typescript/**/*" },
        { type: "main", pattern: "src/main/**/*" },
        // App Layer
        { type: "app-cases", pattern: "src/app/use-cases/**/*" },
        { type: "app", pattern: "src/app/**/*" },
        // { type: "app-services", pattern: "src/app/services/**/*" },
        // Presentation Layer
        { type: "present-ctrl", pattern: "src/presentation/controller/**/*" },
        { type: "present-ware", pattern: "src/presentation/middleware/**/*" },
        { type: "present-schema", pattern: "src/presentation/validation/**/*" },
        { type: "present-route", pattern: "src/presentation/routes/**/*" },
        { type: "presentation", pattern: "src/presentation/**/*" },
        // Infra Layer
        { type: "infra-config", pattern: "src/infra/config/**/*" },
        { type: "infra-data", pattern: "src/infra/data/**/*" },
        { type: "infra-repo", pattern: "src/infra/repo/**/*" },
        { type: "infra", pattern: "src/infra/**/*" },
        // Shared & Global Types
        // { type: "shared", pattern: "src/shared/**/*" },
        { type: "types", pattern: "src/types/**/*" },
        // Root entry files
        { type: "root", pattern: "src/*" },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // PRESENTATION
            { from: "present-route", allow: [] },
            { from: "present-ctrl", allow: ["app-services"] },
            // {
            //   from: "presentation",
            //   allow: ["app-services"],
            // },
            // APP
            {
              from: "app-services",
              allow: [
                "main-entities",
                "main-types",
                "main",
                "main-shared",
                "types",
              ],
            },

            // INFRA
            { from: "infra-repo", allow: [] },
            { from: "infra-data", allow: [] },

            // SHARED & TYPES (Utility)
            { from: ["shared", "types"], allow: ["main-types", "types"] },
          ],
        },
      ],
    },
  },
];
