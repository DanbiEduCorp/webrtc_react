// 중요: @@SOCKET 으로 시작하는 항목은 executor를 타게 된다 .
export const socket = Object.freeze({
    SOCKET_CONNECT: '@@SOCKET/CONNECT',
    SOCKET_RECONNECT: '@@SOCKET/RECONNECT',
    SOCKET_DISCONNECT: '@@SOCKET/DISCONNECT',
    SOCKET_DISCONNECTED: 'SOCKET/DISCONNECTED',
    SOCKET_ON: 'message',
    SOCKET_ON_CHECKED: 'SOCKET/ON_CHECKED',
    SOCKET_TALK_CHECKED: 'SOCKET/TALK_CHECKED',
    SOCKET_EMIT: '@@SOCKET/EMIT',
    SOCKET_EMIT_TALK: '@@SOCKET/EMIT_TALK',

    MEDIA_WORKER_INIT: 'SOCKET/MEDIA_WORKER_INIT',
    SOCKET_TALK_INIT: 'SOCKET/SOCKET_TALK_INIT',

    RTC_INIT: 'SOCKET/RTC_INIT',
    RTC_HEALTH_CHECK: '@@SOCKET/RTC_HEALTH_CHECK',
    RTC_HEALTH_CHECK_RESULT: 'SOCKET/RTC_HEALTH_CHECK_RESULT',
    RTC_LOCAL_STREAM: 'SOCKET/RTC_LOCAL_STREAM',
    RTC_LESSON_CONNECT_STATUS: 'SOCKET/RTC_LESSON_CONNECT_STATUS',
    RTC_LESSON_CONNECT: '@@SOCKET/RTC_LESSON_CONNECT',
    RTC_LESSON_DISCONNECT: '@@SOCKET/RTC_LESSON_DISCONNECT',
    RTC_LOCAL_RESOURCE_CHANGE: 'SOCKET/RTC_LOCAL_RESOURCE_CHANGE',

    RTC_REMOTE_APPEND: 'SOCKET/RTC_REMOTE_APPEND',
    RTC_REMOTE_REMOVE: 'SOCKET/RTC_REMOTE_REMOVE',

    RTC_CAMERA_CHANGE: '@@SOCKET/RTC_CAMERA_CHANGE',
    RTC_CAMERA_DID_CHANGE: 'SOCKET/RTC_CAMERA_DID_CHANGE',

    RTC_CAMERA_QUALITY_CHANGE: '@@SOCKET/RTC_CAMERA_QUALITY_CHANGE',
    RTC_CAMERA_QUALITY_DID_CHANGE: 'SOCKET/RTC_CAMERA_QUALITY_DID_CHANGE',

    RTC_AUDIO_CONFIG_WILL_CHANGE: 'SOCKET/RTC_AUDIO_CONFIG_WILL_CHANGE',
    RTC_AUDIO_CONFIG_CHANGE: '@@SOCKET/RTC_AUDIO_CONFIG_CHANGE',

    RTC_POINT_SEND: '@@SOCKET/RTC_POINT_SEND',
    RTC_POINT_DID_SEND: 'SOCKET/RTC_POINT_DID_SEND',

    RTC_CONTENT_SHARE_START: '@@SOCKET/RTC_CONTENT_SHARE_START',
    RTC_CONTENT_SHARE_DID_START: 'SOCKET/RTC_CONTENT_SHARE_DID_START',
    RTC_CONTENT_SHARE_FINISH: '@@SOCKET/RTC_CONTENT_SHARE_FINISH',
    RTC_CONTENT_SHARE_DID_FINISH: 'SOCKET/RTC_CONTENT_SHARE_DID_FINISH',
    RTC_LOCAL_SHARE_DID_UPDATE_STEP: 'SOCKET/RTC_LOCAL_SHARE_DID_UPDATE_STEP',
    RTC_LOCAL_SHARE_DID_UPDATE_EXT: 'SOCKET/RTC_LOCAL_SHARE_DID_UPDATE_EXT',
    RTC_CONTENT_SHARE_PLAY: 'SOCKET/RTC_CONTENT_SHARE_PLAY',
    RTC_CONTENT_SHARE_PAUSE: 'SOCKET/RTC_CONTENT_SHARE_PAUSE',

    RTC_MANUAL_RECORD_CHANGE: 'SOCKET/RTC_MANUAL_RECORD_CHANGE',
    // RTC_MANUAL_RECORD_DID_CHANGE: 'SOCKET/RTC_MANUAL_RECORD_DID_CHANGE',
    // RTC_MANUAL_RECORD_ERR_CHANGE: 'SOCKET/RTC_MANUAL_RECORD_ERR_CHANGE',

    RTC_CANVAS_WORKSPACE_CHANGE: 'SOCKET/RTC_CANVAS_WORKSPACE_CHANGE',

    RTC_SKETCHER_CHANGE: '@@SOCKET/RTC_SKETCHER_CHANGE',

    RTC_CONNECT_STATUS: 'SOCKET/RTC_CONNECT_STATUS',
    RTC_CONNECT: '@@SOCKET/RTC_CONNECT',
    RTC_DISCONNECT: '@@SOCKET/RTC_DISCONNECT',
});

export default socket;
