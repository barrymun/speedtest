import React from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';

import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {orange, green} from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRedoAlt, faPause} from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    button: {
        boxShadow: `none`,
        backgroundColor: `transparent`,
        '&:hover': {
            backgroundColor: `transparent`,
        },
    },
    buttonNotLoading: {
        border: `2px solid ${green[500]}`,
    },
    fabProgress: {
        color: orange[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: orange[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default function CircularIntegration(props) {
    const classes = useStyles();
    const {loading, setLoading} = props;

    const buttonClassname = clsx({
        [classes.button]: true,  // always active
        [classes.buttonNotLoading]: !loading,
    });

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Fab
                    aria-label="speedtest"
                    // color="primary"
                    className={buttonClassname}
                    onClick={setLoading}
                >
                    {loading ?
                        (
                            <FontAwesomeIcon
                                icon={faPause}
                            />
                        ) :
                        (
                            <FontAwesomeIcon
                                icon={faRedoAlt}
                                // className={`refreshIcon`}
                            />
                        )
                    }
                </Fab>
                {/* the progress icon will remove the ability to click */}
                {loading && <CircularProgress size={68} className={classes.fabProgress}/>}
            </div>
        </div>
    );
}

CircularIntegration.propTypes = {
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
};