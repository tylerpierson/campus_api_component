const React = require('react')
const Login = require('../users/Login')
const Nav = require('../Layouts/Nav')

class Layout extends React.Component {
    render() {
      return (
        <html>
          <head>
            <link rel="stylesheet" href="/css/style.css" />
          </head>
          <Nav></Nav>
          <body>
            {this.props.children}
          </body>
        </html>
      )
    }
  }
  
  module.exports = Layout