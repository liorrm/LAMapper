var Application = React.createClass({
    getInitialState: function() {
        return {
            hoveringOver: ''
        };
    },
    componentDidMount: function() {
        this.loadRegions();
        this.loadNeigborhoods();
    },
    shouldComponentUpdate: function(nextState, nextProps) {
        return nextState !== this.state
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
    handleHover: function(featureName) {
        if (this.state.hoveringOver !== featureName) {
            this.setState({
                hoveringOver: featureName
            });
        }
    },
    render: function() {
        return (
            <Leaflet regions        = {this.state.regions}
                     neighborhoods  = {this.state.neighborhoods}
                     onFeatureHover = {this.handleHover}/>
        );
    }
});