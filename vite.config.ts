import { fileURLToPath, URL } from 'node:url'
import Pages from 'vite-plugin-pages'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PurgeIcons from 'vite-plugin-purge-icons'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import purgecss from 'rollup-plugin-purgecss'
import ViteFonts from 'vite-plugin-fonts'
import nodePolyfills from "rollup-plugin-polyfill-node";

const SILENT = Boolean(process.env.SILENT) ?? false
const SOURCE_MAP = Boolean(process.env.SOURCE_MAP) ?? false

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base: '/',
  // Directory to serve as plain static assets.
  publicDir: 'public',
  // Adjust console output verbosity.
  logLevel: SILENT ? 'error' : 'info',


  optimizeDeps: {
    include: [

      '@iconify/iconify',
      '@vueuse/core',
      '@vueuse/head',
      '@vueform/multiselect',
      '@vueform/slider',
      'axios',
      'billboard.js',

      'nprogress',
      'notyf',

      'vee-validate',
      'vue',
      'vue-scrollto',
      'yup',
    ],
  },
  build: {
    minify: false,
    sourcemap: SOURCE_MAP,
    // Turning off brotliSize display can slightly reduce packaging time

    chunkSizeWarningLimit: 2000,
    // minify: true,

    /**
     * Uncomment this section to build the demo with missing images
     * Don't forget to remove this section when you replaced assets with yours
     */
    rollupOptions: {
      external: [/\/demo\/.*/],
    },
  },
  plugins: [

    vue(),
    Pages(),
    PurgeIcons(),
    Components({
      dirs: ['documentation', 'src/components', 'src/layouts'],
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    VitePWA({
      base: '/',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Youdex',
        short_name: 'Youdex',
        start_url: '/?utm_source=pwa',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    ViteFonts({
      google: {
        families: [
          {
            name: 'Fira Code',
            styles: 'wght@400;600',
          },
          {
            name: 'Montserrat',
            styles: 'wght@500;600;700;800;900',
          },
          {
            name: 'Roboto',
            styles: 'wght@300;400;500;600;700',
          },
          {
            name: 'Nunito',
            styles: 'wght@300;400;500;600;700',
          },
        ],
      },
    }),

    purgecss({
      content: [`./src/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
        ],
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
    }),


  ],
  resolve: {
    alias: [
      {
        find: '/@src/',
        replacement: `/src/`,
      },
    ],
  },
})
