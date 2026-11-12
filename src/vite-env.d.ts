/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Back office API base, e.g. "/api". Unset = no API (events section hidden). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
