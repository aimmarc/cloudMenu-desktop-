import React,{Component} from 'react';
import {Breadcrumb} from 'antd';

class Navigator extends Component{
    render(){
        return(
            <Breadcrumb style={{padding: '24px 0 0 24px'}}>
                <Breadcrumb.Item>{this.props.navList[0]}</Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.navList[1]}</Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}

export default Navigator;