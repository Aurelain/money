import React from 'react';
import {connect} from 'react-redux';
import memoize from 'memoize-one';
import localforage from 'localforage';
import Button from '../ui/Button.jsx';
import Reload from '../ui/Icons/Reload.jsx';
import Menu from '../ui/Icons/Menu.jsx';
import SideMenu from '../ui/SideMenu.jsx';
import Console from '../ui/Icons/Console.jsx';
import LocationExit from '../ui/Icons/LocationExit.jsx';
import {HEADER_HEIGHT, HEADER_SAFETY, PRIMARY_COLOR, STORE_KEY} from '../SETTINGS.js';
import assume from '../utils/assume.js';
import {addFetchListener, checkIsLoading, removeFetchListener} from '../utils/fetchWithLoading.js';
import DotsCircle from '../ui/Animations/DotsCircle.jsx';
import requestHistory from '../state/actions/requestHistory.js';
import Database from '../ui/Icons/Database.jsx';

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
    },
    listItem: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
};

const MENU_FORCE_VAULTS = 'MENU_FORCE_VAULTS';
const MENU_SHOW_CONSOLE = 'MENU_SHOW_CONSOLE';
const MENU_LOG_OUT = 'MENU_LOG_OUT';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Bar extends React.PureComponent {
    state = {
        isMenuOpen: false,
        isLoading: false,
    };

    render() {
        const {isMenuOpen, isLoading} = this.state;
        const reloadIcon = isLoading ? DotsCircle : Reload;
        return (
            <div css={SX.root}>
                <Button icon={Menu} cssNormal={SX.btn} onClick={this.onMenuClick} variant={'inverted'} />
                <Button label={'2 500'} cssNormal={SX.btnGrow} onClick={this.onMenuClick} variant={'inverted'} />
                <Button icon={reloadIcon} cssNormal={SX.btn} onClick={this.onReloadClick} variant={'inverted'} />
                <SideMenu
                    isOpen={isMenuOpen}
                    onClose={this.onMenuClose}
                    onClick={this.onMenuChoice}
                    title={'Money'}
                    list={this.memoMenuList()}
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
        this.setState({
            isMenuOpen: true,
        });
    };

    /**
     *
     */
    onMenuClose = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
        });
    };

    /**
     *
     */
    onMenuChoice = async ({name}) => {
        switch (name) {
            case MENU_FORCE_VAULTS:
                await requestHistory(true);
                this.setState({
                    isMenuOpen: false,
                });
                break;
            case MENU_SHOW_CONSOLE:
                localStorage.setItem('console', 'emulated');
                window.location.reload();
                break;
            case MENU_LOG_OUT:
                await localforage.removeItem(STORE_KEY);
                window.location.reload();
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
        window.scrollTo(0, 0);
        window.location.reload();
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
    memoMenuList = memoize(() => {
        const list = [];
        list.push(
            ...[
                {
                    name: MENU_FORCE_VAULTS,
                    icon: Database,
                    label: 'Recheck vaults',
                },
                {
                    name: MENU_SHOW_CONSOLE,
                    icon: Console,
                    label: 'Show console',
                },
                {
                    name: MENU_LOG_OUT,
                    icon: LocationExit,
                    label: 'Log out',
                },
            ],
        );
        return list;
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Bar.propTypes = {
    // -------------------------------- redux:
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(Bar);
