import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { EditableCell, EditableFormRow } from '../editable';
import { Button, Table, message } from 'antd';
import ConfirmLayer from 'app/components/confirm-layer';
import download from 'app/util/download';
import optimize from 'app/util/optimize';
import CustomUpload from 'app/components/custom-upload';

const cx = classNames.bind(styles);

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSubTypeKey: '',  // 子类型选择
      selectedRowKeys: [],     //选择的key
      confirmVisible: false,  // 二次确认框 
      confirmText: '',        // 确认框文本
      confirmType: '',        // 确认框类型
      fileList: [],
      recordId: '',           //单条id
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
        editable: true,
        className: 'file-name',
        sorter: true,
        width: 350,
        colSpan: 2
      },
      {
        title: '大小',
        dataIndex: 'sizeStr',
        // width: '10%',
        sorter: true
      },
      {
        title: '上次修改时间',
        dataIndex: 'modifyTime',
        // width: '15%',
        sorter: true
      },
      {
        title: '操作',
        dataIndex: 'edit',
        // width: '20%',
        render: (text, record) => (
          <div>
            <Button onClick={() => download({url: record.url, name: record.name})} style={{ margin: '0 10px 5px 0' }} icon="download" type="primary" size="small">下载</Button>
            <Button onClick={() => this.deleteRecord(record.id)} icon="delete" type="danger" size="small">删除</Button>
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
    if(this.props.searchParams.type !== nextProps.searchParams.type) {
      this.setState({
        selectedSubTypeKey: ''
      })
    }
  }

  changeTabs = (key) => {
    const { searchParams } = this.props;
    this.setState({
      selectedSubTypeKey: key
    });
    this.props.fetchList({
      ...searchParams,
      subType: key
    })
  }

  handleSave = row => {
    const { content = [] } = this.props.fileList;
    const newData = [...content];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    console.log('row', row);
    if (row.name !== item.name) {
      // newData.splice(index, 1, {
      //   ...item,
      //   ...row,
      // });
      //this.setState({ data: newData });
      this.props.restName({
        id: row.id,
        name: row.name
      });
    }
  };

  // 排序
  handleTableChange = (pagination, filters, sorter) => {
    const { fetchList, searchParams } = this.props;
    const { order, columnKey } = sorter;
    const { pageSize, current} = pagination;
    let orderBy = -3;
    if (order === 'ascend') {      // 升序
      switch (columnKey) {
        case 'name':
          orderBy = 1;
          break;
        case 'sizeStr':
          orderBy = 2;
          break;
        case 'modifyTime':
          orderBy = 3;
          break;
        default:
          break;
      }
    } else if (order === 'descend') {   // 降序
      switch (columnKey) {
        case 'name':
          orderBy = -1;
          break;
        case 'sizeStr':
          orderBy = -2;
          break;
        case 'modifyTime':
          orderBy = -3;
          break;
        default:
          break;
      }
    }
    //this.setLoading({laoding: false});
    fetchList({
      ...searchParams,
      orderBy,
      pageSize,
      pageNo: current
    })
  };

  // 二次确认框
  confirm = () => {
    const { selectedRowKeys, confirmType, recordId } = this.state;
    const { content = [] } = this.props.fileList;
    if (confirmType === 'delete') {
      this.props.deleteRecord(recordId);
      this.setState({
        confirmVisible: false
      })
    } else if (selectedRowKeys && selectedRowKeys.length > 0) {
      if (confirmType === 'download') {
        let urlList = [];
        selectedRowKeys.forEach(item => {
          content.forEach(contentItem => {
            if (contentItem.id === item) {
              urlList.push({url: contentItem.url, name: contentItem.name});
            }
          })
        })
        urlList.forEach(urlItem => {
          download(urlItem);
        });
      } else if (confirmType === 'batchDelete') {
        this.props.batchDelete(selectedRowKeys);
      }
      this.setState({
        confirmVisible: false
      })
    } else {
      message.error('您还未选择文件');
    }

  }

  batchDelete = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      confirmVisible: true,
      confirmText: `确定要删除${selectedRowKeys.length > 1 ? '这些' : '此'}文件？`,
      confirmType: 'batchDelete',
    })
  }

  batchDownloadFile = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      confirmVisible: true,
      confirmText: `确定要下载${selectedRowKeys.length > 1 ? '这些' : '此'}文件？`,
      confirmType: 'download',
    })
  }

  deleteRecord = (id) => {
    this.setState({
      confirmVisible: true,
      confirmText: '确定要删除此文件？',
      confirmType: 'delete',
      recordId: id
    })
  }

  uploadCallback = (fileList) => {
    console.log('uploadCallback', fileList);
     
    const error = (fileList || []).filter(item => item.status === 'error');
    const uploading = (fileList || []).filter(item => item.status === 'uploading');
    const done  = (fileList || []).filter(item => item.status === 'done');
    if (error && error.length > 0) {
      this.props.setUploadStatus('abnormal');
    } else if (uploading && uploading.length > 0) {
      this.props.setUploadStatus('ongoing');
    } else if(done && done.length > 0) {
      this.props.setUploadStatus('complete');
      if (this.state.fileList != fileList ) {
        console.log('更新列表');
        setTimeout(() => {
          this.props.fetchList(this.props.searchParams);
        },500);
        this.setState({
          fileList
        })
      }
    } else {
      this.props.setUploadStatus('');
    }
    
    this.props.setShowUpload(false);
  } 
  
  render() {
    const { selectedSubTypeKey, selectedRowKeys, confirmVisible, confirmText } = this.state;
    const { fileList = {}, subType = [], searchParams, loading, showUploadBox } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //const selectedKeys = (selectedRows || []).map(item => item.id);
        this.setState({ selectedRowKeys: selectedRowKeys || [] });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className={cx('content')}>
        <div className={cx("button-c")}>
          {/* <Button icon="upload" type="primary" style={{ marginRight: 27 }} >上传</Button> */}
          <CustomUpload 
            callback={this.uploadCallback}
            show={showUploadBox}
          />
          {
            selectedRowKeys && selectedRowKeys.length > 0 ?
              <div style={{ display: 'inline-block' }}>
                <Button onClick={this.batchDownloadFile} icon="download" type="primary" style={{ marginRight: 27 }}>下载</Button>
                <Button onClick={this.batchDelete} icon="delete" type="danger">删除</Button>
              </div>
              : ''
          }
        </div>
        <div className={cx("tabs")} style={{display: searchParams.type === 'TEXT' ? 'block' : 'none'}}>
          <div
            onClick={() => this.changeTabs('')}
            className={cx("tab-item", selectedSubTypeKey === '' ? 'activeTab' : '')}>
              全部文档 <div className={cx("line")}></div>
          </div>
          {
            subType.map((item, idx) => (
              <div
                key={idx}
                onClick={() => this.changeTabs(item)}
                className={cx("tab-item", selectedSubTypeKey === item ? 'activeTab' : '')}>
                {item && item.toUpperCase()} <div className={cx("line")}></div>
              </div>
            ))
          }
        </div>
        <div className={cx("document-table")}>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={fileList.content}
            onChange={this.handleTableChange}
            rowKey={(record) => record.id}
            pagination={{
              total: fileList.total || 0,
              pageSize: fileList.pageSize || 0,
              current: fileList.pageNo || 0,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: total => `共${total || 0}条记录`,
              showQuickJumper: true,
              // onChange: this.onChangePagination,
              // onShowSizeChange: this.onShowSizeChange
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