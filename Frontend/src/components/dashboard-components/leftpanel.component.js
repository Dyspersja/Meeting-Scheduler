import React, { Component } from 'react';

class LeftPanel extends Component {
    render() {
        return (
            <div className='left-panel'>
                <div className='add-button'>
                    <button onClick={this.props.openModal}>Dodaj</button>
                </div>
                <div className='planner'>
                    {/* coś tu będzie kiedyś */}
                </div>
            </div>
        );
    }
}

export default LeftPanel;
