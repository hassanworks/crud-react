import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Table } from '@material-ui/core';
import Modal from './components/modal';
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const CustomTableCell = ({ row, name, onChange, editUser }) => (

  <TableCell align="left">
    {!editUser.isEdit || editUser.userId !== row.id ?
      (
        row[name]
      ) :
      <Input
        value={row[name]}
        name={name}
        onChange={(e) => onChange(e, row)}
      />}
  </TableCell>
)

export default function BasicTable() {
  const classes = useStyles();

  // USESTATES
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState({ isEdit: false, userId: null });
  const [person, setPerson] = useState({ name: "", purpose: "", location: "" });
  const [status, setStatus] = useState(false);
  const [userModal, setUserModal] = useState(false);

  // GET API
  useEffect(() => {
    fetch("http://172.16.20.18:4000/subprocessor")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setUsers(result.data);
        }
      ).catch(err => {
        alert("no data Found")
      })
  }, [status])

  // USER EDIT HANDLE
  const onEdit = (id) => {
    setEditUser({ isEdit: true, userId: id })
    const index = users.findIndex((el) => el.id == id)
    setPerson({ ...users[index] })
  }

  // USER UPDATE HANDLE
  const onUpdate = (id) => {
    fetch(`http://172.16.20.18:4000/subprocessor/${id}`, { method: "PATCH", headers: { "Content-type": "application/json" }, body: JSON.stringify(person) })
      .then(res => res.json())
      .then(
        (result) => {
          setStatus(true)
          onCancel()
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  // USER DELETE HANDLE
  const onDelete = (id) => {
    fetch(`http://172.16.20.18:4000/subprocessor/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(
        (result) => {
          setStatus(!status)
          onCancel()
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  // CANCEL UPDATE HANDLE
  const onCancel = () => {
    setEditUser({ isEdit: false, userId: null })
  }

  // INPUT CHANGE HANDLE
  const onChangeHandle = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value })
  }

  const onChange = (e, row) => {
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = users.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setUsers(newRows);
    setPerson((person) => ({ ...person, [name]: value }))
  };

  // MODAL OPEN HANDLE
  const handleModal = () => {
    setUserModal(true)
  }

  // MODAL CLOSE HANDLE
  const handleClose = () => {
    setUserModal(false);
  }

  return (
    <>
      <section className="m-5">
        <div className="d-flex justify-content-between">
          <h2>Subprocessor</h2>
          <button className="btn btn-primary" type="button" onClick={handleModal}>
            Add Subprocessor
          </button>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length && users.map((row) => (
                <TableRow key={row.id}>
                  {/* <TableCell component="th" scope="row"> */}

                  {/* Experiment Starts */}

                  <CustomTableCell {... { row, name: "name", onChange, editUser: editUser }} />
                  <CustomTableCell {... { row, name: "purpose", onChange, editUser: editUser }} />
                  <CustomTableCell {... { row, name: "location", onChange, editUser: editUser }} />

                  {/* Experiment Ends */}


                  {/* {
                      !editUser.isEdit || editUser.userId !== row.id ?
                        row.name
                        :
                        <input type="text" value={users.name} name="name" onChange={onChangeHandle} required />
                    } */}
                  {/* </TableCell> */}
                  {/* <TableCell>
                    {
                      !editUser.isEdit || editUser.userId !== row.id ?
                        row.purpose
                        :
                        <input type="text" value={users.purpose} name="purpose" onChange={onChangeHandle} required />
                    }
                  </TableCell> */}
                  {/* <TableCell>
                    {
                      !editUser.isEdit || editUser.userId !== row.id ?
                        row.location
                        :
                        <form>
                          <input type="text" value={users.location} name="location" onChange={onChangeHandle} required />
                        </form>
                    }
                  </TableCell> */}

                  {/* <TableCell> */}

                  <TableCell>
                    {
                      !editUser.isEdit || editUser.userId !== row.id ?
                        <>
                          <button className="btn btn-primary m-2" onClick={() => onEdit(row.id)}>edit</button>
                          <button className="btn btn-danger" onClick={() => onDelete(window.confirm("Sure bro?") ? row.id : "")}>remove</button>
                        </>
                        :
                        <>
                          <button className="btn btn-primary m-2" type="button" onClick={() => onUpdate(row.id)}>✔</button>
                          <button className="btn btn-danger" type="button" onClick={onCancel}>X</button>
                        </>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {userModal &&
          <Modal
            open={userModal}
            close={handleClose}
            users={users}
            onChangeHandle={onChangeHandle}
            person={person}
          >
          </Modal>}
      </section>
    </>
  );
}
