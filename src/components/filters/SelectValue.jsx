import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import Select from '../../ui/Select.jsx';
import SelectSX from './SelectSX.jsx';
import Cash from '../../ui/Icons/Cash.jsx';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectValue extends React.PureComponent {
    render() {
        const {onSelect, isFilter} = this.props;
        return (
            <Select
                cssNormal={this.memoButtonCss(isFilter)}
                label={'Value'}
                icon={Cash}
                variant={'simple'}
                listProps={this.memoListProps()}
                onSelect={onSelect}
            />
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    memoButtonCss = memoize((isFilter) => {
        const css = [SelectSX.root];
        css.push(isFilter ? SelectSX.isFilter : SelectSX.isSelect);
        return css;
    });

    /**
     *
     */
    memoListProps = memoize(() => {
        return {
            items: [
                {
                    name: 'foo',
                    label: 'foo',
                },
                {
                    name: 'bar',
                    label: 'bar',
                },
            ],
        };
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectValue.propTypes = {
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default SelectValue;
