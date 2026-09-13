// Type declarations for Deno runtime and Supabase Edge Functions in TypeScript IDEs
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    has(key: string): boolean;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }
  export const env: Env;
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function serve(options: Record<string, unknown>, handler: (req: Request) => Response | Promise<Response>): void;
}

// Module declarations for npm: specifiers used in Deno / Supabase Edge Functions
declare module 'npm:@supabase/supabase-js@*' {
  export * from '@supabase/supabase-js';
}

declare module 'npm:@supabase/supabase-js' {
  export * from '@supabase/supabase-js';
}

declare module 'npm:nodemailer@*' {
  const nodemailer: any;
  export default nodemailer;
}

declare module 'npm:nodemailer' {
  const nodemailer: any;
  export default nodemailer;
}

declare module 'npm:*' {
  const value: any;
  export default value;
  export const createClient: any;
}

// Module declarations for URL imports
declare module 'https://*' {
  const value: any;
  export default value;
  export const createClient: any;
}

declare module 'http://*' {
  const value: any;
  export default value;
  export const createClient: any;
}
