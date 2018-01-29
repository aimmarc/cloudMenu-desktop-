import React, {Component} from 'react';
import {Layout, Icon, Breadcrumb, Form, Input, Button, Table, Modal, Upload, Select, message} from 'antd';
import Menus from '../../Components/menu/menu';

const {Content} = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const {TextArea} = Input;
const columns = [{
    title: '菜品名称',
    dataIndex: 'name',
    width: 150,
}, {
    title: '菜品编码',
    dataIndex: 'code',
    width: 150,
}, {
    title: '价格',
    dataIndex: 'price',
    width: 150,
}, {
    title: '分类',
    dataIndex: 'foodClass',
    width: 150
}, {
    title: '图片链接',
    dataIndex: 'imgSrc',
    width: 150,
}, {
    title: '描述',
    dataIndex: 'desc',
    width: 150,
}, {
    title: '操作',
    dataIndex: 'opt',
}];

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


class Food extends Component {
    state = {
        collapsed: false,
        menuWd: '250px',
        left: '250px',
        data: [],
        addOpen: false,
        modalTitle: '',
        imageUrl: '',
        loading: false,
        foodName: 'hhh',
        token: '',
        upUrl: '',
        foodClass:[{key:0}],
        addFlag: 1, //1:add,2:edit
        editId: null,
        imgTile:'',
        seeOpen:false,
        seeImgSrc:''
    }

