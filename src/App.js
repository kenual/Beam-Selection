import { useState } from "react";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import beamDiagram from "./beamDiagram";
import "antd/dist/antd.css";
import "./App.css";

const round = (num, decimalPlaces = 0) => {
  const p = Math.pow(10, decimalPlaces);
  const m = num * p * (1 + Number.EPSILON);
  return Math.round(m) / p;
};

const App = () => {
  const [showResult, setShowResult] = useState(false);
  const result = window.result;
  const Vmax = Math.max(result.R1, result.R2);

  const loadTable = {
    dataSource: [
      {
        loadType: "1",
        load: "w=100 (plf)",
        loadingLocation: "15",
        key: "0",
      },
      {
        loadType: "2",
        load: "p=1000 (lbs)",
        loadingLocation: "L1=5",
        key: "1",
      },
      {
        loadType: "3",
        load: "w=100 (plf)",
        loadingLocation: "15",
        key: "2",
      },
      {
        loadType: "4",
        load: "w=100 (plf)",
        loadingLocation: "L1=2.5, L2=6",
        key: "3",
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
        title: "Loading Location (ft)",
      },
    ],
  };

  const dataFontStyle = {
    fontFamily: "'Lucida Console', 'Courier New', monospace",
    fontSize: "20px",
  };
  const requiredTable = {
    dataSource: [
      {
        name: "WOOD",
        Srequired: round((result.M.max * 12) / 1000, 2),
        Arequired: round((1.5 * Vmax) / 95, 2),
        Irequired: round((20 * result.D.max) / (1700000 * result.L), 2),
        key: "0",
      },
      {
        name: "GLULAM",
        Srequired: round((result.M.max * 12) / (0.95 * 2400), 2),
        Arequired: round((1.5 * Vmax) / (0.95 * 165), 2),
        Irequired: round((20 * result.D.max) / (0.95 * 1800000 * result.L), 2),
        key: "1",
      },
      {
        name: "PARALLAM",
        Srequired: round((result.M.max * 12) / (0.95 * 2900), 2),
        Arequired: round((1.5 * Vmax) / (0.95 * 290), 2),
        Irequired: round((20 * result.D.max) / (0.95 * 2000000 * result.L), 2),
        key: "2",
      },
      {
        name: "STEEL",
        Srequired: round((result.M.max * 12) / 21600, 2),
        Arequired: round((1.5 * Vmax) / (0.4 * 36000), 2),
        Irequired: round((20 * result.D.max) / (29000000 * result.L), 2),
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
        render: (text) => (
          <Input placeholder={text} bordered={false} style={dataFontStyle} />
        ),
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

  const marginTop = {
    marginTop: "40px",
  };
  const marginBottom = {
    marginBottom: "80px",
  };

  return (
    <>
      {resultDialog}
      <h2 onClick={() => setShowResult(true)}>{result.beamName}</h2>
      <Row align="middle">
        <Col span={24 - 10}>
          <Table
            pagination={false}
            dataSource={loadTable.dataSource}
            columns={loadTable.columns}
          />
        </Col>
        <Col span={10}>{beamDiagram()}</Col>
      </Row>
      <Row gutter={[0, 10]} style={marginTop}>
        <Col span="8" style={dataFontStyle}>
          R1 = {result.R1} (lbs)
        </Col>
        <Col span="8" style={dataFontStyle}>
          R2 = {result.R2} (lbs)
        </Col>
        <Col span="8" style={dataFontStyle}>
          Vmax = {Vmax} (lbs)
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span="10" style={dataFontStyle}>
          Mmax = {result.M.max} (lbs-ft)
        </Col>
        <Col span="8" style={dataFontStyle}>
          A left = {result.M.aleft} (ft)
        </Col>
      </Row>
      <Row gutter={[0, 10]} style={marginBottom}>
        <Col span="10" style={dataFontStyle}>
          Dmax = {result.D.max}/EI(in)
        </Col>
        <Col span="8" style={dataFontStyle}>
          A left = {result.D.aleft} (ft)
        </Col>
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
