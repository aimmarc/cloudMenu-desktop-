import React, {Component} from 'react';
import { Menu, Icon, Button} from 'antd';
import BasicRoute from '../../route/route';
import history from '../../history';
const SubMenu = Menu.SubMenu;
class Home extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        collapsed: false,
        menuWd: '250px',
        left: '250px'
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className={'nav'}>
                    <h3 className={'nav-title'} style={{padding:'0 12px'}}>XX管理系统</h3>
                </div>
                <BasicRoute/>
            </div>
        );
    }
}
export default Home;