    componentDidMount() {
        this.getMainData();
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
                        for(let i in resp){
                            resp[i].key = i;
                        }
                        this.setState({
                            foodClass:resp
                        });
                    }
                });
            }

        }, function (err) {
            message.error('获取数据异常')
        });
    }

    getMainData = () => {
        const _this = this;
        const getFood = fetch("http://localhost/cloudMenu/server/sysManager/food.php?action=qryFoodList", {
            method: "GET",
            headers: {'Accept': 'application/json'},
            //body:"id=3&name=jack"
        });
        getFood.then( (res) => {
            if (res.ok) {
                let getTextObj = res.text();
                getTextObj.then( (resp) => {
                    resp = JSON.parse(resp);
                    if (resp.code == 0) {
                        resp = resp.rows;
                        let data = [];debugger
                        for (let i = 0; i < resp.length; i++) {
                            data.push({
                                key: resp[i].id,
                                classId: resp[i].classId,
                                name: resp[i].foodName,
                                code: resp[i].foodCode,
                                price: resp[i].foodPrice,
                                imgSrc: resp[i].imgSrc == null ? '--' : resp[i].imgSrc,
                                desc: resp[i].foodDesc,
                                foodClass: resp[i].className == null ? '--' : resp[i].className,
                                opt: (
                                    <div className={'opt'}>
                                        <Button type="primary" htmlType="button"
                                                onClick={_this.editFood.bind(_this, resp[i].id)}>
                                            修改
                                        </Button>
                                        <Button type="primary" htmlType="button" onClick={this.seeImg.bind(this, resp[i].id)}>
                                            查看大图
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

    seeImg = (index) => {
        var data = this.state.data;
        for(let i in data){
            if(data[i].key == index){
                this.setState({
                    seeOpen: true,
                    seeImgSrc: 'http://localhost/cloudMenu/server/commPHP/' + data[i].imgSrc,
                    imgTile: `查看图片- ${data[i].imgSrc}`
                });
            }
        }

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
                formData.append("foodName", values['菜品名称']);
                formData.append("foodCode", values['菜品编码']);
                formData.append("foodPrice", values['价格']);
                formData.append("desc", values['描述']);
                formData.append("imgSrc", this.state.upUrl);
                formData.append("classId", values['分类']);
                if(this.state.addFlag==1){
                    url = 'http://localhost/cloudMenu/server/sysManager/food.php?action=addFood';
                }else{
                    url = 'http://localhost/cloudMenu/server/sysManager/food.php?action=modifyFood';
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
            modalTitle: '新增菜品',
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
            '菜品名称': String(nFood['name']),
            '菜品编码': String(nFood['code']),
            '价格': String(nFood['price']),
            '描述': String(nFood['desc']),
            '分类': String(nFood['classId'])
        });
        debugger
        this.setState({
            addOpen: true,
            modalTitle: '修改菜品',
            addFlag:2,
            editId: index,
            imageUrl:'http://localhost/cloudMenu/server/commPHP/' + nFood['imgSrc'],
            upUrl: nFood['imgSrc']
        })
    }
    /*清除form*/
    clear = () => {
        this.props.form.setFieldsValue({
            '菜品名称': '',
            '菜品编码': '',
            '价格': '',
            '描述': '',
            '分类': ''
        });
        this.setState({
            imageUrl: '',
            upUrl: ''
        })
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
                const getObj = fetch("http://localhost/cloudMenu/server/sysManager/food.php?action=removeFood", {
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
    /*上传之前判断图片格式和尺寸*/
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('请选择正确的图片文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传图片不能超过2M!');
        }
        return isJPG && isLt2M;
    }
    /*上传状态变化*/
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            let res = info.file.response;
            if (res != null) {
                if (res.code == 1) {
                    getBase64(info.file.originFileObj, imageUrl => this.setState({
                        imageUrl,
                        loading: false,
                    }));
                    this.setState({
                        upUrl: res.src
                    });
                    message.success('上传成功');
                } else {
                    this.setState({
                        loading: false,
                    });
                    message.error(`${info.file.name} ${res.msg}`);
                }
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
            this.setState({
                loading: false,
            });
        }
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
        const imageUrl = this.state.imageUrl;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Menus father={this} selectItem={'/food'}/>
                <div className={'main-page'} style={{paddingLeft: this.state.left}}>
                    <Breadcrumb style={{padding: '24px 0 0 24px'}}>
                        <Breadcrumb.Item>基础管理</Breadcrumb.Item>
                        <Breadcrumb.Item>菜品管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                        <Form layout="inline" style={{marginBottom: '24px'}}>
                            <FormItem>
                                <Input type="user" placeholder="菜品名称" style={{color: 'rgba(0,0,0,.25)'}}/>
                            </FormItem>
                            <FormItem>
                                <Input type="lock" placeholder="菜品编码" style={{color: 'rgba(0,0,0,.25)'}}/>
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
                                    label="菜品名称"
                                >
                                    {getFieldDecorator('菜品名称', {
                                        rules: [{
                                            required: true, message: '请输入菜品名称',whitespace:true
                                        }, {
                                            max: 20, message: '菜品名称长度不能超过20'
                                        }],
                                    })(
                                        <Input type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="菜品编码"
                                >
                                    {getFieldDecorator('菜品编码', {
                                        rules: [{
                                            required: true, message: '请输入菜品编码', max: 10,whitespace:true
                                        }, {
                                        }],
                                    })(
                                        <Input type={'text'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="分类"
                                >
                                    {getFieldDecorator('分类', {
                                        rules: [{
                                            required: true, message: '请选择分类',whitespace:true
                                        }],
                                    })(
                                        <Select>
                                            {
                                                this.state.foodClass.map((item)=>{
                                                    return (
                                                        <Option value={item.id} key={item.key}>{item.className}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={"图片"}
                                >
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action="http://localhost/cloudMenu/server/commPHP/upload.php"
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img style={{width: '100%'}} title={this.state.upUrl} src={imageUrl} alt=""/> : uploadButton}
                                    </Upload>
                                    <span>* 请尽量选择小于2M的正方形图片进行上传</span>
                                    <span>{this.state.upUrl}</span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="价格"
                                >
                                    {getFieldDecorator('价格', {
                                        rules: [{
                                            required: true, message: '请输入价格',whitespace:true
                                        },{
                                            max:10, message: '价格不能超过10'
                                        }],
                                    })(
                                        <Input type={'number'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="描述"
                                >
                                    {getFieldDecorator('描述', {
                                        rules: [{
                                            required: true, message: '请输入描述',
                                        }],
                                    })(
                                        <TextArea row={4}/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal
                        title={this.state.imgTile}
                        visible={this.state.seeOpen}
                        onOk={()=>{this.setState({seeOpen:false})}}
                        onCancel={()=>{this.setState({seeOpen:false})}}
                        okText={'确认'}
                        cancelText={'取消'}
                    >
                        <img style={{width:'100%'}} src={this.state.seeImgSrc}/>
                    </Modal>
                </div>
            </div>
        )
    }
}

const food = Form.create()(Food);
export default food;