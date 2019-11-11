import React, { Component } from 'react';
import {connect} from 'react-redux';
import studentM from '../../../resource/student_m.png';
import studentW from '../../../resource/student_w.png';
import {service, values, api} from '../../commons/configs';
import {CustomIcon, Duration} from '../../commons/components';
import {socket as action, fetch} from '../../redux/actions';
import Loader from 'react-loader';

import {Flex, Button} from 'antd-mobile';

const TIME_WAIT = 40000;

const mapStateToProps = ({ fetch, security, socket }) => {
    const room = service.getValue(fetch, 'multipleList.room', {});
    const student = service.getValue(room, 'sdata.studentDetail', {});
    const talkInfo = service.getValue(fetch, 'item', {});
    return {
        parent: {...security.actor},
        student,
        room,
        rtc: socket.rtc,
        remote: socket.remote,
        status: socket.status,
        local: socket.local,
        rtcStatus: socket.rtcStatus,
        callStatus: socket.callStatus,
        talkInfo,
        resource: socket.resource
    }
};
const mapDispatchProps = dispatch => ({
    update: (url, params) => dispatch(fetch.update(url, params)),
    simpleUpdate: (url, params) => dispatch(fetch.simpleUpdate(url, params)),
    updateRtcStatus: (rtcStatus, student, useRelay, subType) => dispatch(action.updateVideoCallConnectStatus(rtcStatus, student, useRelay, subType)),
    updateCallStatus: (callStatus) => dispatch(action.updateVideoCallStatus(callStatus)),
    emit: (params) => dispatch(action.emitTalk(params)),
    reset: () => dispatch(fetch.reset()),

});

class VideoPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'connect',
            audioOn: true,
            pauseVideo: false,
            loaded: true,
            videoOn: true
        };
        this.roomId = '7292_7293';
    }
    componentDidMount() {
        if (window.cordova !== undefined) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
            document.addEventListener('orientationchange', this.onRefreshVideos.bind(this), false);
            if(window.StatusBar) {
                window.StatusBar.styleLightContent();
            }
        }
    }
    componentWillUnmount() {
        document.removeEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.removeEventListener('orientationchange', this.onRefreshVideos.bind(this), false);
        if(window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    }

    onRefreshVideos() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
            // window.cordova.plugins.iosrtc.refreshVideos();
            (function refreshVideos () {
                window.cordova.plugins.iosrtc.refreshVideos();
                requestAnimationFrame(refreshVideos);
            }());
        }
    }

    componentDidUpdate(prevProps) {
        const {remote, rtcStatus, callStatus} = this.props;
        const keys = Object.keys(remote);
        if(prevProps.rtcStatus !== rtcStatus) {
            if(rtcStatus === values.rtcStatus.REMOTE_APPEND) {
                this.appendRemoteVideo(remote[keys[0]]);
            } else if(rtcStatus === values.rtcStatus.REMOTE_REMOVE) {
                this.disconnect(values.callStatus.CALL_END);;
            }
        }
        if(prevProps.callStatus !== callStatus) {
            if(callStatus === values.callStatus.CALL_END) {
                this.endCall();
            } else if(callStatus === values.callStatus.CALL_FAIL) {
                this.failCall();
            }
        }
    }

    appendRemoteVideo({video, peer}) {
        var peerVideoBox = document.getElementById('peerVideoBox');
        // this.stopVibrate();
        video.style.zIndex = -2;
        video.style.width = '100%';
        video.style.height = '100%';
        // iphone 5s 대응
        if(window.document.body.offsetWidth < 375) {
            video.style.objectFit = 'cover';
        }
        video.className = 'peer-video';

        peerVideoBox.className = 'peer-video-box';
        peerVideoBox.appendChild(video);

        setTimeout(() => {
            const myVideoBoxSmall = document.getElementById('myVideoBoxSmall');
            myVideoBoxSmall.appendChild(this.myVideo || document.getElementById("myVideo"));
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
                window.cordova.plugins.iosrtc.refreshVideos();
                if(window.cordova.plugins.CordovaCall && window.cordova.plugins.CordovaCall.speakerOn) {
                    window.cordova.plugins.CordovaCall.speakerOn(() => console.log('success'), () => console.log('fail'));
                }
            }
        }, 300);

        this.props.updateCallStatus(values.callStatus.CALLING);
    }

    onDeviceReady() {
        this.prepareWebRTC();
    }

    prepareWebRTC() {
        this.connect();
    }

    connectRoom(subType) {
        const {student} = this.props.data;

        setTimeout(() => {
            this.props.updateRtcStatus(values.rtcStatus.CONNECT, student.id, false, subType );
        }, 300);
    }

    connect() {
        const {callStatus} = this.props;
        const {parent, room} = this.props.data;
        this.serverUrl = service.getUrl();
        this.roomId = room.name;
        this.actorId = parent.id;
        this.actorName = parent.authHumanName;
        this.facingMode = true;

        if(callStatus === values.callStatus.CALL_WAIT) {
            this.connectRoom(values.subtype.CONNECT);
            this.setTalk('create');
            setTimeout(() => {
                if (this.props.callStatus === values.callStatus.CALL_WAIT) {
                    this.props.updateCallStatus(values.callStatus.CALL_FAIL);
                }
            }, TIME_WAIT);

        } else if(callStatus === values.callStatus.RECEIVED) {
            // this.startVibrate();
        }
    }

    disconnect(state) {
        const {status} = this.props;
        const {student} = this.props.data;
        if(status === values.rtcStatus.CONNECT) {
            if(window.cordova.plugins.CordovaCall && window.cordova.plugins.CordovaCall.speakerOff) {
                window.cordova.plugins.CordovaCall.speakerOff(() => console.log('success'), () => console.log('fail'));
            }
            this.props.updateRtcStatus(values.rtcStatus.DISCONNECT, student.id, false );
        }
        // this.stopVibrate();
        setTimeout(() => {
            this.setTalk(state);
        });
        this.props.onClose();
    }

    toggleAudio = (e) => {
        console.log('[VideoPhone] toggleAudio');
        e.preventDefault();
        if (this.props.rtc) {
            if (this.state.audioOn) {
                this.props.rtc.mute();
            } else {
                this.props.rtc.unmute();
            }
            this.setState({
                ...this.state,
                audioOn: !this.state.audioOn
            });
        }
    }

    toggleVideo = (e) => {
        console.log('[VideoPhone] toggleVideo');
        e.preventDefault();
        if (this.props.rtc) {
            if (this.state.videoOn) {
                this.props.rtc.pauseVideo();
            } else {
                this.props.rtc.resumeVideo();
            }
            this.setState({
                ...this.state,
                videoOn: !this.state.videoOn
            });
        }
    }

    changeCamera = (e) => {
        e.preventDefault();
        console.log('[VideoPhone] changeCamera');
        this.facingMode = !this.facingMode;
        return this.props.rtc.changeLocalVideo({
            video: { facingMode: { exact: this.facingMode ? 'user' : 'environment' } },
            audio: true
        });
    }

    createVideoTalk() {
        const {room} = this.props;
        const params = {
            modelType: values.talkType.RealtimeVideoTalk,
            room: room.id,
            data: {}
        };
        const obj = api.sendTalk(params);
        return this.props.update(obj.url, obj.params);
    }

    completeVideoTalk(state) {
        const {room, talkInfo, student} = this.props;
        const params = {
            data: {
                state,
                duration: this.duration // this.state.curTime - this.state.startTime
            }
        };
        const obj = api.modifyTalk(talkInfo.id, params);
        return this.props.simpleUpdate(obj.url, obj.params)
            .then(() => {
                const setObj = api.setTalk(talkInfo.id, {status: 0});
                return this.props.update(setObj.url, setObj.params);
            })
            .then(() => {
                return this.props.emit({to: student.id, room: room.id, text: '통화성공'});
            })
            .then(() => {
                return this.props.reset();
            });
    }

    failVideoTalk(state) {
        const {room, talkInfo, student} = this.props;
        const params = {
            state,
            duration: 0
        };
        const obj = api.modifyTalk(talkInfo.id, params);
        return this.props.simpleUpdate(obj.url, obj.params)
            .then(() => {
                const setObj = api.setTalk(talkInfo.id, {status: 99});
                return this.props.update(setObj.url, setObj.params);
            })
            .then(() => {
                return this.props.emit({to: student.id, room: room.id, text: '통화실패'});
            })
            .then(() => {
                return this.props.reset();
            });
    }

    setTalk(state) {
        const {talkInfo, room} = this.props;

        if(state === 'create') {
            if(!talkInfo.id) {
                this.createVideoTalk();
            }
        } else {
            if(!room.id) {
                return ;
            }
            switch (state) {
                case values.callStatus.CALL_END:
                    this.completeVideoTalk(state);
                    break;
                case values.callStatus.CALL_CANCEL:
                case values.callStatus.CALL_FAIL:
                case values.callStatus.CALL_REJECT:
                    this.failVideoTalk(state);
                    break;
                default:
                    break;
            }
        }
    }

    isConnected() {
        const {remote} = this.props;
        return (Object.keys(remote).length > 0);
    }

    failCall() {
        const {student} = this.props.data;
        setTimeout(() => {
            this.props.updateRtcStatus(values.rtcStatus.DISCONNECT, student.id, false );
            this.props.onClose();
        }, 2000);
    }
    endCall() {
        const {student} = this.props.data;
        setTimeout(() => {
            this.props.updateRtcStatus(values.rtcStatus.DISCONNECT, student.id, false );
            this.props.onClose();
        }, 1500);
    }

    renderCallStatus() {
        const { callStatus } = this.props;

        if (callStatus === values.callStatus.CALL_END) {
            return '영상 통화를 종료합니다.';
        } else if(callStatus === values.callStatus.CALLING) {
            return (<Duration format={'mm:ss'} on={this.getTimerStatus()} setDuration={this.setDuration.bind(this)} />);
        } else if (callStatus === values.callStatus.CALL_WAIT) {
            return '연결중입니다.';
        } else if (callStatus === values.callStatus.RECEIVED) {
            return '전화 왔습니다.';
        } else if (callStatus === values.callStatus.CALL_FAIL) {
            return '상대방이 받지 않아 영상 통화를 종료합니다.';
        }
    }

    renderCameraSwitchButton() {
        return (
            <div className="videophone-camera-switch">
                <img src="https://s.wink.co.kr/app/parents/images/parents/btn_camera_change.png" alt="" onClick={e => this.changeCamera(e)}/>
            </div>
        )
    }

    renderSpinner() {
        return (
            <div className="videophone-spinner">
                <Loader lines={12} length={12} width={8} radius={30}
                        color="#fff" className="spinner" zIndex={2e9} top="50%" left="50%" scale={1.00}
                        loadedClassName="loadedContent" >
                </Loader>
                <CustomIcon roots="FontAwesome" type="FaVideoCamera" className="loader-icon" sizes="lg"/>
            </div>
        )
    }

    stopVibrate() {
        if(navigator.vibrate) {
            navigator.vibrate(0);
        }
    }

    startVibrate() {
        if(navigator.vibrate) {
            if (window.cordova.platformId === 'ios') {
                navigator.vibrate();
            } else {
                let arr = [];
                let inx = 30;
                while(inx-- > 0) arr.push(900, 500);
                navigator.vibrate(arr);
            }
        }
    }

    setDuration = (duration) => {
        this.setState({
            duration
        });
        this.duration = duration;

    };

    getTimerStatus() {
        const {callStatus} = this.props;
        return callStatus === values.callStatus.CALLING ? true : false;
    }

    renderButton() {
        const {callStatus} = this.props;
        const {audioOn, videoOn} = this.state;
        switch(callStatus) {
            case values.callStatus.CALLING:
                return (
                    <Flex className="button-list" justify="center">
                        <Flex.Item className="videophone-icon">
                            <CustomIcon type={audioOn ? "MdMicOff" : "MdMic"} onClick={e => this.toggleAudio(e)}/>
                        </Flex.Item>
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(values.callStatus.CALL_END)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>
                        <Flex.Item className="videophone-icon">
                            <CustomIcon type={videoOn ? "MdVideocamOff" : "MdVideocam"} onClick={e => this.toggleVideo(e)}/>
                        </Flex.Item>
                    </Flex>
                );
            case values.callStatus.RECEIVED:
                return (
                    <Flex className="button-list" justify="center">
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large"
                                    onClick={() => this.disconnect(values.callStatus.CALL_REJECT)}>
                                <CustomIcon type="MdDoNotDisturb"/>
                                거절</Button>
                        </Flex.Item>
                        <Flex.Item className="videophone-button">
                            <Button type="primary" size="large" onClick={() => this.connectRoom(values.subtype.ACCEPT)}>
                                <CustomIcon type="MdPhone"/>
                                통화</Button>
                        </Flex.Item>
                    </Flex>
                );
            case values.callStatus.CALL_WAIT:
                return (
                    <Flex className="button-list" justify="center">
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={() => this.disconnect(values.callStatus.CALL_CANCEL)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>
                    </Flex>
                );
            case values.callStatus.CALL_FAIL:
                return (
                    <Flex className="button-list" justify="center">
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={() => this.disconnect(values.callStatus.CALL_FAIL)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>
                    </Flex>
                );
            default:
                return ;
        }
    }

    render() {
        const {callStatus} = this.props;
        const {student} = this.props.data;

        return (
            <div>
                <div id="myVideoBox"></div>
                <div id="peerVideoBox"></div>
                <div id="myVideoBoxSmall" className="my-video-box-small"></div>
                {/*<video id="vidSelf" className="video-loading" autoPlay poster="https://s.wink.co.kr/images/parent/video_poster_parent_parent.png"></video>*/}
                <div className="videophone-student-division">
                    <Flex direction="column">
                        {callStatus !== values.callStatus.CALLING && (
                            <Flex.Item>
                                <img src={student.isMail ? studentM : studentW} alt="student" className="student-img"/>
                            </Flex.Item>
                        )}
                        <Flex.Item className="student-name">
                            {student.authHumanName || '정주어'}
                        </Flex.Item>
                        <Flex.Item className="call-status">
                            {this.renderCallStatus()}
                        </Flex.Item>
                    </Flex>
                </div>
                {false && this.renderCameraSwitchButton()}
                {false && this.renderSpinner()}
                <div className="videophone-button-division">
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(VideoPhone);
