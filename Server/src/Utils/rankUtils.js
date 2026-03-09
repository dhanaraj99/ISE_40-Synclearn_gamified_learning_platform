/**
 * rankUtils.js — Shared XP rank calculator
 * Derives a student's rank from their totalScore.
 * Keep thresholds in sync with client/src/utils/rankUtils.js
 */

const RANKS = [
    { label: "Novice", minScore: 0, emoji: "🌱" },
    { label: "Scholar", minScore: 10, emoji: "📖" },
    { label: "Warrior", minScore: 30, emoji: "⚔️" },
    { label: "Champion", minScore: 60, emoji: "🏆" },
    { label: "Master", minScore: 100, emoji: "🔥" },
]

/**
 * getRank(totalScore) → { label, emoji, minScore }
 * Returns the highest rank the student qualifies for.
 */
const getRank = (totalScore = 0) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (totalScore >= RANKS[i].minScore) return RANKS[i]
    }
    return RANKS[0]
}

const BONUS_XP = 10   // awarded on first successful lesson completion

/**
 * getLevel(totalScore) → { level, currentXP, xpToNext, progressPercent }
 * Calculates level based on XP, with 50 XP per level.
 */
const getLevel = (totalScore = 0) => {
    const XP_PER_LEVEL = 50;
    const level = Math.floor(totalScore / XP_PER_LEVEL) + 1;
    const currentXP = totalScore % XP_PER_LEVEL;
    const xpToNext = XP_PER_LEVEL - currentXP;
    const progressPercent = (currentXP / XP_PER_LEVEL) * 100;
    return { level, currentXP, xpToNext, progressPercent };
}

module.exports = { getRank, RANKS, BONUS_XP, getLevel }
