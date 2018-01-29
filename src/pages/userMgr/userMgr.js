import React, {Component} from 'react';
import {Layout, Form, Input, Button, Table, Modal, message} from 'antd';
import Menus from '../../Components/menu/menu';
import Navigator from '../../Components/navigation/navigation';

const {Content} = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const columns = [{
    title: '用户名',
    dataIndex: 'username',
    width: 250,
}, {
    title: '姓名',
    dataIndex: 'nikeName',
    width: 250,
}, {
    title: '联系方式',
    dataIndex: 'phoneNumber',
    width: 250,
}, {
    title: '身份证号码',
    dataIndex: 'idCode',
    width: 250,
}, {
    title: '操作',
    dataIndex: 'opt',
}];

class user extends Component {
    state = {
        collapsed: false,
        menuWd: '250px',
        left: '250px',
        data: [],
        addOpen: false,
        modalTitle: '',
        token: '',
        addFlag: 1, //1:add,2:edit
        editId: null,
    }

    componentDidMount() {
        this.getMainData();
    }

    getMainData = () => {
        const _this = this;
        const getClass = fetch("http://localhost/cloudMenu/server/sysManager/user.php?action=qryUserList", {
            method: "GET",
            headers: {'Accept': 'application/json'},
            //body:"id=3&name=jack"
        });
        getClass.then( (res) => {
            if (res.ok) {
                let getTextObj = res.text();
                getTextObj.then( (resp) => {
                    resp = JSON.parse(resp);
                    if (resp.code == 0) {
                        resp = resp.rows;
                        let data = [];
                        for (let i = 0; i < resp.length; i++) {
                            data.push({
                                key: resp[i].id,
                                username: resp[i].username,
                                idCode: resp[i].idCode,
                                nikeName: resp[i].nikeName,
                                phoneNumber: resp[i].phoneNumber == null ? '--' : resp[i].phoneNumber,
                                opt: (
                                    <div className={'opt'}>
                                        <Button type="primary" htmlType="button"
                                                onClick={_this.editFood.bind(_this, resp[i].id)}>
                                            修改
                                        </Button>
                                        <Button type="danger" htmlType="button"
                                                onClick={_this.deleteFood.bind(_this, resp[i].id)}>
                                            删除
                                        </Button>
                                    </div>
                                ),
                            });
                        }
                        _this.setState({
                            data: data
                        })
                    }
                });
            }

        }, function (err) {
            message.error('获取数据异常')
        });
    }

