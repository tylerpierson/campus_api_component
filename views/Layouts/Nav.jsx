const React = require('react')
const Login = require('../users/Login')

class Nav extends React.Component {
    render() {
      return (
        <html>
          <head>
            <link rel="stylesheet" href="/css/style.css" />
          </head>
            <nav>
                <div className="logo-container">
                    <img className="logo" src="https://i.imgur.com/Hez7X3k.png" alt="Logo" />
                    <h2 className="logo-name">SpaceBound Education</h2>
                </div>
                <div className="alt-logo-container">
                    <h2 className="alt-logo-name">SpaceBound Education</h2>
                </div>
                <ul>
                    <li><button className="nav-btn" href="#">Home</button></li>
                    <li><button className="nav-btn" href="#">About Us</button></li>
                </ul>
            </nav>
        </html>
      )
    }
  }
  
  module.exports = Nav