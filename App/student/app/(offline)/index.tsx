import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { NeonButton } from '../../src/components/NeonButton';

export default function OfflineDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>OFFLINE<Text style={styles.highlight}>MODE</Text></Text>
                <Text style={styles.subtitle}>Local Data Access</Text>
            </View>

            <GlassCard style={styles.card}>
                <Text style={styles.infoText}>
                    You are currently in Offline Mode. This dashboard uses local storage (AsyncStorage/SQLite) to display cached data.
                </Text>

                <View style={styles.statusBox}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Local Cache Active</Text>
                </View>

                <NeonButton
                    title="Return to Gateway"
                    variant="outline"
                    onPress={() => router.back()}
                    style={styles.button}
                />
            </GlassCard>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h1,
        letterSpacing: 1,
    },
    highlight: {
        color: theme.colors.primary,
    },
    subtitle: {
        ...theme.typography.caption,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: theme.spacing.xs,
    },
    card: {
        alignItems: 'center',
    },
    infoText: {
        ...theme.typography.body,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.xl,
    },
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceHighlight,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.round,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.secondary,
        marginRight: theme.spacing.sm,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    },
    statusText: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
    },
    button: {
        width: '100%',
    },
});
