import React from 'react';
import { calculateNominalPower } from '../util/nominal_power.js';

const mapOptions = {
  center: { lat: 42.381671, lng: -71.078107},
  zoom: 19,
  mapTypeId: 'hybrid',
  labels: true
};

const polyOptions = {
  strokeWeight: 0,
  fillOpacity: 0.5,
  editable: true,
  fillColor: 'orange'
};

class GMap extends React.Component {
  constructor(props) {
    super(props);

    this.setInput = this.setInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.beginPolygon = this.beginPolygon.bind(this);
    this.deletePolygon = this.deletePolygon.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      shapes: [],
      lifelongPolygonCount: 0,
      selected: -1
    };
  }

  componentDidMount() {
    // generate map, geocoder, and drawingmanager
    this.map = new google.maps.Map(this.refs.map, mapOptions);
    this.geocoder = new google.maps.Geocoder();
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      markerOptions: { draggable: true },
      polygonOptions: polyOptions
    });

    // this method and approach informed from code herein: http://jsfiddle.net/89u6owsz/
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e) => {
      // deactivate drawing mode
      this.drawingManager.setDrawingMode(null);

      // calculate area of polygon
      const area = google.maps.geometry.spherical.computeArea(e.overlay.getPath());

      // add event listener for selecting already completed polygon
      google.maps.event.addListener(e.overlay, 'click', () => {
        this.setCurrentShape(e.overlay);
      });

      this.setCurrentShape(e.overlay);

      const currentShape = this.currentShape;
      const newPolyCount = this.state.lifelongPolygonCount + 1;
      const newAreaList = this.state.shapes;
      newAreaList.push({[newPolyCount]: [area, currentShape]});

      this.setState({
        shapes: newAreaList,
        lifelongPolygonCount: newPolyCount,
        selected: newPolyCount
      });
    });
  }

  beginPolygon() {
    this.drawingManager.setMap(this.map);
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }

  deletePolygon() {
    // remove polygon from state
    for (let i = 0; i < this.state.shapes.length; i++) {
      if (Object.values(this.state.shapes[i])[0][1] === this.currentShape) {
        this.state.shapes.splice(i, 1);
        break;
      }
    }

    if (this.currentShape) {
      this.currentShape.setMap(null);
    }

    this.setState(this.state);
  }

  setCurrentShape(shape) {
    if (this.currentShape) {
      this.currentShape.setEditable(false);
    }

    this.currentShape = shape;
    this.currentShape.setEditable(true);

    // declare a new 'selected polygon'
    let newSelected;
    for (let i = 0; i < this.state.shapes.length; i++) {
      if (this.currentShape === Object.values(this.state.shapes[i])[0][1]) {
        newSelected = parseInt(Object.keys(this.state.shapes[i])[0]);
      }
    }

    this.setState({ selected: newSelected});
  }

  setInput (input) {
    // this function is based on work here: http://react.tips/reactjs-and-geocoding/
    this.searchInputElement = input;
  }

  handleSubmit(e) {
    e.preventDefault();
    const address = this.searchInputElement.value;
    this.geocodeAddress(address);
  }

  handleSelect(shapeNum, e) {
    // update state's selected polygon
    for (let i = 0; i < this.state.shapes.length; i++) {
      if (parseInt(Object.keys(this.state.shapes[i])[0]) === shapeNum) {
        this.setCurrentShape(Object.values(this.state.shapes[i])[0][1]);
      }
    }
  }

  geocodeAddress(address) {
    // this function is informed from work here: http://react.tips/reactjs-and-geocoding/
    this.geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);
      }
    });
  }

  render() {
    const mapStyle = {
      width: 800,
      height: 400,
      border: '1px solid black'
    };

    let totalArea = 0;
    let totalNominalPower = 0;

    const shapes = this.state.shapes.map((shape, index) => {
      const actualArea = Object.values(shape)[0][0];
      const shapeNum = parseInt(Object.keys(shape)[0]);
      const className = this.state.selected === shapeNum ? "selected data" : "data";
      const nominalPower = calculateNominalPower(actualArea);

      totalArea += actualArea;
      totalNominalPower += nominalPower;

      return (
        <tr
          className={className}
          key={shapeNum}
          onClick={this.handleSelect.bind(this, shapeNum)}>

          <th>Polygon {shapeNum}</th>
          <td>{Math.round(actualArea)}</td>
          <td>{Math.round(nominalPower)}</td>
        </tr>
      );
    });

    return (
      <div className='parent-div'>
        <h3>Paul Angland Solar Calculator Prototype</h3>
        <p>Use the "select area" prompt to draw a polygon representing solar panel placements.</p>
        <form className="form-group">
          <input type="text"
            id="address"
            placeholder="Enter a new address"
            ref={this.setInput}
            required />
          <button onClick={this.handleSubmit}> Search </button>
        </form>

        <div className="polygon-buttons">
          <button onClick={this.beginPolygon}> Select Area </button>
          <button onClick={this.deletePolygon}> Delete Area </button>
        </div>

        <div className='map' ref="map" style={mapStyle}>
          Temp Input
        </div>

        <table className={this.state.shapes.length > 0 ? "" : "hide"}>
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
      </div>
    );
  }
}

export default GMap;
