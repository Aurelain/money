import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '../ui/Button.jsx';
import Reload from '../ui/Icons/Reload.jsx';
import SideMenu from '../ui/SideMenu.jsx';
import LocationExit from '../ui/Icons/LocationExit.jsx';
import {HEADER_HEIGHT, HEADER_SAFETY, PRIMARY_COLOR} from '../SETTINGS.js';
import assume from '../utils/assume.js';
import {addFetchListener, checkIsLoading, removeFetchListener} from '../utils/fetchWithLoading.js';
import DotsCircle from '../ui/Animations/DotsCircle.jsx';
import requestHistory from '../state/actions/requestHistory.js';
import Totals from './Totals.jsx';
import {selectFormulas, selectHistory, selectIsMenuOpen} from '../state/selectors.js';
import Sigma from '../ui/Icons/Sigma.jsx';
import configureFormula from '../state/actions/configureFormula.js';
import memoFormulaResults from '../system/memoFormulaResults.js';
import RefreshCircle from '../ui/Icons/RefreshCircle.jsx';
import Bank from '../ui/Icons/Bank.jsx';
import showDebts from '../state/actions/showDebts.js';
import toggleMenu from '../state/actions/toggleMenu.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT + HEADER_SAFETY,
        zIndex: 100,
        display: 'flex',
        background: PRIMARY_COLOR,
        color: '#fff',
        paddingTop: HEADER_SAFETY,
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
    btn: {
        padding: 8,
    },
    btnGrow: {
        padding: 8,
        flexGrow: 1,
        fontSize: 24,
        justifyContent: 'start',
    },
    formulas: {
        flexGrow: 1,
    },
    listItem: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: 8,
    },
    result: {
        borderRight: 'solid 1px rgba(255,255,255,0.5)',
        lineHeight: '32px',
        padding: '4px 8px',
        '&:last-of-type': {
            borderRight: 0,
        },
    },
};

const MENU_ADD_FORMULA = 'MENU_ADD_FORMULA';
const MENU_DEBTS = 'MENU_DEBTS';
const MENU_LOG_OUT = 'MENU_LOG_OUT';
const LIST = [
    {
        name: MENU_ADD_FORMULA,
        icon: Sigma,
        label: 'Add formula',
    },
    {
        name: MENU_DEBTS,
        icon: Bank,
        label: 'Show debts',
    },
    // {
    //     name: MENU_SHOW_CONSOLE,
    //     icon: Console,
    //     label: 'Show console',
    // },
    {
        name: MENU_LOG_OUT,
        icon: LocationExit,
        label: 'Log out',
    },
];

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Bar extends React.PureComponent {
    state = {
        isLoading: false,
    };

    render() {
        const {history, formulas, isMenuOpen} = this.props;
        const {isLoading} = this.state;
        const reloadIcon = isLoading ? DotsCircle : Reload;
        return (
            <div css={SX.root}>
                <Button
                    label={this.memoGrowLabel(history, formulas)}
                    cssNormal={SX.btnGrow}
                    onClick={this.onMenuClick}
                    variant={'inverted'}
                />
                <Button
                    icon={reloadIcon}
                    holdIcon={RefreshCircle}
                    cssNormal={SX.btn}
                    onClick={this.onReloadClick}
                    onHold={this.onReloadHold}
                    variant={'inverted'}
                />
                <SideMenu
                    isOpen={isMenuOpen}
                    onClose={this.onMenuClose}
                    onSelect={this.onMenuSelect}
                    title={'Money'}
                    content={Totals}
                    list={LIST}
                    listItemCss={SX.listItem}
                />
            </div>
        );
    }

    componentDidMount() {
        addFetchListener(this.onFetchChange);
        this.setState({
            isLoading: checkIsLoading(),
        });
    }

    componentWillUnmount() {
        removeFetchListener(this.onFetchChange);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onMenuClick = () => {
        toggleMenu(true);
    };

    /**
     *
     */
    onMenuClose = () => {
        toggleMenu(false);
    };

    /**
     *
     */
    onMenuSelect = async ({name}) => {
        switch (name) {
            case MENU_ADD_FORMULA:
                await configureFormula();
                break;
            case MENU_DEBTS:
                showDebts();
                break;
            // case MENU_SHOW_CONSOLE:
            //     localStorage.setItem('console', 'emulated');
            //     window.location.reload();
            //     break;
            case MENU_LOG_OUT:
                window.refreshHard();
                break;
            default: {
                assume(false, `Unexpected menu choice "${name}"!`);
            }
        }
    };

    /**
     *
     */
    onReloadClick = () => {
        window.location.reload();
    };

    /**
     *
     */
    onReloadHold = async () => {
        await requestHistory(true);
        // window.location.reload();
    };

    /**
     *
     */
    onFetchChange = (isLoading) => {
        this.setState({isLoading});
    };

    /**
     *
     */
    memoGrowLabel = memoize((history, formulas) => {
        const results = memoFormulaResults(history, formulas).filter((item) => item.label.startsWith('_'));
        if (results.length < 2) {
            return results[0]?.result;
        }
        return (
            <>
                {results.map((item, index) => {
                    return (
                        <div key={index} css={SX.result}>
                            {item.result}
                        </div>
                    );
                })}
            </>
        );
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Bar.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.arrayOf(PropTypes.object),
    formulas: PropTypes.arrayOf(PropTypes.object),
    isMenuOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
        formulas: selectFormulas(state),
        isMenuOpen: selectIsMenuOpen(state),
    };
};

export default connect(mapStateToProps)(Bar);
