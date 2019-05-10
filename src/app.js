import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GlobalStyle } from './style/global';

const SignUp = React.lazy(() => import('@/pages/sign-up'));

function LazyRoute({ lazy: Lazy, ...props }) {
  return (
    <Route
      {...props}
      render={routeProps => {
        return (
          <Suspense fallback={null}>
            <Lazy {...routeProps} />
          </Suspense>
        );
      }}
    />
  );
}

export default function App() {
  return (
    <>
      <GlobalStyle />

      <BrowserRouter>
        <Switch>
          <LazyRoute exact path="/sign-up" lazy={SignUp} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
