var Application = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.loadRegions();
        this.loadNeigborhoods();
    },
    loadRegions: function() {
        $.getJSON('/api/regions', function(data) {
            this.setState({
                regions: data.rows
            });
        }.bind(this));
    },
    loadNeigborhoods: function() {
        $.getJSON('api/neighborhoods', function(data) {
            this.setState({
                neighborhoods: data.rows
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