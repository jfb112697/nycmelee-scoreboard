// vite.config.ts
import { defineConfig } from "file:///C:/Users/jeremy/Projects/nycmelee-scoreboard/node_modules/vite/dist/node/index.js";
import solid from "file:///C:/Users/jeremy/Projects/nycmelee-scoreboard/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\jeremy\\Projects\\nycmelee-scoreboard";
var vite_config_default = defineConfig(async () => ({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqZXJlbXlcXFxcUHJvamVjdHNcXFxcbnljbWVsZWUtc2NvcmVib2FyZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcamVyZW15XFxcXFByb2plY3RzXFxcXG55Y21lbGVlLXNjb3JlYm9hcmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2plcmVteS9Qcm9qZWN0cy9ueWNtZWxlZS1zY29yZWJvYXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHNvbGlkIGZyb20gXCJ2aXRlLXBsdWdpbi1zb2xpZFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKCkgPT4gKHtcclxuICBwbHVnaW5zOiBbc29saWQoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJ+XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gVml0ZSBvcHRpb25zIHRhaWxvcmVkIGZvciBUYXVyaSBkZXZlbG9wbWVudCBhbmQgb25seSBhcHBsaWVkIGluIGB0YXVyaSBkZXZgIG9yIGB0YXVyaSBidWlsZGBcclxuICAvL1xyXG4gIC8vIDEuIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xyXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcclxuICAvLyAyLiB0YXVyaSBleHBlY3RzIGEgZml4ZWQgcG9ydCwgZmFpbCBpZiB0aGF0IHBvcnQgaXMgbm90IGF2YWlsYWJsZVxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMTQyMCxcclxuICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAvLyAzLiB0ZWxsIHZpdGUgdG8gaWdub3JlIHdhdGNoaW5nIGBzcmMtdGF1cmlgXHJcbiAgICAgIGlnbm9yZWQ6IFtcIioqL3NyYy10YXVyaS8qKlwiXSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdVLFNBQVMsb0JBQW9CO0FBQzdWLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLGFBQWE7QUFBQSxFQUN2QyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsYUFBYTtBQUFBO0FBQUEsRUFFYixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUE7QUFBQSxNQUVMLFNBQVMsQ0FBQyxpQkFBaUI7QUFBQSxJQUM3QjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
