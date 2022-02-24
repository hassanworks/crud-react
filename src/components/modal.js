import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '50%'
  },
}));



export default function TransitionsModal({ open, close, users, onChangeHandle, person }) {
  const classes = useStyles();
  const [isClose, setIsClose] = React.useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  console.log("users ", users);
  console.log("person ", person);

  const onCreate = () => {
    console.log("dsadasds", person);
    fetch(`http://172.16.20.18:4000/subprocessor/`, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(person) })
      .then(res => res.json())
      .then(
        (result) => {
        }
      )
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 className="text-center">ADD USER</h2>
          <form onSubmit={onCreate} className="d-flex flex-column">
            <input className="mb-3" type="text" placeholder="Name" value={users.name} name="name" onChange={onChangeHandle} required />
            <input className="mb-3" type="text" placeholder="Purpose" value={users.purpose} name="purpose" onChange={onChangeHandle} required />
            <input className="mb-3" type="text" placeholder="Location" value={users.location} name="location" onChange={onChangeHandle} required />
            <div>
              <button type="submit" className="btn btn-primary w-50">ADD</button>
              <button className="btn btn-danger w-50" onClick={() => setIsClose(close)}>CLOSE</button>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
}