export const loadState = () => {
    try {
        const serialized = localStorage.getItem('pg-manager-state')
        if (!serialized) return undefined
        return JSON.parse(serialized)
    } catch {
        return undefined
    }
}

export const saveState = (state) => {
    try {
        const serialized = JSON.stringify(state)
        localStorage.setItem('pg-manager-state', serialized)
    } catch {
        // ignore
    }
}