import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme/theme';
import { NeonButton } from '../src/components/NeonButton';

export default function GatewayScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SYNC<Text style={styles.highlight}>LEARN</Text></Text>
        <Text style={styles.subtitle}>Student Portal</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.prompt}>Select Connectivity Mode</Text>

        <View style={styles.buttonContainer}>
          <NeonButton
            title="Online Mode"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
          <NeonButton
            title="Offline Mode"
            variant="outline"
            onPress={() => router.push('/(offline)')}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 42,
    letterSpacing: 2,
  },
  highlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.h3,
    color: theme.colors.textDim,
    marginTop: theme.spacing.xs,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  prompt: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
    color: theme.colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});
