import React from 'react';

import { StickyContainer } from 'react-sticky';
import { APICaller } from './mobileCommons/api';

import {api, path, service, values} from './commons/configs';
import { WrapperContainer } from './layout';

import Push from './lib/Push';
import {PLATFORM, getPlatformName} from './lib/utils';
import { connect } from 'react-redux';

import {fetch, socket as action, socket as socketAction} from './redux/actions';
import {push} from "react-router-redux";

const mapStateToProps = ({ security, fetch }) => ({
    parent : security.actor,
    room: service.getValue(fetch, 'multipleList.room', {}),
});

const mapDispatchProps = dispatch => ({
    connect: () => {
        return dispatch(socketAction.connect());
    },
    worker: (worker) => {
        return dispatch(socketAction.initWorker(worker));
    },
    move: (location) => dispatch(push(location)),
    updateVideoCallStatus: (callStatus) => dispatch(action.updateVideoCallStatus(callStatus)),
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu : false,
            mypage : false,
        };
        this.platform = getPlatformName();
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    componentDidMount() {
        if (this.platform !== PLATFORM.browser) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        }

    }

    modifyActor() {
        const pushIdsIos = JSON.parse(window.localStorage.getItem(values.storageKey.PUSH_IDS_IOS));
        if(pushIdsIos) {
            const {parent} = this.props;
            const params = {
                data: {
                    pushIdsIos
                }
            };
            const obj = api.modifyActor(service.getValue(parent, 'id'), params);
            return APICaller.post(obj.url, obj.params);
        }
    }

    onDeviceReady() {
        if (window.cordova.platformId.toLocaleLowerCase() === 'ios') {
            window.cordova.plugins.iosrtc.registerGlobals();
        }
        // push 제거
        return ;
        if(window.plugins && window.plugins.OneSignal && window.cordova.platformId === 'ios') {
            Push.init(
                (pushIds) => {
                    this.onPushIds(pushIds);
                },
                (notifyData) => {
                    this.onPushNotify(notifyData);
                }
            );
        }
        // requestPermissions();
    }

    // 푸시 아이디를 스토리지에 저장한다. (나중에 이용자가 로그인 할 때, 이것을 읽어서 actor 정보에 저장하도록 한다.)
    onPushIds = (ids) => {
        localStorage.setItem(values.storageKey.PUSH_IDS_IOS, JSON.stringify(ids));
        this.modifyActor();
    }

    // 푸시 메세지 수신 시 처리한다.
    onPushNotify = (data) => {
        if (data.handleType === 'received') {
            // 영상통화 수신 기능 제거
            return ;

            const additionalData = service.getValue(data, 'payload.additionalData', {});
            if(additionalData.type === 'CALL') {
                const {parent} = this.props;
                const obj = api.getRoomId({name: `${parent.id}_${additionalData.fromActorId}`});
                return this.props.multipleList([{id:'room', url :obj.url, params : obj.params }])
                // return APICaller.get(obj.url, obj.params)
                    .then(() => {
                        const {room} = this.props;
                        if(room.id) {
                            this.props.updateVideoCallStatus(values.callStatus.RECEIVED);
                            this.props.move(path.video);
                        } else {
                            console.log('room이 없음');
                            return ;
                        }
                    });
            }
        }
    }
    onOpenChange(target){
        return this.setState({
            menu : false,
            mypage : false,
            [target] : !this.state[target],
        });
    }

    render() {
        return (
            <div>
                <StickyContainer className="contents-container">
                    <WrapperContainer />
                </StickyContainer>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(App);
