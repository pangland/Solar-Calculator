import React from 'react';

const mapOptions = {
  center: { lat: 42.346268, lng: -71.095764 },
  zoom: 13
};

class Map extends React.Component {
  componentDidMount() {
    this.map = new google.maps.Map(this.refs.map, mapOptions);
    // this.geocoder = new google.maps.Geocoder();
  }

  render() {
    const mapStyle = {
      width: 500,
      height: 300,
      border: '1px solid black'
    };

    return (
      <div ref="map" style={mapStyle}>
        Temp Input
      </div>
    );
  }
}

export default Map;
