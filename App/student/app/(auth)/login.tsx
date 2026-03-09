import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme/theme';
import { TechInput } from '../../src/components/TechInput';
import { NeonButton } from '../../src/components/NeonButton';
import { GlassCard } from '../../src/components/GlassCard';
import { loginStudent } from '../../src/api/authService';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string, api?: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let valid = true;
        let newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S/.test(email)) {
            newErrors.email = 'Invalid email format';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (validate()) {
            setLoading(true);
            try {
                await loginStudent({ email, password });
                router.replace('/(tabs)' as any); // Replace with actual core route later
            } catch (err: any) {
                setErrors(prev => ({ ...prev, api: err.response?.data?.message || 'Login failed' }));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>{'<'} BACK</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>STUDENT<Text style={styles.highlight}>LOGIN</Text></Text>
                    <Text style={styles.subtitle}>Secure Access Required</Text>
                </View>

                <GlassCard style={styles.card}>
                    {errors.api && <Text style={styles.apiError}>{errors.api}</Text>}
                    <TechInput
                        label="Email Address"
                        placeholder="student@learnsync.com"
                        value={email}
                        onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: undefined })) }}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TechInput
                        label="Security Key"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: undefined })) }}
                        error={errors.password}
                        secureTextEntry
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity>
                            <Text style={styles.forgotText}>LOST KEY?</Text>
                        </TouchableOpacity>
                    </View>

                    <NeonButton
                        title={loading ? "Authenticating..." : "Authenticate"}
                        disabled={loading}
                        onPress={handleLogin}
                        style={styles.loginButton}
                    />
                </GlassCard>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        position: 'absolute',
        top: 60,
        left: theme.spacing.lg,
        zIndex: 10,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    backText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    titleContainer: {
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.xxl * 2,
    },
    title: {
        ...theme.typography.h1,
        letterSpacing: 2,
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
    apiError: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    card: {
        width: '100%',
    },
    actions: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.xs,
    },
    forgotText: {
        ...theme.typography.caption,
        color: theme.colors.textDim,
    },
    loginButton: {
        width: '100%',
    },
});
