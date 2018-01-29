import React from 'react';
import {HashRouter,Route, Switch, Redirect} from 'react-router-dom';
import Main from '../pages/main/main';
import Food from '../pages/foodMgr/foodMgr';
import ClassMgr from '../pages/classMgr/classMgr';
import ShopMgr from '../pages/shopMgr/shopMgr';
import User from '../pages/userMgr/userMgr';
import Login from '../pages/login/login';

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/" component={Main}/>
            <Route path="/food" component={Food}/>
            <Route path="/class" component={ClassMgr}/>
            <Route path="/shop" component={ShopMgr}/>
            <Route path="/user" component={User}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;