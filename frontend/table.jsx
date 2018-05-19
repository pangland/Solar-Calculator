import React from 'react';
import { calculateNominalPower } from '../util/nominal_power.js';

class Table extends React.Component {
  render() {
    let totalArea = 0;
    let totalNominalPower = 0;

    const shapes = this.props.shapes.map((shape, shapeNum) => {
      if (shape === null) {
        return;
      }

      const actualArea = shape.area;
      const className = this.props.selected === shapeNum ? "selected data" : "data";
      const nominalPower = calculateNominalPower(actualArea);

      totalArea += actualArea;
      totalNominalPower += nominalPower;

      return (
        <tr
          className={className}
          key={shapeNum}
          onClick={this.props.handleSelect.bind(this, shapeNum)}>

          <th>Polygon {shapeNum +1}</th>
          <td>{Math.round(actualArea)}</td>
          <td>{Math.round(nominalPower)}</td>
        </tr>
      );
    });

    return (
      <table className={this.props.shapes.length > 0 ? "" : "hide"}>
        <tr>
          <th>&nbsp;</th>
          <th>Area (m^2)</th>
          <th>Nominal Power (kW)</th>
        </tr>
        {shapes}
        <tr>
          <th>Total</th>
          <td>{Math.round(totalArea)}</td>
          <td>{Math.round(totalNominalPower)}</td>
        </tr>
      </table>
    );
  }
}

export default Table;
