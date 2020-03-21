import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { actions } from '../../actions';
import styles from './style.mod.less';
import Footer from '../../components/footer';
import Content from '../../components/content';

// import Literallycanvas from 'app/components/literallycanvas';

const cx = classNames.bind(styles);

class App extends Component {
  // state = {
  //   img: {}
  // }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({
  //       img: {
  //         custom: {},
  //         name: "tmp_85AC318786F2580105B7C7FE366B2E88.jpg",
  //         thumb: "https://tea-202002-1301282269.cos.ap-guangzhou.myqcloud.com/tea/xcx/work-image/20200302/4061fd830874449dbfd17feec624fc33092_thumb.jpg",
  //         type: "IMAGE",
  //         url: "https://tea-202002-1301282269.file.myqcloud.com/tea/xcx/work-image/20200305/2db5e67df6ae4dd8b52caf56c6e4fbd2.jpg",
  //         uuid: "4061fd830874449dbfd17feec624fc33092",
  //       }
  //     });
  //   }, 2000);
  // }

  render() {
    const { loading, uuid, status, fetchUuid, fetchStatus, clearStatus } = this.props;

    return (
      <div className={cx('com-layout')}>
        <Content 
          loading={loading} 
          uuid={uuid} 
          status={status} 
          clearStatus={clearStatus}
          fetchUuid={fetchUuid} 
          fetchStatus={fetchStatus} 
        />
        <Footer />
        {/* <Literallycanvas img={this.state.img}/> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUuid: () => {
      dispatch(actions.fetchUuid());
    },
    fetchStatus: data => {
      dispatch(actions.fetchStatus(data));
    },
    clearStatus: () => {
      dispatch(actions.clearStatus());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
