export const FormInput = ({ label, type, onChange, placeholder }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <input 
            type={type}
            required
            placeholder={placeholder}
            onChange={onChange}
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-orange border-gray-300 transition-all"
        />
    </div>
);