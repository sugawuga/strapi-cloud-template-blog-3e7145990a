module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'market-assets.strapi.io', '*'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'market-assets.strapi.io', '*'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // Use a small whitelist of known frontends to avoid issues with credentials and preflight handling.
      origin: (ctx) => {
        const whitelist = [
          'https://saurya-adventure-5189fedd6ed7.herokuapp.com',
          'http://localhost:3000',
          'http://localhost:5000',
          'http://localhost:5173',
          'https://aistudio.google.com',
        ];
        const requestOrigin = ctx.request.header.origin;
        return whitelist.includes(requestOrigin) ? requestOrigin : null;
      },
      // Explicit list of allowed request headers
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      // If you later need cookies/auth credentials, set this to true and be sure the origin is not '*'
      credentials: false,
      maxAge: 86400,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'global::strip-internal-fields',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
