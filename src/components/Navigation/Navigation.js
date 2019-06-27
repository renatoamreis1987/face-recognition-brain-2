import React from 'react'
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
        if (isSignedIn) {
            return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
                {/* bellow is: () => onRouteChange('signout') and is because we want to execute function only when we click */}
                {/* It will render only the modules based on the route in App.js */}
            </nav>
            )
        } else {
            return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer '> Sign In </p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer '> Register </p>
            </nav>
            )
        }
}


export default Navigation;