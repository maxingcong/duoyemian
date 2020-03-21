import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { Spin, Checkbox } from 'antd';
import optimize from 'app/util/optimize';
import ConfirmLayer from 'app/components/confirm-layer';

const cx = classNames.bind(styles);

class StudentsList extends Component {
  state = {
    activeTab: 1,
    itemIdx: 0,
    waitAllchecked: false,
    completeAllchecked: false,
    showbatchBtn: false,     // 是否展示批量操作按钮
    confirmVisible: false
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.currentWorkId !== nextProps.currentWorkId) {
      this.setState({
        itemIdx: 0,
        activeTab: 1,
        waitAllchecked: false,
        completeAllchecked: false,
        confirmVisible: false,
        showbatchBtn: false
      })
    }
  }

  changeTab(key) {
    const { complete = [], wait = [] } = this.props.studentsList;
    this.setState({
      activeTab: key,
      itemIdx: 0
    });
    let accId;
    let recordId;
    if (key == 2) {
      accId = complete[0] ? complete[0].accId : '';
      recordId = complete[0] ? complete[0].recordId : '';
    } else {
      accId = wait[0] ? wait[0].accId : '';
      recordId = wait[0] ? wait[0].recordId : ''
    }
    if (accId && recordId) {
      this.props.fetchWorkDetails({
        accId,
        recordId
      });
    } else {
      this.props.clearList({
        workDetails: {}
      })
    }
  }

  selectStudents(idx, accId, recordId) {
     // 获取详情
    this.setState({
      itemIdx: idx
    });
    if (!recordId) {
      //return message.error('当前学生还未提交作业', 5);
      this.props.clearList({
        workDetails: {}
      })
    } else {
      this.props.fetchWorkDetails({
        accId,
        recordId
      });
    }
  }

  sort = () => {
    const { activeTab } = this.state;
    const { studentsList = {} } = this.props;
    const { complete = [], wait = [] } = studentsList;
    let newList = [];
    if (activeTab === 1) {
      if (wait && wait.length > 1) {
        newList = wait.reverse();
        this.props.sortList({
          studentsList: {
            ...studentsList,
            wait: [...newList]
          }
        });
      }
    } else if (activeTab === 2) {
      if (complete && complete.length > 1) {
        newList = complete.reverse();
        this.props.sortList({
          studentsList: {
            ...studentsList,
            complete: [...newList]
          }
        });
      }
    }
    const firstItem = newList[0];
    if (firstItem.accId && firstItem.recordId) {
      this.props.fetchWorkDetails({
        accId: firstItem.accId,
        recordId: firstItem.recordId
      });
    } else {
      this.props.clearList({
        workDetails: {}
      })
    }
  }

  refresh = () => {
    this.setState({
      activeTab: 1,
      itemIdx: 0,
      showbatchBtn: false
    })
    this.props.setLoading({ studentsListLoading: true})
    this.props.fetchStudents();
  }

  changeCheckBox = (idx, e) => {
    const checked = e.target.checked;
    let { activeTab } = this.state;
    let { complete = [], wait = [] } = this.props.studentsList;
    let notChecked = [];
    if (activeTab === 1) {
      wait[idx].checked = checked;
      notChecked = wait.filter(item => !item.checked);
      let waitAllchecked = true;
      if (notChecked && notChecked.length > 0) {
        waitAllchecked = false
      }
      this.setState({ waitAllchecked, showbatchBtn: notChecked.length < wait.length ? true : false });
    } else if (activeTab === 2) {
      complete[idx].checked = checked;
      notChecked = complete.filter(item => !item.checked);
      let completeAllchecked = true;
      if (notChecked && notChecked.length > 0) {
        completeAllchecked = false
      }
      this.setState({ completeAllchecked, showbatchBtn: notChecked.length < complete.length ? true : false });
    }
    this.props.setStudentsList({
      ...this.props.studentsList
    })
  }

  confirm = () => {
    const accIds = this.getBatchIds('accId');
    this.props.batchLikeOpt({ accIds, islike: true });
    this.setState({
      confirmVisible: false
    })
  }

  changeAllBox = (e) => {
    let { activeTab } = this.state;
    const  studentsList = this.props.studentsList;
    let { complete = [], wait = [] } = studentsList;
    const checked = e.target.checked;
    if (activeTab === 1) {
      wait.forEach(item => {
        item.checked = checked;
        return item;
      })
      this.setState({
        waitAllchecked: checked,
        showbatchBtn: checked
      })
    } else if (activeTab === 2) {
      complete.forEach(item => {
        item.checked = checked;
        return item;
      })
      this.setState({
        completeAllchecked: checked,
        showbatchBtn: checked
      })
    }
    this.props.setStudentsList({
      ...studentsList
    })
  }

  givingFlowers = () => {
    const accIds = this.getBatchIds('accId');
    this.props.setBatchIds({ accIds });
    this.props.setVisible({
      flowerVisible: true,
      isBatch: true
    })
  }

  comments = () => {
    const accIds = this.getBatchIds('accId');
    this.props.setBatchIds({ accIds });
    this.props.setVisible({
      commentsVisible: true,
      isBatch: true
    })
  }

  getBatchIds = (type) => {
    let { activeTab } = this.state;
    const  studentsList = this.props.studentsList;
    let { complete = [], wait = [] } = studentsList;
    let ids = [];
    if (activeTab === 1) {
      ids = wait.filter(item => item.checked);
    } else if (activeTab === 2) {
      ids = complete.filter(item => item.checked);
    }
    ids = ids.map(item => item[type]);
    return ids;
  }

  StopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
  }

  render() {
    const { activeTab, itemIdx, waitAllchecked, completeAllchecked, showbatchBtn, confirmVisible } = this.state;
    const { studentsListLoading } = this.props;
    const { complete = [], wait = [] } = this.props.studentsList;
    let waitSubmitList = [];  // 未批改已提交作业
    if (wait && wait.length > 0) {
      waitSubmitList = wait.filter(item => item.recordId);
    }
    return(
      <Spin spinning={studentsListLoading}>
        <div className={cx('work-list')}>
          <div className={cx("work-list-title")}>
            <div className={cx("text")}>
              {
                (activeTab === 1 && waitSubmitList.length > 0) || (activeTab === 2 && complete.length > 0)
                ? <Checkbox onChange={this.changeAllBox} checked={activeTab === 1 ? waitAllchecked : completeAllchecked}>{showbatchBtn ? '' : '学生'}</Checkbox>
                : <div className={cx('text-word')}>学生</div>
              }
            </div>
            {
              showbatchBtn ?
                <div className={cx("batch-btn")}>
                  <div onClick={this.comments} className={cx("btn-item")}>评语</div>
                  <div onClick={() => this.setState({ confirmVisible: true })} className={cx("btn-item")}>点赞</div>
                  <div onClick={this.givingFlowers} className={cx("btn-item", "last-item")}>小红花</div>
                </div>
              : <div className={cx("work-tab")}>
                  <div onClick={ () => this.changeTab(1)} className={cx("work-tab-item", "waiting", activeTab === 1 ? 'active' : '')}>待批改</div>
                  <div onClick={ () => this.changeTab(2)} className={cx("work-tab-item", "already", activeTab === 2 ? 'active' : '')} >已批改</div>
                </div>
            }
            {
               showbatchBtn ? ''
               :  <div className={cx("icon-container")}>
                    <div onClick={this.sort} className={cx("sort")}></div>
                    <div onClick={this.refresh} className={cx("refresh")}></div>
                  </div>
            }
          </div>
          {
            activeTab === 2 ? 
              complete && complete.length > 0 ?
              complete.map((item, idx) => (
                <div key={idx} onClick={(e) => this.selectStudents(idx, item.accId, item.recordId)} className={cx("work-list-item", itemIdx === idx ?  'active-item' : '')}>
                  {/* <div className={cx('name')}>{item.name}</div> */}
                  <img src={item.head} alt="" className={cx("head")} />
                  <div className={cx("st")}>
                    <div className={cx("title")}>{item.name}</div>
                    <div className={cx("date")}>{item.createTime}</div>
                  </div>
                  {
                    item.recordId ?
                      <div style={{display: 'inline-block'}} onClick={this.StopEvent} key={`${idx}-${item.checked}`}>
                        <Checkbox className={cx('checkbox')} checked={item.checked}  onChange={(e) => {this.changeCheckBox(idx, e)}}/>
                      </div>
                    : ''
                  }
                 
                </div>
              )) 
              : <div className={cx("tips-page")}>
                  <div className={cx("icon", "icon2")}></div>
                  <div className={cx("text")}>还没有批改的学生</div>
                </div>
            : wait && wait.length > 0 ?
                wait.map((item, idx) => (
                  <div key={idx} onClick={(e) => this.selectStudents(idx, item.accId, item.recordId)} className={cx("work-list-item", itemIdx === idx ?  'active-item' : '')}>
                    <img src={item.head} alt="" className={cx("head")} />
                    <div className={cx("st")}>
                      <div className={cx("title")}>{item.name}</div>
                      <div className={cx("date")}>{item.createTime}</div>
                    </div>
                    {
                    !item.recordId 
                    ? <div className={cx("s-btn")}>未提交</div>
                    :
                      <div style={{display: 'inline-block'}} onClick={this.StopEvent}  key={`${idx}-${item.checked}`}>
                        <Checkbox className={cx('checkbox')} checked={item.checked} onChange={ (e) => { this.changeCheckBox(idx, e)}}/>
                      </div>
                  }
                  </div>
                )) 
                : <div className={cx("tips-page")}>
                    <div className={cx("icon")}></div>
                    <div className={cx("text")}>还没有待批改的学生</div>
                  </div> 
          }
          <ConfirmLayer
            visible={confirmVisible}
            confirm={this.confirm}
            cancel={() => this.setState({ confirmVisible: false })}
            text="您确定要批量点赞吗？"
          />
        </div>
      </Spin>
    )
  }
}

export default StudentsList;