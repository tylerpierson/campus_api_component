const React = require('react')
const Login = require('../users/Login')

class Layout extends React.Component {
    render() {
      return (
        <html>
          <head>
            <link rel="stylesheet" href="/css/style.css" />
          </head>
          <body>
            {this.props.children}
          </body>
        </html>
      )
    }
  }
  
  module.exports = Layout