import React from 'react';
import PropTypes from 'prop-types';


const ProfileCard = ({ currentUser }) => {

    const age = () => {
        if(currentUser.dateOfBirth){
            const currentYear = new Date();
            const birth = new Date(currentUser.dateOfBirth);
            const difference = (currentYear.getTime() - birth.getTime())
            return Math.floor( difference / (1000 * 60 * 60 * 24 * 365.25)) + " years"

        }
        return;
    }
    return (
        <div className="profile-card">
            <img 
                src={currentUser.userImage}
                alt = "John"
                className="profile-card__image"
            />
            <h1 className="profile-card__title">{currentUser.username}</h1>
            <p className="age">{age()}</p>
            <p className="occupation">{currentUser.occupation}</p>
            <p className="age">{currentUser.location}</p>
        </div>
    );
};


ProfileCard.propTypes = {

};


export default ProfileCard;
