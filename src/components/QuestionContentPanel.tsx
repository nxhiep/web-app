import { Grid } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { showImageDialog } from '../redux/actions/appValue';
import { AppState } from '../redux/appstate';
import Image from './Image';
import { AppInfoState } from '../redux/reducers/appInfo';
import { useParams } from 'react-router-dom';

export enum TextContentType {
    question = 1,
    answer = 2,
    explanation = 3,
}

const QuestionContentPanel: FunctionComponent<({ 
    content: string, 
    image?: string,
    type: TextContentType,
    showImageDialog: any,
    appInfoState: AppInfoState
})> = ({ 
    content, 
    image = '',
    type = TextContentType.question,
    showImageDialog,
    appInfoState
}) => {
    let { appNameId } = useParams();
    let { bucket } = appInfoState.data[appNameId ?? ''];
    bucket = bucket ?? '';
    console.log("QuestionContentPanel bucket ", bucket);
    content = content.replace(/\n/g,"<br/>").replace(/\\u(....)/g, "&#x$1;");
    if(type === TextContentType.question){
        return <TextContentQuestion content={content} image={image} showImageDialog={showImageDialog} type={type} bucket={bucket} />
    }
    return <TextContent content={content} type={type} bucket={bucket} />
}

const getUrlImage = (bucket: string, name: string): string => {
    return 'https://storage.googleapis.com/micro-enigma-235001.appspot.com/'+bucket+'/images/' + name;
}

const TextContent: FunctionComponent<({ 
    content: string, 
    type: TextContentType,
    bucket: string
    })> = ({ 
    content, 
    type,
    bucket
    }) => {
    let result = content.split('$').map((str) => {
        if(isImage(str)){
            let size = getSizeImage(str);
            return '<img style="cursor:pointer;display:inline-block;vertical-align:middle" alt="" src="'+getUrlImage(bucket, str)+'" width="'+size.width+'" height="'+size.height+'" />'
        }
        return str;
    }).join('');
    return (
        <div style={type == TextContentType.explanation ? {marginBottom: '10px'} : {}}>{ReactHtmlParser(result)}</div>
    );
}

const TextContentQuestion: FunctionComponent<({ 
    content: string, 
    image: string,
    showImageDialog: any,
    type: TextContentType,
    bucket: string
    })> = ({ 
    content, 
    image,
    showImageDialog,
    type,
    bucket
}) => {
    if (!image) {
        if(hasImage(content)){
            return <TextContent content={content} type={type} bucket={bucket} />;
        }
        return (
            <div>{ReactHtmlParser(content)}</div>
        );
    }
    let imageUrl = getUrlImage(bucket, image);
    return (
        <Grid
            container
            direction="row"
            alignItems="flex-start"
            style={{marginBottom: '10px'}}
        >
            <Grid
                item
                xs={9}
            >
                {ReactHtmlParser(content)}
            </Grid>
            <Grid
                item
                xs={3}
            >
                <Image
                    className="image-in-question" 
                    width="100%" 
                    src={imageUrl} alt="" 
                    onClick={() => showImageDialog(imageUrl)} 
                />
            </Grid>
        </Grid>
    );
}

function hasImage(str: string): boolean {
    return (!!str) && (str.includes(".png") || str.includes(".jpg") 
    || str.includes(".gif") || str.includes(".tiff") || str.includes(".bmp")); 
}

function isImage(str: string): boolean {
    return (!!str) && (str.endsWith(".png") || str.endsWith(".jpg") 
    || str.endsWith(".gif") || str.endsWith(".tiff") || str.endsWith(".bmp")); 
}

function getSizeImage(str: string) : { width: string, height: string } {
    let i1: number = str.indexOf('_'), i2: number = str.lastIndexOf('.');
    if(i1 > -1 && i2 > -1){
        let sizeStr = str.substring(i1, i2);
        let i3: number = sizeStr.indexOf('_w'), i4: number = sizeStr.lastIndexOf('_h');
        let width = sizeStr.substring(i3 + 2, i4);
        let height = sizeStr.substring(i4 + 2, sizeStr.length);
        return { width: width+'px', height: height+'px' };
    }
    return { width: '50px', height: '50px' };
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        appInfoState: state.appInfoState
    }
}

const mapDispatchToProps = {
    showImageDialog: (url: string) => showImageDialog(url),
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionContentPanel);