import React, { useState, useEffect } from 'react'
import './Responses.css'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const Responses = () => {
  const [data, setData] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    fetch('http://localhost/forms/api/responses.php')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error))
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = () => {
    const sortableData = [...data]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼'
    }
    return '▲'
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredData = sortedData().filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const exportToExcel = () => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    // Construct the worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      // Header row
      [
        'Name',
        'Designation',
        'Contact Number',
        'Email',
        'Year',
        'Category',
        'Department Name',
        'Agency Name',
        'Name of SUC',
        'Projects',
        'Name of GOCCs',
        'Name of LWDs',
        'Province',
        'City/Municipality',
        'Name of SUCs',
        'Other Agency Category',
        'Agency Head',
        'FY 2023 SRI Grant?',
        'Contract of Service',
        'Job Order',
        'Minimum Rate',
        'Maximum Rate',
        'Tally Range A',
        'Tally Range B',
        'Tally Range C',
        'Tally Range D',
        'Tally Range E',
        'Non-Grant Reason',
        'Filename',
        'Filesize',
        'Filetype',
      ],
      // Data rows
      ...filteredData.map((item) => [
        item.submitName,
        item.designation,
        item.contactNumber,
        item.email,
        item._year,
        item.category,
        item.department,
        item.agency,
        item.university,
        item.projects
          .map(
            (project) =>
              `${project.projectName}(${project.expenditureObject}): ${project.amount}`
          )
          .join('\n'),
        item.nameGOCC,
        item.nameLWD,
        item.provinceLGU,
        item.cityMunicipalLGU,
        item.nameSUC,
        item.nameOthers,
        item.agencyHead,
        item._grant,
        item.contractOfService,
        item.jobOrder,
        item.minimumRate,
        item.maximumRate,
        item.tallyRangeA,
        item.tallyRangeB,
        item.tallyRangeC,
        item.tallyRangeD,
        item.tallyRangeE,
        item.nonGrantReason,
        item.filename,
        item.filesize,
        item.filetype,
      ]),
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'data')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

    const blob = new Blob([excelBuffer], { type: fileType })

    saveAs(blob, 'gratuity_table_data' + fileExtension)
  }

  const exportToPDF = () => {
    const input = document.getElementById('table-to-export')

    // Extract data for the first 9 columns
    const tableData = []
    const numRows = filteredData.length
    for (let i = 0; i < numRows; i++) {
      const rowData = []
      for (let j = 0; j < 9; j++) {
        rowData.push(filteredData[i][Object.keys(filteredData[i])[j]])
      }
      tableData.push(rowData)
    }

    // Generate PDF
    const pdf = new jsPDF()
    pdf.autoTable({
      head: [
        // Header row
        [
          'Name',
          'Designation',
          'Contact Number',
          'Email',
          'Year',
          'Category',
          'Department Name',
          'Agency Name',
          'Name of SUC',
        ],
      ],
      body: tableData,
      styles: {
        fontSize: 4,
      },
      headStyles: {
        fontSize: 6,
        fillColor: [169, 169, 169],
      },
    })

    // Save the PDF
    pdf.save('gratuity_table_data.pdf')
  }

  return (
    <div className="res-container">
      <div className="res-header-container">
        <input
          className="res-search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="res-export-button" onClick={exportToExcel}>
          Export to Excel
        </button>
        <button className="res-export-button" onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>
      <div className="res-table-wrapper">
        <table className="res-table" id="table-to-export">
          <thead>
            <tr className="res-tr-header">
              <th className="res-th" onClick={() => handleSort('submitName')}>
                Name {getSortIcon('submitName')}
              </th>
              <th className="res-th" onClick={() => handleSort('designation')}>
                Designation {getSortIcon('designation')}
              </th>
              <th
                className="res-th"
                onClick={() => handleSort('contactNumber')}
              >
                Contact Number {getSortIcon('contactNumber')}
              </th>
              <th className="res-th" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th className="res-th" onClick={() => handleSort('_year')}>
                Year {getSortIcon('_year')}
              </th>
              <th className="res-th" onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </th>
              <th className="res-th" onClick={() => handleSort('department')}>
                Department Name {getSortIcon('department')}
              </th>
              <th className="res-th" onClick={() => handleSort('agency')}>
                Agency Name {getSortIcon('agency')}
              </th>
              <th className="res-th" onClick={() => handleSort('nameSUC')}>
                Name of SUC {getSortIcon('nameSUC')}
              </th>
              <th className="res-th" onClick={() => handleSort('nameGOCC')}>
                Name of GOCCs {getSortIcon('nameGOCC')}
              </th>
              <th className="res-th" onClick={() => handleSort('nameLWD')}>
                Name of LWDs {getSortIcon('nameLWD')}
              </th>
              <th className="res-th" onClick={() => handleSort('provinceLGU')}>
                Province {getSortIcon('provinceLGU')}
              </th>
              <th
                className="res-th"
                onClick={() => handleSort('cityMunicipalLGU')}
              >
                City/Municipality {getSortIcon('cityMunicipalLGU')}
              </th>
              <th className="res-th" onClick={() => handleSort('nameSUC')}>
                Name of SUCs {getSortIcon('nameSUC')}
              </th>
              <th className="res-th" onClick={() => handleSort('nameOthers')}>
                Other Agency Category {getSortIcon('nameOthers')}
              </th>
              <th className="res-th" onClick={() => handleSort('agencyHead')}>
                Agency Head {getSortIcon('agencyHead')}
              </th>
              <th className="res-th" onClick={() => handleSort('_grant')}>
                FY 2023 SRI Grant? {getSortIcon('_grant')}
              </th>
              <th
                className="res-th"
                onClick={() => handleSort('contractOfService')}
              >
                Contract of Service {getSortIcon('contractOfService')}
              </th>
              <th className="res-th" onClick={() => handleSort('jobOrder')}>
                Job Order {getSortIcon('jobOrder')}
              </th>
              <th className="res-th" onClick={() => handleSort('minimumRate')}>
                Minimum Rate {getSortIcon('minimumRate')}
              </th>
              <th className="res-th" onClick={() => handleSort('maximumRate')}>
                Maximum Rate {getSortIcon('maximumRate')}
              </th>
              <th className="res-th" onClick={() => handleSort('projects')}>
                Projects {getSortIcon('projects')}
              </th>
              <th className="res-th" onClick={() => handleSort('tallyRangeA')}>
                Tally Range A {getSortIcon('tallyRangeA')}
              </th>
              <th className="res-th" onClick={() => handleSort('tallyRangeB')}>
                Tally Range B {getSortIcon('tallyRangeB')}
              </th>
              <th className="res-th" onClick={() => handleSort('tallyRangeC')}>
                Tally Range C {getSortIcon('tallyRangeC')}
              </th>
              <th className="res-th" onClick={() => handleSort('tallyRangeD')}>
                Tally Range D {getSortIcon('tallyRangeD')}
              </th>
              <th className="res-th" onClick={() => handleSort('tallyRangeE')}>
                Tally Range E {getSortIcon('tallyRangeE')}
              </th>
              <th
                className="res-th"
                onClick={() => handleSort('nonGrantReason')}
              >
                Non-Grant Reason {getSortIcon('nonGrantReason')}
              </th>
              <th className="res-th" onClick={() => handleSort('filename')}>
                Filename {getSortIcon('filename')}
              </th>
              <th className="res-th" onClick={() => handleSort('filesize')}>
                Filesize {getSortIcon('filesize')}
              </th>
              <th className="res-th" onClick={() => handleSort('filetype')}>
                Filetype {getSortIcon('filetype')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="res-td">{item.submitName}</td>
                <td className="res-td">{item.designation}</td>
                <td className="res-td">{item.contactNumber}</td>
                <td className="res-td">{item.email}</td>
                <td className="res-td">{item._year}</td>
                <td className="res-td">{item.category}</td>
                <td className="res-td">{item.department}</td>
                <td className="res-td">{item.agency}</td>
                <td className="res-td">{item.university}</td>
                <td className="res-td">{item.nameGOCC}</td>
                <td className="res-td">{item.nameLWD}</td>
                <td className="res-td">{item.provinceLGU}</td>
                <td className="res-td">{item.cityMunicipalLGU}</td>
                <td className="res-td">{item.nameSUC}</td>
                <td className="res-td">{item.nameOthers}</td>
                <td className="res-td">{item.agencyHead}</td>
                <td className="res-td">{item._grant}</td>
                <td className="res-td">{item.contractOfService}</td>
                <td className="res-td">{item.jobOrder}</td>
                <td className="res-td">{item.minimumRate}</td>
                <td className="res-td">{item.maximumRate}</td>
                <td className="res-td">
                  {item.projects ? JSON.stringify(item.projects) : '-'}
                </td>
                <td className="res-td">{item.tallyRangeA}</td>
                <td className="res-td">{item.tallyRangeB}</td>
                <td className="res-td">{item.tallyRangeC}</td>
                <td className="res-td">{item.tallyRangeD}</td>
                <td className="res-td">{item.tallyRangeE}</td>
                <td className="res-td">{item.nonGrantReason}</td>
                <td className="res-td">{item.filename}</td>
                <td className="res-td">{item.filesize}</td>
                <td className="res-td">{item.filetype}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Responses
