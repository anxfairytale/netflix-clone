import React, { useEffect, useState } from 'react'
import { authApi } from '../services/api'
function Users() {
    const [users, setUsers] = useState([])
    async function getUsers() {
        const res = await authApi.get('/users')
        console.log(res)
        setUsers(res.data)
    }
    useEffect(() => {
        getUsers()
    }, [])
    return (
        <div className="user-page">
            <table className="approval-table">
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>Name</th>
                        <th>Mail</th>
                        <th>DOB</th>
                        <th>Aprroved</th>
                        <th>Rejected</th>
                        <th>Pending</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => {
                        return (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.dob}</td>
                                <td>{u.approvedCount}</td>
                                <td>{u.rejectedCount}</td>
                                <td>{u.pendingCount}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
    )
}

export default Users