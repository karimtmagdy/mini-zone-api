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
      // boundaries elements
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
      // boundaries elements types
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // MAIN (Isolated)
            {
              from: ["main-entities", "main-types", "main"],
              allow: ["main-entities", "main-types", "main-shared", "types"],
            },
            // APP
            {
              from: "app-cases",
              allow: [
                "main-entities",
                "main-types",
                "main",
                "app-services",
                "main-shared",
                "types",
              ],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: "app",
              allow: [
                "main-entities",
                "main-types",
                "main",
                "main-shared",
                "types",
              ],
            },
            // PRESENTATION
            {
              from: "present-route",
              allow: [
                "present-ctrl",
                "present-ware",
                "present-schema",
                "main-shared",
                "types",
              ],
            },
            {
              from: "present-ctrl",
              allow: [
                "app-cases",
                "main-types",
                "present-schema",
                "main-shared",
                "types",
              ],
            },
            {
              from: "present-ware",
              allow: ["app-cases", "main-types", "main-shared", "types"],
            },
            {
              from: "present-schema",
              allow: ["main-types", "main-shared", "types"],
            },
            {
              from: "presentation",
              allow: ["app-cases", "main-types", "main-shared", "types"],
            },
            // INFRA
            {
              from: "infra-repo",
              allow: [
                "main-entities",
                "main-types",
                "main",
                "infra-data",
                "main-shared",
                "types",
              ],
            },
            {
              from: "infra-data",
              allow: [
                "main-entities",
                "main-types",
                "infra-config",
                "main-shared",
                "types",
              ],
            },
            {
              from: "infra-config",
              allow: ["main-shared", "types"],
            },
            {
              from: "infra",
              allow: [
                "main-entities",
                "main-types",
                "main",
                "main-shared",
                "types",
              ],
            },
            // SHARED & TYPES (Utility)
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            // ROOT (app.ts / server.ts)
            {
              from: "root",
              allow: [
                "present-route",
                "present-ware",
                "infra-data",
                "infra-config",
                "main-shared",
                "types",
              ],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
            {
              from: [],
              allow: [],
            },
          ],
        },
      ],
    },
  },
];
