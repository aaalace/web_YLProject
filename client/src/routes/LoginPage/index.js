import { useDispatch, useSelector } from 'react-redux';
import { setUserDataReducer } from '../../store/user/actions';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './style.css'
import Axios from 'axios';
import LoadingIcon from '../../components/Loading';
import TextField from '@mui/material/TextField';

const BoxStyles = {
    width: '80%',
    maxWidth: '600px',
    borderRadius: '20px',
    margin: '20vh auto',
    textAlign: 'center',
    padding: '24px 24px 30px'
}

const inputStyles = {
    background: 'rgba(244, 244, 244, 0.7)',
    boxSizing: 'borderBox',
    borderRadius: '5px',
    marginTop: '24px',
}

const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: '0 auto',
}

const buttonsStyles = {
    background: '#AC80C1',
    border: '1px solid rgba(175, 175, 175, 0.3)',
    borderRadius: '5px',
    color: '#FFFFFF',
    padding: '6px',
}


export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ checked, setChecked ] = useState(false);
    const [ profileName, setProfileName ] = useState('');
    const [ profilePassword, setProfilePassword ] = useState('');
    const [ logging, setLogging ] = useState(false)

    const handlerLog = (arg) => {
        setLogging(true)
        if(arg === 'home'){
            Axios.post('/checkLoged',
                {
                    profile_name: profileName,
                    profile_password: profilePassword
                }
            ).then((response) => {
                if(response.data.loged){
                    dispatch(setUserDataReducer({
                        loged: true, 
                        profileName: profileName, 
                        profilePassword: profilePassword, 
                        personName: response.data.name, // нужно как то InstrumentedAttribute сюда отправлять
                        personSurname: response.data.surname, // нужно как то InstrumentedAttribute сюда отправлять
                        userBirthDate: response.birth_date // нужно как то InstrumentedAttribute сюда отправлять
                    }));
                    navigate('/');
                }
                else{
                    navigate('/')
                }
            })
        }
        if(arg === 'reg'){
            navigate('/signup')
        }

    }

    return(
        <div style={{display: 'flex'}}>
            {logging ? <LoadingIcon/> :
            <div style={BoxStyles}>
                <h2 style={{fontStyle: 'normal', fontWeight: 'normal',
                fontSize: '20px', lineHeight: '23px', color: 'rgba(0, 0, 0, 0.7)'
                }}>Авторизация</h2>
                <div style={formStyles}>
                <TextField
                        label="Имя профиля"
                        type="name"
                        variant="standard"
                        style={inputStyles}
                        onChange={e => setProfileName(e.target.value)}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        variant="standard"
                        style={inputStyles}
                        onChange={e => setProfilePassword(e.target.value)}
                    />
                    <div style={{display: 'grid', gridTemplateColumns: '2fr 3fr', gridGap: '13px', marginTop: '36px'}}>
                        <button style={buttonsStyles} onClick={() => handlerLog('home')}>Войти</button>
                        <button style={{...buttonsStyles, background: 'rgba(172, 128, 193, 0.7)'}} onClick={() => handlerLog('reg')}>Регистрация</button>
                    </div>
                    <div className='faq'/>
                </div>
            </div>}
        </div>
    )
}