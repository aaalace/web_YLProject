import React from 'react';
import ReactLoading from 'react-loading';
import './style.less'

const LoadingIcon = (props) => {
    return (
    <div style={{margin: '0 auto', marginTop: '50px'}}>
        <ReactLoading type={'bars'} color={'rgba(172, 128, 193, 1)'} height={20} width={200}/>
    </div>
)}

export default LoadingIcon