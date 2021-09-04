declare namespace Reflect {
  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param metadataKey A key used to store and retrieve metadata.
   * @param target The target object on which the metadata is defined.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example {
   *     }
   *
   *     // constructor
   *     result = Reflect.getMetadata("custom:annotation", Example);
   *
   */
  function getMetadata<T>(metadataKey: any, target: any): T | undefined;
}
