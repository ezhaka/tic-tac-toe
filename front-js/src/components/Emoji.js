import React from 'react';

export default function Emoji({type}) {
  switch (type) {
    case 'UNICORN':
      return <span role="img" aria-label="Unicorn">🦄</span>
    case 'HEDGEHOG':
      return <span role="img" aria-label="Hedgehog">🦔</span>
    default:
      throw new Error(`Unkonwn icon type ${type}`)
  }
}
