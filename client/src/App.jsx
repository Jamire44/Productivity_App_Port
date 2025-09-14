import Navbar from "./components/Navbar";

export default function App({ children }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
}
