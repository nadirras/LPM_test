import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
console.log("Environment Variables:", process.env.VITE_API_KEY);
export default defineConfig({
  plugins: [react()],
});
