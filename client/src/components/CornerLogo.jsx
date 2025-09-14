import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function CornerLogo({ size = 80 }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 50,
      }}
    >
      <Link to="/">
        <Logo style={{ width: size, height: size, cursor: "pointer" }} />
      </Link>
    </div>
  );
}