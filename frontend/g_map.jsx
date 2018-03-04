import React from 'react';

const mapOptions = {
  center: { lat: 42.346268, lng: -71.095764 },
  zoom: 17
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

    this.setStartingSearchData = this.setStartingSearchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.beginPolygon = this.beginPolygon.bind(this);
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
  }

  beginPolygon() {
    this.drawingManager.setMap(this.map);
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

    // couldn't figure out a nicer way to terminate drawing mode than this:
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e) => {
      this.drawingManager.setDrawingMode(null);

      const area = google.maps.geometry.spherical.computeArea(e.overlay.getPath());
      console.log(area);
    });
  }

  setStartingSearchData (input) {
    // this function is based on work here: http://react.tips/reactjs-and-geocoding/
    this.searchInputElement = input;
  }

  handleSubmit(e) {
    e.preventDefault();
    const address = this.searchInputElement.value;
    this.geocodeAddress(address);
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
      width: 500,
      height: 300,
      border: '1px solid black'
    };

    return (
      <div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" placeholder="Paris, France" ref={this.setStartingSearchData} required />
          <button onClick={this.handleSubmit}> Search </button>
        </div>

        <div className="polygon-buttons">
          <button onClick={this.beginPolygon}> Select Area </button>
        </div>

        <div ref="map" style={mapStyle}>
          Temp Input
        </div>
      </div>
    );
  }
}

export default GMap;
