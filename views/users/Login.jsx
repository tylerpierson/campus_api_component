const React = require('react')
const Layout = require('../Layouts/Layout')

function Login (props) {
    return (
        <Layout>
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
        </Layout>
    )
}

module.exports = Login
