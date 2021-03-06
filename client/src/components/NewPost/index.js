import './style.css';
import './inputTags.css';
import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ButtonPost } from '../ButtonPost/index';
import Axios from 'axios';

import { AudioBox } from '../PostTypes/AudioPost';
import { VideoPost } from '../PostTypes/VideoPost';
import { ImagePost } from '../PostTypes/ImagePost';
import { TextPost } from '../PostTypes/TextPost';
import { PostTypeError } from '../PostTypes/PostTypeError';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';

import { addNewPost } from '../../store/profilePosts/actions';
import { addUserPost } from '../../store/user/actions';
import { Rect1 } from '../Header';
import { Rect2 } from '../Header';
import { Rect3 } from '../Header';


const initialFormats = [
    {
        id: 1,
        text: 'Аудио',
        classNameBlock: 'format format-audio',
        className: 'fa-solid fa-music',
    },
    {
        id: 2,
        text: 'Видео',
        classNameBlock: 'format format-video',
        className: 'fa-solid fa-video',
    },
    {
        id: 3,
        text: 'Изображение',
        classNameBlock: 'format format-photo',
        className: 'fa-solid fa-image',
    },
    {
        id: 4,
        text: 'Текст',
        classNameBlock: 'format format-text',
        className: 'fa-solid fa-envelope-open-text',
    }
]

export const NewPostPage = ({createNewPost, setCreatePost}) => {
    const [formats, setFormats] = useState(JSON.parse(JSON.stringify(initialFormats)));
    const [contentFormatClass, setContentFormatClass] = useState('create-post-content__format');
    const [formatSelected, setFormatSelected] = useState(false);
    const userId = useSelector((state) => state.user.profile_id);
    const user = useSelector((state) => state.user);

    const [audioData, setAudioData] = useState(false);
    const [videoData, setVideoData] = useState(false);
    const [imageData, setImageData] = useState(false);
    const [textData, setTextData] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const dispatch = useDispatch()
    const [postProportion, setPostProportion] = useState(0);
    const [tags, setTags] = useState('');
    const [error, setError] = useState('')

    const [postStatus, setPostStatus] = useState({
        loading: false,
    })

    const closeCreatingPage = () => {
        setFormats(JSON.parse(JSON.stringify(initialFormats)));
        setContentFormatClass('create-post-content__format');
        setFormatSelected(false)
        createNewPost();
    }

    const selectFormat = (id) => {
        if (formatSelected) {
            setFormats(JSON.parse(JSON.stringify(initialFormats)));
            setContentFormatClass('create-post-content__format');
            setFormatSelected(false);
            return 'formats-init';
        }
        setFormats(items => items.map(item => {
            if (item.id !== id) {
                item.classNameBlock += ' test_class';
            } else {
                item.classNameBlock += ' grow_class';
                setFormatSelected(item.id);
                setContentFormatClass('create-post-content__format content-grow_class');
            }
            return item;
        }))
    }

    const renderFormats = formats.map((format) =>
        <div className={format.classNameBlock} key={format.id} onClick={() => {selectFormat(format.id)}}>
            <span>{format.text}</span><i className={format.className}/>
        </div>
    );

    useEffect(() => {
        if (tags.search('`') !== -1) {
            setError('В теге не должен встречаться символ `')
        } else {
            setError('')
        }
    }, [tags])

    const handleTagInput = (e) => {
        setTags(e.target.value);
    }

    const postData = () => {
        if (tags.search('`') !== -1) {
            setError('В теге не должен встречаться символ `')
            return false
        }

        let postBody = audioData;
        if (formatSelected === 2) {
            postBody = videoData;
        } else if (formatSelected === 3) {
            postBody = imageData;
        } else if (formatSelected === 4) {
            postBody = textData;
        } else if (formatSelected !== 1) {
            return 'error'
        }
        
        setPostStatus((prevState) => ({
            ...prevState,
            loading: true,
        }));
        Axios.post('https://sya.syaapihandler.ru/createPost',
            {
                userId,
                type: formatSelected,
                body: postBody,
                proportion: postProportion,
                tags
            }
        ).then((response) => {
            setPostStatus((prevState) => ({
                ...prevState,
                loading: false,
            }));
            dispatch(addNewPost({
                userId: response.data.userId, post_id: response.data.post_id, data: {...response.data.data, user_name: user.profileName, 
                path_to_avatar: user.path_to_media}, media: {[response.data.data.media_id]: response.data.media}
            }))
            dispatch(addUserPost(response.data.post_id))
        })
        setCreatePost(false)
    }

    return (
        <div className='create-post-box'>
            <div className='create-post-content'>
                <div className='create-post-content__title' 
                    style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                    <h4 className='create-post__title'>Опубликовать</h4>
                    <svg viewBox="0 0 100 80" width="40" height="40" onClick={closeCreatingPage}>
                        <Rect1 rx="7" ry="7" open={true}/>
                        <Rect2 y="30" rx="7" ry="7" open={true}/>
                        <Rect3 y="60" rx="7" ry="7" open={true}/>
                    </svg>
                </div>
                <div className={contentFormatClass}>
                    {renderFormats}
                </div>
                {formatSelected ? <div className='drag-and-drop-window'>
                    {
                        formatSelected === 1 ? <AudioBox audioData={audioData} setAudioData={setAudioData} setContentLoaded={setContentLoaded}/> : 
                        formatSelected === 2 ? <VideoPost setPostProportion={setPostProportion} videoData={videoData} setVideoData={setVideoData} setContentLoaded={setContentLoaded}/> :
                        formatSelected === 3 ? <ImagePost setPostProportion={setPostProportion} imageData={imageData} setImageData={setImageData} setContentLoaded={setContentLoaded}/> :
                        formatSelected === 4 ? <TextPost textData={textData} setTextData={setTextData}/> : 
                        <PostTypeError />
                    }
                    {
                        contentLoaded || formatSelected === 4 ? 
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '24px'}}>
                                <div className="page" style={{width: '49%'}}>
                                    <label className="field field_v3" style={{width: '100%'}}>
                                        <input className="field__input" placeholder="SYA1 SYA2 SYA3" 
                                            style={{width: '100%', color: 'var(--text-black-to-purple-color)'}} onChange={e => handleTagInput(e)}
                                        />
                                        <span className="field__label-wrap">
                                            <span className="field__label" style={{
                                                color: 'var(--text-black-to-purple-color)'
                                            }}>
                                                Добавьте до 4 тегов
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <ButtonPost loading={postStatus.loading} postData={postData} />
                            </div>
                        : null
                    }
                    <p style={{color: 'red'}}>{error}</p>
                </div> : null}
            </div>
        </div>
    )
}