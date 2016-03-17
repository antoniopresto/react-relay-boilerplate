import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {requireAuth} from './redux/modules/auth';

import {
  App,
  Login
} from './containers';

export default (store) => {
  const requireAuthCallback = (nextState) => (
    store.dispatch(requireAuth(nextState))
  );

  return (
    <Route path="/" component={App}>
      <Route path="login" component={Login} />

      <Route onEnter={requireAuthCallback}>
        <IndexRoute component={_=> <h1>Home</h1>} />
      </Route>

      <Route path="*" component={()=> <h1>'NOT FOUND'</h1>} status={404} />
    </Route>
  );
};
