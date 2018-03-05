import React from 'react';

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
      markerOptions: {
        draggable: true
      },
      polygonOptions: polyOptions
    });

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e) => {
      this.drawingManager.setDrawingMode(null);

      const area = google.maps.geometry.spherical.computeArea(e.overlay.getPath());
      const newAreaList = this.state.shapes;

      google.maps.event.addListener(e.overlay, 'click', () => {
        this.setCurrentShape(e.overlay);
      });

      this.setCurrentShape(e.overlay);

      const currentShape = this.currentShape;
      const newPolyCount = this.state.lifelongPolygonCount + 1;
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

    // couldn't figure out a nicer way to terminate drawing mode than this:
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
    for (let i = 0; i < this.state.shapes.length; i++) {
      if (parseInt(Object.keys(this.state.shapes[i])[0]) === shapeNum) {
        this.setCurrentShape(Object.values(this.state.shapes[i])[0][1]);
      }
    }
  }

  geocodeAddress(address) {
    // this function is based on work here: http://react.tips/reactjs-and-geocoding/
    this.geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {

        this.setState({
          foundAddress: results[0].formatted_address,
          isGeocodingError: false
        });

        this.map.setCenter(results[0].geometry.location);

        return;
      }
    });
  }

  render() {
    const mapStyle = {
      width: 800,
      height: 500,
      border: '1px solid black'
    };

    const shapes = this.state.shapes.map((shape, index) => {
      const actualArea = Object.values(shape)[0][0];
      const shapeNum = parseInt(Object.keys(shape)[0]);
      const className = this.state.selected === shapeNum ? "selected data" : "data";

      return (
        <li className={className} key={shapeNum} onClick={this.handleSelect.bind(this, shapeNum)}>
          Polygon {shapeNum}: {actualArea} square meters
        </li>
      );
    });

    return (
      <div className='parent-div'>
        <h3>Paul Angland Solar Calculator Prototype</h3>
        <p>Use the "select area" prompt to draw a polygon representing solar panel placements.</p>
        <div className="form-group">
          <input type="text" id="address" placeholder="Enter a new address" ref={this.setInput} required />
          <button onClick={this.handleSubmit}> Search </button>
        </div>

        <div className="polygon-buttons">
          <button onClick={this.beginPolygon}> Select Area </button>
          <button onClick={this.deletePolygon}> Delete Area </button>
        </div>

        <div className='map' ref="map" style={mapStyle}>
          Temp Input
        </div>

        <ul className='list'>
          {shapes}
        </ul>
      </div>
    );
  }
}

export default GMap;
