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
        { type: "domain", pattern: "src/domain/*" },
        { type: "application", pattern: "src/application/*" },
        { type: "presentation", pattern: "src/presentation/*" },
        { type: "infrastructure", pattern: "src/infrastructure/*" },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "presentation", allow: ["application"] },
            { from: "application", allow: ["domain"] },
            { from: "infrastructure", allow: ["domain"] },
          ],
        },
      ],
    },
  },
];
