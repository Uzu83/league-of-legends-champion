import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://82e8709e38a70772bf7fdf5737de0a30@o4511570344280064.ingest.us.sentry.io/4511570401558528",
  tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
