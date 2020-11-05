export default class Exception extends Error {
  public readonly code: number;
  public readonly namespace: string;

  constructor(name: string, message: string, code: number, namespace: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.namespace = namespace;
  }
}
