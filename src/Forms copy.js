import React, { useState, useRef, useEffect } from 'react'
import RadioButtons from './RadioButtons'
import DropDown from './DropDown'
import Table from './Table'
import axios from 'axios'
import emailjs from '@emailjs/browser'
import './Forms.css'
import logo from './logo.png'

const Forms = () => {
  const form = useRef()

  useEffect(() => emailjs.init('-jXBNVhR-1idlAk36'), [])

  const categoryOptions = [
    { label: 'NGAs', value: 'NGAs' },
    { label: 'GOCCs', value: 'GOCCs' },
    { label: 'LWDs', value: 'LWDs' },
    { label: 'LGUs', value: 'LGUs' },
    { label: 'SUCs', value: 'SUCs' },
    { label: 'Others', value: 'Others' },
  ]

  const grantOptions = [
    { label: 'YES', value: 'YES' },
    { label: 'NO', value: 'NO' },
  ]

  const [_year, setYear] = useState('')
  const [category, setCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [agency, setAgency] = useState('')
  const [showNGA, setShowNGA] = useState(false)
  const [showGOCC, setShowGOCC] = useState(false)
  const [showLWD, setShowLWD] = useState(false)
  const [showLGU, setShowLGU] = useState(false)
  const [showSUC, setShowSUC] = useState(false)
  const [university, setUniversity] = useState('')
  const [showOthers, setShowOthers] = useState(false)
  const [nameGOCC, setGOCCName] = useState('')
  const [nameLWD, setLWDName] = useState('')
  const [provinceLGU, setLGUProvince] = useState('')
  const [cityMunicipalLGU, setLGUCityMunicipal] = useState('')
  const [nameSUC, setSUCName] = useState('')
  const [nameOthers, setOthersName] = useState('')
  const [submitName, setSubmitName] = useState('')
  const [designation, setDesignation] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [email, setEmail] = useState('')
  const [agencyHead, setAgencyHead] = useState('')
  const [_grant, setGrant] = useState('')
  const [showYES, setShowYES] = useState(false)
  const [showNO, setShowNO] = useState(false)
  const [contactOfService, setContractOfService] = useState(0)
  const [jobOrder, setJobOrder] = useState(0)
  const [minimumRate, setMinimumRate] = useState('')
  const [maximumRate, setMaximumRate] = useState('')
  const [projects, setProjects] = useState([])
  const [tallyRangeA, setTallyRangeA] = useState(0)
  const [tallyRangeB, setTallyRangeB] = useState(0)
  const [tallyRangeC, setTallyRangeC] = useState(0)
  const [tallyRangeD, setTallyRangeD] = useState(0)
  const [tallyRangeE, setTallyRangeE] = useState(0)
  const [nonGrantReason, setNonGrantReason] = useState('')
  const [reportFile, setReportFile] = useState(null)
  const [timeSubmitted, setTimeSubmitted] = useState(null)
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [agencyOptions, setAgencyOptions] = useState([])
  const [universityOptions, setUniversityOptions] = useState([])
  const [sendReceipt, setSendReceipt] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (department !== '') {
      fetchAgencies(department)
    }
  }, [department])

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost/forms/api/departments.php')
      if (!response.ok) {
        throw new Error('Failed to fetch departments')
      }
      const data = await response.json()
      setDepartmentOptions(data)
    } catch (error) {
      console.error('Error fetching departments:', error.message)
    }
  }

  const fetchAgencies = async (departmentId) => {
    try {
      const response = await fetch(
        `http://localhost/forms/api/departments.php?department_id="${departmentId}"`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch agencies')
      }
      const data = await response.json()
      setAgencyOptions(data)
    } catch (error) {
      console.error('Error fetching agencies:', error.message)
    }
  }

  const fetchUniversities = async () => {
    try {
      const response = await fetch(
        'http://localhost/forms/api/universities.php'
      )
      if (!response.ok) {
        throw new Error('Failed to fetch universities')
      }
      const data = await response.json()
      setUniversityOptions(data)
    } catch (error) {
      console.error('Error fetching universities:', error.message)
    }
  }

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    if (event.target.value === 'NGAs') {
      setShowNGA(true)
      setShowGOCC(false)
      setShowLWD(false)
      setShowLGU(false)
      setShowSUC(false)
      setShowOthers(false)
    } else if (event.target.value === 'GOCCs') {
      setShowNGA(false)
      setShowGOCC(true)
      setShowLWD(false)
      setShowLGU(false)
      setShowSUC(false)
      setShowOthers(false)
    } else if (event.target.value === 'LWDs') {
      setShowNGA(false)
      setShowGOCC(false)
      setShowLWD(true)
      setShowLGU(false)
      setShowSUC(false)
      setShowOthers(false)
    } else if (event.target.value === 'LGUs') {
      setShowNGA(false)
      setShowGOCC(false)
      setShowLWD(false)
      setShowLGU(true)
      setShowSUC(false)
      setShowOthers(false)
    } else if (event.target.value === 'SUCs') {
      setShowNGA(false)
      setShowGOCC(false)
      setShowLWD(false)
      setShowLGU(false)
      setShowSUC(true)
      setShowOthers(false)
    } else if (event.target.value === 'Others') {
      setShowNGA(false)
      setShowGOCC(false)
      setShowLWD(false)
      setShowLGU(false)
      setShowSUC(false)
      setShowOthers(true)
    } else {
      setShowNGA(false)
      setShowGOCC(false)
      setShowLWD(false)
      setShowLGU(false)
      setShowSUC(false)
      setShowOthers(false)
    }
  }

  const handleAgencyChange = (event) => {
    setAgency(event.target.value)
  }

  const handleUniversityChange = (event) => {
    setUniversity(event.target.value)
  }

  const handleGrantChange = (event) => {
    setGrant(event.target.value)
    if (event.target.value === 'YES') {
      setShowYES(true)
      setShowNO(false)
    } else if (event.target.value === 'NO') {
      setShowYES(false)
      setShowNO(true)
    } else {
      setShowYES(false)
      setShowNO(false)
    }
  }

  const handleSendReceipt = () => {
    setSendReceipt(!sendReceipt)
  }

  const computeTotalAmount = () => {
    let totalAmount = 0
    for (const item of projects) {
      totalAmount += parseFloat(item.amount)
    }
    return totalAmount
  }

  const refreshForm = () => {
    setYear('')
    setCategory('')
    setDepartment('')
    setAgency('')
    setShowNGA(false)
    setShowGOCC(false)
    setShowLWD(false)
    setShowLGU(false)
    setShowSUC(false)
    setUniversity('')
    setShowOthers(false)
    setGOCCName('')
    setLWDName('')
    setLGUProvince('')
    setLGUCityMunicipal('')
    setSUCName('')
    setOthersName('')
    setSubmitName('')
    setDesignation('')
    setContactNumber('')
    setEmail('')
    setAgencyHead('')
    setGrant('')
    setShowYES(false)
    setShowNO(false)
    setContractOfService(0)
    setJobOrder(0)
    setMinimumRate('')
    setMaximumRate('')
    setProjects([])
    setTallyRangeA(0)
    setTallyRangeB(0)
    setTallyRangeC(0)
    setTallyRangeD(0)
    setTallyRangeE(0)
    setNonGrantReason('')
    setReportFile(null)
    setTimeSubmitted(null)
    setSendReceipt(false)
    window.location.reload()
  }

  const handleFileChange = (e) => {
    setReportFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const timeNow = new Date().getTime()
    setTimeSubmitted(timeNow)

    const projectsJSON = JSON.stringify(projects)

    const formData = new FormData()

    formData.append('submitName', submitName)
    formData.append('designation', designation)
    formData.append('contactNumber', contactNumber)
    formData.append('email', email)
    formData.append('_year', _year)
    formData.append('category', category)
    formData.append('department', department)
    formData.append('agency', agency)
    formData.append('university', university)
    formData.append('nameGOCC', nameGOCC)
    formData.append('nameLWD', nameLWD)
    formData.append('provinceLGU', provinceLGU)
    formData.append('cityMunicipalLGU', cityMunicipalLGU)
    formData.append('nameSUC', nameSUC)
    formData.append('nameOthers', nameOthers)
    formData.append('agencyhead', agencyHead)
    formData.append('_grant', _grant)
    formData.append('contractOfService', contactOfService)
    formData.append('jobOrder', jobOrder)
    formData.append('minimumRate', minimumRate)
    formData.append('maximumRate', maximumRate)
    formData.append('projects', projectsJSON)
    formData.append('tallyRangeA', tallyRangeA)
    formData.append('tallyRangeB', tallyRangeB)
    formData.append('tallyRangeC', tallyRangeC)
    formData.append('tallyRangeD', tallyRangeD)
    formData.append('tallyRangeE', tallyRangeE)
    formData.append('nonGrantReason', nonGrantReason)
    formData.append('file', reportFile)

    try {
      const res = await axios.post(
        'http://localhost/forms/api/responses.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      console.log('Response:', res.data)
    } catch (error) {
      console.error('Error:', error)
    }

    const adminEmail = 'ivandimauga1994@gmail.com'
    try {
      await emailjs.send('service_bstgv8c', 'template_nncltxl', {
        name: submitName,
        email: adminEmail,
      })
      alert('Submitted Successfully')
    } catch (error) {
      console.log(error)
    }

    if (sendReceipt == true) {
      try {
        await emailjs.send('service_bstgv8c', 'template_vlo8xm6', {
          name: submitName,
          email: email,
        })
        alert('Check Your Inbox')
      } catch (error) {
        console.log(error)
      }
    }

    refreshForm()
  }

  return (
    <form ref={form} encType="multipart/form-data">
      <div className="background">
        <div className="container">
          <img className="header-img" src={logo} alt="Header Image" />
          <h1>Summary of Reports on the Payment of Gratuity Pay</h1>
          <hr />
          <h2>Department / Agency Information</h2>
          <div>
            <label className="dai-inside">
              Year:{' '}
              <input
                className="category-input"
                onChange={(e) => setYear(e.target.value)}
              ></input>
            </label>
            <br />
            <label className="dai-inside">
              Category{' '}
              <RadioButtons
                selection={category}
                handleChange={handleCategoryChange}
                categoryOptions={categoryOptions}
              />
            </label>
            <br />

            <label className="dai-outside">
              {showNGA && (
                <div>
                  <h2>NGAs</h2>
                  <hr />
                  <label className="dai-inside">
                    Department Name:{' '}
                    <DropDown
                      selection={department}
                      handleChange={handleDepartmentChange}
                      dropDownOptions={departmentOptions}
                    />
                  </label>
                  <br />
                  <label className="dai-inside">
                    Agency Name:{' '}
                    <DropDown
                      selection={agency}
                      handleChange={handleAgencyChange}
                      dropDownOptions={agencyOptions}
                    />
                  </label>
                </div>
              )}
              {showGOCC && (
                <div>
                  <h2>GOCCs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of GOCCs:{' '}
                    <input
                      className="category-input"
                      onChange={(e) => setGOCCName(e.target.value)}
                    ></input>
                  </label>
                </div>
              )}
              {showLWD && (
                <div>
                  <h2>LWDs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of LWDs:{' '}
                    <input
                      className="category-input"
                      onChange={(e) => setLWDName(e.target.value)}
                    ></input>
                  </label>
                </div>
              )}
              {showLGU && (
                <div>
                  <h2>LGUs</h2>
                  <hr />
                  <label className="dai-inside">
                    Province:{' '}
                    <input
                      className="category-input"
                      onChange={(e) => setLGUProvince(e.target.value)}
                    ></input>
                  </label>
                  <br />
                  <label className="dai-inside">
                    City / Municipality:{' '}
                    <input
                      className="category-input"
                      onChange={(e) => setLGUCityMunicipal(e.target.value)}
                    ></input>
                  </label>
                </div>
              )}
              {showSUC && (
                <div>
                  <h2>SUCs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of SUCs:{' '}
                    <DropDown
                      selection={university}
                      handleChange={handleUniversityChange}
                      dropDownOptions={universityOptions}
                    />
                  </label>
                </div>
              )}
              {showOthers && (
                <div>
                  <h2>Others</h2>
                  <hr />
                  <label className="dai-inside">
                    Others:{' '}
                    <input
                      className="category-input"
                      onChange={(e) => setOthersName(e.target.value)}
                    ></input>
                  </label>
                </div>
              )}
            </label>
          </div>
          <br />

          <h2>Submitted By:</h2>
          <hr />
          <div>
            <label className="sb-name">
              Name:{' '}
              <input
                className="submittedby-input"
                onChange={(e) => setSubmitName(e.target.value)}
              ></input>
            </label>
            <label className="sb-others">
              Designation:{' '}
              <input
                className="submittedby-input"
                onChange={(e) => setDesignation(e.target.value)}
              ></input>
            </label>
            <label className="sb-others">
              Contact Number:{' '}
              <input
                className="submittedby-input"
                onChange={(e) => setContactNumber(e.target.value)}
              ></input>
            </label>
            <label className="sb-others">
              Email:{' '}
              <input
                className="submittedby-input"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>
            <br />
            <br />
          </div>

          <h2>Certified By:</h2>
          <hr />
          <div>
            <label className="cb-inside">
              Agency Head:{' '}
              <input
                className="agencyhead-input"
                onChange={(e) => setAgencyHead(e.target.value)}
              ></input>
            </label>
            <br />
            <label className="cb-inside">
              Did your Departments/Agency/Institution grant the FY 2023 SRI{' '}
              <div className="cb-radio">
                <RadioButtons
                  selection={_grant}
                  handleChange={handleGrantChange}
                  categoryOptions={grantOptions}
                />
              </div>
            </label>
            <br />
          </div>

          {showYES && (
            <div>
              <h2>If Granted Gratuity Pay</h2>
              <hr />
              <h3>Number of Qualified Workers</h3>
              <label className="cb-inside">
                Contract of Service:
                <input
                  className="iggp-input"
                  type="number"
                  onChange={(e) => setContractOfService(e.target.value)}
                ></input>
              </label>
              <label className="cb-inside">
                Job Order:
                <input
                  className="iggp-input"
                  type="number"
                  onChange={(e) => setJobOrder(e.target.value)}
                ></input>
              </label>
              <label className="cb-inside">
                Total: {parseInt(contactOfService) + parseInt(jobOrder)}
              </label>

              <h3>Amount Granted to Workers</h3>
              <label className="cb-inside">
                Minimum Rate:
                <input
                  className="iggp-input"
                  type="number"
                  step="0.01"
                  onChange={(e) => setMinimumRate(e.target.value)}
                ></input>
              </label>
              <label className="cb-inside">
                Maximum Rate:
                <input
                  className="iggp-input"
                  type="number"
                  step="0.01"
                  onChange={(e) => setMaximumRate(e.target.value)}
                ></input>
              </label>
              <br />
              <br />

              <h2>Fund Sources</h2>
              <hr />
              <div>
                <Table projects={projects} setProjects={setProjects} />
                <div className="fs-total">
                  Total Amount: {computeTotalAmount()}
                </div>
              </div>
              <br />

              <h2>Tally of Recipients per Amount/Range</h2>
              <hr />
              <div>
                <label className="trar-inside-2k">
                  Below P2,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) => setTallyRangeA(e.target.value)}
                  ></input>
                </label>
                <label className="trar-inside">
                  P2,001 - P3,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) => setTallyRangeB(e.target.value)}
                  ></input>
                </label>
                <label className="trar-inside">
                  P3,001-P4,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) => setTallyRangeC(e.target.value)}
                  ></input>
                </label>
                <label className="trar-inside">
                  P4,001 - P4,999{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) => setTallyRangeD(e.target.value)}
                  ></input>
                </label>
                <label className="trar-inside">
                  P5,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) => setTallyRangeD(e.target.value)}
                  ></input>
                </label>
                <label className="trar-inside">
                  Total:{' '}
                  {parseInt(tallyRangeA) +
                    parseInt(tallyRangeB) +
                    parseInt(tallyRangeC) +
                    parseInt(tallyRangeD) +
                    parseInt(tallyRangeE)}
                </label>
              </div>
            </div>
          )}

          {showNO && (
            <div>
              <h2>If the Gratuity Pay is not Granted</h2>
              <hr />
              <label className="cb-inside">
                Please state reason/s for non-grant{' '}
                <input
                  className="iggpn-input"
                  onChange={(e) => setNonGrantReason(e.target.value)}
                ></input>
              </label>
            </div>
          )}
          <br />

          <h2>Upload Report</h2>
          <hr />
          <p className="ur-p">
            File name shall be &lt;deptname&gt; &lt;agencyname&gt; AnnexA
            FY2023GP
          </p>
          <label className="ur-inside">
            Report:{' '}
            <input
              className="ur-input"
              type="file"
              name="file"
              id="file"
              onChange={handleFileChange}
            />
          </label>
          <br />
          <br />

          <div>
            <hr />
            <button
              className="submit-button"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <label className="ur-inside">
              <input
                type="checkbox"
                checked={sendReceipt}
                onChange={handleSendReceipt}
              />{' '}
              Send me a receipt of my response
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Forms
