import { APP_NAME } from '@/constants'
import Link from 'next/link'
import React from 'react'

function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-[#070707]/[0.5] backdrop-blur-sm"
        style={{
            padding:"1.5rem 1rem"
        }}
        >
            <Link href="/" className="flex items-center gap-2.5 group">
                <span className="text-sm tracking-widest uppercase text-white/50 group-hover:text-white transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {APP_NAME}
                </span>
            </Link>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 text-[13px] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {["Components", "GitHub"].map(l => (
                        <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Header