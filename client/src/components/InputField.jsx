export default function InputField({ type, value, onChange, placeholder }) {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border p-2 rounded w-64"
      />
    );
  }
  