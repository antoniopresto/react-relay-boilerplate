import {routeActions} from 'redux-simple-router';
import Accounts from '../../helpers/Accounts';
// import {logout} from '../modules/auth';

export default ({getState, dispatch}) => next => action => {
  next(action);
  // Se logado redireciona para ultima rota que tentou
  if (action.type === 'auth/LOGIN_SUCCESS') {
    Accounts.sessionUser(getState().auth.user);
    const {lastRouteLocation = '/'} = getState().auth;
    dispatch(routeActions.push(lastRouteLocation));
  }
  // se a api retornar algum erro, verifica se é de login e limpa localUser
  // disparado no clientMiddleware
  if (action.type === 'auth/API_ERROR') {
    console.info('CONFIGURAR ERROS DA API (if auth)');
    console.log(action);
    // if (error.error === 'xyz') dispatch(logout());
  }
};
