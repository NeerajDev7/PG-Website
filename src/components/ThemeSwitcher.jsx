import { useEffect, useState } from 'react'

function ThemeSwitcher() {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'default'
    )

    useEffect(() => {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme')
        } else {
            document.documentElement.setAttribute('data-theme', theme)
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className='flex flex-col gap-2'>
            <p
                className='text-xs font-semibold tracking-wide'
                style={{ color: 'var(--text-secondary)' }}
            >
                THEME
            </p>

            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className='w-full px-3 py-2 rounded-lg text-sm outline-none'
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                }}
            >
                <option value='default'>Luxury Green</option>
                <option value='dark'>Dark Mode</option>
                <option value='purple'>Royal Purple</option>
                <option value='ocean'>Ocean Blue</option>
            </select>
        </div>
    )
}

export default ThemeSwitcher