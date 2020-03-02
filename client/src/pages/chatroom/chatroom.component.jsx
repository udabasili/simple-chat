import React, { Component } from 'react';
import LeftNav from "../../components/left-nav/left-nav.components";
import Contacts from "../../components/contacts/contact.component";
import UserMessageHistory from "../../components/user-message-history/user-message-history.component";
import Profile from "../../components/profile/profile.component";
import Events from "../../components/events/events.components";
import Group from "../../components/groups/group.component";
import Users from "../../components/users/users.component";
import {isMobile, isBrowser} from 'react-device-detect';
import hash from "../../components/spotify/hash";
import { socket } from '../../services/socketIo';
import ModalWindow from '../../components/modal-window/modal-window.component';
import VideoComponent from "../../components/video-calling/video-component";
import {connect} from "react-redux";
import { getLocation } from '../../redux/action/user.action';
import PrivateMessages from '../../components/private-messages/private-messages.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';


const SpotifyWebApi = require('spotify-web-api-node');
let spotify = new SpotifyWebApi();


class Chatroom extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLink:"messages",
      showUserMessages: false,
      incomingCalling: false,
      leftSectionStyling:{
        marginLeft: "9vw",
        iconType: faMinus
      },
      calling:null,
      caller: null,
      showModal: false,
      hideLeftSection: true,
      token: null,
      location:null,
      albums:null, 
      room:null,
      friend:null
    };
    this.getAlbum = this.getAlbum.bind(this);
    }
  //show user's profile 
    showProfile = (value) =>{
      this.setState((prevState)=>({
        ...prevState,
        friend: value,
      }))
    }

    //popup the message window when a new one arrives
    showUserMessagesHandler = (value) => {
      this.setState((prevState) => ({
        showUserMessages: true,
        friend:value,
      }),this.toggleLeftSection(true))

    }

    toggleLeftSection = (hide) => {
      let leftMargin = hide;
      let icon = "";
      if(hide){
        leftMargin = "-80vw"
          icon = faPlus
      }
      else{
        leftMargin = "9vw"
        icon = faMinus
      }
      this.setState((prevState)=>({
        ...prevState,
          hideLeftSection:!prevState.hideLeftSection,
          leftSectionStyling: {
            marginLeft: leftMargin,
            iconType: icon
              }
          })
        )
    }
  
  componentDidMount() {
    socket.on('privateMessage', this.popUpUserProfile)    
    socket.on('receive', this.receiveVideo)
    let _token = hash.access_token; 
    if (_token && _token !== undefined) {
      localStorage.setItem("token",_token)
      this.setState({
        token: _token
      });
      _token = localStorage.getItem("token")
      this.getAlbum(_token);

      }

    }
    //recieve the socket information about the contact being video called and pop up the video compoent
    //to activate the video room for the recipient to join

    receiveVideo = (message) =>{
      this.setState({
        incomingCalling:message.incomingCalling, 
          caller: message.caller,
          calling: message.calling,
          room: message.room,
          showModal: true
      })   
    }

    toggleModal = (value) =>{
      this.setState((prevState) => ({
        ...prevState,
        showModal: value
        })
      )
    }

    popUpUserProfile = (message) =>{      
      let userFriend = this.props.allUsers.filter(user => user.username === message.createdBy)[0]    
        this.setState(prevState => ({
          ...prevState,
          showUserMessages: true,
          friend: userFriend

      })
    )}

          
  //get album from spotify
  getAlbum(token) {
    token = localStorage.getItem("token")
    spotify.setAccessToken(token)
    spotify.getNewReleases()
    .then((data)=> {              
        this.setState({albums: data.body.albums.items[0]})
        })
      .catch((error)=>console.log(error)
      )
    }

  navLinkChangeHandler = (value) =>{    
    this.setState({currentLink: value}, this.toggleLeftSection(false))
  }



  navComponents = () =>{
    switch (this.state.currentLink) {
      case "messages":
        return (
          <React.Fragment>
              <div className="chatroom__left-section__header">
                <h1 className="primary-header">Contacts</h1>
                {isMobile && (
                    <FontAwesomeIcon onClick={() => this.toggleLeftSection(this.state.hideLeftSection)}
                icon={this.state.leftSectionStyling.iconType}/>)}
              </div>
            <Contacts showMessages={this.showUserMessagesHandler}/>
            <UserMessageHistory showMessages={this.showUserMessagesHandler}/>
          </React.Fragment>
        )  
        case "events":
        return (
          <React.Fragment>
              <div className="chatroom__left-section__header">
                <h1 className="primary-header" >Events</h1>
              </div>
              <Events/>
          </React.Fragment>
        )
        case "groups":
          return (
            <React.Fragment>
              <div className="chatroom__left-section__header">
                <h1 className="primary-header" >Group</h1>
              </div>
              <Group/>
          </React.Fragment>
            ) 
          case "users":
            return (
              <React.Fragment>
              <div className="chatroom__left-section__header">
                <h1 className="primary-header" >Users</h1>
              </div>
              <Users/>
          </React.Fragment>
                )  
          default:
            return;
    }
  }  


  render() {
    return (
      <div>
          <main className="chatroom">
          {(this.state.showModal && this.state.incomingCalling) &&
            <ModalWindow closeHandler={this.toggleModal}  >
              <VideoComponent 
              closeHandler={this.toggleModal} 
              calling={this.state.calling}
              currentUser={this.props.currentUser.username}
              caller={this.state.caller}
              incomingCalling={this.state.incomingCalling}
              room={this.state.room}
              />
            </ModalWindow>
            }
          <LeftNav 
            albums={this.state.albums}
            navLinkChangeHandler={this.navLinkChangeHandler}  
            className="navigation"/>
            <div className="chatroom__left-section" style={isMobile ? this.state.leftSectionStyling : {}}>
              {this.navComponents()}
            </div>
            <div className="chatroom__main-section">
            { this.state.friend && this.state.showUserMessages &&
              <PrivateMessages 
                recipient={this.state.friend}
                currentUser = {this.props.currentUser}/>
              }
            </div>
            {isBrowser && (
              <div className="chatroom__right-section">
              {this.state.friend &&
                <Profile userData={this.state.friend}
                  currentUser = {this.props.currentUser}
                />
              }
            </div>
            )}
            
          </main>
      </div>
    )
  }
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
  errors : state.errors,
  allUsers: state.user.users,

})

const mapDispatchToProps = dispatch => ({
  getLocation: (coords) => dispatch(getLocation(coords))  

})


export default connect(mapStateToProps , mapDispatchToProps)(Chatroom);