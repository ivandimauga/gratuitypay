const DropDown = ({ selection, handleChange, dropDownOptions }) => {
  return (
    <select
      className="select-dropdown"
      value={selection}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option className="option-dropdown" value="" disabled>
        Select an option
      </option>
      {dropDownOptions.map((option) => (
        <option className="option-dropdown" key={option.id} value={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

export default DropDown
