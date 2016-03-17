/*eslint-disable*/
import configs from '../config';
import ApiClient from '../helpers/ApiClient';
const apiClient = new ApiClient();

const USER_STORAGE = 'accounts.user';

let Accounts = {
  LOGIN_PATH: configs.remoteLoginPath
};

// Format user Data
Accounts.formatUserData = (data) => {
  const { instances = [] } = data;
  if(!data.instances[0]) throw new Error('Nenhuma instancia econtrada');

  const brandColor = instances[0].color;
  const brandLogo = instances[0].thumb_url;

  return {
    ...data,
    brandColor,
    brandLogo
  }
};

// Get or SET user from localStorage
Accounts.sessionUser = (data) => {
  if(!__CLIENT__) return null;
  if(data) localStorage.setItem(USER_STORAGE, JSON.stringify(data));
  const user  = localStorage.getItem(USER_STORAGE);
  return (user) ? Accounts.formatUserData(JSON.parse(user)) : null;
};

// Clear localStorage user login data
Accounts.removeLocalStorageUser = () => localStorage.removeItem(USER_STORAGE);

export default Accounts;