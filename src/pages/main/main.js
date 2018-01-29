import React, {Component} from 'react';
import Menus from '../../Components/menu/menu';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.goTest = this.goTest.bind(this);
    }

    state = {
        collapsed: false,
        menuWd: '250px',
        left: '250px'
    }

    goTest() {
        this.props.history.push('/foodMgr')
    }

    render() {
        return (
            <div>
                <Menus father={this} selectItem={'/'}/>
                <div className={'main-page'} style={{paddingLeft: this.state.left}}>
                    <div onClick={this.goTest}>这是Main</div>
                </div>
            </div>
        )
    }
}