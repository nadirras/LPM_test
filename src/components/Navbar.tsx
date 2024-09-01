import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-neutral text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <div tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 shadow text-black text-lg my-3 h-24 p-2">
            <Link to={"/"} className="hover:bg-primary hover:rounded-lg">
              Isi Form
            </Link>
            <Link to={"/list-forms"} className="hover:bg-primary hover:rounded-lg">
              Daftar Form
            </Link>
          </div>
        </div>
        <Link to={"/"} className="btn btn-ghost text-xl">
          LPM
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <div className="menu menu-horizontal px-1 flex gap-3">
          <Link to={"/"} className="hover:bg-gray-600 hover:rounded-lg p-2">
            Isi Form
          </Link>
          <Link to={"/list-forms"} className="hover:bg-gray-600 hover:rounded-lg p-2">
            Daftar Form
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
