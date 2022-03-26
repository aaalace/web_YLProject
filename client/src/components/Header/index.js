import React from 'react'
import { Link } from 'react-router-dom';
import './header.css'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/user/actions';
import styled from "styled-components";
import { NewPostPage } from '../NewPost';
import Axios from 'axios';
import { useRef } from 'react';
import { rollMedia } from '../../store/rolledMedia/actions';

const HeaderBox = styled.div`
    display: flex;
    height: 64px;
    width: 100%;
    background-color: #FFFFFF;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
`

const LoginedBox = styled.div`
    display: ${props => (props.open ? "block" : "none")};
    padding: 20px;
`

const Menu = styled.div`
    @media (max-width: 768px) {
        display: none;
    }
`;

const Burger = styled.div`
    position: relative;
    z-index: 4;
    @media (min-width: 769px) {
        display: none;
`;

const MenuOpened = styled.div`
    position: absolute;
    width: ${props => (props.open ? "50%" : "0px")};
    height: calc(100vh - 64px);
    background-color: white;
    z-index: 1;
    top: 64px;
    right: 0;
`;

const Rect1 = styled.rect`
    width: 100px;
    height: 13px;
    transform: ${props => (props.open ? "rotate(45deg) translate(17px, -14px)" : "rotate(0deg)")};
`

const Rect2 = styled.rect`
    width: 100px;
    height: 13px;
    opacity: ${props => (props.open ? "0%" : "100%")};
`

const Rect3 = styled.rect`
    width: 100px;
    height: 13px;
    transform: ${props => (props.open ? "rotate(-45deg) translate(-41px, -1px)" : "rotate(0deg)")};
`

// const CastomP = styled.p`
//     display: ${props => (props.open ? "block" : "none")};
//     margin-left: 15px;
//     margin-top: 15px;
//     color: rgb(172, 128, 193);
// `

