import { setOpenPost } from '../../store/currentPost/actions';
import { useDispatch } from 'react-redux';
import { FullControl } from '../../components/Audio/FullControl'
import Video from '../../components/Video/component';


export const PostSwitcher = ({post, getMedia, mediaConnect}) => {
    let borderColor = '#9979d4';
    const dispatch = useDispatch();
    let middle_color = post.middle_color;
    const media_id = post.media_id;
    const type = post.type;
    const proportion = post.proportion || 1;

    const path_to_media = mediaConnect ? mediaConnect[media_id] : post.path_to_media;

    const openPost = (post) => {
        dispatch(setOpenPost({
            open: true,
            id: post.id,
            user_id: post.user_id,
            user_name: post.user_name,
            path_to_avatar: post.path_to_avatar,
            path_to_media: post.path_to_media,
            media_type: post.type,
            likes_count: post.likes_count,
            post_time: post.post_time,
            type: post.type,
            media_id: post.media_id,
            tags: post.tags
        }))
    }

    if(middle_color){
        middle_color = 'rgb(' + middle_color.split(';').join(', ') + ')'
    }

    if (!path_to_media) {
        getMedia(media_id)
    }

    switch(type) {
        case 1:
            return (
                <div className="audio-post-homepage" style={{
                    border: `2px solid ${borderColor}`
                }}>
                    <FullControl src={path_to_media ? `/get_post_media/${path_to_media}` : null} />
                    <button className="cta" 
                        onClick={() => openPost(post)}
                        style={{ width: '100%', alignItems: 'center', marginTop: '6px',
                            display: 'flex', justifyContent: 'flex-start'
                    }}>
                        <span>Перейти</span>
                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>
            )
        case 2:
            return (
                <div style={{marginTop: '2%'}}>
                    <Video src={path_to_media ? `/get_post_media/${path_to_media}` : null} style={{width: '100%'}} onLoadEnd={() => {console.log('loaded')}}/>
                    <button className="cta" onClick={() => openPost(post)} style={{
                        width: '100%', alignItems: 'center', marginTop: '6px',
                        display: 'flex', justifyContent: 'flex-start'
                    }}>
                        <span>Перейти</span>
                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>
            )
        case 3:
            return (
                <div onClick={() => openPost(post)} style={{marginTop: '2%', boxSizing: 'inherit'}}>
                    {path_to_media ? 
                        <img src={`/get_post_media/${path_to_media}`} alt="картинка" className="hoverBrightness"
                            style={{width: '100%', borderRadius: '15px'}}/>
                        : 
                        <div className="hoverBrightness"
                            style={{width: '100%', borderRadius: '15px', maxHeight: '60vh',
                                backgroundColor: middle_color, aspectRatio: `1 / ${proportion}`,
                                marginLeft: 'auto', marginRight: 'auto'
                        }}>
                        </div>
                    }
                </div>
            )
        case 4:
            return (
                <div onClick={() => openPost(post)} className="hoverBrightness__text"
                    style={{marginTop: '2%', borderRadius: '15px', border: `2px solid ${borderColor}`
                }}>
                    <div style={{margin: '12px'}}>
                        {path_to_media}
                    </div>
                </div>
            )
        default:
            return (
                <div></div>
            )
    }
}