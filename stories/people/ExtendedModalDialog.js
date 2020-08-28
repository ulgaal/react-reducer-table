/*
Copyright 2020 Ulrich Gaal

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { useBootstrapPrefix } from 'react-bootstrap/esm/ThemeProvider'
import './ExtendedModalDialog.css'

const propTypes = {
  /** @default 'modal' */
  bsPrefix: PropTypes.string,

  /**
   * Render a large, extra large or small modal.
   *
   * @type ('sm'|'lg','xl')
   */
  size: PropTypes.string,

  /**
   * Specify whether the Component should be vertically centered
   */
  centered: PropTypes.bool,

  /**
   * Allows scrolling the `<Modal.Body>` instead of the entire Modal when overflowing.
   */
  scrollable: PropTypes.bool
}

const ModalDialog = React.forwardRef(
  (
    {
      bsPrefix,
      className,
      centered,
      size,
      children,
      scrollable,
      width,
      height,
      minConstraints,
      position,
      onStop,
      onResize,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'modal')
    const dialogClass = `${bsPrefix}-dialog`

    return (
      <Draggable handle='.modal-title' position={position} onStop={onStop}>
        <div
          {...props}
          ref={ref}
          className={classNames(
            dialogClass,
            className,
            size && `${bsPrefix}-${size}`,
            centered && `${dialogClass}-centered`,
            scrollable && `${dialogClass}-scrollable`
          )}
        >
          <ResizableBox
            width={width}
            height={height}
            minConstraints={minConstraints}
            onResize={onResize}
          >
            <div className={`${bsPrefix}-content`}>{children}</div>
          </ResizableBox>
        </div>
      </Draggable>
    )
  }
)

ModalDialog.displayName = 'ModalDialog'
ModalDialog.propTypes = propTypes

export default ModalDialog

/*

import classNames from 'classnames'
import React from 'react'
import 'react-resizable/css/styles.css'
import './ExtendedModalDialog.css'
import { Resizable } from 'react-resizable'

import {
  getClassSet,
  prefix,
  splitBsProps
} from 'react-bootstrap/lib/utils/bootstrapUtils'

const ModalDialog = props => {
  // console.log('ModalDialog', props)
  const {
    dialogClassName,
    className,
    style,
    children,
    width,
    height,
    minConstraints,
    position,
    onStop,
    onResize,
    ...rest
  } = props
  const [bsProps, elementProps] = splitBsProps(rest)
  const bsClassName = prefix(bsProps)
  const modalStyle = { display: 'block', ...style }

  const dialogClasses = {
    ...getClassSet(bsProps),
    [bsClassName]: false,
    [prefix(bsProps, 'dialog')]: true
  }

  return (
    <Draggable handle='.modal-title' position={position} onStop={onStop}>
      <div
        {...elementProps}
        tabIndex='-1'
        role='dialog'
        style={modalStyle}
        className={classNames(className, bsClassName)}
      >
        <div className={classNames(dialogClassName, dialogClasses)}>
          <Resizable
            className='resizable-target'
            width={width}
            height={height}
            minConstraints={minConstraints}
            onResize={onResize}
          >
            <div
              className={'resizable-target ' + prefix(bsProps, 'content')}
              role='document'
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              {children}
            </div>
          </Resizable>
        </div>
      </div>
    </Draggable>
  )
}
export default ModalDialog
*/
