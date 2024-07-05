// vite.config.ts
import react from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.11/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { glob } from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/glob@10.3.12/node_modules/glob/dist/esm/index.js";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/vite@5.2.11_@types+node@20.12.7_sass@1.77.0/node_modules/vite/dist/node/index.js";
import { libInjectCss } from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/vite-plugin-lib-inject-css@2.0.1_vite@5.2.11/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import tsconfigPaths from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.4.5_vite@5.2.11/node_modules/vite-tsconfig-paths/dist/index.mjs";
import dts from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.12.7_rollup@4.18.0_typescript@5.4.5_vite@5.2.11/node_modules/vite-plugin-dts/dist/index.mjs";
import preserveDirectives from "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/node_modules/.pnpm/rollup-preserve-directives@1.1.1_rollup@4.18.0/node_modules/rollup-preserve-directives/dist/es/index.mjs";
var __vite_injected_original_dirname = "/home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/packages/app-ui";
var __vite_injected_original_import_meta_url = "file:///home/rcano/Development/thesolidchain/summer.fi/summerfi-monorepo/packages/app-ui/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    preserveDirectives(),
    {
      ...libInjectCss(),
      enforce: "pre"
      // this is important to make sure the css is injected before the code is processed
    },
    {
      // libInjectCss (with preserveDirectives) adds the css import to the top of the file
      // this custom handle moves the directive ('use client') to the top of the file again
      name: "custom-swap-directive",
      generateBundle(_, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === "chunk") {
            if (chunk.code.includes("use client")) {
              chunk.code = chunk.code.replace(/['"]use client['"];/, "");
              chunk.code = `'use client';
${chunk.code}`;
            }
            if (chunk.code.includes("use server")) {
              chunk.code = chunk.code.replace(/['"]use server['"];/, "");
              chunk.code = `'use server';
${chunk.code}`;
            }
          }
        }
      }
    },
    dts({ outDir: "dist/types", insertTypesEntry: true, strictOutput: true, copyDtsFiles: true })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // OB breakpoints: 531, 744, 1025, 1279
        additionalData: `
        @import './node_modules/include-media/dist/_include-media.scss';
        $breakpoints: (
          s: 531px,
          m: 744px,
          l: 1025px,
          xl: 1279px,
        );
        `
      }
    }
  },
  build: {
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "next/link",
        "next/image",
        "lodash",
        "@loadable/component",
        "@tabler/icons-react"
      ],
      input: Object.fromEntries(
        glob.sync("src/**/*.{ts,tsx}").filter((file) => !file.endsWith(".d.ts")).map((file) => [
          relative("src", file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9yY2Fuby9EZXZlbG9wbWVudC90aGVzb2xpZGNoYWluL3N1bW1lci5maS9zdW1tZXJmaS1tb25vcmVwby9wYWNrYWdlcy9hcHAtdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3JjYW5vL0RldmVsb3BtZW50L3RoZXNvbGlkY2hhaW4vc3VtbWVyLmZpL3N1bW1lcmZpLW1vbm9yZXBvL3BhY2thZ2VzL2FwcC11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9yY2Fuby9EZXZlbG9wbWVudC90aGVzb2xpZGNoYWluL3N1bW1lci5maS9zdW1tZXJmaS1tb25vcmVwby9wYWNrYWdlcy9hcHAtdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBnbG9iIH0gZnJvbSAnZ2xvYidcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IGV4dG5hbWUsIHJlbGF0aXZlLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5cbi8vIGluamVjdHMgdGhlIGNzcyBpbXBvcnQgYXQgdG9wIG9mIHRoZSBjb21wb25lbnRzXG5pbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tICd2aXRlLXBsdWdpbi1saWItaW5qZWN0LWNzcydcbi8vIGhhbmRsZXMgdHNjb25maWcgcGF0aHMgZnJvbSB0aGUgdHNjb25maWcuanNvblxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbi8vIGdlbmVyYXRlcyB0eXBlc2NyaXB0IGRlY2xhcmF0aW9uIGZpbGVzIChqdXN0IHRoZSBqcy90cywgc2NzcyBpcyBkb25lIGluIHBhY2thZ2UuanNvbilcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuLy8gcHJlc2VydmVzIGRpcmVjdGl2ZXMgbGlrZSBcInVzZSBjbGllbnRcIiBpbiB0aGUgb3V0cHV0XG5pbXBvcnQgcHJlc2VydmVEaXJlY3RpdmVzIGZyb20gJ3JvbGx1cC1wcmVzZXJ2ZS1kaXJlY3RpdmVzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIHByZXNlcnZlRGlyZWN0aXZlcygpLFxuICAgIHtcbiAgICAgIC4uLmxpYkluamVjdENzcygpLFxuICAgICAgZW5mb3JjZTogJ3ByZScsIC8vIHRoaXMgaXMgaW1wb3J0YW50IHRvIG1ha2Ugc3VyZSB0aGUgY3NzIGlzIGluamVjdGVkIGJlZm9yZSB0aGUgY29kZSBpcyBwcm9jZXNzZWRcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGxpYkluamVjdENzcyAod2l0aCBwcmVzZXJ2ZURpcmVjdGl2ZXMpIGFkZHMgdGhlIGNzcyBpbXBvcnQgdG8gdGhlIHRvcCBvZiB0aGUgZmlsZVxuICAgICAgLy8gdGhpcyBjdXN0b20gaGFuZGxlIG1vdmVzIHRoZSBkaXJlY3RpdmUgKCd1c2UgY2xpZW50JykgdG8gdGhlIHRvcCBvZiB0aGUgZmlsZSBhZ2FpblxuICAgICAgbmFtZTogJ2N1c3RvbS1zd2FwLWRpcmVjdGl2ZScsXG4gICAgICBnZW5lcmF0ZUJ1bmRsZShfLCBidW5kbGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBPYmplY3QudmFsdWVzKGJ1bmRsZSkpIHtcbiAgICAgICAgICBpZiAoY2h1bmsudHlwZSA9PT0gJ2NodW5rJykge1xuICAgICAgICAgICAgaWYgKGNodW5rLmNvZGUuaW5jbHVkZXMoJ3VzZSBjbGllbnQnKSkge1xuICAgICAgICAgICAgICBjaHVuay5jb2RlID0gY2h1bmsuY29kZS5yZXBsYWNlKC9bJ1wiXXVzZSBjbGllbnRbJ1wiXTsvLCAnJylcbiAgICAgICAgICAgICAgY2h1bmsuY29kZSA9IGAndXNlIGNsaWVudCc7XFxuJHtjaHVuay5jb2RlfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaHVuay5jb2RlLmluY2x1ZGVzKCd1c2Ugc2VydmVyJykpIHtcbiAgICAgICAgICAgICAgY2h1bmsuY29kZSA9IGNodW5rLmNvZGUucmVwbGFjZSgvWydcIl11c2Ugc2VydmVyWydcIl07LywgJycpXG4gICAgICAgICAgICAgIGNodW5rLmNvZGUgPSBgJ3VzZSBzZXJ2ZXInO1xcbiR7Y2h1bmsuY29kZX1gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgZHRzKHsgb3V0RGlyOiAnZGlzdC90eXBlcycsIGluc2VydFR5cGVzRW50cnk6IHRydWUsIHN0cmljdE91dHB1dDogdHJ1ZSwgY29weUR0c0ZpbGVzOiB0cnVlIH0pLFxuICBdLFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIC8vIE9CIGJyZWFrcG9pbnRzOiA1MzEsIDc0NCwgMTAyNSwgMTI3OVxuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYFxuICAgICAgICBAaW1wb3J0ICcuL25vZGVfbW9kdWxlcy9pbmNsdWRlLW1lZGlhL2Rpc3QvX2luY2x1ZGUtbWVkaWEuc2Nzcyc7XG4gICAgICAgICRicmVha3BvaW50czogKFxuICAgICAgICAgIHM6IDUzMXB4LFxuICAgICAgICAgIG06IDc0NHB4LFxuICAgICAgICAgIGw6IDEwMjVweCxcbiAgICAgICAgICB4bDogMTI3OXB4LFxuICAgICAgICApO1xuICAgICAgICBgLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICAncmVhY3QnLFxuICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnLFxuICAgICAgICAnbmV4dC9saW5rJyxcbiAgICAgICAgJ25leHQvaW1hZ2UnLFxuICAgICAgICAnbG9kYXNoJyxcbiAgICAgICAgJ0Bsb2FkYWJsZS9jb21wb25lbnQnLFxuICAgICAgICAnQHRhYmxlci9pY29ucy1yZWFjdCcsXG4gICAgICBdLFxuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgZ2xvYlxuICAgICAgICAgIC5zeW5jKCdzcmMvKiovKi57dHMsdHN4fScpXG4gICAgICAgICAgLmZpbHRlcigoZmlsZSkgPT4gIWZpbGUuZW5kc1dpdGgoJy5kLnRzJykpXG4gICAgICAgICAgLm1hcCgoZmlsZSkgPT4gW1xuICAgICAgICAgICAgcmVsYXRpdmUoJ3NyYycsIGZpbGUuc2xpY2UoMCwgZmlsZS5sZW5ndGggLSBleHRuYW1lKGZpbGUpLmxlbmd0aCkpLFxuICAgICAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAgIF0pLFxuICAgICAgKSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV1bZXh0bmFtZV0nLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAg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
