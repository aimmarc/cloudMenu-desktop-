import React, {Component} from 'react';
import {Layout, Form, Input, Button, Table, Modal, message, Select} from 'antd';
import Menus from '../../Components/menu/menu';
import Navigator from '../../Components/navigation/navigation';

const {Content} = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const columns = [{
    title: '分类名称',
    dataIndex: 'name',
    width: 250,
}, {
    title: '分类编码',
    dataIndex: 'code',
    width: 250,
}, {
    title: '店铺名称',
    dataIndex: 'shopName',
    width: 250,
}, {
    title: '操作',
    dataIndex: 'opt',
}];

class foodClass extends Component {
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
        shop:[]
    }

    componentDidMount() {
        this.getMainData();
        this.getShopData();
    }

    getMainData = () => {
        const _this = this;
        const getClass = fetch("http://localhost/cloudMenu/server/sysManager/foodClass.php?action=qryClassList", {
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
                                classId: resp[i].classId,
                                name: resp[i].className,
                                code: resp[i].classCode,
                                shopId: resp[i].shopId,
                                shopName: resp[i].shopName,
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
                        this.setState({
                            data: data
                        })
                    }
                });
            }

        }, function (err) {
            message.error('获取数据异常')
        });
    }

    getShopData = () =>{
        const getShop = fetch("http://localhost/cloudMenu/server/sysManager/shop.php?action=qryShopList", {
            method: "GET",
            headers: {'Accept': 'application/json'},
            //body:"id=3&name=jack"
        });
        getShop.then( (res) => {
            if (res.ok) {
                let getTextObj = res.text();
                getTextObj.then( (resp) => {
                    resp = JSON.parse(resp);
                    if (resp.code == 0) {
                        resp = resp.rows;
                        for(var i in resp){
                            resp[i].key = i;
                        }
                        this.setState({
                            shop: resp
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
                formData.append("className", values['分类名称']);
                formData.append("classCode", values['分类编码']);
                formData.append("shopId", values['店铺名称']);
                if(this.state.addFlag==1){
                    url = 'http://localhost/cloudMenu/server/sysManager/foodClass.php?action=addClass';
                }else{
                    url = 'http://localhost/cloudMenu/server/sysManager/foodClass.php?action=modifyFood';
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
            modalTitle: '新增菜品分类',
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
            '分类名称': String(nFood['name']),
            '分类编码': String(nFood['code']),
            '店铺名称': parseInt(nFood['shopId']),
        });
        this.setState({
            addOpen: true,
            modalTitle: '修改菜品分类',
            addFlag:2,
            editId: index
        })
    }
    /*清除form*/
    clear = () => {
        this.props.form.setFieldsValue({
            '分类名称': '',
            '分类编码': '',
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
                const getObj = fetch("http://localhost/cloudMenu/server/sysManager/foodClass.php?action=removeClass", {
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

    subFun = (e) => {

    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Menus father={this} selectItem={'/class'}/>
                <div className={'main-page'} style={{paddingLeft: this.state.left}}>
                    <Navigator navList={['基础管理','菜品分类管理']}/>
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
                            <Form onSubmit={this.subFun}>
                                <FormItem
                                    {...formItemLayout}
                                    label="分类名称"
                                >
                                    {getFieldDecorator('分类名称', {
                                        rules: [{
                                            required: true, message: '请输入分类名称',whitespace:true
                                        }, {
                                            max: 20, message: '分类名称长度不能超过20'
                                        }],
                                    })(
                                        <Input placeholder={'请输入分类名称'} type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="分类编码"
                                >
                                    {getFieldDecorator('分类编码', {
                                        rules: [{
                                            required: true, message: '请输入分类编码', whitespace:true
                                        }, {
                                            max: 10,message: '分类编码长度不能超过10',
                                        }],
                                    })(
                                        <Input placeholder={'分类编码由不超过10位的大写字母组成'} type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="店铺名称"
                                >
                                    {getFieldDecorator('店铺名称', {
                                        rules: [{
                                            required: true, message: '请选择店铺'
                                        }],
                                    })(
                                        <Select>
                                            {
                                                this.state.shop.map((item)=>{
                                                    return (
                                                        <Option value={parseInt(item.id)} key={item.key}>{item.shopName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
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

const FoodClass = Form.create()(foodClass);
export default FoodClass;