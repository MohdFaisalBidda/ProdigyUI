import { APP_NAME } from '@/constants'
import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className="border-t border-white/[0.05] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#070707] text-white"
        style={{
            padding:"0.875rem 1.5rem"
        }}
        >
            <Link href={"/"} className="hover:text-white/50 transition-colors cursor-pointer text-[11px] text-white/15 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {APP_NAME} — MIT © {new Date().getFullYear()}
            </Link>
            <div className="flex items-center gap-6 text-[11px] text-white/15" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {["Components", "GitHub"].map(l => (
                    <Link key={l} href="#" className="hover:text-white/50 transition-colors">{l}</Link>
                ))}
            </div>
        </footer>
    )
}

export default Footer