import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme/theme';

interface NeonButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
}) => {
    const isOutline = variant === 'outline';
    const color = variant === 'secondary' ? theme.colors.secondary : theme.colors.primary;
    const glow = variant === 'secondary' ? theme.colors.glowRed : theme.colors.glow;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
                styles.button,
                isOutline ? { borderColor: color, borderWidth: 1 } : { backgroundColor: color },
                !isOutline && !disabled && {
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    elevation: 10,
                },
                disabled && styles.disabled,
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    isOutline ? { color: color } : { color: theme.colors.background },
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        ...theme.typography.h3,
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    disabled: {
        opacity: 0.5,
    },
});
