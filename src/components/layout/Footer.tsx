import { APP_NAME } from '@/constants'
import Link from 'next/link'
import React from 'react'

function GithubIcon() {
    return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    )
}

function NpmIcon() {
    return (
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.001 3C20.5533 3 21.001 3.44772 21.001 4V20C21.001 20.5523 20.5533 21 20.001 21H4.00098C3.44869 21 3.00098 20.5523 3.00098 20V4C3.00098 3.44772 3.44869 3 4.00098 3H20.001ZM17.001 7H7.00098V17H12.001V9.5H14.501V17H17.001V7Z"></path></svg>
    )
}

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
                <Link href="/components" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                    Components
                </Link>
                <a href="https://www.npmjs.com/package/prodigy-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                    <NpmIcon />
                    npm
                </a>
                {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                    <GithubIcon />
                    GitHub
                </a> */}
            </div>
        </footer>
    )
}

export default Footer