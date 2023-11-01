import React from 'react';
import {mdiInformationOutline} from '@mdi/js';
import Icon from '../Icon.jsx';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class InformationOutline extends React.PureComponent {
    render() {
        return <Icon path={mdiInformationOutline} />;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default InformationOutline;