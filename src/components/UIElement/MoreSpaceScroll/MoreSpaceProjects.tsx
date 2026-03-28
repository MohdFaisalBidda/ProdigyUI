"use client";

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react'
import { getLocalImage } from '@/lib/images'

gsap.registerPlugin(ScrollTrigger);

export interface Project {
    name: string;
    img: string;
    year: string;
}

export interface MoreSpaceProjectsProps {
    projects?: Project[];
    projectsPerRow?: number;
    totalRows?: number;
}

function MoreSpaceProjects({
    projects,
    projectsPerRow = 9,
    totalRows = 10,
}: MoreSpaceProjectsProps) {
    const defaultProjects: Project[] = [
        { name: 'Project 1', img: getLocalImage(0, 1), year: '2022' },
        { name: 'Project 2', img: getLocalImage(1, 2), year: '2023' },
        { name: 'Project 3', img: getLocalImage(2, 3), year: '2024' },
        { name: 'Project 4', img: getLocalImage(3, 4), year: '2025' },
        { name: 'Project 5', img: getLocalImage(4, 5), year: '2026' },
        { name: 'Project 6', img: getLocalImage(5, 6), year: '2027' },
    ];

    const projectsToUse = projects && projects.length > 0 ? projects : defaultProjects;

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

    for (let r = 0; r < totalRows; r++) {
        const rowProjects: Project[] = []
        for (let c = 0; c < projectsPerRow; c++) {
            rowProjects.push(projectsToUse[currentProjectIndex % projectsToUse.length])
            currentProjectIndex++
        }
        rowsData.push(rowProjects)
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
                                padding:"0.25rem 0 1rem 0"
                            }}
                            >
                                <p className='uppercase text-xs font-medium leading-4 letter-spacing-wide text-[#e8e8e2]'>{project.name}</p>
                                <p className='uppercase text-xs font-medium leading-4 letter-spacing-wide text-[#e8e8e2]'>{project.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default MoreSpaceProjects