import React from 'react'
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
        <h3>
            There was some error. please Go back to
            <Link to={'/'}>homepage</Link>
        </h3>
    </div>
  )
}

export default ErrorPage