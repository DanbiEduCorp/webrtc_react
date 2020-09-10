import React from 'react';
import { connect } from 'react-redux';
import {push} from 'react-router-redux';

import {values} from '../../commons/configs';
import {  security as action } from '../../redux/actions';

import { Flex, Button, List, Switch, Modal } from 'antd-mobile';
import {SecurityService, SessionService} from '../../mobileCommons/security/services';

import { getCurrentAppVersion } from '../../lib/utils';

const Item = List.Item;

const mapStateToProps = ({ fetch, security }) => {
    return {
        parent: {...security, push: true}
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            return dispatch(action.logout());
        },
        move: (location) => dispatch(push(location)),
    }
};

class Settings extends React.Component {
    confirmLogout() {
        Modal.alert('로그아웃', '윙크 영상통화앱 서비스에서 로그아웃 하시겠습니까?', [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.logout()}
        ]);
    }

    logout() {
        localStorage.removeItem(values.storageKey.AUTH_TOKENNAME);
        SessionService.logout();
        SecurityService.logout()
            .then(() => {
                this.props.logout();
                this.props.move('/login');
            });
    }

    renderLoginSetting() {
        const {parent} = this.props;
        const name = parent.humanName + (((parent.userName||'').indexOf('@noid') > -1 || (parent.userName||'').indexOf('@named') > -1) ? '' : `(${parent.userName})`);
        return (
            <List renderHeader={() => '로그인'} className="setting-list-header">
                <Item
                    extra={
                        <Button type="primary" size="small" className="setting-button" onClick={e => this.confirmLogout(e)}>로그아웃</Button>
                    }
                >
                    {name}
                </Item>
            </List>
        );
    }

    onPushChange(push) {
        console.log('onPushChange: ', push, getCurrentAppVersion());
    }

    renderPushSetting() {
        const {parent} = this.props;
        return (
            <List renderHeader={() => '알림 설정'} className="setting-list-header">
                <Item
                    extra={
                        <Switch
                            checked={parent.push}
                            onChange={checked => this.onPushChange(checked)}
                            platform="ios"
                        />
                    }
                >
                    영상통화 PUSH 알람
                </Item>
            </List>
        )
    }

    renderVersionInfo() {
        return (

            <List renderHeader={() => '버전정보'} className="setting-list-header">
                <Item>
                    <span className="setting-version-title">현재 버전</span>&nbsp;&nbsp;&nbsp;
                    <span className="setting-version-value">Ver.1.0.1</span>
                </Item>
                <Item>
                    <span className="setting-version-title">최신 버전</span>&nbsp;&nbsp;&nbsp;
                    <span className="setting-version-value">현재 최신 버전입니다.</span>
                </Item>
            </List>
        )
    }


    render() {
        return (
            <div>
                <Flex direction="column" className="setting-list-wrapper">
                    <Flex.Item>
                        {this.renderLoginSetting()}
                    </Flex.Item>
                    {/*<Flex.Item>*/}
                        {/*{this.renderPushSetting()}*/}
                    {/*</Flex.Item>*/}
                    {/*<Flex.Item>*/}
                        {/*{this.renderVersionInfo()}*/}
                    {/*</Flex.Item>*/}
                </Flex>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
