import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Home } from '../Home';
import { NotFound } from '../../components';

const AppRouter = () => (
  <BrowserRouter basename={process.env.REACT_APP_ROOT_PATH}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Redirect exact from="*" to="/404" />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
