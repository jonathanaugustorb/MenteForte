import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const PLAYER_DO_YOUTUBE = 'https://www.youtube-nocookie.com'

function politicaDeSeguranca(emDesenvolvimento) {
  const conexoes = ["'self'", emDesenvolvimento ? 'ws: wss:' : ''].filter(Boolean).join(' ')

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${conexoes}`,
    `frame-src ${PLAYER_DO_YOUTUBE}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

function cabecalhoDeSeguranca(politica) {
  return {
    name: 'menteforte-csp',
    transformIndexHtml() {
      return {
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: politica },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    cabecalhoDeSeguranca(politicaDeSeguranca(command === 'serve')),
  ],
  server: {
    headers: {
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
}))
