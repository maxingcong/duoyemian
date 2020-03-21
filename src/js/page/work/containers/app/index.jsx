import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Spin, Drawer, notification } from 'antd';
import classNames from 'classnames/bind';
import { actions } from '../../actions';
import styles from './style.mod.less';
import ClassTab from '../../components/class-tab';
import Comments from '../../components/comments';
import FlowerModal from '../../components/flower-modal'
import WorlList from '../../components/work-list';
import StudentsList from '../../components/students-list';
import Details from '../../components/details';
import Header from 'app/components/new-header';
import myBrowser from 'app/util/browser';
//import CustomUpload from 'app/components/custom-upload';

const cx = classNames.bind(styles);
const navigation = [
  { title: '作业', selected: true },
  { title: '文件库', link: '/files', selected: false },
]

class App extends Component {
  state = {
    lastVisible: false,
    visible: true,
    uploadStatus: '',         // 上传状态
    showUploadBox: false      // 是否展示上传文件弹层
  }

  onClose = () => {
    this.setState({
      lastVisible: this.state.visible,
      visible: false
    })
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.workDetails.accId && !prevState.lastVisible) {
      prevState.visible = true;
    }
    prevState.lastVisible = prevState.visible;
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

  componentDidMount() {
    this.props.fetchClass();
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

  render() {
    const isTablet = (window.screen.availHeight <= 1366 && window.screen.availWidth <= 1024) || /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    const { showUploadBox, uploadStatus } = this.state;
    const {
      loading, classList, fetchWork, setVisible, setLoading, fetchStudents, fetchWorkDetails, withdrawComment, activeTab, workDetails,
      studentsListLoading, workDetailsLoading, flowerVisible, commentsVisible, undoVisible, workList, studentsList,
      clearList, rewardFlowers, commentsId, setCommentsId, addComment, fetchWaitStudents, likeOpt, setCurrentRecordId,
      currentRecordId, sortList, withdrawAll, setStudentsList, currentWorkId, isBatch, batchLikeOpt, batchRewardFlowers,
      batchAddComment, setBatchIds, accIds, currentAccId
    } = this.props;
    return (
      <Spin spinning={loading}>
        <div className={cx("work-contianer")}>
          <Header 
            navigation={navigation}   
            uploadStatus={uploadStatus}
            setShowUpload={this.setShowUpload}
            showUpload={false}
          />
          <div className={cx('work-main')}>
            <ClassTab classList={classList} fetchWork={fetchWork} setLoading={setLoading} clearList={clearList} />
            {
              loading ? ''
                : <div className={cx('content')}>
                  <Row className={cx("content-row")}>
                    <Col md={12} lg={12} xl={isTablet ? 12 : 6}>
                      <WorlList
                        setLoading={setLoading}
                        fetchStudents={fetchStudents}
                        workList={workList}
                        activeTab={activeTab}
                        clearList={clearList}
                        sortList={sortList}
                        fetchWork={fetchWork}
                      />
                    </Col>
                    <Col md={12} lg={12} xl={isTablet ? 12 : 7}>
                      <StudentsList
                        setLoading={setLoading}
                        fetchWorkDetails={fetchWorkDetails}
                        studentsListLoading={studentsListLoading}
                        activeTab={activeTab}
                        studentsList={studentsList}
                        clearList={clearList}
                        sortList={sortList}
                        fetchStudents={fetchStudents}
                        setStudentsList={setStudentsList}
                        currentWorkId={currentWorkId}
                        setVisible={setVisible}
                        batchLikeOpt={batchLikeOpt}
                        setBatchIds={setBatchIds}
                      />
                    </Col>
                    {
                      isTablet && workDetails.accId ?
                        <Drawer
                          title="作业详情"
                          placement="right"
                          maskClosable={true}
                          width="100%"
                          zIndex="100"
                          onClose={this.onClose}
                          visible={this.state.visible}
                        >
                          <Details
                            setVisible={setVisible}
                            setLoading={setLoading}
                            workDetailsLoading={workDetailsLoading}
                            undoVisible={undoVisible}
                            withdrawComment={withdrawComment}
                            workDetails={workDetails}
                            setCommentsId={setCommentsId}
                            fetchWaitStudents={fetchWaitStudents}
                            likeOpt={likeOpt}
                            addComment={addComment}
                            setCurrentRecordId={setCurrentRecordId}
                            rewardFlowers={rewardFlowers}
                            withdrawAll={withdrawAll}
                            currentAccId={currentAccId}
                            fetchWorkDetails={fetchWorkDetails}
                          />
                        </Drawer> :

                        <Col md={24} lg={24} xl={11} className={cx('workDetails')}>
                          {
                            workDetails.accId ?
                              <Details
                                setVisible={setVisible}
                                setLoading={setLoading}
                                workDetailsLoading={workDetailsLoading}
                                undoVisible={undoVisible}
                                withdrawComment={withdrawComment}
                                workDetails={workDetails}
                                setCommentsId={setCommentsId}
                                fetchWaitStudents={fetchWaitStudents}
                                likeOpt={likeOpt}
                                addComment={addComment}
                                setCurrentRecordId={setCurrentRecordId}
                                rewardFlowers={rewardFlowers}
                                withdrawAll={withdrawAll}
                                currentAccId={currentAccId}
                                fetchWorkDetails={fetchWorkDetails}
                              />
                              : ''
                          }
                        </Col>
                    }
                  </Row>
                </div>
            }

            <Comments
              commentsVisible={commentsVisible}
              setVisible={setVisible}
              commentsId={commentsId}
              addComment={addComment}
              currentRecordId={currentRecordId}
              isBatch={isBatch}
              batchAddComment={batchAddComment}
              accIds={accIds}
            />
            <FlowerModal
              setVisible={setVisible}
              flowerVisible={flowerVisible}
              rewardFlowers={rewardFlowers}
              rewardNum={workDetails.rewardNum || 0}
              isBatch={isBatch}
              batchRewardFlowers={batchRewardFlowers}
              accIds={accIds}
            />
          </div>
          {/* <CustomUpload 
            callback={this.uploadCallback}
            show={showUploadBox}
          /> */}
        </div>
      </Spin>
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
    fetchClass: () => {
      dispatch(actions.fetchClass());
    },
    fetchWork: (data) => {
      dispatch(actions.fetchWork(data));
    },
    setLoading: (data) => {
      dispatch(actions.setLoading(data));
    },
    setVisible: (data) => {
      dispatch(actions.setVisible(data));
    },
    fetchWorkDetails: (data) => {
      dispatch(actions.fetchWorkDetails(data));
    },
    fetchStudents: (data) => {
      dispatch(actions.fetchStudents(data));
    },
    withdrawComment: (data) => {
      dispatch(actions.withdrawComment(data));
    },
    clearList: (data) => {
      dispatch(actions.clearList(data));
    },
    rewardFlowers: (data) => {
      dispatch(actions.rewardFlowers(data));
    },
    setCommentsId: (data) => {
      dispatch(actions.setCommentsId(data));
    },
    addComment: (data) => {
      dispatch(actions.addComment(data));
    },
    fetchWaitStudents: (data) => {
      dispatch(actions.fetchWaitStudents(data));
    },
    likeOpt: (data) => {
      dispatch(actions.likeOpt(data));
    },
    setCurrentRecordId: (data) => {
      dispatch(actions.setCurrentRecordId(data));
    },
    sortList: (data) => {
      dispatch(actions.sortList(data));
    },
    withdrawAll: (data) => {
      dispatch(actions.withdrawAll(data));
    },
    setStudentsList: (data) => {
      dispatch(actions.setStudentsList(data));
    },
    batchLikeOpt: (data) => {
      dispatch(actions.batchLikeOpt(data));
    },
    batchAddComment: (data) => {
      dispatch(actions.batchAddComment(data));
    },
    batchRewardFlowers: (data) => {
      dispatch(actions.batchRewardFlowers(data));
    },
    setBatchIds: (data) => {
      dispatch(actions.setBatchIds(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