    /*提交验证*/
    handleOk = (e) => {
        e.preventDefault();
        if (this.state.imageUrl == '') {
            message.error('请上传图片！')
            return;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let formData = new FormData();
                let url = '';
                formData.append("UserName", values['用户名']);
                formData.append("phoneNumber", values['联系方式']);
                formData.append("nikeName", values['姓名']);
                formData.append("idCode", values['身份证号码']);
                if(this.state.addFlag==1){
                    url = 'http://localhost/cloudMenu/server/sysManager/user.php?action=addUser';
                }else{
                    url = 'http://localhost/cloudMenu/server/sysManager/user.php?action=modifyUser';
                    formData.append("id", this.state.editId);
                }
                const getObj = fetch(url, {
                    method: "POST",
                    headers: {'Accept': 'application/json'},
                    body: formData
                });
                getObj.then((res) => {
                    if (res.ok) {
                        let getTextObj = res.text();
                        getTextObj.then((resp) => {
                            resp = JSON.parse(resp);
                            if (resp.code == 0) {
                                this.setState({
                                    addOpen: false
                                });
                                message.success('保存成功！');
                                this.getMainData();
                            }
                        });
                    }
                })
            } else {
                message.error('请完善表单!');
            }
        });
    }
    /*取消*/
    handleCancel = () => {
        this.setState({
            addOpen: false
        });
    }
    /*新增菜品*/
    addFood = () => {
        this.setState({
            addOpen: true,
            modalTitle: '新增用户',
            addFlag:1
        })
        this.clear();
    }
    /*编辑菜品*/
    editFood = (index) => {
        let eFood = this.state.data;
        let nFood;
        for (let i in eFood) {
            if (eFood[i].key == index) {
                nFood = eFood[i];
            }
        }
        this.props.form.setFieldsValue({
            '用户名': String(nFood['username']),
            '姓名': String(nFood['nikeName']),
            '联系方式': String(nFood['phoneNumber']),
            '身份证号码': String(nFood['idCode']),
        });
        this.setState({
            addOpen: true,
            modalTitle: '修改用户',
            addFlag:2,
            editId: index
        })
    }
    /*清除form*/
    clear = () => {
        this.props.form.setFieldsValue({
            '用户名': '',
            '姓名': '',
            '联系方式': '',
            '身份证号码': '',
        });
    }
    /*删除菜品*/
    deleteFood = (index) => {
        let _this = this;
        confirm({
            title: '是否删除?',
            content: '删除后不可恢复，请谨慎操作。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                let formData = new FormData();
                formData.append("id", index);
                const getObj = fetch("http://localhost/cloudMenu/server/sysManager/user.php?action=removeUser", {
                    method: "POST",
                    headers: {'Accept': 'application/json'},
                    body: formData
                });
                getObj.then((res) => {
                    if (res.ok) {
                        let getTextObj = res.text();
                        getTextObj.then(function (resp) {
                            resp = JSON.parse(resp);
                            if (resp.code == 0) {
                                message.success('删除成功！');
                                let data = _this.state.data;
                                for (let i in data) {
                                    if (data[i].key == index) {
                                        data.splice(i, 1);
                                        break;
                                    }
                                }
                                _this.setState({
                                    data: data
                                })
                            } else {
                                message.error('删除失败！');
                            }
                        });
                    }
                })
            },
            // onCancel() {
            //     console.log('Cancel');
            // },
        });
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
            <div>
                <Menus father={this} selectItem={'/user'}/>
                <div className={'main-page'} style={{paddingLeft: this.state.left}}>
                    <Navigator navList={['基础管理','用户管理']}/>
                    <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                        <Form layout="inline" style={{marginBottom: '24px'}}>
                            <FormItem>
                                <Input type="user" placeholder="分类名称" style={{color: 'rgba(0,0,0,.25)'}}/>
                            </FormItem>
                            <FormItem>
                                <Input type="lock" placeholder="分类编码" style={{color: 'rgba(0,0,0,.25)'}}/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="button" onClick={this.addFood}>
                                    新增
                                </Button>
                            </FormItem>
                        </Form>
                        <Table columns={columns} dataSource={this.state.data} pagination={{pageSize: 10}}
                               scroll={{y: 380}}/>
                    </Content>
                </div>
                <div>
                    <Modal
                        title={this.state.modalTitle}
                        visible={this.state.addOpen}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText={'确认'}
                        cancelText={'取消'}
                    >
                        <div>
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="用户名"
                                >
                                    {getFieldDecorator('用户名', {
                                        rules: [{
                                            required: true, message: '请输入用户名',whitespace:true
                                        }, {
                                            max: 20, message: '分类名称长度不能超过20'
                                        }],
                                    })(
                                        <Input placeholder={'请输入分类名称'} type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                >
                                    {getFieldDecorator('姓名', {
                                        rules: [{
                                            required: true, message: '请输入分类编码', whitespace:true
                                        }, {
                                            max: 10,message: '姓名长度不能超过10',
                                        }],
                                    })(
                                        <Input placeholder={'姓名由不超过10位汉字组成'} type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="联系方式"
                                >
                                    {getFieldDecorator('联系方式', {
                                        rules: [{
                                            required: true, message: '请输入联系方式', whitespace:true
                                        }, {
                                            max: 11,message: '联系方式长度不能超过11',
                                        }],
                                    })(
                                        <Input placeholder={'请输入联系方式'} type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号码"
                                >
                                    {getFieldDecorator('身份证号码', {
                                        rules: [{
                                            required: true, message: '请输入身份证号码', whitespace:true
                                        }, {
                                            max: 18,message: '请输入正确的身份证号码',min: 18
                                        }],
                                    })(
                                        <Input placeholder={'请输入身份证号码'} type={'text'}/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const User = Form.create()(user);
export default User;