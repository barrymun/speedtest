import React from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';

import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {green} from '@material-ui/core/colors';
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
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
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
        [classes.buttonSuccess]: loading,
    });

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Fab
                    aria-label="speedtest"
                    color="primary"
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
                {/*{loading && <CircularProgress size={68} className={classes.fabProgress}/>}*/}
            </div>
        </div>
    );
}

CircularIntegration.propTypes = {
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
};