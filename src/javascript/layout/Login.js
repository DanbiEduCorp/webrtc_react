import React from 'react';
import logo from '../../resource/logo.png';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createForm } from 'rc-form';
import { APICaller } from 'wink_mobile_commons/dist/api';

import { Flex, InputItem, Button, Tabs, Checkbox, List, WingBlank, Modal } from 'antd-mobile'

import {security as action} from '../redux/actions';
import { api, service, values } from '../commons/configs';
import { fetch } from '../redux/actions';
import {PhoneNumberLogin} from './';
import {Toast} from "antd-mobile/lib/index";

const AgreeItem = Checkbox.AgreeItem;
const localStorage = window.localStorage;

const mapDispatchToProps = (dispatch) => {
    return {
        login: ({username, password}) => {
            return dispatch(action.login({username, password}));
        },
        authLogin: (params) => {
            return dispatch(action.authLogin(params));
        },
        fail: () => {
            return dispatch(action.loginFail());
        },
        moveHome: () => dispatch(push('/')),
        simpleUpdate: (url, params) => dispatch(fetch.simpleUpdate(url, params))
    }
};

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        // const authToken = localStorage.getItem(values.storageKey.AUTH_TOKENNAME);
        // if(authToken) {
        //     this.authLogin({authToken, autoLogin: true});
        // }
    }

    authLogin(params) {
        console.log('[Login] authLogin...', params);
        this.props.authLogin({...params, actorType: values.actorType.parent})
            .then(({actor}) => {
                if(service.getValue(params, 'autoLogin')) {
                    return APICaller.get(api.getAuthToken(service.getValue(actor, 'authDetail.id', '')).url, {})
                        .then(({data}) => {
                            localStorage.setItem(values.storageKey.AUTH_TOKENNAME, data.authToken);
                        });
                }
            })
            .then(() => {
                this.props.moveHome('/');
            })
            .catch(err => {
                //TODO : 로그인 실패 메시지 출력
                console.log('error message =========== ', err);
                localStorage.removeItem(values.storageKey.AUTH_TOKENNAME);

                this.props.form.resetFields();
                this.props.fail();

                this.showModal({title: '로그인 오류', message: '아이디와 비밀번호를 확인해주세요.'});
            });
    }

    login(params) {
        console.log('[Login] login.params', params);
        this.props.login(params)
            .then(accountInfo => {
                // console.log('[Login] login.then.accountInfo', accountInfo);
                if(service.getValue(params, 'autoLogin')) {
                    return APICaller.get(api.getAuthToken(accountInfo.authId).url, {})
                        .then(({data}) => {
                            console.log('[Login] data in login.getAuthToken', data);
                            localStorage.setItem(values.storageKey.AUTH_TOKENNAME, data.authToken);
                        })
                }
            })
            .then(() => {
                console.log('[Login] before moveHome');
                this.props.moveHome('/');
                console.log('[Login] after moveHome');
            })
            .catch(err => {
                //TODO : 로그인 실패 메시지 출력
                console.log('error message =========== ', err);
                localStorage.removeItem(values.storageKey.AUTH_TOKENNAME);

                this.props.form.resetFields();
                this.props.fail();

                this.showModal({title: '로그인 오류', message: '아이디와 비밀번호를 확인해주세요.'});
            });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    usernameError: err.username ? true : false,
                    passwordError: err.password ? true : false,
                });
                return Toast.fail('필수 입력란을 모두 입력해주세요.', 1);
            }
            this.login(values);
        });
    }

    showModal({title, message}){
        this.setState({
            title,
            message,
            visible: true
        });
    }
    onClose() {
        this.setState({visible: false});
    }
    render() {
        const { getFieldProps } = this.props.form;
        const {usernameError, passwordError, visible, title, message} = this.state;
        return (
            <div className="login-container">
                <Flex direction="column" className="login-wrapper">
                    <Flex.Item className="login-top-item">
                        <Flex direction="column" className="login-top-contents">
                            <Flex.Item className="login-top-contents-logo">
                                <img src={logo} alt="logo" className="logo"/>
                            </Flex.Item>
                            <Flex.Item className="login-top-contents-text">
                                윙크 영상통화앱을 이용하면<br/>
                                어디서든 우리 아이와 손쉽게 영상통화를 할 수 있습니다.<br/>
                                지금 바로 보고싶은 얼굴을 보러 가볼까요?
                            </Flex.Item>
                            <Flex.Item className="login-top-contents-notice">
                                ※ 윙크 영상통화앱은 윙크 학부모앱의 계정으로 이용이 가능합니다.
                            </Flex.Item>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item className="login-input-wrapper">
                        <Tabs tabs={values.tabs} initialPage={0} animated={false} useOnPan={false}>
                            <div className="tab-div">
                                <List className="login-input-list">
                                    <InputItem
                                        {...getFieldProps('username', {
                                            rules: [{ required: true, message: '아이디를 입력하세요!'}]
                                        })}
                                        placeholder="아이디"
                                        error={usernameError}
                                    />
                                </List>
                                <List className="login-input-list">
                                    <InputItem
                                        {...getFieldProps('password', {
                                            rules: [{ required: true, message: '비밀번호를 입력하세요!'}]
                                        })}
                                        type="password"
                                        placeholder="비밀번호"
                                        error={passwordError}
                                    />
                                </List>

                                <AgreeItem {...getFieldProps('autoLogin', {initialValue: true})} defaultChecked className="login-checkbox">
                                    로그인 상태 유지
                                </AgreeItem>
                                <Button type="primary" onClick={this.onSubmit.bind(this)} className="login-submit-button">로그인</Button>
                            </div>
                            <div className="tab-div">
                                <PhoneNumberLogin showModal={this.showModal.bind(this)} authLogin={this.authLogin.bind(this)}/>
                            </div>
                        </Tabs>
                    </Flex.Item>
                </Flex>

                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose.bind(this)}
                    title={title}
                    footer={[{ text: '확인', onPress: () => this.onClose() }]}
                >{message}
                </Modal>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(createForm()(Login));
