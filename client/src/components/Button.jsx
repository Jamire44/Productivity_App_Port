export default function Button({ text, onClick, variant = "primary" }) {
  const base = "px-4 py-2 rounded-lg font-semibold transition";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-neutral-600 text-gray-100 hover:bg-neutral-500",
    danger: "bg-red-600 text-white hover:bg-red-500", 
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {text}
    </button>
  );
}
