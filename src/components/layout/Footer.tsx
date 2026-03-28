import { APP_NAME } from '@/constants'
import Link from 'next/link'
import { ComponentsIcon, NpmIcon } from './Icons'

function Footer() {
    return (
        <footer className="border-t border-white/[0.05] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#070707] text-white"
            style={{
                padding: "0.875rem 1.5rem"
            }}
        >
            <Link href={"/"} className="hover:text-white/50 transition-colors cursor-pointer text-[11px] text-white/15 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {APP_NAME} — MIT © {new Date().getFullYear()}
            </Link>
            <div className="flex items-center gap-6 text-[11px] text-white/15" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <Link href="/components" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                    <ComponentsIcon />
                    Components
                </Link>
                <a href="https://www.npmjs.com/package/prodigy-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                    <NpmIcon />
                    npm
                </a>
                <a target="_blank" href="/sitemap.xml" className="hover:text-white/50 transition-colors">
                    sitemap.xml
                </a>
                <a target="_blank" href="/robots.txt" className="hover:text-white/50 transition-colors">
                    robots.txt
                </a>
            </div>
        </footer>
    )
}

export default Footer
