'use client'

import React, { type FC } from 'react'
import { AnimatePresence, motion as m } from 'framer-motion'
import cx from 'classnames'

interface FallingTextProps {
  children: string
  className?: string
}

const FallingText: FC<FallingTextProps> = ({ children, className }) => {
  const wordsArray = children.split(' ')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const wordVariants = {
    hidden: {
      y: -75,
      opacity: 0,
      rotate: 3
    },
    visible: {
      y: [-300, 0, -30, -30, 0],
      rotate: [0, -5, 5, 0],
      opacity: 1
    }
  }

  return (
        <AnimatePresence mode="wait">
            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cx('flex flex-wrap', className)}
            >
                {wordsArray.map((word, index) => (
                    <m.p key={index} variants={wordVariants}>
                        {word}
                        &nbsp;
                    </m.p>
                ))}
            </m.div>
        </AnimatePresence>
  )
}

export default FallingText
