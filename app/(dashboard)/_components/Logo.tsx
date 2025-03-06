import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image
        src='/full-logo.png'
        alt='Logo'
        width={200}
        height={200}
    />
  )
}

export default Logo