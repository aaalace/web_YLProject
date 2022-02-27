import './style.css';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ButtonPost } from '../ButtonPost/index';
import Axios from 'axios';

import { AudioBox } from '../PostTypes/AudioPost';
import { VideoPost } from '../PostTypes/VideoPost';
import { ImagePost } from '../PostTypes/ImagePost';
import { TextPost } from '../PostTypes/TextPost';
import { PostTypeError } from '../PostTypes/PostTypeError';

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

export const NewPostPage = ({createNewPost}) => {
    const [formats, setFormats] = useState(JSON.parse(JSON.stringify(initialFormats)));
    const [contentFormatClass, setContentFormatClass] = useState('create-post-content__format');
    const [formatSelected, setFormatSelected] = useState(false);

    const [audioData, setAudioData] = useState(false);
    const [videoData, setVideoData] = useState(false);
    const [imageData, setImageData] = useState(false);
    const [textData, setTextData] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false)

    const closeCreatingPage = () => {
        setFormats(JSON.parse(JSON.stringify(initialFormats)));
        setContentFormatClass('create-post-content__format');
        setFormatSelected(false)
        createNewPost();
    }

    const selectFormat = (id) => {
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

    const postData = () => {
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

        Axios.post('/createPost',
            {
                type: formatSelected,
                body: postBody
            }
        ).then((response) => {
            console.log(response);
        })
    }

    return (
        <div className='create-post-box'>
            <div className='create-post-box__close' onClick={closeCreatingPage}>
                <i className="create-post-box__close-icon fa-solid fa-xmark"/>
            </div>
            <div className='create-post-content'>
                <div className='create-post-content__title'>
                    <h4 className='create-post__title'>Создание публикации</h4>
                </div>
                <hr/>
                <div className={contentFormatClass}>
                    {renderFormats}
                </div>
                {formatSelected ? <div className='drag-and-drop-window'>
                    {
                        formatSelected === 1 ? <AudioBox audioData={audioData} setAudioData={setAudioData} setContentLoaded={setContentLoaded}/> : 
                        formatSelected === 2 ? <VideoPost videoData={videoData} setVideoData={setVideoData} setContentLoaded={setContentLoaded}/> :
                        formatSelected === 3 ? <ImagePost imageData={imageData} setImageData={setImageData} setContentLoaded={setContentLoaded}/> :
                        formatSelected === 4 ? <TextPost textData={textData} setTextData={setTextData}/> : 
                        <PostTypeError />
                    }
                    {
                        contentLoaded || formatSelected === 4 ? 
                            <div style={{textAlign: 'end', marginTop: '8px'}}>
                                <span onClick={() => {postData()}}><ButtonPost /></span>
                            </div>
                        : null
                    }
                </div> : null}
            </div>
        </div>
    )
}