const React = require('react')

function Index (props) {
    return (
        <div>
            <h1>Users Index Page</h1>
            <ul>
                {
                    props.users.map((user) => {
                        return (
                            <li key={user._id}>
                                <a href={`/users/${user._id}`}>{user.name}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

module.exports = Index