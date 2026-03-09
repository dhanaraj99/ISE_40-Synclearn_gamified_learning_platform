import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(20, 20, 26, 0.7)', // Semi-transparent surface
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        // Add backdrop filter in web or via expo-blur if needed,
        // but for simple React Native, a border and transparency look close enough
    },
});
