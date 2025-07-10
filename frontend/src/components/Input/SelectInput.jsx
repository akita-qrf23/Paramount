const SelectInput = ({ text, value, onChange, options, placeholder, disabled = false, required = false }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm text-[#3D1609] font-[Nunito]">{text}</label>
      <select 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
        required={required} 
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Alexandria] transition focus:border-[#A73249] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
export default SelectInput