
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
//import CustomUpload from 'app/components/custom-upload';

const cx = classNames.bind(styles);
const navigation = [
  { title: '作业', link: '/', selected: false },
  { title: '文件库', selected: true },
]

class App extends Component {
  state = {
    uploadStatus: '',         // 上传状态
    showUploadBox: false      // 是否展示上传文件弹层
  }

  componentDidMount() {
    //this.props.fetchToken();
    this.props.fetchList({
      pageNo: 1,
      pageSize: 10
    });
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


  uploadCallback = (fileList) => {
    console.log('uploadCallback', fileList);
    const error = (fileList || []).filter(item => item.status === 'error');
    const uploading = (fileList || []).filter(item => item.status === 'uploading');
    const done  = (fileList || []).filter(item => item.status === 'done');
    if (error && error.length > 0) {
      this.setUploadStatus('abnormal');
    } else if (uploading && uploading.length > 0) {
      this.setUploadStatus('ongoing');
    } else if(done && done.length > 0) {
      this.setUploadStatus('complete');
    } else {
      this.setUploadStatus('');
    }
    this.setShowUpload(false);
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
    const {
      loading, fileList, searchParams, deleteRecord, batchDelete, revivification, batchRevivification, fetchList, clearList
    } = this.props;
    const { showUploadBox, uploadStatus } = this.state;
    return (
        <div className={cx("contianer")}>
          <Header 
            navigation={navigation}
            uploadStatus={uploadStatus}
            setShowUpload={this.setShowUpload}
            showUpload={false}
          />
          <div className={cx("recycle-body")}>
            <Sidebar
              page={'recycle'}
            />
            <div className={cx("recycle-main")}>
              <Content 
                fileList={fileList}
                searchParams={searchParams}
                deleteRecord={deleteRecord}
                batchDelete={batchDelete}
                loading={loading}
                revivification={revivification}
                batchRevivification={batchRevivification}
                fetchList={fetchList}
                clearList={clearList}
              />
            </div>
            {/* <CustomUpload 
              callback={this.uploadCallback}
              show={showUploadBox}
            /> */}
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
    revivification: (data) => {
      dispatch(actions.revivification(data));
    },
    fetchToken: (data) => {
      dispatch(actions.fetchToken(data));
    },
    batchRevivification: (data) => {
      dispatch(actions.batchRevivification(data));
    },
    clearList: (data) => {
      dispatch(actions.clearList(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);