import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import classNames from 'classnames/bind';
import { actions } from '../../actions';
import styles from './style.mod.less';
import Header from 'app/components/new-header';
import Sidebar from 'app/components/sidebar';
import Content from '../../components/content';
import myBrowser from 'app/util/browser';
import utils from 'app/util/util';

const cx = classNames.bind(styles);
const type = utils.getParaFromUrl('type') || '';
const navigation = [
  { title: '作业', link: '/', selected: false },
  { title: '文件库',  selected: true },
]

class App extends Component {
  state = {
    uploadStatus: '',         // 上传状态
    showUploadBox: false      // 是否展示上传文件弹层
  }
  componentDidMount() {
    //this.props.fetchToken();
    this.props.fetchList({
      ...this.props.searchParams,
      type
    });
    //this.props.fetchSubType('TEXT');
    const userAgent = myBrowser();
    if (userAgent !== 'Safari' && userAgent !== 'Chrome' && userAgent !== 'FF') {
      notification.info({
        message: '亲，你的浏览器版本过低，建议您使用Chrome浏览器，更流畅体验！',
        description:
          <div>
            <a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank" rel="noopener noreferrer">
              <div className={cx("google")}></div>
              <div>去下载</div>
            </a>
          </div>,
        duration: 10
      });
    }
  }

  changeSidebar = (type) => {
    //this.props.setLoading({loading: true});
    this.props.fetchList({
      ...this.props.searchParams,
      type,
      subType: ''
    })
  }

  setShowUpload = (value) => {
    this.setState({
      showUploadBox: value
    })
  }

  setUploadStatus = (value) => {
    this.setState({
      uploadStatus: value
    })
  }

  render() {
    //const isIpad = (window.screen.availHeight <= 1366 && window.screen.availWidth <= 1024) || /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    const {
      loading, fileList, searchParams, deleteRecord, restName, batchDelete, subType, fetchList, 
    } = this.props;
    const { uploadStatus, showUploadBox } = this.state;
    return (
     
        <div className={cx("library-contianer")}>
          <Header 
            navigation={navigation} 
            uploadStatus={uploadStatus}
            setShowUpload={this.setShowUpload}
            showUpload={true}
          />
          <div className={cx("library-body")}>
            <Sidebar 
              type={searchParams.type}
              changeSidebar={this.changeSidebar}
              page={''}
            />
            <div className={cx("library-main")}>
              <Content 
                fileList={fileList}
                searchParams={searchParams}
                deleteRecord={deleteRecord}
                batchDelete={batchDelete}
                restName={restName}
                subType={subType}
                fetchList={fetchList}
                loading={loading}
                showUploadBox={showUploadBox}
                setUploadStatus={this.setUploadStatus}
                setShowUpload={this.setShowUpload}
              />
            </div>
          </div>
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
    fetchList: (data) => {
      dispatch(actions.fetchList(data));
    },
    setLoading: (data) => {
      dispatch(actions.setLoading(data));
    },
    deleteRecord: (data) => {
      dispatch(actions.deleteRecord(data));
    },
    batchDelete: (data) => {
      dispatch(actions.batchDelete(data));
    },
    restName: (data) => {
      dispatch(actions.restName(data));
    },
    fetchSubType: (data) => {
      dispatch(actions.fetchSubType(data));
    },
    fetchToken: (data) => {
      dispatch(actions.fetchToken(data));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
