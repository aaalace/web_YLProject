import { Link } from 'react-router-dom';
import { nanoid } from "nanoid";
import { UsersConnect } from '../../../connect/Users';
import Axios from 'axios';
import { IconLoader } from '../../Loaders/icons';
import { TextLoader } from '../../Loaders/text';
import { useDispatch } from 'react-redux';
import { toggleChatList } from '../../../store/currentPage/actions';


export const ChatsList = ({chats, selectedId, setSelectedId}) => {
    const dispatch = useDispatch()
    const handleClick = (id) => {
        dispatch(toggleChatList())
        setSelectedId({type: 'chat', id})
    }

    return (
        <>
            {
                Object.values(chats).map(chat => (
                    <Link className='chat-link' to={`/forum/chat/${chat.id}`} key={nanoid(8)}
                        onClick={() => {handleClick(chat.id)}}
                        style={{backgroundColor: 
                            chat.id === selectedId.id && selectedId.type === 'chat' ? 'var(--chat-focus-color)' : null
                    }}>
                        <ListEl userId={chat.user_id} chat={chat} />
                    </Link> 
                ))
            }
        </>
    )
}

const ListEl = UsersConnect(({user, chat, setUserN}) => {
    if (!user) {
        Axios.get('https://sya.syaapihandler.ru/get_oth/', {
            params: {user_id: chat.user_id}
        }).then(response => {
            setUserN({user_id: chat.user_id, data: response.data})
        })
    }

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {user ? <img alt="avatar"
                style={{
                    objectFit: 'cover',
                    width: '50px',
                    aspectRatio: '1 / 1',
                    height: '50px',
                    borderRadius: '18px',
                    margin: '0 10px 0 0'
                }}
                src={`https://sya.syaapihandler.ru/get_post_media/${user.path_to_media}`}
            /> : <IconLoader style={{margin: '0 10px 0 0'}} />}
            <div>
                {user ? 
                    <b>{user.profileName}</b> 
                    : <TextLoader />
                }
            </div>
        </div>
    )
})