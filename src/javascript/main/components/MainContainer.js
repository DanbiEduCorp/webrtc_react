import React from 'react';
import { connect } from 'react-redux';

import { StudentList } from './';
import main from '../../../resource/main.png';

import { Flex, Card } from 'antd-mobile';

const mapStateToProps = ({ fetch, security }) => {
    return {
        parent: security,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
};

class MainContainer extends React.Component {

    componentDidMount() {
        // this.getList();
        console.log('[MainContainer] main image: ', main);
    }

    render() {
        const {parent} = this.props;
        return (
            <div>
                <Flex direction="column" className="main-wrapper">
                    <Flex.Item className="main-top">
                        <div className="main-top-hello">안녕하세요,</div>
                        <div className="main-top-name">{`${parent.humanName}(${parent.userName})님!`}</div>
                        <img src={main} alt="main" className="main-top-img"/>
                    </Flex.Item>
                    <Flex.Item className="main-student">
                        <StudentList/>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
