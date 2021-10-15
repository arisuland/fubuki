declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    TSUBAKI_URL: string;
    WEBHOOK_SECRET: string;
    GITHUB_APP_ID: string;
    GITHUB_APP_SECRET: string;
    GITHUB_APP_PEM_LOCATION: string;
    KAFKA_CONSUMER_TOPIC: string;
    KAFKA_CONSUMER_GROUP_ID?: string;
    KAFKA_CONSUMER_BROKERS: string;
    GITHUB_APP_INSTALLATION_ID: string;
  }
}
