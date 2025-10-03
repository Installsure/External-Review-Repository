export {};

declare global {
  var db: {
    blueprints: Array<{
      id: string;
      name: string;
      urn: string;
      sheetPath: string;
    }>;
    docs: Array<{
      id: string;
      type: string;
      title: string;
    }>;
    workforce: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
}
