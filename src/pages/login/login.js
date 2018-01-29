import React, {Component} from 'react';
import {Layout, Form, Input, Button, Row, Col, Modal, message} from 'antd';

const crypto = require('crypto');
const {Content} = Layout;
const FormItem = Form.Item;

class login extends Component {
    login = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let md5 = crypto.createHash('md5');
                let password = md5.update(values['密码']).digest('base64');
                let formData = new FormData();
                formData.append("username", values['用户名']);
                formData.append("password", password);
                const loginObj = fetch("http://localhost/cloudMenu/server/login/login.php?action=login", {
                    method: "POST",
                    headers: {'Accept': 'application/json'},
                    body: formData
                });
                loginObj.then((res) => {
                    if (res.ok) {
                        let getTextObj = res.text();
                        getTextObj.then((resp) => {
                            try {
                                resp = JSON.parse(resp);
                                if (resp.code == 0) {
                                    message.success('登录成功')
                                    this.props.history.push('/');
                                } else {
                                    if (resp.code == 6) {
                                        message.error('密码错误')
                                    }
                                    if(resp.code == -1){
                                        message.error('用户名不存在');
                                        return;
                                    }
                                }
                            } catch (e) {
                                message.error('出现未知错误');
                                throw e;
                            }
                        })
                    }
                })
            } else {

            }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
            },
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{height: '100%', paddingTop: '56px'}}>
                <Row>
                    <Col span={8}></Col>
                    <Col span={8}>
                        <Form onSubmit={this.login}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                            >
                                {getFieldDecorator('用户名', {
                                    rules: [{
                                        required: true, message: '请输入用户名', whitespace: true
                                    }, {
                                        max: 20, message: '用户名长度不能超过20'
                                    }],
                                })(
                                    <Input placeholder={'请输入用户名'} type={'text'}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="密码"
                            >
                                {getFieldDecorator('密码', {
                                    rules: [{
                                        required: true, message: '请输入密码', whitespace: true
                                    }, {
                                        min: 6, message: '用户密码在6~16位之间', max: 16
                                    }],
                                })(
                                    <Input placeholder={'请输入密码'} type={'password'}/>
                                )}
                            </FormItem>
                            <FormItem>
                                <div className={'loginBtn'}>
                                    <Button type="primary" htmlType="button" onClick={this.addFood}>
                                        注册
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        登录
                                    </Button>
                                </div>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={8}></Col>
                </Row>
            </div>
        )
    }
}

const Login = Form.create()(login);
export default Login;