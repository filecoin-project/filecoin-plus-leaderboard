import * as Sentry from '@sentry/nextjs';
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: true,
  attachStacktrace: true,
  integrations: [
    new CaptureConsoleIntegration({
      // array of methods that should be captured
      // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
      levels: ['log', 'info', 'warn', 'error', 'debug', 'assert', 'trace', 'table', 'dir', 'dirxml'],
    }),
  ],
});
