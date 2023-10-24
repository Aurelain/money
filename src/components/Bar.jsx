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
import {BAR_HEIGHT, BAR_SAFETY, PRIMARY_COLOR, STORE_KEY} from '../SETTINGS.js';
import assume from '../utils/assume.js';
import {addFetchListener, checkIsLoading, removeFetchListener} from '../utils/fetchWithLoading.js';
import Separator from '../ui/Separator.jsx';
import DotsCircle from '../ui/Animations/DotsCircle.jsx';
import Database from '../ui/Icons/Database.jsx';
import requestHistory from '../state/actions/requestHistory.js';
import discoverVault from '../state/actions/discoverVault.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT + BAR_SAFETY,
        zIndex: 100,
        display: 'flex',
        background: PRIMARY_COLOR,
        color: '#fff',
        paddingTop: BAR_SAFETY,
    },
    grow: {
        flexGrow: 1,
    },
    btn: {
        padding: 8,
    },
    hamburger: {
        paddingRight: 64,
    },
    listItem: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    sliver: {
        position: 'absolute',
        inset: 'auto 0 0 0',
        height: 1,
        background: 'rgba(0,0,0,0.1)',
    },
};

const MENU_REFRESH_VAULT = 'MENU_REFRESH_VAULT';
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
                <Button
                    icon={Menu}
                    cssNormal={[SX.btn, SX.hamburger]}
                    onClick={this.onMenuClick}
                    variant={'inverted'}
                />
                <div css={SX.grow} />
                <Button icon={reloadIcon} cssNormal={SX.btn} onClick={this.onReloadClick} variant={'inverted'} />
                <div css={SX.sliver} />
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
            case MENU_REFRESH_VAULT:
                await discoverVault();
                await requestHistory();
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
                Separator,
                {
                    name: MENU_REFRESH_VAULT,
                    icon: Database,
                    label: 'Refresh vault',
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
