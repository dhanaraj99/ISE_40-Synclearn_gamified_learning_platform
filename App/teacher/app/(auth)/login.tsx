import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme/theme';
import { TechInput } from '../../src/components/TechInput';
import { NeonButton } from '../../src/components/NeonButton';
import { GlassCard } from '../../src/components/GlassCard';
import { loginAdmin, loginTeacher } from '../../src/api/authService';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string, api?: string }>({});
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<'teacher' | 'admin'>('teacher');

    const isAdmin = role === 'admin';

    const validate = () => {
        let valid = true;
        let newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
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
                if (isAdmin) {
                    await loginAdmin({ email, password });
                } else {
                    await loginTeacher({ email, password });
                }
                // Successful login, navigate to core app
                router.replace('/(tabs)' as any); // Replace with your actual core route
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
                    <Text style={styles.title}>
                        {isAdmin ? 'ADMIN' : 'TEACHER'}
                        <Text style={[styles.highlight, isAdmin && { color: theme.colors.accent }]}>LOGIN</Text>
                    </Text>
                    <Text style={styles.subtitle}>Secure Access Required</Text>
                </View>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, !isAdmin && styles.toggleActive]}
                        onPress={() => setRole('teacher')}
                    >
                        <Text style={[styles.toggleText, !isAdmin && styles.toggleTextActive]}>Teacher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, isAdmin && styles.toggleActiveAdmin]}
                        onPress={() => setRole('admin')}
                    >
                        <Text style={[styles.toggleText, isAdmin && styles.toggleTextActive]}>Admin</Text>
                    </TouchableOpacity>
                </View>

                <GlassCard style={[styles.card, isAdmin ? { borderColor: theme.colors.accent } : {}]}>
                    {errors.api && <Text style={styles.apiError}>{errors.api}</Text>}
                    <TechInput
                        label="Email Address"
                        placeholder={isAdmin ? "admin@learnsync.com" : "teacher@learnsync.com"}
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
                        onPress={handleLogin}
                        disabled={loading}
                        variant={isAdmin ? 'secondary' : 'primary'}
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
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderRadius: theme.borderRadius.sm,
    },
    toggleActive: {
        backgroundColor: theme.colors.primary,
    },
    toggleActiveAdmin: {
        backgroundColor: theme.colors.accent,
    },
    toggleText: {
        ...theme.typography.caption,
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: theme.colors.background,
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
