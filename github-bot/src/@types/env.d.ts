declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    GITHUB_APP_ID: string;
    GITHUB_APP_SECRET: string;
    GITHUB_APP_PEM_LOCATION: string;
    KAFKA_CONSUMER_HOST: string;
    KAFKA_CONSUMER_PORT: string;
    KAFKA_CONSUMER_TOPIC: string;
    KAFKA_CONSUME_GROUP_ID?: string;
  }
}
