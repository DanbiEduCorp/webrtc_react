import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../commons/configs';
import { fetch, socket as socketAction } from '../../redux/actions';

import { Settings } from './';
import {VideoPhone} from "./";
import {push} from "react-router-redux";

const mapStateToProps = ({ fetch, security, socket }) => {
    const room = service.getValue(fetch, 'multipleList.room', {});
    const student = service.getValue(room, 'sdata.studentDetail', {});
    return {
        parent: {...security.actor},
        student,
        room,
        socket
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        list: (url, params) => dispatch(fetch.list(url, params)),
        moveHome: () => dispatch(push('/')),
        connect: (params) => {
            return dispatch(socketAction.connect(params));
        },
    }
};

class VideoContainer extends React.Component {
    state = {
    };
    constructor(props){
        super(props);
    }

    componentDidMount() {
        // var vidSelf = service.getValue(this.props, 'socket.resource.vidSelf', '');
        // if( ! vidSelf) {
        //     vidSelf = document.createElement('VIDEO');
        //     vidSelf.autoplay = true;
        //     vidSelf.volume = 0;
        //     vidSelf.style.height = '80vh';
        //     vidSelf.style.width = '80vw';
        //     vidSelf.id = 'vidSelf';
        //     vidSelf.className = 'video-loading';
        //
        //     console.log('connect: ', this.props.socket);
        //
        // }
        this.props.connect({localResource: {localVideoEl: 'vidSelf'}});
        // this.getList();
    }

    getList() {
        // const {parent} = this.props;
        // const obj =  api.getFamily(parent.actorId);
        // return APICaller.get(obj.url, obj.params)
        //     .then(({data}) => {
        //         if(data.count === 0 ) {
        //             return ;
        //         }
        //         const obj = api.getMembers(data.results[0].id);
        //         return this.props.multipleList([{id:'familyMembers', url :obj.url, params : obj.params }]);
        //     });
    }

    onClose() {
        // e.preventDefault();
        // console.log(e);
        this.props.moveHome();
    }


    render() {
        return (
            <div>
                {/*<VideoPhone3 data={{...this.props}}/>*/}
                <VideoPhone data={{...this.props}} onClose={this.onClose.bind(this)}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoContainer);
