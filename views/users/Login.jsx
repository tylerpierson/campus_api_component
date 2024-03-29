const React = require('react')
const Nav = require('../Layouts/Nav')
const Layout = require('../Layouts/Layout')

function Login (props) {
    return (
        <Layout>
            <img className="ufo-img" src="https://i.imgur.com/ACM0vdb.png" alt="UFO Image" />
            <img className="stars stars-one" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-two" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-three" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-four" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-five" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-six" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-seven" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-eight" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-nine" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-ten" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-eleven" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-twelve" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-thirteen" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-fourteen" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <img className="stars stars-fifteen" src="https://i.imgur.com/gJOwMCM.png" alt="stars" />
            <h1>Login to Campus Database</h1>
            <form action="/users/login" method="POST">
                <div className="login-container">
                    <div className="input-container">
                        <input type="email" placeholder="Email" name="email" />
                        <input type="password" placeholder="Password" name="password" />
                    </div>
                    <div className="btn-container">
                        <button className="login-btn" type="submit">Login</button>
                        <button className="signup-btn" type="submit">Sign Up</button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}

module.exports = Login
