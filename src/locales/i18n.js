//external lib import
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');

const initI18next = (app) => {
  i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      fallbackLng: 'en',
      backend: {
        loadPath: './src/locales/{{lng}}/translate.json',
      },
    });

  app.use(i18nextMiddleware.handle(i18next));
};

module.exports = initI18next;
