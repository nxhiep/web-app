import React, { useState, useEffect } from 'react';
import { LoadingWidget } from './Widgets';
import ImageError from '../resources/images/error-image-generic.png';
const Image = ({ src, alt = '', width = '', height = '', onClick = () => { }, onLoaded = () => { }, onError = () => { }, className }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
    }, [src]);
    
    const [url, setUrl] = useState(src);
    console.log(url)
    return (React.createElement("span", { className: 'my-image' + (className ? ' ' + className : '') },
        loading ? React.createElement(LoadingWidget, null) : '',
        React.createElement("img", { style: loading ? { display: 'none' } : {}, src: url, alt: alt, width: width, height: height, onLoad: () => {
                onLoaded();
                setLoading(false);
            }, onError: () => {
                onError();
                setLoading(false);
                setUrl(ImageError);
            }, onClick: onClick })));
};
export default Image;
