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
        { type: "root", pattern: "src/*" },
        { type: "app", pattern: "src/app/**/*" },
        { type: "common", pattern: "src/common/**/*" },
        { type: "domain", pattern: "src/domain/**/*" },
        { type: "infra", pattern: "src/infra/**/*" },
        { type: "presentation", pattern: "src/presentation/**/*" },
        // App Layer
        { type: "dto", pattern: "src/app/dto/*" },
        { type: "mapping", pattern: "src/app/mapping/*" },
        { type: "cases", pattern: "src/app/use-cases/**/*" },
        // Common Layer (Utility)
        { type: "api", pattern: "src/common/api/*" },
        { type: "generator", pattern: "src/common/generator/*" },
        { type: "lib", pattern: "src/common/lib/*" },
        { type: "middleware", pattern: "src/common/middleware/*" },
        { type: "plugin", pattern: "src/common/plugin/*" },

        // Domain Layer
        { type: "entities", pattern: "src/domain/entities/**/*" },
        { type: "ports", pattern: "src/domain/ports/**/*" },
        { type: "types", pattern: "src/domain/types/**/*" },
        // { type: "value-objects", pattern: "src/domain/value-objects/**/*" },
        // Infrastructure Layer
        { type: "config", pattern: "src/infra/config/**/*" },
        { type: "models", pattern: "src/infra/db/*" },
        { type: "repo", pattern: "src/infra/repo/**/*" },
        // Presentation Layer
        { type: "ctrl", pattern: "src/presentation/controller/*" },
        { type: "routes", pattern: "src/presentation/routes/*" },
        { type: "validator", pattern: "src/presentation/validator/**/*" },
        // Shared & Global Types
        { type: "types", pattern: "src/types/**/*" },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // Root (src/index.ts, src/server.ts, etc.)
            {
              from: "root",
              allow: [
                "root",
                "app",
                "common",
                "domain",
                "infra",
                "presentation",
                "types",
              ],
            },

            // 1. Domain Layer (The Core - Business Logic & Rules)
            // Purest layer: should not depend on Infra, Presentation, or App.
            {
              from: ["domain", "entities", "ports", "types"],
              allow: [
                "domain",
                "entities",
                "ports",
                "types",
                "common",
                "lib",
                "generator",
              ],
            },

            // 2. Application Layer (Use Cases, DTOs, Mappings)
            // Depends on: Domain, Common, Global Types, Validator (for DTO/Input shapes)
            // Must NOT depend on: Infra (DB/Models), Presentation (Controllers/Routes)
            {
              from: ["app", "cases", "dto", "mapping"],
              allow: [
                "app",
                "cases",
                "dto",
                "mapping",
                "domain",
                "entities",
                "ports",
                "types",
                "common",
                "api",
                "lib",
                "generator",
                "validator",
              ],
            },

            // 3. Infrastructure Layer (Database, Repositories, External Services)
            // Implements ports from Domain, maps DTOs to Entities.
            // Depends on: Domain, App (DTO/Mapping), Common, DB Models.
            // Must NOT depend on: Presentation Controllers or Routes.
            {
              from: ["infra", "repo", "models", "config"],
              allow: [
                "infra",
                "repo",
                "models",
                "config",
                "domain",
                "entities",
                "ports",
                "types",
                "app",
                "dto",
                "mapping",
                "common",
                "validator",
              ],
            },

            // 4. Presentation Layer (HTTP, Controllers, Routes, Validators)
            // Accepts requests, calls Use Cases, returns HTTP responses.
            // Depends on: App (Use Cases, Mappings), Domain (Entities, Ports), Common, Infra (Repo instances for DI)
            {
              from: "routes",
              allow: ["routes", "ctrl", "middleware", "common"],
            },
            {
              from: "ctrl",
              allow: [
                "ctrl",
                "cases",
                "mapping",
                "dto",
                "validator",
                "domain",
                "entities",
                "types",
                "common",
                "lib",
                "api",
                "repo",
              ],
            },
            {
              from: "validator",
              allow: ["validator", "domain", "types", "common"],
            },
            {
              from: "presentation",
              allow: [
                "presentation",
                "ctrl",
                "routes",
                "validator",
                "app",
                "cases",
                "mapping",
                "dto",
                "domain",
                "entities",
                "types",
                "common",
                "infra",
                "repo",
              ],
            },

            // 5. Common Layer (Cross-Cutting Concerns & Utilities)
            // Shared helpers, middleware, plugins, base classes.
            // Must NOT depend on business features (App, Infra, Presentation).
            {
              from: [
                "common",
                "api",
                "generator",
                "lib",
                "middleware",
                "plugin",
              ],
              allow: [
                "common",
                "api",
                "generator",
                "lib",
                "middleware",
                "plugin",
                "types",
              ],
            },

            // 6. Global Types
            {
              from: "types",
              allow: ["types"],
            },
          ],
        },
      ],
    },
  },
];
