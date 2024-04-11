import React, { useState, useEffect } from 'react'
import './Others.css'

const Table = ({ setProjects }) => {
  const [rows, setRows] = useState([
    { id: 1, projectName: '', expenditureObject: '', amount: '0' },
  ])

  useEffect(() => {
    setProjects(rows)
  }, [rows])

  const onAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      projectName: '',
      expenditureObject: '',
      amount: '0',
    }
    setRows([...rows, newRow])
  }

  const onDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id)
    setRows(updatedRows)
  }

  const handleChange = (e, id, field) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: e.target.value }
      }
      return row
    })
    setRows(updatedRows)
    const projectsData = updatedRows.map(
      ({ projectName, expenditureObject, amount }) => ({
        projectName,
        expenditureObject,
        amount,
      })
    )
    setProjects(projectsData)
  }

  return (
    <div>
      <table className="fs-table">
        <thead>
          <tr className="fs-tr-header">
            <th className="fs-th">Program/Activity/Project</th>
            <th className="fs-th">Object of Expenditure</th>
            <th className="fs-th">Amount</th>
            <th className="fs-th"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="fs-td">
                <input
                  className="fs-td-input"
                  value={row.projectName}
                  onChange={(e) => handleChange(e, row.id, 'projectName')}
                />
              </td>
              <td className="fs-td">
                <input
                  className="fs-td-input"
                  value={row.expenditureObject}
                  onChange={(e) => handleChange(e, row.id, 'expenditureObject')}
                />
              </td>
              <td className="fs-td">
                <input
                  className="fs-td-input"
                  type="number"
                  value={row.amount}
                  onChange={(e) => handleChange(e, row.id, 'amount')}
                />
              </td>
              <td className="fs-td">
                {index === rows.length - 1 && (
                  <button className="fs-add-button" onClick={onAddRow}>
                    +
                  </button>
                )}
                <button
                  className="fs-delete-button"
                  onClick={() => onDeleteRow(row.id)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  )
}

export default Table
