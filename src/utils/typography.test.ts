// Typography System Test
// Validates that all typography variants are properly defined and work with React Native

import { TYPOGRAPHY, TypographyVariant } from '../utils/typography';

// Test function to validate typography system
export const testTypographySystem = () => {
  const variants: TypographyVariant[] = [
    'displayLarge', 'displayMedium', 'displaySmall',
    'headlineLarge', 'headlineMedium', 'headlineSmall',
    'titleLarge', 'titleMedium', 'titleSmall',
    'bodyLarge', 'bodyMedium', 'bodySmall',
    'labelLarge', 'labelMedium', 'labelSmall'
  ];

  const results: { variant: string; valid: boolean; style: any }[] = [];

  variants.forEach(variant => {
    try {
      const style = TYPOGRAPHY[variant];
      // Validate required properties
      const hasFontSize = style && typeof style.fontSize === 'number';
      const hasFontWeight = style && typeof style.fontWeight === 'string';
      const hasFontFamily = style && typeof style.fontFamily === 'string';
      const hasLineHeight = style && typeof style.lineHeight === 'number';

      const valid = hasFontSize && hasFontWeight && hasFontFamily && hasLineHeight;
      
      results.push({
        variant,
        valid,
        style: valid ? style : null
      });
    } catch (error) {
      results.push({
        variant,
        valid: false,
        style: null
      });
    }
  });

  return results;
};

// Export for debugging
export const typographyTestResults = testTypographySystem();

// Log results if in development
if (__DEV__) {
  console.log('🔤 Typography System Test Results:');
  typographyTestResults.forEach(({ variant, valid }) => {
    console.log(`${valid ? '✅' : '❌'} ${variant}`);
  });
}