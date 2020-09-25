import React from 'react';

class FooterContainer extends React.Component {

    render() {
        return (
            <div className="footer-container">
                <span className="footer-container-left">윙크 학부모님 공감센터 <a href="tel:1522-1244">1522-1244</a></span>
                <span className="footer-container-divider"/>
                <span className="footer-container-right">평일 10:00~20:00</span>
            </div>
        );
    }
}

export default FooterContainer;
