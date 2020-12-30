import { useState, useEffect } from "react";
import { Button, Col, Input, Modal, Row, Spin, Table } from "antd";
import beamDiagram from "./beamDiagram";
import "antd/dist/antd.css";
import "./App.css";

const round = (num, decimalPlaces = 0) => {
  const p = Math.pow(10, decimalPlaces);
  const m = num * p * (1 + Number.EPSILON);
  return Math.round(m) / p;
};

const extractLoadTableDataSource = (result) => {
  let dataSource = [];
  result.loadings.forEach((load) => {
    // load
    let loadString = "";
    if (load.hasOwnProperty("w")) {
      loadString = "w=" + load["w"] + " (plf)";
    } else if (load.hasOwnProperty("p")) {
      loadString = "p=" + load["p"] + " (lbs)";
    }

    // loadingLocation
    let location = "";
    if (load.hasOwnProperty("l1")) {
      location += "L1=" + load["l1"];
      if (load.hasOwnProperty("l2")) {
        location += ", L2=" + load["l2"];
      }
    } else {
      location += result.L;
    }

    const newLoad = {
      loadType: load["type"],
      load: loadString,
      loadingLocation: location,
      key: dataSource.length,
    };

    dataSource.push(newLoad);
  });
  return dataSource;
};

const App = () => {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const getResult = async () => {
      console.log("Before");
      const calcResponse = await fetch("/rest/Calc");
      const jsonObject = await calcResponse.json();
      console.log("After");
      setResult(jsonObject);
    };
    getResult();
  }, []);

  if (result == null) {
    return <Spin />;
  }

  const Vmax = Math.max(result.R1, result.R2);

  const loadings = extractLoadTableDataSource(result);
  const loadTable = {
    dataSource: loadings,
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
        <Col span={10}>{beamDiagram(result)}</Col>
      </Row>
      <Row gutter={[0, 10]} style={marginTop}>
        <Col span="8" style={dataFontStyle}>
          R1 = {round(result.R1, 0)} (lbs)
        </Col>
        <Col span="8" style={dataFontStyle}>
          R2 = {round(result.R2, 0)} (lbs)
        </Col>
        <Col span="8" style={dataFontStyle}>
          Vmax = {round(Vmax, 0)} (lbs)
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
