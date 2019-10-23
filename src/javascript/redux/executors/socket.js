import SimpleWebRTC from 'danbi-simplewebrtc';
import {SocketIOConnection} from 'danbi-msgclient';

// import message from 'antd/lib/message';
import {socket as creator} from '../creators';
import {socket as type} from '../types';

const authToken = '*danbi*';
let actorId, currentRtc, roomName;

const makeRTC = (socket, params = null) => {
    const myVideo = document.createElement('VIDEO');
    myVideo.autoplay = true;
    myVideo.volume = 0;
    myVideo.style.zIndex = -1;
    myVideo.style.width = '100%';
    myVideo.style.height = '100%';
    myVideo.style.objectFit = 'cover';
    myVideo.fullscreenElement = true;
    myVideo.id = 'myVideo';
    myVideo.className = 'my-video';
    this.myVideo = myVideo;

    const connection = new SocketIOConnection(socket, { eventPrefix: 'rtc'});

    console.log('makeRTC: ', params);

    return new SimpleWebRTC({
        connection,
        autoRequestMedia: true,
        // peerVolumeWhenSpeaking: 0.75, // 의미없음
        // adjustPeerVolume: true, // 문제가 더 심각해짐
        // ...params,
        localVideoEl: 'myVideo',
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        media: {
            video: true,
            audio: true
        },
    });
};

const onLocalStream = () => {
    const myVideoBox = document.getElementById('myVideoBox');
    console.log('onLocalStream: ', myVideoBox, myVideoBox.hasChildNodes());

    myVideoBox.className = "my-video-box-full";
    myVideoBox.appendChild(this.myVideo);

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
        window.cordova.plugins.iosrtc.refreshVideos();
    } else {
        this.myVideo.play();
    }
};

const eventsWithDispatch = (rtc, emit, dispatch, isReconnect) => {
    rtc.on('localStream', (stream) => {
        // Notice: 화상 교육 화면에서 처음 message 호출하면 오류 발생 antd 2.13.4 기준)
        dispatch(creator.localStream(stream));
        onLocalStream();
    });
    rtc.on('readyToCall', () => {
        emit('usePlugin', {id: 'rtc'});
        // 재연결 관련 로직 추가
        if(isReconnect && roomName) {
            // rtc.joinRoom(roomName);
        }
    });

    rtc.on('videoAdded', (video, peer) => {
        dispatch(creator.appendRemote(video, peer));
        roomName = rtc.roomName;
    });

    rtc.on('videoRemoved', (video, peer) => {
        dispatch(creator.removeRemote(video, peer));
        roomName = undefined;
    });

    window.addEventListener("message", message => {
        if(message.data.event === 'learnStart') {
            dispatch(creator.updateStepContentShare(message.data.payload));
        }
        if(message.data.event === 'sendEvent') {
            dispatch(creator.updateExtContentShare(message.data));
        }
    });
};

const initialize = (socket, emit, dispatch, isReconnect, resource) => {
    emit('login', {authToken, actorId});

    const rtc = makeRTC(socket, resource);

    dispatch(creator.initRTC(rtc, resource));

    eventsWithDispatch(rtc, emit, dispatch, isReconnect);

    return rtc;
};

const destroy = (rtc) => {
    // TODO: RTC 객체 해제에 대한 처리가 필요함.
};

export const socket = (socket) => {

    return (action, emit, dispatch) => {
        switch(action.type)	 {
            case type.SOCKET_DISCONNECT:
                // Toast.fail('화상 연결이 비정상적으로 종료되었습니다.');
                // Toast.info('재연결을 시도합니다.', 10);

                destroy(currentRtc);

                dispatch(creator.disconnect());
                break;
            case type.SOCKET_RECONNECT:
                // msg-server를 재기동하더라도 일반적인 connection은 물려 있으나,
                // 판서 그림은 공유 되지 않음
                // Toast.success('재연결중입니다.');

                // currentRtc = initialize(socket, emit, dispatch, true);
                break;
            case type.SOCKET_CONNECT:
                // 중요: 삭제불가
                actorId = action.payload.actorId;
                currentRtc = initialize(socket, emit, dispatch, false, action.payload.localResource);
                break;
            case type.SOCKET_EMIT_TALK:
                emit('message', {type: 'message', ...action.payload.item});
                break;
            case type.RTC_CONNECT:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_DISCONNECT:
                emit('message', {...action.payload.item});
                break;
            default:
                break;
        }
    };
};
