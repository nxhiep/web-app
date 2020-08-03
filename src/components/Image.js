import React, { useState, useEffect } from 'react';
import { LoadingWidget } from './Widgets';
import ImageError from '../resources/images/error-image-generic.png';
const Image = ({ src, alt = '', width = '', height = '', onClick = () => { }, onError = () => { }, className }) => {

    const [url, setUrl] = useState(src);
    return (
        <span className={'my-image' + (className ? ' ' + className : '')}>
            <img  src={url} alt={alt} width={width} height={height}
                onError={() => {
                    onError();
                    setUrl(ImageError);
                }} onClick={onClick} />
        </span>
    );
};
export default Image;
