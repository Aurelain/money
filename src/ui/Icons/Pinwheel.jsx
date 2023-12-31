import React from 'react';
import {mdiPinwheel} from '@mdi/js';
import Icon from '../Icon.jsx';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Pinwheel extends React.PureComponent {
    render() {
        return <Icon path={mdiPinwheel} />;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default Pinwheel;
