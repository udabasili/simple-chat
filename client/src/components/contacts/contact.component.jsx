import  React, {useEffect, useState} from 'react'
import  UserIcon from "../user-icon-status/user-icon-status";
import {connect} from "react-redux";
import { socket } from '../../nodeserver/node.utils';

/**
  * @desc handles showing the user's friends and checking if they are online or not sending the online
  * friends list to User Icon as props
  * @param props for the toggle button of showing and hiding profile window and current user from redux
  * @author Udendu Abasili

*/

function Contacts({currentUser, showProfile}) {  
    const [onlineFriends, setOnlineFriends] = useState([])  
      useEffect(() => {
        const interval = setInterval(() => {
          socket.emit("getOnlineFriends",currentUser.username, (response)=>{            
              setOnlineFriends(response)
     
           })
        }, 10000);
        return () => clearInterval(interval);
      }, []);

  return (
      <div className="contact-container">
          {currentUser.friends ?
            <div className="user-contacts">
              {currentUser.friends.map((friend, i)=>(
                  <div 
                    key={i} 
                    className="user-contacts__item"
                     onClick={() => {
                       return showProfile({
                         friend:{
                           _id:friend.userInfo._id,
                           username:friend.userInfo.username,
                           image: `data:image/png;base64,${friend.userInfo.userImage}`
                          }
                        })
                        }
                       }>
                      <UserIcon 
                        imageUri={`data:image/png;base64,${friend.userInfo.userImage}`}
                        username = {friend.userInfo.username} 
                        onlineUsers = {onlineFriends}
                      />
                      <div className="user-contacts__username">{friend.userInfo.username}</div>
                  </div>
              ))}
            </div>:
            <div className="user-contacts"> 
              NO FRIENDS YET     
            </div>}
      </div>
    
  )
}

const mapStateToProps = (state) =>({
   currentUser:state.user.currentUser
})

export default connect(mapStateToProps, null)(Contacts)