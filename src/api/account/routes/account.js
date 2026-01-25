module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/account/me',
      handler: 'account.me',
      config: {
        auth: false,
      },
    },
  ],
};