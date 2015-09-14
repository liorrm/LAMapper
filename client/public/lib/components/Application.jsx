var Application = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        console.log('hello?')
        this.loadPolygonData('/api/regions');
    },
    loadPolygonData: function(url) {
        console.log(url, 'erwer LOD loadPolygonData')
        $.getJSON(url, function(data) {
            console.log(data.rows)
            this.setState({
                regions: data.rows
            });
        }.bind(this));
    },
    render: function() {

        return (
            <Leaflet regions       = {this.state.regions}
                     neighborhoods = {this.state.neighborhoods} />
        );
    }
});