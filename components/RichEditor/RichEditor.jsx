'use client'
import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import styles from './RichEditor.module.css'
import './CKEditor.css'
import S3Uploader from './S3Uploader';
import { useAppDispatch } from '@/redux/hooks';
import { updateContent } from '@/redux/post/draft.slice';

function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new S3Uploader(loader);
    };
};

const RichEditor = ({ onChange }) => {
    const dispatch = useAppDispatch();

    const editorConfiguration = {
        language:{
            textPartLanguage: [
                { title: 'English', languageCode: 'en' },
                { title: 'German', languageCode: 'de' },
                { title: 'Vietnamese', languageCode: 'vi' },
                { title: 'Chinese', languageCode: 'zh-cn'}
            ]
        },
        toolbar: {
            items: [
                'textPartLanguage', 'heading', 'style', '|',
                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
                'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
                'alignment', 'outdent', 'indent', '|',
                'code', 'codeBlock', 'sourceEditing', 'showBlocks', '|',
                'bulletedList', 'numberedList', 'horizontalLine', '|',
                'link', 'insertImage', 'mediaEmbed', 'blockQuote', '|',
                'undo', 'redo', 'findAndReplace', 'specialCharacters'
            ],
            viewportTopOffset: 30,
            shouldNotGroupWhenFull: true
        },
        ckfinder: {
            uploadUrl: '/uploads'
        },
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                'linkImage'
            ]},
        mediaEmbed: {
            removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
        },
        extraPlugins: [CustomUploadAdapterPlugin]
    };

  return (
    <div className={styles.richEditor}>
        <CKEditor
                editor={ Editor }
                config={ editorConfiguration }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    // console.log( { event, editor, data } );
                    dispatch(updateContent(data));
                    onChange(data);
                } }
            />
    </div>
  )
}

export default RichEditor