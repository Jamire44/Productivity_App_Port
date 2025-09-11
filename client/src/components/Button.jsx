export default function Button({ text, onClick, color }) {
    const base = "px-4 py-2 rounded text-white";
    const colors = {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      red: "bg-red-500 hover:bg-red-600",
    };
  
    return (
      <button onClick={onClick} className={`${base} ${colors[color] || "bg-gray-500"}`}>
        {text}
      </button>
    );
  }
  