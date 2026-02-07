import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
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

const EXAMPLE_PROMPTS = [
  '给我写一段给父母的温馨祝福语',
  '我想给领导写一个正式的拜年短信',
  '帮我写一段搞笑的祝福语发给好朋友',
  '写一段适合发给客户的商务祝福语',
];

export default function CustomScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('提示', '请输入您的需求');
      return;
    }

    setLoading(true);
    setResult('');
    Keyboard.dismiss();

    try {
      /**
       * 服务端文件：server/src/routes/blessings.ts
       * 接口：POST /api/v1/blessings/custom
       * Body 参数：prompt: string
       */
      const response = await fetch(buildApiUrl('/api/v1/blessings/custom'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.blessings);
      } else {
        Alert.alert('提示', data.error || '生成失败');
      }
    } catch (error) {
      console.error('Custom blessing error:', error);
      Alert.alert('错误', '网络请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePress = (example: string) => {
    setPrompt(example);
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
              🤖 定制
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary}>
              说出你的需求，生成个性化祝福语
            </ThemedText>
          </ThemedView>

          {/* Prompt Input */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              描述您的需求
            </ThemedText>
            <TextInput
              style={styles.textarea}
              placeholder="例如：给我写一段给父母的温馨祝福语"
              placeholderTextColor={theme.textMuted}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </ThemedView>

          {/* Example Prompts */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              参考示例
            </ThemedText>
            {EXAMPLE_PROMPTS.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleCard}
                onPress={() => handleExamplePress(example)}
              >
                <FontAwesome6
                  name="lightbulb"
                  size={16}
                  color={theme.primary}
                  style={styles.exampleIcon}
                />
                <ThemedText variant="body" color={theme.textSecondary}>
                  {example}
                </ThemedText>
              </TouchableOpacity>
            ))}
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
              {loading ? '生成中...' : 'AI 生成'}
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
