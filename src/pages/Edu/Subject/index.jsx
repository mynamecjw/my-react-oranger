import React, { Component } from "react";
import { Button, Table } from "antd"; //导入Button按钮
import { PlusOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"; //导入antd中的icon

// 导入样式文件
import "./index.less";

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <>
        <Button type="primary" className="update-btn">
          <FormOutlined />
        </Button>
        <Button type="danger">
          <DeleteOutlined />
        </Button>
      </>
    ),
    width: 200,
  },
];
const data = [
  {
    key: 1,
    name: "Strawberry ",
    age: 1,
    address: "China",
    description: "Sour, sweet, red, delicious and expensive",
  },
  {
    key: 2,
    name: "Durian",
    age: 2,
    address: "Thailand",
    description:
      "Although there is a taste, but sweet and delicious, is a good dessert",
  },
  {
    key: 3,
    name: "Cherry",
    age: 3,
    address: "Japan",
    description: "Red like a gem, it looks very attractive",
  },
  {
    key: 4,
    name: "watermelon",
    age: 4,
    address: "Sidcountryside",
    description: "Summer is the most thirsty",
  },
];
export default class Subject extends Component {
  render() {
    return (
      <div className="subject">
        <Button type="primary" className="subject-btn">
          <PlusOutlined />
          新建
        </Button>
        <Table
          // 控制可展开项
          columns={columns}
          expandable={{
            // 可展开项展开的内容
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            // 控制这一列是否可展开
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={data}
        />
        , mountNode,
      </div>
    );
  }
}
