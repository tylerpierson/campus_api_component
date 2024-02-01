const React = require('react')

function Login (props) {
    return (
        <div>
            <h1>Login</h1>
            <form action="/users/login" method="POST">
                <div>
                    <input type="email" placeholder="Email" name="email" /><br/>
                    <input type="password" placeholder="Password" name="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

module.exports = Login
