/**
 * rankUtils.js — Client-side rank calculator
 * Keep thresholds in sync with Server/src/Utils/rankUtils.js
 */

export const RANKS = [
    { label: "Novice", minScore: 0, emoji: "🌱", color: "text-slate-400", bg: "bg-slate-400/10   border-slate-400/20" },
    { label: "Scholar", minScore: 10, emoji: "📖", color: "text-blue-400", bg: "bg-blue-400/10    border-blue-400/20" },
    { label: "Warrior", minScore: 30, emoji: "⚔️", color: "text-violet-400", bg: "bg-violet-400/10  border-violet-400/20" },
    { label: "Champion", minScore: 60, emoji: "🏆", color: "text-yellow-400", bg: "bg-yellow-400/10  border-yellow-400/20" },
    { label: "Master", minScore: 100, emoji: "🔥", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
]

/**
 * getRank(totalScore) → { label, emoji, color, bg, minScore }
 * Returns the highest rank the student qualifies for.
 */
export const getRank = (totalScore = 0) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (totalScore >= RANKS[i].minScore) return RANKS[i]
    }
    return RANKS[0]
}

/**
 * getLevel(totalScore) → { level, currentXP, xpToNext, progressPercent }
 * Calculates level based on XP, with 50 XP per level.
 */
export const getLevel = (totalScore = 0) => {
    const XP_PER_LEVEL = 50;
    const level = Math.floor(totalScore / XP_PER_LEVEL) + 1;
    const currentXP = totalScore % XP_PER_LEVEL;
    const xpToNext = XP_PER_LEVEL - currentXP;
    const progressPercent = (currentXP / XP_PER_LEVEL) * 100;
    return { level, currentXP, xpToNext, progressPercent };
}
