import React, { useState } from 'react';
import AddPost from './add-post.component';
import Modal from './modal.component';
import PropTypes from 'prop-types';

/**
 *
 * The input box in the homepage
 * @param {object} {currentUser}
 * @return {JSX} 
 */
function AddPostBox({currentUser}) {

    const [showModal, setShowModal] = useState(false)

    return (
        <React.Fragment>
            { showModal && (
                <Modal>
                    <AddPost 
                        currentUser={currentUser}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>
            )}
            <div className="add-post-box">
                <div className="avatar">
                    <img 
                        src={
                            currentUser.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                        } 
                        alt={currentUser.username}
                    />
                </div>
                <input 
                    type="text" 
                    onClick={() => setShowModal(true)}
                    readOnly={true}
                    value=''
                    placeholder="What is on your mind?" 
                    className="add-post-box__input"
                />
            </div>
        </React.Fragment>
        
    )
}

AddPostBox.propTypes = {
    currentUser: PropTypes.object,
}

export default AddPostBox