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

  useEffect(() => emailjs.init(process.env.REACT_APP_EMAILJS_API_KEY), [])

  // Admin email
  const adminEmail = 'ivandimauga1994@gmail.com'

  // Radio button options
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

  // Initial state
  const defaultState = {
    _year: '',
    category: '',
    department: '',
    agency: '',
    showNGA: false,
    showGOCC: false,
    showLWD: false,
    showLGU: false,
    showSUC: false,
    university: '',
    showOthers: false,
    nameGOCC: '',
    nameLWD: '',
    provinceLGU: '',
    cityMunicipalLGU: '',
    nameSUC: '',
    nameOthers: '',
    submitName: '',
    designation: '',
    contactNumber: '',
    email: '',
    agencyHead: '',
    _grant: '',
    showYES: false,
    showNO: false,
    contractOfService: 0,
    jobOrder: 0,
    minimumRate: '',
    maximumRate: '',
    projects: [],
    tallyRangeA: 0,
    tallyRangeB: 0,
    tallyRangeC: 0,
    tallyRangeD: 0,
    tallyRangeE: 0,
    nonGrantReason: '',
    file: null,
    departmentOptions: [],
    agencyOptions: [],
    universityOptions: [],
    sendReceipt: false,
  }

  // useState object
  const [state, setState] = useState(defaultState)

  const handleStateChange = (field, value) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  // Effect hooks
  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (state.department !== '') {
      fetchAgencies(state.department)
    }
  }, [state.department])

  useEffect(() => {
    fetchUniversities()
  }, [])

  // Dropdown options
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost/forms/api/departments.php')
      if (!response.ok) {
        throw new Error('Failed to fetch departments')
      }
      const data = await response.json()
      handleStateChange('departmentOptions', data)
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
      handleStateChange('agencyOptions', data)
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
      handleStateChange('universityOptions', data)
    } catch (error) {
      console.error('Error fetching universities:', error.message)
    }
  }

  // Handle hooks
  const handleCategoryChange = (event) => {
    const category = event.target.value
    handleStateChange('category', category)

    const categoryStateMap = {
      NGAs: {
        showNGA: true,
        showGOCC: false,
        showLWD: false,
        showLGU: false,
        showSUC: false,
        showOthers: false,
      },
      GOCCs: {
        showNGA: false,
        showGOCC: true,
        showLWD: false,
        showLGU: false,
        showSUC: false,
        showOthers: false,
      },
      LWDs: {
        showNGA: false,
        showGOCC: false,
        showLWD: true,
        showLGU: false,
        showSUC: false,
        showOthers: false,
      },
      LGUs: {
        showNGA: false,
        showGOCC: false,
        showLWD: false,
        showLGU: true,
        showSUC: false,
        showOthers: false,
      },
      SUCs: {
        showNGA: false,
        showGOCC: false,
        showLWD: false,
        showLGU: false,
        showSUC: true,
        showOthers: false,
      },
      Others: {
        showNGA: false,
        showGOCC: false,
        showLWD: false,
        showLGU: false,
        showSUC: false,
        showOthers: true,
      },
      '': {
        showNGA: false,
        showGOCC: false,
        showLWD: false,
        showLGU: false,
        showSUC: false,
        showOthers: false,
      },
    }

    const newState = categoryStateMap[category] || categoryStateMap['']
    for (const [key, value] of Object.entries(newState))
      handleStateChange(key, value)
  }

  const handleGrantChange = (event) => {
    const grant = event.target.value
    handleStateChange('_grant', grant)

    const grantStateMap = {
      YES: { showYES: true, showNO: false },
      NO: { showYES: false, showNO: true },
      '': { showYES: false, showNO: false },
    }

    const newState = grantStateMap[grant] || grantStateMap['']
    handleStateChange('showYES', newState.showYES)
    handleStateChange('showNO', newState.showNO)
  }

  const handleProjectChange = (projects) => {
    handleStateChange('projects', projects)
  }

  // Helper functions
  const handleSendReceipt = () => {
    handleStateChange('sendReceipt', !state.sendReceipt)
  }

  const computeTotalAmount = () => {
    const { projects } = state

    let totalAmount = 0
    for (const item of projects) {
      totalAmount += parseFloat(item.amount)
    }
    return totalAmount
  }

  const refreshForm = () => {
    setState(defaultState)
    window.location.reload()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleStateChange('file', file)
  }

  const prepareFormData = () => {
    const formData = new FormData()

    const projectsJSON = JSON.stringify(state.projects)

    const dataToAppend = {
      ...state,
    }

    Object.entries(dataToAppend).forEach(([key, value]) => {
      const finalValue = Array.isArray(value) ? JSON.stringify(value) : value
      formData.append(key, finalValue)
    })

    formData.append('projects', projectsJSON)

    return formData
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = prepareFormData()

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

    try {
      await emailjs.send('service_bstgv8c', 'template_nncltxl', {
        name: state.submitName,
        email: adminEmail,
      })
      alert('Submitted Successfully')
    } catch (error) {
      console.log(error)
    }

    if (state.sendReceipt) {
      try {
        await emailjs.send('service_bstgv8c', 'template_vlo8xm6', {
          name: state.submitName,
          email: state.email,
        })
        alert('Check Your Inbox')
      } catch (error) {
        console.log(error)
      }
    }

    refreshForm()
  }

  console.log(state.projects)

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
                type="number"
                value={state._year}
                onChange={(e) => handleStateChange('_year', e.target.value)}
              ></input>
            </label>
            <br />
            <label className="dai-inside">
              Category{' '}
              <RadioButtons
                selection={state.category}
                handleChange={handleCategoryChange}
                categoryOptions={categoryOptions}
              />
            </label>
            <br />

            <label className="dai-outside">
              {state.showNGA && (
                <div>
                  <h2>NGAs</h2>
                  <hr />
                  <label className="dai-inside">
                    Department Name:{' '}
                    <DropDown
                      selection={state.department}
                      handleChange={(value) =>
                        handleStateChange('department', value)
                      }
                      dropDownOptions={state.departmentOptions}
                    />
                  </label>
                  <br />
                  <label className="dai-inside">
                    Agency Name:{' '}
                    <DropDown
                      selection={state.agency}
                      handleChange={(value) =>
                        handleStateChange('agency', value)
                      }
                      dropDownOptions={state.agencyOptions}
                    />
                  </label>
                </div>
              )}
              {state.showGOCC && (
                <div>
                  <h2>GOCCs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of GOCCs:{' '}
                    <input
                      className="category-input"
                      value={state.nameGOCC}
                      onChange={(e) =>
                        handleStateChange('nameGOCC', e.target.value)
                      }
                    ></input>
                  </label>
                </div>
              )}
              {state.showLWD && (
                <div>
                  <h2>LWDs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of LWDs:{' '}
                    <input
                      className="category-input"
                      value={state.nameLWD}
                      onChange={(e) =>
                        handleStateChange('nameLWD', e.target.value)
                      }
                    ></input>
                  </label>
                </div>
              )}

              {state.showLGU && (
                <div>
                  <h2>LGUs</h2>
                  <hr />
                  <label className="dai-inside">
                    Province:{' '}
                    <input
                      className="category-input"
                      value={state.provinceLGU}
                      onChange={(e) =>
                        handleStateChange('provinceLGU', e.target.value)
                      }
                    ></input>
                  </label>
                  <br />
                  <label className="dai-inside">
                    City / Municipality:{' '}
                    <input
                      className="category-input"
                      value={state.cityMunicipalLGU}
                      onChange={(e) =>
                        handleStateChange('cityMunicipalLGU', e.target.value)
                      }
                    ></input>
                  </label>
                </div>
              )}

              {state.showSUC && (
                <div>
                  <h2>SUCs</h2>
                  <hr />
                  <label className="dai-inside">
                    Name of SUCs:{' '}
                    <DropDown
                      selection={state.university}
                      handleChange={(value) =>
                        handleStateChange('university', value)
                      }
                      dropDownOptions={state.universityOptions}
                    />
                  </label>
                </div>
              )}

              {state.showOthers && (
                <div>
                  <h2>Others</h2>
                  <hr />
                  <label className="dai-inside">
                    Others:{' '}
                    <input
                      className="category-input"
                      value={state.nameOthers}
                      onChange={(e) =>
                        handleStateChange('nameOthers', e.target.value)
                      }
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
                value={state.submitName}
                onChange={(e) =>
                  handleStateChange('submitName', e.target.value)
                }
              />
            </label>
            <label className="sb-others">
              Designation:{' '}
              <input
                className="submittedby-input"
                value={state.designation}
                onChange={(e) =>
                  handleStateChange('designation', e.target.value)
                }
              />
            </label>
            <label className="sb-others">
              Contact Number:{' '}
              <input
                className="submittedby-input"
                value={state.contactNumber}
                onChange={(e) =>
                  handleStateChange('contactNumber', e.target.value)
                }
              />
            </label>
            <label className="sb-others">
              Email:{' '}
              <input
                className="submittedby-input"
                type="email"
                value={state.email}
                onChange={(e) => handleStateChange('email', e.target.value)}
              />
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
                value={state.agencyHead}
                onChange={(e) =>
                  handleStateChange('agencyHead', e.target.value)
                }
              />
            </label>
            <br />
            <label className="cb-inside">
              Did your Departments/Agency/Institution grant the FY 2023 SRI{' '}
              <div className="cb-radio">
                <RadioButtons
                  selection={state._grant}
                  handleChange={handleGrantChange}
                  categoryOptions={grantOptions}
                />
              </div>
            </label>
            <br />
          </div>

          {state.showYES && (
            <div>
              <h2>If Granted Gratuity Pay</h2>
              <hr />
              <h3>Number of Qualified Workers</h3>
              <label className="cb-inside">
                Contract of Service:
                <input
                  className="iggp-input"
                  type="number"
                  onChange={(e) =>
                    handleStateChange('contractOfService', e.target.value)
                  }
                />
              </label>
              <label className="cb-inside">
                Job Order:
                <input
                  className="iggp-input"
                  type="number"
                  onChange={(e) =>
                    handleStateChange('jobOrder', e.target.value)
                  }
                />
              </label>
              <label className="cb-inside">
                Total:{' '}
                {parseInt(state.contractOfService) + parseInt(state.jobOrder)}
              </label>

              <h3>Amount Granted to Workers</h3>
              <label className="cb-inside">
                Minimum Rate:
                <input
                  className="iggp-input"
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    handleStateChange('minimumRate', e.target.value)
                  }
                />
              </label>
              <label className="cb-inside">
                Maximum Rate:
                <input
                  className="iggp-input"
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    handleStateChange('maximumRate', e.target.value)
                  }
                />
              </label>
              <br />
              <br />

              <h2>Fund Sources</h2>
              <hr />
              <div>
                <Table
                  projects={state.projects}
                  setProjects={handleProjectChange}
                />
                <div className="fs-total">
                  Total Amount: {computeTotalAmount(state.projects)}
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
                    onChange={(e) =>
                      handleStateChange('tallyRangeA', e.target.value)
                    }
                  />
                </label>
                <label className="trar-inside">
                  P2,001 - P3,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) =>
                      handleStateChange('tallyRangeB', e.target.value)
                    }
                  />
                </label>
                <label className="trar-inside">
                  P3,001-P4,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) =>
                      handleStateChange('tallyRangeC', e.target.value)
                    }
                  />
                </label>
                <label className="trar-inside">
                  P4,001 - P4,999{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) =>
                      handleStateChange('tallyRangeD', e.target.value)
                    }
                  />
                </label>
                <label className="trar-inside">
                  P5,000{' '}
                  <input
                    className="trar-input"
                    type="number"
                    onChange={(e) =>
                      handleStateChange('tallyRangeE', e.target.value)
                    }
                  />
                </label>
                <label className="trar-inside">
                  Total:{' '}
                  {parseInt(state.tallyRangeA) +
                    parseInt(state.tallyRangeB) +
                    parseInt(state.tallyRangeC) +
                    parseInt(state.tallyRangeD) +
                    parseInt(state.tallyRangeE)}
                </label>
              </div>
            </div>
          )}

          {state.showNO && (
            <div>
              <h2>If the Gratuity Pay is not Granted</h2>
              <hr />
              <label className="cb-inside">
                Please state reason/s for non-grant{' '}
                <input
                  className="iggpn-input"
                  onChange={(e) =>
                    handleStateChange('nonGrantReason', e.target.value)
                  }
                />
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
                checked={state.sendReceipt}
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
