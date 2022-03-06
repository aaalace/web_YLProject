import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './home_page.css';
import { Button } from '../../components/LiquidButton'; 
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';

export const HomePage = () => {
    const post_limit = 5;
    const [posts, setPosts] = useState([]);
    const [media, setMedia] = useState({});
    const userLoged = useSelector(state => state.user.loged);

    const getMedia = (mediaIds) => {
        for (const id of mediaIds) {
            Axios.get(`http://127.0.0.1:5000/get_media//${id}`).then((res) => {
                setMedia(prevState => ({
                    ...prevState,
                    [id]: res.data
                }))
            })
        }
    }
    const getPosts = () => {
        Axios.get(`http://127.0.0.1:5000/get_posts//${post_limit}`)
            .then((res) => {
                setPosts(res.data.body);
                getMedia(res.data.media_ids);
        })
    }

    useEffect(() => {
        getPosts();
    }, [])

    useEffect(() => {
        console.log(media)
    }, [media])

    const switchType = (type, media_id) => {
        switch(type) {
            case 1:
                return (
                    <div style={{margin: '2% 0'}}>
                        <audio src={media[media_id]} 
                            controls className='audio-player' 
                            style={{width: '100%'}}>
                        </audio> 
                    </div>
                )
            case 2:
                return (
                    <div style={{margin: '2% 0'}}>
                        <video controls 
                            src={media[media_id]}
                            style={{maxWidth: '100%', maxHeight: '60vh', borderRadius: '5px'}}>
                        </video>
                    </div>
                )
            case 3:
                return (
                    <div style={{margin: '2% 0'}}>
                        <img src={media[media_id]} alt="картинка"
                            style={{maxWidth: '100%', maxHeight: '60vh', borderRadius: '5px'}}/>
                    </div>
                )
            case 4:
                return (
                    <div style={{margin: '2% 0'}}>
                        <div style={{margin: '12px'}}>
                            {media[media_id]}
                        </div>
                    </div>
                )
            default:
                return 'error'
        }
    }

    return ( 
        <div style={{position: 'relative'}} id="sec-1">
            <div className="background">

            </div>
            <div  className='main'>
                <div className='sec'>
                    <h1 className='main__title'>A social network<br/>of associations</h1>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '10%', marginTop: '10%'}}>
                        <Link to='/login'>
                            <Button text={'Log in'} className='main__button'/>
                        </Link>
                    </div>
                </div>
                <div className='posts-box'>
                {
                    posts.map((post, index) => 
                        <div className='posts' id={`sec-${index + 2}`} key={post.media_id}>
                            <div className='post homepage-box'>
                                <div className='post__top'>
                                    <h2 className='homepage-box__title'>SYA daily {index + 1}</h2>
                                    {userLoged ? 
                                        <a href={index < post_limit - 1 ? `#sec-${index + 3}` : "#sec-1"} 
                                            className='next-link'
                                        ><span style={{fontSize: '22px'}}>G</span>O!
                                        </a>
                                        : <Link to="/login" 
                                            className='next-link'
                                        ><span style={{fontSize: '22px'}}>G</span>O!
                                        </Link>
                                    }
                                </div>
                                <div>
                                    <h4>type: {post.type}</h4>
                                </div>
                                {switchType(post.type, post.media_id)}
                            </div>
                        </div>
                    )
                }
                </div>
                </div>
            </div>
    )
}