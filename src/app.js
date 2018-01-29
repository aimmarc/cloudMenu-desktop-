import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import Home from './pages/home/home';
import '../dist/css/default.css';

class App extends React.Component {
    render(){
        return(
            <Home />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));