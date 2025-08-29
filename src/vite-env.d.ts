/// <reference types="vite/client" />

// Extend ImportMeta interface to include Vite's glob function
interface ImportMeta {
  readonly glob: (pattern: string, options?: {
    query?: string;
    import?: string;
    eager?: boolean;
  }) => Record<string, any>;
}
