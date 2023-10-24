import React from 'react';
import PropTypes from 'prop-types';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Icon extends React.PureComponent {
    render() {
        const {path, styling, ...other} = this.props;
        return (
            <svg css={styling} viewBox="0 0 24 24" width={24} height={24} {...other}>
                <path d={path} style={{fill: 'currentcolor'}} />
            </svg>
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Icon.propTypes = {
    path: PropTypes.string,
    styling: PropTypes.object,
};
export default Icon;
