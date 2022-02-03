import React, { useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import { Controlled as ControlledEditor } from 'react-codemirror2'

const style = {
  editorContainer: {
    flexGrow: '1',
    flexBasis: '0',
    display: 'flex',
    flexDirection: 'column',
    padding: '.5rem',
    backgroundColor: 'hsl(225, 6%, 25%)'
  },
  editorContainerCollapsed: {
    flexGrow: '0'
  },
  editorTitle :{
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'hsl(225, 6%, 13%)',
    color: 'white',
    padding: '.5rem .5rem .5rem 1rem',
    borderTopRightRadius: '.5rem',
    borderTopLeftRadius: '.5rem'
  },
  codeMirrorWrapper: {
    flexGrow: 1,
    borderBottomRightRadius: '.5rem',
    borderBottomLeftRadius: '.5rem',
    overflow: 'hidden',
  }
}

export default function Editor(props) {
  const {
    language,
    displayName,
    value,
    onChange
  } = props

  function handleChange(editor, data, value) {
    onChange(value)
  }

  return (
    <div style={style.editorContainer}>
      <div style={style.editorTitle}>
        {displayName}
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        style={style.codeMirrorWrapper}
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: 'material',
          lineNumbers: true
        }}
      />
    </div>
  )
}