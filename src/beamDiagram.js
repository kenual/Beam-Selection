const beamDialog = () => {
  return (
    <svg height="300" width="300">
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
      <text x="25" y="175" fill="red" fontSize="xxx-large">
        ^
        <tspan x="273" y="175" fill="red" fontSize="xxx-large">
          ^
        </tspan>
        <tspan x="37" y="170" fill="red" fontSize="xx-large">
          |
        </tspan>
        <tspan x="285" y="170" fill="red" fontSize="xx-large">
          |
        </tspan>
      </text>
      <text x="30" y="200" fontSize="large">
        R1
      </text>
      <text x="150" y="200" fontSize="large">
        20'
      </text>
      <text x="280" y="200" fontSize="large">
        R2
      </text>
    </svg>
  );
};
export default beamDialog;
