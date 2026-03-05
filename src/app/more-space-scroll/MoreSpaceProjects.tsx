"use client"

import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'

const PROJECTS = [
    {
        name: 'Project 1',
        img: 'img1.avif',
        year: '2022',
    },
    {
        name: 'Project 2',
        img: 'img2.avif',
        year: '2023',
    },
    {
        name: 'Project 3',
        img: 'img3.avif',
        year: '2024',
    },
    {
        name: 'Project 4',
        img: 'img4.avif',
        year: '2025',
    },
    {
        name: 'Project 5',
        img: 'img5.avif',
        year: '2026',
    },
    {
        name: 'Project 6',
        img: 'img6.avif',
        year: '2027',
    },
    {
        name: 'Project 7',
        img: 'img1.avif',
        year: '2028',
    },
    {
        name: 'Project 8',
        img: 'img2.avif',
        year: '2029',
    },
    {
        name: 'Project 9',
        img: 'img3.avif',
        year: '2030',
    },
    {
        name: 'Project 10',
        img: 'img4.avif',
        year: '2031',
    },
    {
        name: 'Project 11',
        img: 'img5.avif',
        year: '2032',
    },
    {
        name: 'Project 12',
        img: 'img6.avif',
        year: '2033',
    },
    {
        name: 'Project 13',
        img: 'img1.avif',
        year: '2034',
    },
    {
        name: 'Project 14',
        img: 'img2.avif',
        year: '2035',
    },
    {
        name: 'Project 15',
        img: 'img3.avif',
        year: '2036',
    },
    {
        name: 'Project 16',
        img: 'img4.avif',
        year: '2037',
    },
    {
        name: 'Project 17',
        img: 'img5.avif',
        year: '2038',
    },
    {
        name: 'Project 18',
        img: 'img6.avif',
        year: '2039',
    },
    {
        name: 'Project 19',
        img: 'img1.avif',
        year: '2040',
    },
    {
        name: 'Project 20',
        img: 'img2.avif',
        year: '2041',
    },
]

const PROJECTS_PER_ROW = 9
const TOTAL_ROWS = 10

function MoreSpaceProjects() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const rowsRef = useRef<HTMLDivElement[]>([])
    const rowStartWidth = useRef<number>(125)
    const rowEndWidth = useRef<number>(500)

    useEffect(() => {
        const section = sectionRef.current
        if(!section) return

        const rows = rowsRef.current        
        const isMobile = window.innerWidth < 1000;
        rowStartWidth.current = isMobile ? 250 : 125
        rowEndWidth.current = isMobile ? 750 : 500

        const firstRow = rows[0]
        firstRow.style.width = `${rowStartWidth.current}%`
        const expandedRowHeight = firstRow.offsetHeight
        firstRow.style.width = ""

        const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
        const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 0;

        const expandedSectionHeight = expandedRowHeight * rows.length + sectionGap * (rows.length - 1) + sectionPadding * 2
        section.style.height = `${expandedSectionHeight}px`

        function onScrollUpdate(){
            const scrollY = window.scrollY
            const viewportHeight = window.innerHeight

            rows.forEach((row, index) => {
                const rec = row.getBoundingClientRect()
                const rowTop = rec.top + scrollY
                const rowBottom = rowTop + rec.height

                const scrollStart = rowTop - viewportHeight
                const scrollEnd = rowBottom;

                let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart)
                progress = Math.max(0, Math.min(1, progress))

                const width = rowStartWidth.current + (rowEndWidth.current - rowStartWidth.current) * progress
                row.style.width = `${width}%`
            })
        }

        gsap.ticker.add(onScrollUpdate)


        const handleResize = () => {
            const isMobile = window.innerWidth < 1000;
            rowStartWidth.current = isMobile ? 250 : 125
            rowEndWidth.current = isMobile ? 750 : 500

            firstRow.style.width = `${rowStartWidth.current}%`
            const newRowHeight = firstRow.offsetHeight
            firstRow.style.width = ""

            const newSectionHeight = newRowHeight * rows.length + sectionGap * (rows.length - 1) + sectionPadding * 2
            section.style.height = `${newSectionHeight}px`
        }

        window.addEventListener("resize", handleResize)
        return () => {
            gsap.ticker.remove(onScrollUpdate)
            window.removeEventListener("resize", handleResize)
        }
    },[])

    const rowsData = [];
    let currentProjectIndex = 0;

    for (let r = 0; r < TOTAL_ROWS; r++) {
        const projects: { name: string, img: string, year: string }[] = []
        for (let c = 0; c < PROJECTS_PER_ROW; c++) {
            projects.push(PROJECTS[currentProjectIndex % PROJECTS.length])
            currentProjectIndex++
        }
        rowsData.push(projects)
    }

    return (
        <section ref={sectionRef} className='projects relative w-full py-2 px-0 flex flex-col items-center gap-x-2 overflow-hidden'>
            {rowsData.map((rowProjects, rowIndex) => (
                <div key={rowIndex} className="projects-row w-[125%] flex gap-4"
                    ref={(el) => {
                        if (el) rowsRef.current[rowIndex] = el
                    }}
                >
                    {rowProjects.map((project, colIndex) => (
                        <div key={colIndex} className="project flex-1 aspect-[7/5] flex flex-col overflow-hidden">
                            <div className="project-img flex-1 min-h-0 overflow-hidden">
                                <img src={project.img} alt={project.name} className='w-full h-full object-cover'/>
                            </div>
                            <div className="project-info flex justify-between" 
                            style={{
                                padding:"0.25rem 0"
                            }}
                            >
                                <p className='uppercase text-xs font-medium leading-4 letter-spacing-wide'>{project.name}</p>
                                <p className='uppercase text-xs font-medium leading-4 letter-spacing-wide'>{project.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default MoreSpaceProjects