// components/GuestHeader.tsx
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="header-shadow">
            <h1 className="app-name">MyApp</h1>
            <nav>
                <ul className="">
                    <li>
                        <Link to="/" className="nav-item">Home</Link>
                    </li>
                    <li>
                        <Link to="/login" className="nav-item">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup" className="nav-item">Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
