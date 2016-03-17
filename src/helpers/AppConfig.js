APP_CONFIG = (typeof APP_CONFIG !== 'undefined')
  ? APP_CONFIG
  : {};

AppConfig = {
  render(config = {}) {
    _.extend(APP_CONFIG, config);
    if(typeof MainApp !== 'function') return

    const user = Accounts.user();
    if(user) setBrandStyles(user.instances[0].color)

    ReactDOM.render(
      React.createElement(MainApp, APP_CONFIG),
      document.getElementById('main-root')
    )
  },

  get(name) {
    return APP_CONFIG[name];
  },

  getUserData(userName) {
    return {
      userCompleteName: faker.name.title(),
      memberSince: faker.date.past(),
      profileType: 'pessoal',
      userName: userName,
      avatar: faker.image.avatar()
    }
  }
};
