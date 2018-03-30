import axios from 'axios';

import {security as creator}  from '../creators';
import {fetch as fetchCreator}  from '../creators';
import {SessionService, SecurityService} from 'wink_mobile_commons/dist/security/services';

export const errorHandler = (dispatch) => {

    axios.interceptors.response.use(response => {
        return response;
    }, (error) => {
        dispatch(fetchCreator.fetchEnd());
        dispatch(fetchCreator.postEnd());
        const {response} = error;
        if(response && response.status === 403) {
            dispatch(logout());
        } else if(response && response.status === 401) {
            dispatch(logout());
        } else {
        }

        return Promise.reject(error);
    });
};

export const login = ({username, password}) => {
    return (dispatch, getState) => {
        const actorType = getState().security.actorType;
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.authenticate({username, password})
            .then((data) => {
                const { authId, humanName, isAdmin, userName } = data;
                // 인증 정보를 먼저 Store에 등록
                dispatch(creator.loginAuth({authId, humanName, isAdmin, userName}));
                // return SecurityService.actorLogin({authId, actorType});
                return { authId, humanName, isAdmin, userName, actorType };
            })
            .then(data => {
                // actor 생성
                dispatch(creator.loginSuccess(data));
                // TODO : SessionService 대신에  store 판단 가능하지 않나?
                SessionService.login(getState().security);
                return data;
            });
    };
};

export const authLogin = (params) => {
    return (dispatch, getState) => {
        const actorType = getState().security.actorType;
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.authenticate(params)
            .then((data) => {
                const { authId, humanName, isAdmin, userName } = data;
                // 인증 정보를 먼저 Store에 등록
                dispatch(creator.loginAuth({authId, humanName, isAdmin, userName}));
                // return SecurityService.actorLogin({authId, actorType: params.actorType});
                return { authId, humanName, isAdmin, userName, actorType };
            })
            .then(data => {
                // actor 생성
                dispatch(creator.loginSuccess(data));
                // TODO : SessionService 대신에  store 판단 가능하지 않나?
                SessionService.login(getState().security);
                return data;
            });
    };
};

// export const login = ({ username, password }) => {
//     return (dispatch, getState) => {
//         const actorType = getState().security.actorType;
//         // 로그인 시작
//         dispatch(creator.loginRequest());
//         return SecurityService.authenticate({ username, password })
//             .then(({ authId, humanName, isAdmin, userName }) => {
//                 // 인증 정보를 먼저 Store에 등록
//                 dispatch(creator.loginAuth({ authId, humanName, isAdmin, userName }));
//                 return SecurityService.actorLogin({ authId, actorType });
//             })
//             .then(data => {
//                 // actor 생성
//                 dispatch(creator.loginSuccess(data));
//                 // TODO : SessionService 대신에  store 판단 가능하지 않나?
//                 SessionService.login(getState().security);
//                 return data;
//             });
//     };
// };

// export const authLogin = (params) => {
//     return (dispatch, getState) => {
//         // 로그인 시작
//         dispatch(creator.loginRequest());
//         return SecurityService.authenticate(params)
//             .then(({ authId, humanName, isAdmin, userName }) => {
//                 // 인증 정보를 먼저 Store에 등록
//                 dispatch(creator.loginAuth({ authId, humanName, isAdmin, userName }));
//                 return SecurityService.actorLogin({ authId, actorType: params.actorType });
//             })
//             .then(data => {
//                 // actor 생성
//                 dispatch(creator.loginSuccess(data));
//                 // TODO : SessionService 대신에  store 판단 가능하지 않나?
//                 SessionService.login(getState().security);
//                 return data;
//             });
//     };
// };

export const loginFail = () => {
    return (dispatch) => {
        dispatch(creator.loginFail());
    };
};

export const logout = () => {
    return (dispatch) => {
        dispatch(creator.logout());
    };
};
