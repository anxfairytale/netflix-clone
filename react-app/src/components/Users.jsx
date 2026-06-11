import React, { useEffect, useState } from 'react'
import { authApi } from '../services/api'
import { ToastContainer, toast } from 'react-toastify'

function Users() {
    const [users, setUsers] = useState([])
    const [deleteUserId, setDeleteUserId] = useState(null)

    async function getUsers() {
        try {
            const res = await authApi.get('/users')
            setUsers(res.data)
        } catch (err) {
            console.log(err)
            toast.error('Could not fetch users')
        }
    }

    function openDeleteModal(id) {
        setDeleteUserId(id)
    }

    async function confirmDeleteUser() {
        try {
            await authApi.delete(`/users/${deleteUserId}`)

            toast.success('User deleted successfully')

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== deleteUserId)
            )

            setDeleteUserId(null)
        } catch (err) {
            console.log(err)
            toast.error('Oh oh! Cannot delete user, try again')
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="user-page">
            <ToastContainer />

            {deleteUserId && (
                <div className="modal-backdrop">
                    <dialog className="pass-modal" open>
                        <h1>Are you sure?</h1>
                        <p>
                            Deleting a user will delete all of their data and is irreversible.
                        </p>

                        <button onClick={confirmDeleteUser}>Yes</button>
                        <button onClick={() => setDeleteUserId(null)}>No</button>
                    </dialog>
                </div>
            )}

            <table className="approval-table">
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>Name</th>
                        <th>Mail</th>
                        <th>DOB</th>
                        <th>Approved</th>
                        <th>Rejected</th>
                        <th>Pending</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.dob}</td>
                            <td>{u.approvedCount}</td>
                            <td>{u.rejectedCount}</td>
                            <td>{u.pendingCount}</td>
                            <td>
                                <button onClick={() => openDeleteModal(u.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users