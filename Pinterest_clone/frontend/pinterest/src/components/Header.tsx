import React, {useContext, useState, useEffect} from 'react';
import SearchBar from './subcomponents/MainSearchBar.tsx';
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaCommentAlt, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from "../context/contextProvider.tsx";
import { BASE_URL } from '../constants.tsx';
import {logout} from '../api/apiRequests.tsx';



const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const data = authContext;
  const user = data.user;

  const [isDropOpen, setDropOpen] = useState<boolean>(false);

  const handleDrop = (e:Event): void => {
    e.preventDefault();
    setDropOpen(!isDropOpen);
  }

  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  }


  const [screenWith, setWith] = useState<number>(window.innerWidth);

  useEffect(() => {
    // Handler to update the state on screen size change
    const handleResize = () => {
      setWith(window.innerWidth);
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const [isSearchDrop, setSearchDrop] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const handleSearhDrop = (e:Event): void => {
    e.preventDefault();
    
    setSearchDrop(!isSearchDrop);
    if(isDropOpen) {
      setDropOpen(!isDropOpen);
    }
  }

  const handleMenuOpen = (e:Event): void => {
    e.preventDefault();
    setMenuOpen(!isMenuOpen);
  }

  return (
    <section className="head">
      {data.authenticated &&
        <div>
          <header className="header">
            <div className="header-left">
              <Link className="pinterest-logo-link"><img className="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4bbV81EyBpAdTCq2dqUwwAHUCWDr9qvrscg&s" width="27px" height="27px"></img></Link>

              {screenWith>=575.98 && 
              <nav className="nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/create-pin" className="nav-link">Create</Link>
              </nav>
              }
              {screenWith < 575.98 && (
              <div className="drop-menu">
                <select className="pinterest-select">
                  <option value="">Home</option>
                  <option value="create">Create</option>
                </select>
              
                
              </div>
            )}

            </div>
            {screenWith > 768 &&
            <SearchBar className="search-bar"></SearchBar>
            }
            {screenWith<=768 && 
              <div className="searchDiv">
                <img onClick={handleSearhDrop} className="searchIcon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vector_search_icon.svg/1890px-Vector_search_icon.svg.png"></img>
              </div> 
            }

            {screenWith<768 && isSearchDrop && <SearchBar className="search-bar-drop"></SearchBar>}


            <div className="right-side">
              <div className="bell-div"><img src="https://icons.veryicon.com/png/o/miscellaneous/interface-2/notification-bell-ring-1.png" className="bell-icon"/></div>
              <div className="iconWrapper"><img className="message-icon" src="https://w7.pngwing.com/pngs/851/677/png-transparent-chat-box-inbox-message-pinterest-pinterest-ui-glyph-icon.png"/></div>

              <Link to={`/${user?.username}`} className="icon-wrapper"><img  src={`${BASE_URL}${user.profileImage}`}></img></Link>
              <Link onClick={handleDrop} className="drop-link" to=""><img className="drop-icon" src="https://www.freeiconspng.com/uploads/arrow-down-icon-png-9.png"></img></Link>
            </div>
        </header>
          {isDropOpen && 
          <div className="settingsNav">
            <h5>Settings</h5>
            <h5 onClick={handleLogout}>Logout</h5>
          </div>
          }
        </div>
      }
       

    </section>
    
    
  );
}

export default Header;
