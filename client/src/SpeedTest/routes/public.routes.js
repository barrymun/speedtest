import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {routes} from "../constants";
import {Main} from '..'

const speedTestPublicRoutes = thisProps => {
    return (
        <Switch>
            <Route
                exact
                path={routes.ROOT}
                render={props => (
                    <Main
                        {...props}
                        {...thisProps}
                    />
                )}
            />
        </Switch>
    );
};
export default speedTestPublicRoutes;