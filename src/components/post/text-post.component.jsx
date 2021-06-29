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
import AddPost from '../add-post.component';
import Modal from '../modal.component';

function TextPost({ 
        post,
        commentModal=true,
        currentUser,
        addCommentToPost,
        addLikeToPost,
        removeLikeFromComment,
        show=false,
        addReplyToComment,
        deletePost,
    }) {
    const [showModal, setShowModal] = useState(show);
    const [editPost, setEditPost] = useState(false);
    const [editType, setEditType] = useState(null);
    const [editData, setEditData] = useState(null);


    const editPostHandler = (post, type) => {
        setEditType(`${type}-tab`)
        setEditPost(true)
        setEditData(post)
    }

    const timePrefix = (value) => {
        if(value === 1){
            return ' ago'
        }else{
            return 's ago'
        }
    }

    const prefix = (value, type) => {
        if (value > 1) {
            return `${value} ${type}s`
        } else {
            return `${value} ${type}`
        }
    }

    const addLike = () => {
        const likedBy = currentUser.username;
        addLikeToPost(likedBy, post._id, post.user._id)
    }

    const postLikedByCurrentUser = (array) => {
        return array.filter((value) => {
            return value === currentUser.username
        }).length > 0

    }

    const addReplyToCommentHandler = (reply, postId, commentId) => {
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

    const timeAgo = (timeString) => {
        let microSeconds = timeString.seconds * 1000
        const seconds = Math.abs(Math.floor((Date.now() - new Date(microSeconds)) / 1000));
        let interval = Math.floor(seconds / 31536000)
        if (interval > 1){
            return  interval +  " year" + timePrefix(interval)
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
        return Math.floor(seconds) + " second" + timePrefix(seconds);
    }

    const commentComponent = () =>{
        if (commentModal){
            return (
                <Modal>
                    <Comments 
                        postId={post._id} 
                        liked={post.likes}
                        owner={post.user._id}
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
            {
                editPost &&
                <Modal>
                     <AddPost
                        editData={editData}
                        editPost={editPost}
                        editType={editType}
                        closeModal={() => setEditPost(false)}
                    />
                </Modal>
               
            }
            <div className='post post--text' id={post._id}>
                <div 
                    className={`
                        avatar
                        ${post.user.image ? '': 'no-image'}
                    `}>
                        {
                            post.user.image && (
                                <img 
                                    src={
                                        post.user.image ||  "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                                    } 
                                    alt={post.user.username}
                                />
                            )
                        }
                
                </div>
                <div className="user-info">
                    <span className={`
                        username
                        ${post.user.username ? '': 'no-username'}
                    `}>
                        {
                            post.user.username ? 
                            post.user.username :
                            ''
                        }
                    </span>
                    <span className='date'>{timeAgo(post.createdAt)}</span>
                </div>
                <div className="post__message">{post.text}</div>
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
                                <div className="edit" onClick={() => {
                                    editPostHandler(post, post.type)
                                }}>
                                    Edit
                                </div>
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
                    {
                        !postLikedByCurrentUser(post.likes) ? (
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
                                    currentUser.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
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
    )
}

const mapDispatchToProps = {
    addCommentToPost,
    addLikeToPost,
    addReplyToComment,
    deletePost,
    removeLikeFromComment
};

TextPost.propTypes = {
    currentUser: PropTypes.object,
    addCommentToPost: PropTypes.func,
    addLikeToPost: PropTypes.func,
    addReplyToComment: PropTypes.func,
    deletePost: PropTypes.func,
    removeLikeFromComment: PropTypes.func
}

export default connect(null, mapDispatchToProps)(TextPost);
