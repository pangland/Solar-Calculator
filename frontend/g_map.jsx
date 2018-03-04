import React from 'react';

const mapOptions = {
  center: { lat: 42.346268, lng: -71.095764 },
  zoom: 17
};

class GMap extends React.Component {
  constructor(props) {
    super(props);

    this.setStartingSearchData = this.setStartingSearchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // generate map, geocoder, and draw event function
    this.map = new google.maps.Map(this.refs.map, mapOptions);
    this.geocoder = new google.maps.Geocoder();

    this.map.addListener('click', (e) => {
      this.handleDraw(e.latLng, this.map);
    });
  }

  handleDraw() {
    console.log('test');
  }

  setStartingSearchData (input) {
    // this function is based on work here: http://react.tips/reactjs-and-geocoding/
    debugger
    this.searchInputElement = input;
  }

  handleSubmit(e) {
    e.preventDefault();
    const address = this.searchInputElement.value;
    this.geocodeAddress(address);
  }

  handleClick(e) {
    this.constructPolygon()
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

        <div ref="map" style={mapStyle} onClick={this.handleClick}>
          Temp Input
        </div>
      </div>
    );
  }
}

export default GMap;
