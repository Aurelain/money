import React from 'react';
import {mdiClose} from '@mdi/js';
import Icon from '../Icon.jsx';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Close extends React.PureComponent {
    render() {
        return <Icon path={mdiClose} />;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default Close;
