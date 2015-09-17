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

        // instantiate layers
        this.baseLayer = new L.tileLayer(CDBTileUrl, {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'

        });

       this.regionLayer = new L.FeatureGroup();
       this.neighborhoodLayer = new L.FeatureGroup();

        // add baselayer to map
        this.map.addLayer(this.baseLayer);
        this.map.addLayer(this.regionLayer);
        this.map.addLayer(this.neighborhoodLayer);
        this.determineActiveLayerGroup();
        //
        this.map.on('zoomend', this.determineActiveLayerGroup);

    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps !== this.props || nextState !== this.state;
    },
    determineActiveLayerGroup: function() {
        if (this.map.getZoom() < 11) {
            // reset layer highlighting if mouseout function wasn't called
            this.neighborhoodLayer.eachLayer(function(layer) {
                layer.setStyle({
                    fillOpacity: 0
                })
            });
            this.map.addLayer(this.regionLayer);
            this.map.removeLayer(this.neighborhoodLayer);
        } else {
            this.regionLayer.eachLayer(function(layer) {
                layer.setStyle({
                    fillOpacity: 0
                })
            });
            this.map.removeLayer(this.regionLayer);
            this.map.addLayer(this.neighborhoodLayer);
        }
    },
    handleHover: function(e) {
        var newFeature = e.target.name || ''
        this.setState({
            hoveringOver: newFeature
        });
    },
    handleLeave: function() {
        this.setState({
            hoveringOver: ''
        });
    },
    renderPolygon: function(feature, parentLayer) {
        var polygon = L.geoJson(JSON.parse(feature.geojson), {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 1,
                    opacity: 1,
                    color: '#119b49',
                    fill: true,
                    fillOpacity: 0
                };
            }
        });

        polygon.name = feature.name;
        var popupContent = '<h4>' + feature.name + '</h4>';
        var popup = L.popup({minWidth: 250, closeButton: true, autoPanPaddingTopLeft: [0, 0]}).setContent(popupContent);

        polygon.bindPopup(popup);

        polygon.on('mouseover', function(e) {
            e.target.setStyle({
                fillOpacity: 0.4
            });
            this.handleHover(e);
        }.bind(this))
        .on('mouseout', function(e) {
            e.target.setStyle({
                fillOpacity: 0
            });
            this.handleLeave(e);
        }.bind(this))

        parentLayer.addLayer(polygon);
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps !== this.props) {
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
            <div>
                <div id='map' style={mapStyle} ref="leafletDiv"></div>
                <InfoPanel hoveringOver={this.state.hoveringOver} />
            </div>
        );
    }
});