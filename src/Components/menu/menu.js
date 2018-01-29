import React, {Component} from 'react';
import { Menu, Icon, Button} from 'antd';
const SubMenu = Menu.SubMenu;

export default class Menus extends Component{
    constructor(props) {
        super(props);
        this.goRoute = this.goRoute.bind(this);
    }
    state = {
        collapsed: false,
        menuWd: "250px",
        left: "250px"
    }
    toggleCollapsed = () =>{
        this.setState({
            collapsed: !this.state.collapsed
        });
        if (this.state.collapsed) {
            this.setState({
                menuWd: '250px',
                left: '250px'
            });
            this.props.father.setState({
                menuWd: '250px',
                left: '250px'
            });
        } else {
            this.setState({
                menuWd: '80px',
                left: '80px'
            });
            this.props.father.setState({
                menuWd: '80px',
                left: '80px'
            });
        }
    }
    goRoute(item) {
        this.props.father.props.history.push(item.key)
    }
    render() {
        return(
            <div className={'menu-content'} style={{width: this.state.menuWd}}>
                <div style={{textAlign:'center',height:'36px',lineHeight:'36px'}}>
                    <a><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/></a>
                </div>
                <Menu
                    defaultSelectedKeys={[this.props.selectItem]}
                    defaultOpenKeys={['sub1','sub2']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={this.state.collapsed}
                    onClick={this.goRoute}
                >
                    <Menu.Item key="/">
                        <Icon type="pie-chart"/>
                        <span>首页</span>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="mail"/><span>基础管理</span></span>}>
                        <Menu.Item key="/user">用户管理</Menu.Item>
                        <Menu.Item key="/shop">店铺管理</Menu.Item>
                        <Menu.Item key="/class">菜品分类管理</Menu.Item>
                        <Menu.Item key="/food">菜品管理</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="appstore"/><span>系统设置</span></span>}>
                        <Menu.Item key="//">菜品管理</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <SubMenu key="sub3" title="Submenu">
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}