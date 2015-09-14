var Leaflet = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        console.log('mounted')

        var CDBTileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

        // instantiate Leaflet map
        this.map = new L.Map('map', {
                layers: [],
                // center: new L.LatLng(37.6543, -121.8552),
                zoom: 9,
                minZoom: 4,
                maxBounds:[[-85,-180.0],[85,180.0]],
                zoomControl: false,
                markerZoomAnimation: true,
                boxZoom: true,
                drawControlTooltips: false,
                attributionControl: false
            }
        );
        // instantiate base layer
        var baseLayer = L.tileLayer(CDBTileUrl, {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        });

        // add baselayer to map
        this.map.addLayer(baseLayer);

        console.log(baseLayer)
        console.log(this.map)
    },
    // componentWillUnmount: function() {
    //     this.map.remove();
    // },
    render: function() {

        var mapStyle = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            position: 'absolute'
        }

        return (
            <div id='map' style={mapStyle} ref="leafletDiv"></div>
        );
    }
});