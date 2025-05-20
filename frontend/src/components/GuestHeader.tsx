import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="shadow-md flex flex-col md:flex-row justify-around items-center py-4 px-2 bg-white">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">MyApp</h1>
            <nav>
                <ul className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <li>
                        <Link to="/" className="no-underline text-black hover:bg-gray-100 hover:shadow-md transition rounded px-4 py-2 block text-center">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="no-underline text-black hover:bg-gray-100 hover:shadow-md transition rounded px-4 py-2 block text-center">
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link to="/signup" className="no-underline text-black hover:bg-gray-100 hover:shadow-md transition rounded px-4 py-2 block text-center">
                            Sign Up
                        </Link>
                    </li>
                </ul>
            </nav>

        </header>
    );
};

export default Header;
