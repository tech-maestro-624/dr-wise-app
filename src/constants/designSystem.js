// Dr. Wise App Design System
// Consistent colors, typography, and styling patterns

export const Colors = {
  // Primary Purple Gradient
  primaryGradient: ['#8B5CF6', '#A855F7', '#9333EA'],
  primaryPurple: '#8B5CF6',
  primaryPurpleLight: '#A855F7',
  primaryPurpleDark: '#9333EA',
  
  // Background Colors
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  inputBackground: '#F9FAFB',
  
  // Text Colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textWhite: '#FFFFFF',
  textError: '#EF4444',
  textSuccess: '#10B981',
  
  // Border Colors
  borderDefault: '#E5E7EB',
  borderError: '#EF4444',
  borderSuccess: '#10B981',
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Icon Background Colors
  iconBgPurple: '#F3E8FF',
  iconBgYellow: '#FFF8E1',
  iconBgGreen: '#F0FDF4',
  iconBgRed: '#FEF2F2',

  // Referral Screen Specific
  referralCardBg: '#FBFBFB',
  referralCodeText: '#1A1B20',
  referralLabelText: '#7D7D7D',
  primaryButtonPurple: '#8F31F9',
};

export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 20,
    normal: 24,
    relaxed: 28,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const BorderRadius = {
  sm: 8,
  base: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  referralCard: {
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
};

// Common Style Patterns
export const CommonStyles = {
  // Headers
  headerSection: {
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textWhite,
    marginBottom: 8,
  },
  
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  // Cards
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
    marginBottom: Spacing.lg,
  },
  
  formCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
    marginBottom: Spacing['3xl'],
  },
  
  // Buttons
  primaryButton: {
    borderRadius: BorderRadius.base,
    ...Shadows.button,
  },
  
  primaryButtonGradient: {
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
  },
  
  primaryButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textWhite,
  },
  
  // Inputs
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.inputBackground,
  },
  
  textInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  
  // Safe Area and Container
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  contentSection: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.lg,
  },
};



