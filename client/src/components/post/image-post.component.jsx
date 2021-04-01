import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Comments from '../comments.component'
import { connect } from 'react-redux'
import { 
    addCommentToPost,
    addLikeToPost, 
    deletePost, 
    removeLikeFromComment,
    addReplyToComment 
} from '../../redux/posts/post.actions';
import { toast } from 'react-toastify';
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import noImage from '../../assets/images/no-image.png'
import AddPost from '../add-post.component';
import Modal from '../modal.component';

const ImagePost = ({
    post,
    currentUser,
    addCommentToPost,
    addLikeToPost,
    removeLikeFromComment,
    show = false,
    addReplyToComment,
    commentModal=true,
    deletePost,
    }) => {

    const timePrefix = (value) => {
        if (value === 1) {
            return ' ago'
        } else {
            return 's ago'
        }
    }

    const [showModal, setShowModal] = useState(show);

    const prefix = (value, type) => {
        if (value > 1) {
            return `${value} ${type}s`
        } else {
            return `${value} ${type}`
        }
    }

    const timeAgo = (timeString) => {
        const seconds = Math.floor((Date.now() - new Date(timeString)) / 1000);
        let interval = Math.floor(seconds / 31536000)
        if (interval > 1) {
            return interval + " year" + timePrefix(interval)
        }
        interval = Math.floor(seconds / 2628000)
        if (interval > 1) {
            return interval + " month" + timePrefix(interval)
        }
        interval = Math.floor(seconds / 86400)
        if (interval > 1) {
            return interval + " day" + timePrefix(interval)
        }
        interval = Math.floor(seconds / 3600)
        if (interval > 1) {
            return interval + " hour" + timePrefix(interval)
        }
        interval = Math.floor(seconds / 60)
        if (interval > 1) {
            return interval + " minute" + timePrefix(interval)
        }
        return Math.floor(seconds) + " second" + timePrefix(interval);
    }

    const postLikedByCurrentUser = (array) => {
        return array.filter((value) => (
            value.username === currentUser.username
        )).length > 0
    }

    const addReplyToCommentHandler = (reply, postId, commentId) => {
        const likedBy = currentUser._id;
        addReplyToComment(reply, postId, commentId).then(() =>
            toast.success('Reply sent')
        );
    };

    const removeLikeFromCommentHandler = (commentId) => {
        const likedBy = currentUser._id;
        removeLikeFromComment(likedBy, post._id, commentId).then(() =>
            toast.success('Comment Unliked')
        );
    };

    const addLike = () => {
        const likedBy = currentUser.username;
        addLikeToPost(likedBy, post._id)
    }

    const commentComponent = () =>{
        if (commentModal){
            return (
                <Modal>
                    <Comments 
                        postId={post._id} 
                        liked={post.likes}
                        commentList={post.comments} 
                        addReplyToComment={addReplyToCommentHandler}
                        removeLikeFromComment={removeLikeFromCommentHandler}
                        addCommentToPost={addCommentToPost}
                        setShowModal={setShowModal}/>
                </Modal>
            )
        }else{
            return (
                <Comments 
                    postId={post._id} 
                    liked={post.likes}
                    commentList={post.comments} 
                    addReplyToComment={addReplyToCommentHandler}
                    removeLikeFromComment={removeLikeFromCommentHandler}
                    addCommentToPost={addCommentToPost}
                    setShowModal={setShowModal}/>
            )
        }
    }

    return (
        <React.Fragment>
        <div className='post post--image' id={post._id}>
            <div className="avatar">
                <img 
                    src={post.user.userImage} 
                    alt={post.user.username}
                />
            </div>
            <div className="user-info">
                <span className='username'>{post.user.username}</span>
                <span className='date'>{timeAgo(post.createdAt)}</span>
            </div>
            <div className="u-margin-bottom-small u-margin-top-small" id="title">
                <h3 className="tertiary-header">{post.image.title}</h3> 
            </div>
            <div  className='images'>
                {
                    post.image.images.map((image, i) => ( 
                        <img src={image} alt={`${image}-1`} />
                    ))
                }
            </div>
             <div className="post__options">
                    <div className="post__status">
                        <div className="likes">
                            {post.likes !== undefined && post.likes.length > 0 &&
                                prefix(post.likes.length, ' Like')
                            }
                        </div>
                        <div 
                            className="comments"
                            onClick={() => setShowModal(true)}
                            >
                            { post.comments !== undefined && post.comments.length > 0 &&
                            `${prefix( post.comments.length, 'Comment')} `
                            }
                            
                        </div>
                    </div>
                    {
                        currentUser.username === post.user.username && (
                            <div className="post__edit">
                                <div className="delete" onClick={() => {
                                    deletePost(post._id)
                                }}>
                                    Delete
                                </div>
                            </div>
                        )
                    }
            </div>
            <hr />
            <div className="response">
                {!postLikedByCurrentUser(post.likes) ? (
                <div
                    className="response__item"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={addLike}
                    title='like'
                >
                    <AiOutlineLike className="response__icon" />
                </div>
                ) : (
                <div className="response__item liked" style={{ color: "red" }} title='liked'>
                    <AiFillLike className="response__icon" />
                    <p className="response__label" >Liked</p>
                </div>
                )}
                <div className="response__item" onClick={() => setShowModal(true)}>
                    <AiOutlineComment className="response__icon" />
                </div>
            </div>
            <hr/>
            <div className="comment">
                <div className="comment__input-container">
                {(
                    <div className="avatar">
                        <img 
                            src={
                                currentUser.userImage
                                ? currentUser.userImage
                                : noImage
                            }
                            alt={currentUser.username}
                        />
                    </div>
                )}
                <input
                    className="comment__input"
                    onClick={() => setShowModal(true)}
                    type="text"
                    placeholder="Add Comment"
                />
                </div>
                    {showModal &&
                        commentComponent()
                    }
            </div>
        </div>
        </React.Fragment>

    );
};


const mapDispatchToProps = {
    addCommentToPost,
    addLikeToPost,
    addReplyToComment,
    deletePost,
    removeLikeFromComment
};

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})

ImagePost.propTypes = {
    currentUser: PropTypes.object,
    addCommentToPost: PropTypes.func,
    addLikeToPost: PropTypes.func,
    addReplyToComment: PropTypes.func,
    deletePost: PropTypes.func,
    removeLikeFromComment: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagePost);
