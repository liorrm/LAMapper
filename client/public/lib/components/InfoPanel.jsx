var InfoPanel = React.createClass({
    render: function() {
        return (
            <div className='info-panel-container'>
                <p>Hovering Over: {this.props.hoveringOver} </p>
            </div>
        );
    }
});