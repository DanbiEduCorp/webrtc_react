import React from 'react';
import { connect } from 'react-redux';
import studentM from '../../../resource/student_m.png';
import studentW from '../../../resource/student_w.png';

import { api, service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';
import { fetch } from '../../redux/actions';
import { path } from '../../commons/configs';
import { push } from 'react-router-redux';

import { Button, List, Modal } from 'antd-mobile';
import { APICaller } from 'wink_mobile_commons/dist/api';

const Item = List.Item;

const mapStateToProps = ({ fetch, security, socket }) => {
    const students = (service.getValue(fetch, 'multipleList.familyMembers.results') || []).filter(item => item.modelType === 1);
    return {
        item: fetch.item,
        parent: security.actor,
        room: service.getValue(fetch, 'multipleList.room', {}),
        students,
        socket
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        get: (url, params) => dispatch(fetch.get(url, params)),
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        move: (location) => dispatch(push(location)),
    }
};

class StudentList extends React.Component {
    state = {
    };
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const {parent} = this.props;
        const obj = api.getFamily(parent.id);
        return APICaller.get(obj.url, obj.params)
            .then(({data}) => {
                if(data.count === 0 ) {
                    return ;
                }
                const obj = api.getMembers(data.results[0].id);
                return this.props.multipleList([{id:'familyMembers', url :obj.url, params : obj.params }]);
            });
    }

    call(item) {
        const { parent } = this.props;
        const obj = api.getRoomId({name: `${parent.id}_${item.id}`});
        return this.props.multipleList([{id:'room', url :obj.url, params : obj.params }])
        // return APICaller.get(obj.url, obj.params)
            .then(() => {
                const {room} = this.props;
                if(room.id) {
                    this.props.move(path.video);
                } else {
                    console.log('room이 없음');
                    return ;
                }
            });
    }

    call2(item) {
        const { parent } = this.props;
        const obj = api.getRoomId({name: `${parent.id}_${item.id}`});
        return this.props.multipleList([{id:'room', url :obj.url, params : obj.params }])
        // return APICaller.get(obj.url, obj.params)
            .then(() => {
                const {room} = this.props;
                if(room.id) {
                    this.props.move(path.video2);
                } else {
                    console.log('room이 없음');
                    return ;
                }
            });
    }

    confirmModal(e, item) {
        e.preventDefault();
        const title = `${item.authHumanName} 학생에게 영상통화 하시겠습니까?`;
        Modal.alert('영상통화', title, [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.call(item)}
        ]);
    }

    confirmModal2(e, item) {
        e.preventDefault();
        const title = `${item.authHumanName} 학생에게 영상통화 하시겠습니까?(fake)`;
        Modal.alert('영상통화', title, [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.call2(item)}
        ]);
    }

    renderStudent(inx) {
        const {students} = this.props;
        if(students.length >= inx) {
            const student = students[inx-1];
            return (
                <Item
                    thumb={service.getValue(student, 'sdata.authDetail.isMail', false) ? studentM : studentW}
                    extra={
                      <CustomIcon type="MdPhone" className="call-button" onClick={e => this.confirmModal(e, student)}/>
                    }>
                    <span onClick={e => this.confirmModal2(e, student)}>{student.authHumanName}</span>
                </Item>
            )
        } else {
            return (
                <Item></Item>
            )
        }
    }

    render() {
        return (
            <div>
                <List className="main-student-list">
                    {this.renderStudent(1)}
                    {this.renderStudent(2)}
                    {this.renderStudent(3)}
                </List>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);
