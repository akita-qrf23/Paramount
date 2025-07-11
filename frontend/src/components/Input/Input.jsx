const TextInput = ({ name, text, value, onChange, placeholder, type = "text", disabled = false, required = false }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} required={required} className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}/>
    </div>
  )
}
export default TextInput