export const Header = () => {
    const loged = useSelector(state => state.user.loged);
    const rolled_media = useSelector(state => state.rolledMedia.media)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [toFind, setToFind] = useState('');
    const [open, setOpen] = useState(false);
    const [createPost, setCreatePost] = useState(false);
    const [finded, setFinded] = useState()
    const [finded_ids, setFindedIds] = useState([])

    const [audioState, setAudioState] = useState(true) 
    const selectedAudioRef = useRef(null)

    useEffect(() => {
        setAudioState(true)
    }, [rolled_media])

    useEffect(() => {
        document.body.style.overflow = "scroll"
    }, [])

    useEffect(() => {
        open ? 
            document.body.style.overflow = "hidden" 
        : document.body.style.overflow = "scroll"
    }, [open])

    useEffect(() => {
        createPost ? 
            document.body.style.overflow = "hidden"
        : document.body.style.overflow = "scroll"
    }, [createPost])

    const openMenu = () => {setOpen(prevState => !prevState)}

    const createNewPost = () => {
        setCreatePost(prevState => !prevState);
    }

    const logOutHeader = () => {
        openMenu()
        navigate('/login')
        dispatch(logOut())
    }

    function submitHandler(name) {
        setToFind('')
        if (finded){
            if(Object.values(finded).includes(name)){
                openProfile(name)
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter'){
            submitHandler();
        }
    }

    const finderChanged = (text) => {
        setToFind(text)
        if(text.length > 0){
            findUsersByReq(text)
        }
        else{
            setFinded(null)
        }
    }

    function findUsersByReq(text){
        Axios.get(`/find_users/`, {
            params: {text}
        }).then((response) => {
                if(Object.keys(response.data).length > 0){
                    setFinded(response.data)
                    setFindedIds(Object.keys(response.data))
                }
                else{
                    setFinded(null)
                    setFindedIds([])
                }
        })
    }

    const openProfile = (username) => {
        navigate(`/profile/${username}`)
    }

    const DataList = () => {
        return(
            <datalist id="names">
                {finded_ids.map((id) => <option key={id} id={id}>
                                            {finded[id]}
                                        </option>)}
            </datalist>
        )
    }

    const playAudio = () => {
        if(audioState){
            selectedAudioRef.current.pause();
            setAudioState(false)
        }
        else{
            selectedAudioRef.current.play();
            setAudioState(true)
        }
    }

    const closeRolledMedia = () => {
        setAudioState(false)
        dispatch(rollMedia({type: null, media: null}))
    }

    return (
        <>
        <HeaderBox id='header' open={open}>
            <div className='container'>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                    <Link className='header-link' to='/' onClick={() => {if (open) {openMenu()}}}>SYA</Link>
                    {rolled_media && loged ? <audio ref={selectedAudioRef} className='audio-header'autoPlay src={rolled_media} controls style={{display: 'none'}}></audio> : null}
                    {rolled_media && loged ? 
                        <a className='menu-link-audio'>
                            <div style={{display: 'flex', justifyContent: 'center', backgroundColor: '#ac80c1ad', padding: '7px 15px', borderRadius: '10px'}}>
                                {audioState ? 
                                        <i className="fa-solid fa-pause" style={{display: 'flex', alignItems: 'center'}} onClick={playAudio}></i>
                                    : <i className="fa-solid fa-play" style={{display: 'flex', alignItems: 'center'}} onClick={playAudio}></i>}
                                <i style={{marginLeft: '15px'}} onClick={closeRolledMedia}><i class="fa-solid fa-xmark"></i></i>
                            </div>
                        </a> 
                    : null}
                </div>
                {loged ?
                <div>
                <Menu>
                    <div className='right_bar'>
                        <Link className='menu-link' to='/all'>
                            <i className="fa-solid fa-house"/>
                        </Link> 
                        <Link className='menu-link' to='/forum'>
                            <i className="fa fa-send"/>
                        </Link>  
                        <p className='menu-link menu-link-bot' onClick={createNewPost}>
                            <i className="fa fa-plus-square"/>
                        </p>  
                        <Link className='menu-link' to='/profile/'>
                            <i className='fas fa-user-alt'/>
                        </Link>
                        <p className='menu-link' onClick={logOutHeader}>
                            <i className="fas fa-sign-out-alt"/>
                        </p> 
                        <div className="find_over_form">
                            <input list='names' className="find_over" 
                                type="text" placeholder="Find" value={toFind} 
                                onKeyDown={handleKeyDown} 
                                onChange={event => finderChanged(event.target.value)}
                            />
                            {finded ? <DataList></DataList> : null}
                            <p type='submit' className='pointer'
                                onClick={() => submitHandler(toFind)}>
                                <i className="fa fa-search"/>
                            </p>
                        </div>
                    </div>    
                </Menu>
                <Burger onClick={() => {openMenu()}}>
                    <svg viewBox="0 0 100 80" width="40" height="40">
                        <Rect1 rx="7" ry="7" open={open}/>
                        <Rect2 y="30" rx="7" ry="7" open={open}/>
                        <Rect3 y="60" rx="7" ry="7" open={open}/>
                    </svg>
                </Burger>
                </div>
                : null}
            </div>
            {loged ? 
            <MenuOpened open={open} className="tabletBar">
                <LoginedBox open={open}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Link className='menu-link' to='/profile' style={{padding: 0, margin: 0}} 
                                onClick={openMenu}>
                                <i className="fas fa-user" aria-hidden="true"/>
                            </Link>
                            <Link className='menu-link' to='/login' style={{padding: 0}} 
                                onClick={logOutHeader}>
                                <i className="fas fa-sign-out-alt"/>
                            </Link>
                        </div>
                        <div className="find_over_form">
                            <input className="find_over" type="text" placeholder="Find" value={toFind} 
                                onKeyDown={handleKeyDown} 
                                onChange={event => finderChanged(event.target.value)}
                            />
                            <p type='submit' className='pointer'
                                onClick={submitHandler}>
                                <i className="fa fa-search"/>
                            </p>
                        </div>
                        <Link className='menu-link menu-link-bot' to='/all'>
                            Home
                        </Link> 
                        <Link className='menu-link menu-link-bot' to='/' onClick={openMenu}>
                            Forum
                        </Link>  
                        <p className='menu-link menu-link-bot' 
                            style={{cursor: 'pointer'}} 
                            onClick={createNewPost}
                            >New post
                        </p>  
                    </div>
                </LoginedBox>
            </MenuOpened>
            : null}
        </HeaderBox>
        {createPost ? <NewPostPage createNewPost={createNewPost} setCreatePost={setCreatePost}/> : null}
        </>
    )
}
