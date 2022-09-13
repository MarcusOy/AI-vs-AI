import React from 'react'

const SignUpTab = () => {
    return (
        <div>
            <form>
            <div className='form-group'>
                <label>Email</label>
                <input
                type='text'
                className='form-control'
                placeholder='Enter your email'
                />
            </div>

            <div className='form-group'>
                <label>Username</label>
                <input
                type='text'
                className='form-control'
                placeholder='Enter your unique username'
                />
            </div>

            <div className='form-group'>
                <label>Password</label>
                <input
                type='text'
                className='form-control'
                placeholder='Enter your new password'
                />
            </div>
                <button>
                    Register
                </button>
            </form>
        </div>
    )
}

export default SignUpTab