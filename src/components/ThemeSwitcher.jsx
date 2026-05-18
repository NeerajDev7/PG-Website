import { useEffect, useState } from 'react'

const themes = [
    { value: 'default', label: 'Luxury Green', emoji: '🌿' },
    { value: 'dark', label: 'Dark Mode', emoji: '🌑' },
    { value: 'purple', label: 'Ice Cold', emoji: '❄️' },
    { value: 'ocean', label: 'Desert Night', emoji: '🏜️' },
]

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
            <p className='text-xs font-semibold tracking-wide' style={{ color: 'var(--sidebar-text)' }}>
                THEME
            </p>
            <div className='flex flex-col gap-1'>
                {themes.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition text-left'
                        style={theme === t.value
                            ? { backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-text)' }
                            : { color: 'var(--sidebar-text)' }
                        }
                    >
                        <span>{t.emoji}</span>
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ThemeSwitcher