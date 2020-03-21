import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { Button, Table, Popconfirm, message } from 'antd';
import ConfirmLayer from 'app/components/confirm-layer';
import optimize from 'app/util/optimize';


const cx = classNames.bind(styles);

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], //选择的key
      confirmVisible: false,  // 二次确认框 
      confirmText: '',        // 确认框文本
      confirmType: '',        // 确认框类型
      recordId: '',           // 单个ID
    }
    this.columns = [
      {
        title: '缩略图',
        dataIndex: 'thumb',
        colSpan: 0,
        width: 50,
        className: 'thumbnail-col',
        render: (text, record) => (
          <div>
            {
              record.type === 'TEXT' && (record.suffix === 'ppt' || record.suffix === 'doc' || record.suffix === 'xls' || record.suffix === 'pdf')
              ?  <img src={`https://cdn.damixia.cn/dmx-static/0.0.19/dist/images/teacher-assistant/pc/${record.suffix}.png`}  className={cx('thumbnail')} />
              : record.type === 'AUDIO' 
              ? <img src={`https://cdn.damixia.cn/dmx-static/0.0.19/dist/images/teacher-assistant/pc/audio.png`}  className={cx('thumbnail')} />
              : record.type === 'IMAGE'
              ? <img src={record.thumb}  className={cx('thumbnail')} />
              : record.type === 'VIDEO'
              ? <img src={`https://cdn.damixia.cn/dmx-static/0.0.19/dist/images/teacher-assistant/pc/video_icon.png`}  className={cx('thumbnail')} />
              : <img src='https://cdn.damixia.cn/dmx-static/0.0.19/dist/images/teacher-assistant/pc/default.png'  className={cx('thumbnail')} />
            }
          </div>
        )
      },
      {
        title: '文件名',
        dataIndex: 'name',
        className: 'file-name',
        sorter: true,
        width: 350,
        colSpan: 2
      },
      {
        title: '大小',
        dataIndex: 'sizeStr',
        //width: '10%',
        sorter: true
      },
      {
        title: '删除时间',
        dataIndex: 'deletedTime',
        //width: '15%',
        sorter: true
      },
      {
        title: '剩余时间',
        dataIndex: 'deletedDays',
        //width: '15%'
      },
      {
        title: '操作',
        dataIndex: 'edit',
        //width: '20%',
        render: (text, record) => (
          <div>
            <Button onClick={() => this.revivification(record.id)} style={{margin: '0 10px 5px 0'}} icon="rollback" type="primary" size="small">还原</Button>
            <Button onClick={() => this.deleteRecord(record.id)} style={{marginBottom: 5}} icon="delete" type="danger" size="small">删除</Button>
          </div>
        )
      },
    ];
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({
        selectedRowKeys: []
      })
    }
  }

  // 排序
  handleTableChange = (pagination, filters, sorter) => {
    const { fetchList } = this.props;
    const { order, columnKey } = sorter;
    const { pageSize, current } = pagination;
    let orderBy = -3;
    if (order === 'ascend') {      // 升序
      switch(columnKey) {
      case 'name':
        orderBy = 1;
        break;
      case 'sizeStr':
        orderBy = 2;
        break;
      case 'deletedDays':
        orderBy = 3;
        break;
      default:
        break;
      }
    } else if (order === 'descend' ) {   // 降序
      switch(columnKey) {
      case 'name':
        orderBy = -1;
        break;
      case 'sizeStr':
        orderBy = -2;
        break;
      case 'deletedDays':
        orderBy = -3;
        break;
      default:
        break;
      }
    }
    //this.setLoading({laoding: false});
    fetchList({
      orderBy,
      pageSize,
      pageNo: current
    })
  };

  // 二次确认框
  confirm = () => {
    const { selectedRowKeys, confirmType, recordId } = this.state;
    if (confirmType === 'clear') {
      this.props.clearList();
    } else if (confirmType === 'deleteRecord') {
      this.props.deleteRecord(recordId);
    } else if (confirmType === 'reduction') {
      this.props.revivification(recordId);
    } else if (selectedRowKeys && selectedRowKeys.length > 0) {
      if (confirmType === 'delete') {
        this.props.batchDelete(selectedRowKeys);
      } else if (confirmType === 'batchReduction') {
        this.props.batchRevivification(selectedRowKeys);
      } 
      this.setState({
        confirmVisible: false
      })
    } else {
      message.error('您还未选择文件');
    }
    this.setState({
      confirmVisible: false
    })
  } 

  batchDelete = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      confirmVisible: true,
      confirmText: `确定要永久删除${selectedRowKeys.length > 1 ? '这些' : '此'}文件？`,
      confirmType: 'delete'
    })
  }
  
  revivification = (id) => {
    this.setState({
      confirmVisible: true,
      confirmText: '确定要还原此文件？',
      confirmType: 'reduction',
      recordId: id
    })
  }

  batchRevivification = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      confirmVisible: true,
      confirmText: `确定要还原${selectedRowKeys.length > 1 ? '这些' : '此'}文件？`,
      confirmType: 'batchReduction'
    })
  }

  deleteRecord = (id) => {
    this.setState({
      confirmVisible: true,
      confirmText: '确定要永久删除此文件？',
      confirmType: 'deleteRecord',
      recordId: id,
    })
  }

  clearList = () => {
    this.setState({
      confirmVisible: true,
      confirmText: '确定要清空回收站？',
      confirmType: 'clear'
    })
  }

  render() {
    const { selectedRowKeys, confirmVisible, confirmText } = this.state;
    const { fileList = {}, loading } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys: selectedRowKeys || ''})
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return(
      <div className={cx('content')}>
        <div className={cx("button-c")}>
          <Button onClick={this.clearList} className={cx('clear-btn')} type="primary" style={{marginRight: 27}} ><div className={cx('clear')}></div>清空回收站</Button>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ?
              <div style={{display: 'inline-block'}}>
                <Button onClick={this.batchRevivification} icon="rollback" type="primary" style={{marginRight: 27}}>还原</Button>
                <Button onClick={this.batchDelete} icon="delete" type="danger">永久删除</Button>
              </div>
              : ''
          }
        </div>
        <div className={cx("document-table")}>
          <div className={cx("tips")}>回收站的文件将于10天后自动清除</div>
          <Table
            rowClassName={() => 'editable-row'}
            rowSelection={rowSelection} 
            columns={this.columns}
            dataSource={fileList.content || []}
            onChange={this.handleTableChange}
            rowKey={(record) => record.id}
            pagination={{
              total: fileList.total || 0,
              pageSize: fileList.pageSize,
              current: fileList.pageNo,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: total => `共${total || 0}条记录`,
              showQuickJumper: true,
            }}
            loading={loading}
          />
        </div>
        <ConfirmLayer
            visible={confirmVisible}
            confirm={this.confirm}
            cancel={() => this.setState({ confirmVisible: false })}
            text={confirmText}
          />
      </div>
    )
  }
}

export default Content;
