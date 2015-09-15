var Leaflet = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {

        var CDBTileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

        // instantiate Leaflet map
        this.map = new L.Map('map', {
                layers: [],
                center: new L.LatLng(34.0500, -118.2500),
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
        this.baseLayer = new L.tileLayer(CDBTileUrl, {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'

        });

       this.regionLayer = new L.FeatureGroup();
       this.neighborhoodLayer = new L.FeatureGroup();

        // add baselayer to map
        this.map.addLayer(this.baseLayer);
        this.map.addLayer(this.regionLayer);
        this.map.addLayer(this.neighborhoodLayer);
        this.determineLayers();

        this.map.on('zoomend', this.determineLayers);
    },
    determineLayers: function() {
        if (this.map.getZoom() < 12) {
            this.map.addLayer(this.regionLayer);
            this.map.removeLayer(this.neighborhoodLayer);
        } else {
            this.map.removeLayer(this.regionLayer);
            this.map.addLayer(this.neighborhoodLayer);
        }
    },
    renderPolygon: function(boundary, parentLayer) {
        var polygon = L.geoJson(JSON.parse(boundary.geojson), {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 1,
                    opacity: 1,
                    color: '#119b49',
                    fill: false,
                    fillOpacity: 5
                };
            }
        });
       parentLayer.addLayer(polygon);
    },
    componentWillReceiveProps: function(nextProps) {
        console.log('props received', nextProps)
        if (nextProps.regions) {
            for (var i = nextProps.regions.length - 1; i >= 0; i--) {
               this.renderPolygon(nextProps.regions[i], this.regionLayer)
            }
        }
        if (nextProps.neighborhoods) {
            for (var i = nextProps.neighborhoods.length - 1; i >= 0; i--) {
               this.renderPolygon(nextProps.neighborhoods[i], this.neighborhoodLayer)
            }
        }
    },
    componentWillUnmount: function() {
        this.map.remove();
    },
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