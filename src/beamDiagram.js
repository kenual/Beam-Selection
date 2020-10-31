const beamDialog = () => {
  const boldStyle = {
    fontStyle: "bold",
    fontSize: "60px",
    fill: "red",
  };

  return (
    <svg width="306" height="300">
      <line
        x1="30"
        y1="120"
        x2="300"
        y2="120"
        style={{ stroke: "rgb(255,0,0)", strokeWidth: "2" }}
      />
      <line
        x1="30"
        y1="140"
        x2="300"
        y2="140"
        style={{ stroke: "rgb(255,0,0)", strokeWidth: "4" }}
      />
      <text x="18" y="183" style={boldStyle}>
        ↑
      </text>
      <text x="22" y="200" fontSize="large">
        R1
      </text>
      <text x="150" y="200" fontSize="large">
        {window.result.L + "'"}
      </text>
      <text x="283" y="183" style={boldStyle}>
        ↑
      </text>
      <text x="286" y="200" fontSize="large">
        R2
      </text>
    </svg>
  );
};
export default beamDialog;
