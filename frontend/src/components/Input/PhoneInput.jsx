import { useState } from 'react'

const PhoneInput = ({ text, value, onChange, disabled = false, required = false }) => {
  const [formattedValue, setFormattedValue] = useState(value)

  const formatPhoneNumber = (input) => {
    // Remover todos los caracteres no numéricos
    const cleaned = input.replace(/\D/g, '')
    // Limitar a 8 dígitos
    const limited = cleaned.slice(0, 8)
    // Formatear como 0000-0000
    if (limited.length >= 5) {
      return limited.slice(0, 4) + '-' + limited.slice(4)
    } else {
      return limited
    }
  }
  const handleChange = (e) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    setFormattedValue(formatted)
    // Pasar solo los números al componente padre
    const numbersOnly = formatted.replace(/\D/g, '')
    onChange({ target: { name: e.target.name, value: numbersOnly } })
  }
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm text-[#3D1609] font-[Nunito]">{text}</label>
      <input 
        type="text" 
        value={formattedValue} 
        onChange={handleChange} 
        placeholder="0000-0000" 
        disabled={disabled} 
        required={required} 
        maxLength={9}
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Alexandria] placeholder-[#39312f] transition focus:border-[#A73249] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  )
}
export default PhoneInput