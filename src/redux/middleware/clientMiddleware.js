// Quando a action disparada contem uma key `promise` ela é executada por
// este middleware, que chama a ApiClient
import {authHandleAPIError} from '../modules/auth';

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      // verifica se é uma action creator (func)
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

      // se não contem promise, não é tratado nesse middleware
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;

      next({...rest, type: REQUEST});

      return promise(client).then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => {
          dispatch(authHandleAPIError(error, 'before'));
          next({...rest, error, type: FAILURE});
          dispatch(authHandleAPIError(error, 'after'));
        }
      ).catch((error)=> {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });
    };
  };
}
