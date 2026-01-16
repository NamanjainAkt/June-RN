import {
    Canvas,
    Circle,
    Group,
    Path,
    RadialGradient,
    Skia,
    SweepGradient,
    vec
} from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
    Easing,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface VoiceAgentBotProps {
    isListening: boolean;
    size?: number;
}

export const VoiceAgentBot: React.FC<VoiceAgentBotProps> = ({ isListening, size: propSize }) => {
    const { width: windowWidth } = useWindowDimensions();
    const size = propSize || windowWidth * 0.8;
    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.3;

    // Animation values
    const time = useSharedValue(0);
    const eyeScale = useSharedValue(1);

    useEffect(() => {
        time.value = withRepeat(
            withTiming(Math.PI * 2, { duration: 4000, easing: Easing.linear }),
            -1,
            false
        );

        // Blinking mechanism
        const blink = () => {
            eyeScale.value = withSequence(
                withTiming(0, { duration: 100 }),
                withTiming(1, { duration: 100 })
            );
            const nextBlink = 2000 + Math.random() * 3500;
            setTimeout(blink, nextBlink);
        };

        const timeout = setTimeout(blink, 2500);
        return () => clearTimeout(timeout);
    }, []);

    // Compute values for the orb
    const orbScale = useDerivedValue(() => {
        return 1 + Math.sin(time.value * 2) * 0.02;
    });

    const hue = useDerivedValue(() => {
        return 320 + Math.sin(time.value * 0.5) * 20;
    });

    const orbRadius = useDerivedValue(() => baseRadius * orbScale.value);

    // Waveform logic
    const waveformPath = useDerivedValue(() => {
        if (!isListening) return Skia.Path.Make();
        const path = Skia.Path.Make();
        const waveCount = 40;
        const waveRadius = orbRadius.value * 1.3;

        for (let i = 0; i < waveCount; i++) {
            const angle = (i / waveCount) * Math.PI * 2;
            const waveHeight = Math.abs(Math.sin(time.value * 10 + i * 0.3)) * 35;
            const x1 = centerX + Math.cos(angle) * waveRadius;
            const y1 = centerY + Math.sin(angle) * waveRadius;
            const x2 = centerX + Math.cos(angle) * (waveRadius + waveHeight);
            const y2 = centerY + Math.sin(angle) * (waveRadius + waveHeight);

            path.moveTo(x1, y1);
            path.lineTo(x2, y2);
        }
        return path;
    });

    // Eyes logic
    const eyeHeight = 85;
    const eyeWidth = 28;
    const eyeSpacing = 50;

    return (
        <View style={styles.container}>
            <Canvas style={{ width: size, height: size }}>
                {/* Outer Glow */}
                <Group>
                    <Circle cx={centerX} cy={centerY} r={baseRadius * 1.6}>
                        <RadialGradient
                            c={vec(centerX, centerY)}
                            r={baseRadius * 1.6}
                            colors={['rgba(219, 39, 119, 0.4)', 'rgba(190, 24, 93, 0.2)', 'rgba(0, 0, 0, 0)']}
                        />
                    </Circle>
                </Group>

                {/* Main Orb */}
                <Circle cx={centerX} cy={centerY} r={orbRadius}>
                    <RadialGradient
                        c={vec(centerX, centerY)}
                        r={orbRadius}
                        colors={[
                            '#ff7eb9', // hlsa(340, 100%, 70%)
                            '#db2777', // hsla(320, 100%, 55%)
                            '#be185d', // hsla(310, 95%, 45%)
                            '#6d113c', // hsla(290, 90%, 30%)
                        ]}
                    />
                </Circle>

                {/* Highlight */}
                <Circle
                    cx={useDerivedValue(() => centerX - orbRadius.value * 0.35)}
                    cy={useDerivedValue(() => centerY - orbRadius.value * 0.35)}
                    r={useDerivedValue(() => orbRadius.value * 0.7)}
                >
                    <RadialGradient
                        c={useDerivedValue(() => vec(centerX - orbRadius.value * 0.35, centerY - orbRadius.value * 0.35))}
                        r={useDerivedValue(() => orbRadius.value * 0.7)}
                        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 200, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                    />
                </Circle>

                {/* Glass Rim Reflection */}
                <Circle cx={centerX} cy={centerY} r={orbRadius}>
                    <RadialGradient
                        c={vec(centerX, centerY)}
                        r={orbRadius}
                        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(200, 200, 255, 0.3)', 'rgba(150, 150, 200, 0.5)']}
                        positions={[0, 0.8, 0.9, 1]}
                    />
                </Circle>

                {/* Outer Rim Stroke */}
                <Circle cx={centerX} cy={centerY} r={orbRadius} style="stroke" strokeWidth={1} color="rgba(255, 255, 255, 0.15)" />

                {/* Eyes */}
                <Group>
                    {[-1, 1].map((side) => {
                        const eyeX = centerX + eyeSpacing * side;
                        const eyeY = centerY - 25;

                        return (
                            <Group key={`eye-${side}`}>
                                {/* Eye Glow */}
                                <Circle cx={eyeX} cy={eyeY} r={eyeWidth * 1.5}>
                                    <RadialGradient
                                        c={vec(eyeX, eyeY)}
                                        r={eyeWidth * 1.5}
                                        colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                                    />
                                </Circle>

                                {/* Eye Body */}
                                <Group>
                                    <Path
                                        path={useDerivedValue(() => {
                                            const currentHeight = Math.max(2, eyeHeight * eyeScale.value);
                                            const path = Skia.Path.Make();
                                            const r = eyeWidth / 2;
                                            if (eyeScale.value < 0.15) {
                                                // Blinking line
                                                path.moveTo(eyeX - eyeWidth, eyeY);
                                                path.lineTo(eyeX + eyeWidth, eyeY);
                                            } else {
                                                const rect = { x: eyeX - r, y: eyeY - currentHeight / 2, width: eyeWidth, height: currentHeight };
                                                path.addRRect(Skia.RRectXY(rect, r, r));
                                            }
                                            return path;
                                        })}
                                        color="rgba(255, 255, 255, 0.95)"
                                        style={useDerivedValue(() => eyeScale.value < 0.15 ? "stroke" : "fill")}
                                        strokeWidth={3}
                                    />
                                </Group>
                            </Group>
                        );
                    })}
                </Group>

                {/* Waveform */}
                <Group>
                    <Path
                        path={waveformPath}
                        style="stroke"
                        strokeWidth={2.5}
                        strokeCap="round"
                    >
                        <SweepGradient
                            c={vec(centerX, centerY)}
                            colors={['#ff7eb9', '#ffb1d9', '#ff7eb9']}
                        />
                    </Path>
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
