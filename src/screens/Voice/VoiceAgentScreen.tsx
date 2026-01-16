import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Mic, MicOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VoiceAgentBot } from '../../components/voice/VoiceBotSkia';
import { getVercelColors, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';

const { width, height } = Dimensions.get('window');

export function VoiceAgentScreen() {
    const navigation = useNavigation<any>();
    const { isDarkMode } = useAppTheme();
    const colors = getVercelColors(isDarkMode);

    const [isListening, setIsListening] = useState(false);
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isListening]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Waveform Visualization Placeholder */}
            {/* Voice Bot Bot Animation */}
            <View style={styles.botContainer}>
                <VoiceAgentBot
                    isListening={isListening}
                />
            </View>

            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[
                        styles.micButton,
                        {
                            backgroundColor: isListening ? '#ef4444' : colors.accent,
                            shadowColor: isListening ? '#ef4444' : colors.accent,
                        }
                    ]}
                    onPress={() => setIsListening(!isListening)}
                    activeOpacity={0.8}
                >
                    {isListening ? (
                        <MicOff size={32} color="#FFFFFF" strokeWidth={2} />
                    ) : (
                        <Mic size={32} color="#FFFFFF" strokeWidth={2} />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                    {isListening ? "Listening..." : "Tap to Speak"}
                </Text>
                <Text style={[styles.subText, { color: colors.textSecondary }]}>
                    June AI Voice is ready to help you
                </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.surfaceActive }]}
                onPress={() => navigation.navigate('Home' as any)}
            >
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    controlsContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        zIndex: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: VERCEL_SPACING.xl,
    },
    statusText: {
        fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
        fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
        marginBottom: VERCEL_SPACING.sm,
    },
    subText: {
        fontSize: VERCEL_TYPOGRAPHY.sizes.base,
        fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 30,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
