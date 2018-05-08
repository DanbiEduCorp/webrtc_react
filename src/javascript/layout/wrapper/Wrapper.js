import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { path } from '../../commons/configs';

import { Page404 } from '../error';

import { Main} from '../../routes';

class Wrapper extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.home} render={() => {
                    return (<Redirect to={path.main} />)
                }} />
                <Route path={path.main} component={Main}/>
                <Route component={Page404}/>
            </Switch>
        );
    }

}

export default Wrapper;
