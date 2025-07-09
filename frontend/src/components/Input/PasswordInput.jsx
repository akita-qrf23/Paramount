import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const PasswordInput = ({ text, value, onChange, placeholder, disabled = false, required = false }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col w-full relative">
      <label className="mb-1 text-sm text-[#3D1609] font-[Nunito]">{text}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} required={required} className={`w-full bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 pr-10 outline-none text-[#3D1609] font-[Alexandria] placeholder-[#39312f] transition focus:border-[#A73249] [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-password-auto-fill-button]:hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}/>
        <button type="button" onClick={() => setShow(!show)} disabled={disabled} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D1609] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#50352C] transition'}`}> {show ? <FaEyeSlash/> : <FaEye/>}
        </button>
      </div>
    </div>
  )
}
export default PasswordInput