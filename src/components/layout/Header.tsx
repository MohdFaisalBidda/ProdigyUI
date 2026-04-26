import { APP_NAME } from '@/constants'
import Link from 'next/link'
import { ComponentsIcon, NpmIcon } from './Icons'

function MCPIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-[#070707]/[0.5] backdrop-blur-sm"
            style={{
                padding: "1.5rem 1rem"
            }}
        >
            <Link href="/" className="flex items-center gap-2.5 group">
                <span className="text-sm tracking-widest uppercase text-white/50 group-hover:text-white transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {APP_NAME}
                </span>
            </Link>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 text-[13px] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <Link href="/components" className="flex items-center gap-2 hover:text-white transition-colors">
                        <ComponentsIcon />
                        Components
                    </Link>
                    {/* <Link href="/mcp" className="flex items-center gap-2 hover:text-white transition-colors">
                        <MCPIcon />
                        MCP
                    </Link> */}
                    <a href="https://www.npmjs.com/package/prodigy-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                        <NpmIcon />
                        npm
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Header
