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
      height: 380,
      overflow: 'hidden',
      zIndex: -1,
    },
    decorCircle: {
      position: 'absolute',
      borderRadius: 9999,
      opacity: 0.12,
    },
    decorCircle1: {
      width: 220,
      height: 220,
      backgroundColor: '#C8102E', // 中国红
      top: -70,
      right: -60,
      opacity: 0.09,
    },
    decorCircle2: {
      width: 170,
      height: 170,
      backgroundColor: '#D4AF37', // 金色
      top: 70,
      left: -40,
      opacity: 0.15,
    },
    decorCircle3: {
      width: 120,
      height: 120,
      backgroundColor: '#E6A823', // 亮金色
      top: 220,
      right: 30,
      opacity: 0.1,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FEF9F3',
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
      backgroundColor: 'rgba(255, 255, 255, 0.95)', // 半透明白色卡片
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    styleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    styleCard: {
      width: '47%',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 2,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    styleLabel: {
      marginTop: 4,
    },
    festivalGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    festivalCard: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.sm,
      minWidth: 70,
      alignItems: 'center',
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
      lineHeight: 24,
    },
  });
};
