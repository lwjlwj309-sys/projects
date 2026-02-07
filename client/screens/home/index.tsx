import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { buildApiUrl } from '@/utils/api';
import { createStyles } from './styles';

const STYLE_OPTIONS = [
  { id: 'dachang', label: '废话文学', icon: 'building', color: '#2D3748' },
  { id: 'saibo', label: '赛博科幻', icon: 'microchip', color: '#00D4FF' },
  { id: 'fakuang', label: '发疯文学', icon: 'face-grin-squint-tears', color: '#FF6B6B' },
  { id: 'jijian', label: '极简风', icon: 'minus', color: '#718096' },
  { id: 'gaoqing', label: '高情商', icon: 'handshake', color: '#48BB78' },
  { id: 'foxi', label: '佛系躺平', icon: 'spa', color: '#38B2AC' },
  { id: 'shangwu', label: '职场商务', icon: 'briefcase', color: '#2C5282' },
  { id: 'baofu', label: '暴富直球', icon: 'coins', color: '#F6E05E' },
];

const FESTIVAL_OPTIONS = [
  { id: 'xiaonian', label: '小年' },
  { id: 'chuxi', label: '除夕' },
  { id: 'chuyi', label: '初一' },
  { id: 'chuer', label: '初二' },
  { id: 'chusan', label: '初三' },
  { id: 'chusi', label: '初四' },
  { id: 'chuwu', label: '初五' },
  { id: 'chuliu', label: '初六' },
  { id: 'chuqi', label: '初七' },
  { id: 'chuba', label: '初八' },
  { id: 'yuanxiao', label: '元宵' },
];

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  const [selectedStyle, setSelectedStyle] = useState('dachang');
  const [selectedFestival, setSelectedFestival] = useState('chuyi');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    try {
      /**
       * 服务端文件：server/src/routes/blessings.ts
       * 接口：POST /api/v1/blessings/generate
       * Body 参数：style: string, festival: string, recipient?: string
       */
      const response = await fetch(buildApiUrl('/api/v1/blessings/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: selectedStyle,
          festival: selectedFestival,
          recipient: recipient.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.blessings);
      } else {
        Alert.alert('提示', data.error || '生成失败');
      }
    } catch (error) {
      console.error('Generate error:', error);
      Alert.alert('错误', '网络请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Background Decorations */}
          <View style={styles.backgroundDecoration}>
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />
          </View>

          {/* Header */}
          <ThemedView level="root" style={styles.header}>
            <ThemedText variant="h1" color={theme.textPrimary} style={styles.title}>
              🎉 祝福语拜年啦
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary}>
              选择风格和节日，一键生成专属祝福语
            </ThemedText>
          </ThemedView>

          {/* Style Selection */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              选择风格
            </ThemedText>
            <View style={[styles.styleGrid, { gap: 12 }]}>
              {STYLE_OPTIONS.map((option) => {
                const isSelected = selectedStyle === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.styleCard,
                      {
                        backgroundColor: isSelected ? option.color + '15' : theme.backgroundTertiary,
                        borderColor: isSelected ? option.color : 'transparent',
                      },
                    ]}
                    onPress={() => setSelectedStyle(option.id)}
                  >
                    <FontAwesome6
                      name={option.icon as any}
                      size={28}
                      color={isSelected ? option.color : theme.textMuted}
                    />
                    <ThemedText
                      variant="smallMedium"
                      color={isSelected ? option.color : theme.textSecondary}
                      style={styles.styleLabel}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ThemedView>

          {/* Festival Selection */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              选择节日
            </ThemedText>
            <View style={[styles.festivalGrid, { gap: 8 }]}>
              {FESTIVAL_OPTIONS.map((option) => {
                const isSelected = selectedFestival === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.festivalCard,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.backgroundTertiary,
                      },
                    ]}
                    onPress={() => setSelectedFestival(option.id)}
                  >
                    <ThemedText
                      variant="smallMedium"
                      color={isSelected ? theme.buttonPrimaryText : theme.textSecondary}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ThemedView>

          {/* Recipient Input */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              收件人（选填）
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="输入收件人姓名，如：张三"
              placeholderTextColor={theme.textMuted}
              value={recipient}
              onChangeText={setRecipient}
            />
          </ThemedView>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: theme.primary }]}
            onPress={handleGenerate}
            disabled={loading}
          >
            <FontAwesome6
              name="wand-magic-sparkles"
              size={20}
              color={theme.buttonPrimaryText}
              style={styles.buttonIcon}
            />
            <ThemedText variant="label" color={theme.buttonPrimaryText}>
              {loading ? '生成中...' : '生成祝福语'}
            </ThemedText>
          </TouchableOpacity>

          {/* Result */}
          {result ? (
            <ThemedView level="root" style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <ThemedText variant="h3" color={theme.textPrimary}>
                  生成结果
                </ThemedText>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
                  onPress={async () => {
                    await Clipboard.setStringAsync(result);
                    Alert.alert('成功', '祝福语已复制到剪贴板');
                  }}
                >
                  <FontAwesome6 name="copy" size={16} color={theme.primary} />
                  <ThemedText variant="caption" color={theme.primary} style={styles.actionButtonText}>
                    复制
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedView level="default" style={styles.resultCard}>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.resultText}>
                  {result}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
