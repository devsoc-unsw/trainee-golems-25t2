import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.png";

interface NavbarProps {
	brandName?: string;
}

export const Navbar = ({ brandName = "StuVerse" }: NavbarProps) => {
	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo and Brand - closer together */}
					<div className="flex items-center space-x-3">
						<img src={logo} alt="logo" className="w-10 h-10" />
						<h1 className="text-xl font-bold text-gray-900">
							{brandName}
						</h1>
					</div>

					{/* Navigation Links - centered */}
					<div className="flex space-x-8">
						<Link
							to="/about"
							className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							About
						</Link>
						<Link
							to="/features"
							className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Features
						</Link>
						<Link
							to="/contact"
							className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Contact
						</Link>
					</div>

					{/* Sign In Button - right side */}
					<div className="flex items-center">
						<button className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
							Sign In
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};
