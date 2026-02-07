import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing['5xl'],
      backgroundColor: 'linear-gradient(180deg, #FFF8F0 0%, #FEF9F3 100%)',
      position: 'relative',
    },
    backgroundDecoration: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 350,
      overflow: 'hidden',
      zIndex: -1,
    },
    decorCircle: {
      position: 'absolute',
      borderRadius: 9999,
      opacity: 0.12,
    },
    decorCircle1: {
      width: 200,
      height: 200,
      backgroundColor: '#C8102E', // 中国红
      top: -60,
      left: -50,
      opacity: 0.08,
    },
    decorCircle2: {
      width: 160,
      height: 160,
      backgroundColor: '#D4AF37', // 金色
      top: 50,
      right: -30,
      opacity: 0.15,
    },
    decorCircle3: {
      width: 100,
      height: 100,
      backgroundColor: '#E6A823', // 亮金色
      top: 180,
      left: 20,
      opacity: 0.1,
    },
    header: {
      marginBottom: Spacing.xl,
      alignItems: 'center',
      paddingTop: Spacing.md,
    },
    title: {
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    section: {
      marginBottom: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    input: {
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      fontSize: 16,
      borderWidth: 1.5,
      borderColor: '#F5E6D8',
      backgroundColor: '#FFFFFF',
    },
    generateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing['2xl'],
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonIcon: {
      marginRight: Spacing.sm,
    },
    resultSection: {
      marginBottom: 0,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.sm,
      gap: 4,
    },
    actionButtonText: {
      marginLeft: 4,
    },
    resultCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: '#F5E6D8',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
    resultText: {
      lineHeight: 26,
      textAlign: 'center',
    },
    imageCard: {
      marginTop: Spacing.md,
      padding: Spacing.lg,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: '#F5E6D8',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
    imageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    imageTitle: {
      marginBottom: 0,
    },
    resultImage: {
      width: '100%',
      height: 300,
      borderRadius: BorderRadius.sm,
    },
  });
};
