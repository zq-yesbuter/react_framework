import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import Authorized from '../utils/Authorized';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';

const { AuthorizedRoute } = Authorized;

export default class ReadSubRoutes extends PureComponent {
  render() {
    const { match, routerData, defaultPage = NotFound } = this.props;
    const routes = getRoutes(match.path, routerData);
    return (
      <Switch>
        {routes.map(item => (
          <AuthorizedRoute
            key={item.key}
            path={item.path}
            component={item.component}
            authority={item.authority}
            exact={item.exact}
            redirectPath={'/AI/403'}
          />
        ))}
        {
          routes[0] && routes[0].path.indexOf(':') === -1 &&
          <Redirect exact from={match.path} to={routes[0].path} />
        }
        <Route render={defaultPage} />
      </Switch>
    );
  }
}
