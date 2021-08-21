//imporing modules
//importing firebase
import firebase from "../../utils/firebase";
import Spinner from 'react-spinkit'

//importing hooks
import React, {useState, useEffect} from 'react'
import DiaryCard from '../../components/DiaryCard'
//hook for style material components
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';


//import css files
import '../../normalize.css'
import './diaryPage.css'
//Masonary css for grid
import Masonry from 'react-masonry-css'

import {connect} from "react-redux";

function DiaryHome(props) {

    const ref = firebase.firestore().collection("diary-notes")

    ///States
    const [diaryData, setDiaryData] = useState([]);

    const [open, setOpen] = useState(false); ///using to handle dialog state

    const [color, setColor] = useState({///using to handle form border colors(change to red when errors)
        title: "#3498db",
        description: "#3498db"
    });

    const [formData, setFormData] = useState({///using to handle form data
        title: "",
        description: ""
    });

    const [loading, isLoading] = useState(true)

    ///Use-effect using
    useEffect(() => {
        ref.onSnapshot((snapshot) => {
            let items = []
            snapshot.forEach((doc) => {
                items.push(doc.data())
            })
            setDiaryData(items);
            isLoading(false)
        })
    }, [])

    const styles = makeStyles({///Material UI custom stylings
        btn: {
            color: "white",
            border: "2px solid white",
            '&:hover': {
                background: "white",
                color: "#34495e"
            },
        },
        text: {
            borderRadius: "10px",
            borderWidth: "2px",
            borderColor: `${color.title} !important`,
        },
        areaText: {
            borderRadius: "10px",
            borderWidth: "2px",
            borderColor: `${color.description} !important`,
        },
        hidden: {
            color: '#3498db'
        }
    })

    const clasess = styles()

    const breakpoints = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function submitForm() { ///Handling the forms errors and submission

        if (formData.title.trim().length === 0 && formData.description.trim().length === 0) {
            setColor(prevState => ({
                description: "#ff6b6b",
                title: "#ff6b6b"
            }))
        } else if (formData.title.trim().length === 0) {
            setColor(prevState => ({
                title: "#ff6b6b",
                description: "#3498db",
            }))
        } else if (formData.description.trim().length === 0) {
            setColor(prevState => ({
                title: "#3498db",
                description: "#ff6b6b"
            }))
        } else {
            setColor(prevState => ({
                title: "#3498db",
                description: "#3498db"
            }))
            submitData()
            handleClose()
        }
    }

    function submitData() {
        const data = {
            name: "udara",
            title: formData.title,
            description: formData.description
        }
        ///After submit all the form data will be cleared from the state
        setFormData({
            title: "",
            description: ""
        })
    }

    ///render functions
    function loader() {
        // <h1>Loading</h1>
        if (loading) {
            return <Spinner name='pacman' color="white"/>

        } else {
            return <Masonry
                breakpointCols={breakpoints}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {
                    diaryData.map(e => {
                        return <div className="diary-card">
                            <DiaryCard
                                title={e.title}
                                subtitle={e.name}
                                description={e.description}/>
                        </div>
                    })
                }
            </Masonry>
        }
    }

    return (
        <div className="diary-container fld-clm">
            <AppBar className="appbar" position="static">
                <Toolbar>
                </Toolbar>
            </AppBar>
            <div className="data-form center d-flex">
                <Button
                    className={clasess.btn}
                    variant="outlined" color="primary" onClick={handleClickOpen}>
                    Add Note
                </Button>
                <Dialog
                    fullWidth={true}
                    onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle
                        style={{color: "#ed4c67"}}
                        id="customized-dialog-title" onClose={handleClose}>
                        Add Note
                    </DialogTitle>
                    <DialogContent dividers>
                        <FormControl fullWidth={true}>
                            <TextField
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        title: e.target.value
                                    }))
                                }}
                                InputProps={{
                                    classes: {
                                        notchedOutline: clasess.text,
                                    }
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: clasess.hidden
                                    }
                                }}
                                style={{width: "100%"}}
                                fullWidth={true}
                                id="outlined-basic" label="TITLE" variant="outlined"/>
                            <br/>
                            <TextField
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))
                                }}
                                InputProps={{
                                    classes: {
                                        root: clasess.areaText,
                                        notchedOutline: clasess.areaText
                                    }
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: clasess.hidden
                                    }
                                }}
                                style={{width: "100%"}}
                                fullWidth={true}
                                multiline={4}
                                rows={10}
                                maxRows={10}
                                id="outlined-basic" label="DESCRIPTION" variant="outlined"/>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={() => {
                            submitForm()
                        }} variant={"contained"} color="secondary">
                            SUBMIT
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="data-grid">
                {
                    loader()
                }
            </div>
            <footer class="footer d-flex">
                <Typography style={{paddingBottom: 5}} gutterBottom variant="subtitle1">
                    &copy; 2021 Fcode labs | All the copyrights reserved
                </Typography>
            </footer>
        </div>
    )
}
export default DiaryHome
