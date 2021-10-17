declare namespace NodeJS {
  interface ProcessEnv {
    TSUBAKI_URL: string;
    NUXT_HOST?: string;
    NUXT_PORT?: string;
    NODE_ENV: 'development' | 'production';
    HOST?: string;
    PORT?: string;
  }
}
