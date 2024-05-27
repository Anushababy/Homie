// Navbar.jsx
import React, { useState } from 'react';
import { IconButton } from "@mui/material";
import { Search, Menu, Person } from "@mui/icons-material"; 
import variables from "../Styles/variables.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; 
import { setLogout } from '../redux/state';
import "../Styles/Navbar.scss";

function Navbar() {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    return (
      <div className="navbar">
        <Link to="/">
          <img src="/assets/logo.png" alt="logo" />
        </Link>
  
        <div className="navbar_search">
          <input
            type="text"
            placeholder="Search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton disabled={search === ""} onClick={() => navigate(`/properties/search/${search}`)}>
            <Search sx={{ color: variables.pinkred }} />
          </IconButton>
        </div>
  
        <div className="navbar_right">
          <Link to={user ? "/create-listing" : "/login"} className="host">
            Become A Host
          </Link>
  
          <button
            className="navbar_right_account"
            onClick={() => setDropdownMenu(!dropdownMenu)}
          >
            <Menu sx={{ color: variables.darkgrey }} /> 
            {!user || !user.profileImagePath ? (
              <Person sx={{ color: variables.darkgrey }} /> 
            ) : (
              <img
                src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`}
                alt="profile"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </button>
  
          {dropdownMenu && !user && (
            <div className="navbar_right_accountmenu">
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}
  
          {dropdownMenu && user && (
            <div className="navbar_right_accountmenu">
              <Link to={`/${user._id}/trips`}>Trip List</Link>
              <Link to={`/${user._id}/wishList`}>Wish List</Link>
              <Link to={`/${user._id}/properties`}>Property List</Link>
              <Link to="/create-listing">Become A Host</Link>
              <Link
                to="/login"
                onClick={() => dispatch(setLogout())}
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    );
}

export default Navbar;
