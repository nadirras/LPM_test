/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "json-server" {
  interface JsonServer {
    create: () => any;
    router: (source: string | object) => any;
    defaults: () => any;
  }

  const jsonServer: JsonServer;
  export default jsonServer;
}
