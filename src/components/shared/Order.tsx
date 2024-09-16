import type { TableColumnsType } from "antd";
import { Table } from "antd";
import React from "react";
import "./style.css";

interface OrderProps {
  toggleOrderModal: () => void;
  onOrderSuccess: () => void;
}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  { title: "Product", dataIndex: "Product", key: "Product" },
  { title: "Price", dataIndex: "Price", key: "Price" },
  { title: "Status", dataIndex: "Status", key: "Status" },
];

const data: DataType[] = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Not Expandable",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
  },
];
const Order: React.FC<OrderProps> = ({ toggleOrderModal, onOrderSuccess }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-Order">
        <button className="modal-close" onClick={toggleOrderModal}>
          ×
        </button>
        <div className="modal-header">
          <h2>My Orders</h2>
        </div>

        <div className="order-form">
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>{record.description}</p>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
