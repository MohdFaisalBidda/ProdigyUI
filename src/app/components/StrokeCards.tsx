import React from 'react'
import Cards from './Cards'

function StrokeCards() {
  return (
    <div
      style={{
        padding: "0 2rem"
      }}
    >
      <header className='flex justify-center items-center text-center px-8'
        style={{
          padding: "30rem 0"
        }}
      >
        <h1 className='text-[clamp(2rem,5vw,7rem)] font-medium leading-[1.25] tracking-[-0.035rem]'>
          The Stroke cards
        </h1>
      </header>

      <div className='w-full flex flex-col justify-center items-center gap-10'
      >

        <div className="w-full flex flex-col md:flex-row justify-center items-center p-0.5 mb-[1rem] gap-4">
          <Cards imgSrc='/img1.avif'/>
          <Cards imgSrc='/img2.avif'/>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-center items-center p-0.5 mb-[1rem] gap-4">
          <Cards imgSrc='/img3.avif'/>
          <Cards imgSrc='/img4.avif'/>
        </div>  

        <div className="w-full flex flex-col md:flex-row justify-center items-center p-0.5 mb-[1rem] gap-4">
          <Cards imgSrc='/img5.avif'/>
          <Cards imgSrc='/img6.avif'/>
        </div>
      </div>


      <footer className='flex justify-center items-center text-center px-8'
        style={{
          padding: "30rem 0"
        }}
      >
        <h1 className='text-[clamp(2rem,5vw,7rem)] font-medium leading-[1.25] tracking-[-0.035rem]'>
          End of Interaction
        </h1>
      </footer>
    </div>
  )
}

export default StrokeCards