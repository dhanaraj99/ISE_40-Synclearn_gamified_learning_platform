import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Text } from 'react-native';
import { theme } from '../theme/theme';

interface TechInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const TechInput: React.FC<TechInputProps> = ({ label, error, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    style,
                ]}
            >
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textDim}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    label: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        backgroundColor: theme.colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    inputFocused: {
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    inputError: {
        borderColor: theme.colors.secondary,
    },
    input: {
        ...theme.typography.body,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        color: theme.colors.text,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        marginTop: theme.spacing.xs,
    },
});
