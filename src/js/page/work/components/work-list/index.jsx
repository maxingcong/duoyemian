import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';

const cx = classNames.bind(styles);

class WorlList extends Component {
  state = {
    activeTab: 1,
    itemIdx: 0
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  // changeTab(key) {
  //   const { complete = [], wait = [] } = this.props.workList;
  //   this.setState({
  //     activeTab: key,
  //     itemIdx: 0
  //   });
  //   let studentsId;
  //   if (key == 2) {
  //     studentsId = complete[0] ? complete[0].id : ''
  //   } else {
  //     studentsId = wait[0] ? wait[0].id : ''
  //   }
  //   if (studentsId) {
  //     this.props.fetchStudents(studentsId);
  //   } else {
  //     // 清空
  //     this.props.clearList({
  //       workDetails: {},
  //       studentsList: {}
  //     })
  //   }
  // }

  selectWork = (idx, studentsId) => {
    this.setState({
      itemIdx: idx
    })
    // 获取学生列表
    this.props.fetchStudents(studentsId);
  }
  sort = () => {
    const { workList } = this.props;
    if (workList && workList.length > 0) {
      const newWorkList = workList.reverse();
      this.props.sortList({
        workList: [...newWorkList]
      });
      if (newWorkList[0].id) {
        this.props.fetchStudents(newWorkList[0].id);
      }else {
        this.props.clearList({
          workDetails: {},
          studentsList: {}
        })
      } 
    }
  }

  refresh = () => {
    this.setState({
      itemIdx: 0,
      activeTab:1
    })
    this.props.setLoading({ loading: true});
    this.props.fetchWork();
  }

  render() {
    const { itemIdx } = this.state;
    const { workList = [] } = this.props;
    return(
      <div className={cx('work-list')}>
        <div className={cx("work-list-title")}>
          <div className={cx("text")}>全部作业</div>
          <div className={cx("icon-container")}>
            <div onClick={this.sort} className={cx("sort")}></div>
            <div onClick={this.refresh} className={cx("refresh")}></div>
          </div>
        </div>
          {
            workList && workList.length > 0 
              ? workList.map((item, idx) => (
                <div key={idx}
                  onClick={() => this.selectWork(idx, item.id)}
                  className={cx("work-list-item",  itemIdx === idx ? 'active-item' : '',  item.awaitingNum && item.awaitingNum > 0 ? '' : 'correcting')}
                >
                  {
                    item.awaitingNum && item.awaitingNum > 0 ?
                    <div className={cx("dot")}>{item.awaitingNum}</div>
                    : <div className={cx("correcting-img")}></div>
                  }
                  <div className={cx("title")}>{item.title}</div>
                  <div className={cx("date")}>{item.publishTime}</div>
                </div>
              ))
              : <div className={cx("tips-page")}>
                  <div className={cx("icon", "icon2")}></div>
                  <div className={cx("text")}>还没有批改的作业</div>
                </div>
          }
      </div>
    )
  }
}

export default WorlList;