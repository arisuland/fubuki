declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const source: DocumentNode;
  export default source;
}
