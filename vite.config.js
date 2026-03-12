import viteImagemin from "vite-plugin-imagemin";

export default {
  plugins: [
    viteImagemin({
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.8] }
    })
  ]
}