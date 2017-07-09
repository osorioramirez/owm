if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  },

  locales: [
      { id: 'en', name: 'English' },
      { id: 'es', name: 'Español' },
  ],

  owm: {
    appId: '594fe38bd6bf5b47c702ef11673e001a',
    apiEndPoint: 'http://api.openweathermap.org/data/2.5',
  },

  weatherUpdateTime: 180000, // ms
};
