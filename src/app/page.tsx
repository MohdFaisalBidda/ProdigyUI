import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <Link href={"/team-section"}>Team Section</Link>
      <Link href={"/gooey-bar"}>Gooey Bar</Link>
      <Link href={"/stroke-cards"}>Stroke Cards</Link>
    </div>
  )
}

export default page