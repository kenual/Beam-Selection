import { useState } from "react";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import beamDiagram from "./beamDiagram";
import "antd/dist/antd.css";
import "./App.css";

const App = () => {
  const [showResult, setShowResult] = useState(false);
  const result = window.result;

  const inputTable = {
    dataSource: [
      {
        unit: "(plf)",
        label: "w1 =",
        formula: "",
        value: result.w1,
        key: "0",
      },
      {
        unit: "(plf)",
        label: "w2 =",
        formula: "",
        value: result.w2,
        key: "1",
      },
      {
        unit: "(lbs)",
        label: "P1 =",
        formula: "",
        value: result.P1,
        key: "2",
      },
      {
        unit: "(lbs)",
        label: "P2 =",
        formula: "",
        value: result.P2,
        key: "3",
      },
      {
        unit: "(lbs)",
        label: "P3 =",
        formula: "",
        value: result.P3,
        key: "4",
      },
    ],
    columns: [
      {
        dataIndex: "label",
        align: "right",
      },
      {
        dataIndex: "formula",
        align: "left",
        render: (text) => <Input placeholder={text} bordered={false} />,
      },
      {
        dataIndex: "equal",
        align: "right",
        width: "5px",
        render: () => "=",
      },
      {
        dataIndex: "value",
      },
      {
        dataIndex: "unit",
        align: "left",
      },
    ],
  };

  const loadTable = {
    dataSource: [
      {
        loadType: "1",
        load: "326",
        loadingLocation: "1",
        key: "0",
      },
      {
        loadType: "3",
        load: "1000",
        loadingLocation: "20",
        key: "1",
      },
    ],
    columns: [
      {
        dataIndex: "loadType",
        title: "Load Type",
      },
      {
        dataIndex: "load",
        title: "Load",
      },
      {
        dataIndex: "loadingLocation",
        title: "Loading Location",
      },
    ],
  };

  const requiredTable = {
    dataSource: [
      {
        name: "WOOD",
        Srequired: 87.08,
        Arequired: 29.83,
        Irequired: 300.15,
        key: "0",
      },
      {
        name: "GLULAM",
        Srequired: 38.19,
        Arequired: 18.08,
        Irequired: 298.39,
        key: "1",
      },
      {
        name: "PARALLAM",
        Srequired: 31.6,
        Arequired: 10.28,
        Irequired: 268.55,
        key: "2",
      },
      {
        name: "STEEL",
        Srequired: 4.03,
        Arequired: 0.19,
        Irequired: 17.59,
        key: "3",
      },
    ],
    columns: [
      {
        dataIndex: "name",
      },
      {
        dataIndex: "Srequired",
        title: "Sreq'd (in^3)",
      },
      {
        dataIndex: "Arequired",
        title: "Areq'd (in^2)",
      },
      {
        dataIndex: "Irequired",
        title: "Ireq'd (in^4)",
      },
      {
        dataIndex: "use",
        title: "Use",
        render: (text) => <Input placeholder={text} bordered={false} />,
      },
    ],
  };

  const resultParams = [];
  for (const property in result) {
    resultParams.push(
      <Row>
        <Col span="6">{property}</Col>
        <Col>{JSON.stringify(result[property], null, 2)}</Col>
      </Row>
    );
  }
  const resultDialog = (
    <Modal
      title="Calculation Results"
      visible={showResult}
      footer={[
        <Button key="ok" onClick={() => setShowResult(false)}>
          OK
        </Button>,
      ]}
    >
      {resultParams}
    </Modal>
  );

  return (
    <>
      {resultDialog}
      <Row>
        <Col span={24 - 10}>
          <h2 onClick={() => setShowResult(true)}>{result.beamName}</h2>
          <Table
            showHeader={false}
            pagination={false}
            dataSource={inputTable.dataSource}
            columns={inputTable.columns}
          />
        </Col>
        <Col span={10}>{beamDiagram()}</Col>
      </Row>
      <Table
        pagination={false}
        dataSource={loadTable.dataSource}
        columns={loadTable.columns}
      />
      <Row gutter={[0, 10]} style={{ marginTop: "40px" }}>
        <Col span="8">R1 = {result.R1} (kips)</Col>
        <Col span="8">R2 = {result.R2} (kips)</Col>
        <Col span="8">Vmax = {Math.max(result.R1, result.R2)} (kips)</Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span="6">Mmax = {result.M.max} (kip-in)</Col>
        <Col span="6">A left = {result.M.aleft} (ft)</Col>
      </Row>
      <Row gutter={[0, 10]} style={{ marginBottom: "40px" }}>
        <Col span="6">Dmax = {result.D.max} /EI(in)</Col>
        <Col span="6">A left = {result.D.aleft} (ft)</Col>
      </Row>
      <Table
        pagination={false}
        dataSource={requiredTable.dataSource}
        columns={requiredTable.columns}
      />
    </>
  );
};

export default App;
