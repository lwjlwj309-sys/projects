import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { buildApiUrl } from '@/utils/api';
import { createStyles } from './styles';

export default function AcrosticScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('成功', '已复制到剪贴板');
  };

  const handleDownloadImage = async (url: string) => {
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = url;
      link.download = `藏头诗海报_${Date.now()}.png`;
      link.target = '_blank';
      link.click();
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能保存图片');
      return;
    }

    try {
      // @ts-ignore
      const { uri } = await (FileSystem as any).downloadAsync(
        url,
        `${(FileSystem as any).cacheDirectory}acrostic_${Date.now()}.png`
      );
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('成功', '图片已保存到相册');
    } catch (error) {
      console.error('Download image error:', error);
      Alert.alert('错误', '下载失败，请稍后重试');
    }
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      Alert.alert('提示', '请输入关键词');
      return;
    }

    if (keyword.trim().length < 2) {
      Alert.alert('提示', '关键词至少需要2个字');
      return;
    }

    setLoading(true);
    setResult('');
    setImageUrl('');
    Alert.alert('提示', '精美海报正在生成中，感谢支持！');

    try {
      /**
       * 服务端文件：server/src/routes/blessings.ts
       * 接口：POST /api/v1/blessings/acrostic
       * Body 参数：keyword: string
       */
      const response = await fetch(buildApiUrl('/api/v1/blessings/acrostic'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.acrostic);
        setImageUrl(data.imageUrl || '');
      } else {
        Alert.alert('提示', data.error || '生成失败');
      }
    } catch (error) {
      console.error('Generate acrostic error:', error);
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
              📝 个性藏头诗
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary}>
              拒绝千篇一律，属于你的专属祝福语
            </ThemedText>
          </ThemedView>

          {/* Keyword Input */}
          <ThemedView level="root" style={styles.section}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
              输入关键词
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="请输入关键词（至少2个字）"
              placeholderTextColor={theme.textMuted}
              value={keyword}
              onChangeText={setKeyword}
              maxLength={10}
            />
          </ThemedView>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: theme.primary }]}
            onPress={handleGenerate}
            disabled={loading}
          >
            <FontAwesome6
              name="pen-fancy"
              size={20}
              color={theme.buttonPrimaryText}
              style={styles.buttonIcon}
            />
            <ThemedText variant="label" color={theme.buttonPrimaryText}>
              {loading ? '创作中...' : '生成藏头诗'}
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
                  onPress={() => handleCopy(result)}
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
              {imageUrl ? (
                <ThemedView level="default" style={styles.imageCard}>
                  <View style={styles.imageHeader}>
                    <ThemedText variant="caption" color={theme.textSecondary} style={styles.imageTitle}>
                      精美海报
                    </ThemedText>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
                      onPress={() => handleDownloadImage(imageUrl)}
                    >
                      <FontAwesome6 name="download" size={16} color={theme.primary} />
                      <ThemedText variant="caption" color={theme.primary} style={styles.actionButtonText}>
                        下载
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.resultImage}
                    resizeMode="contain"
                  />
                </ThemedView>
              ) : null}
            </ThemedView>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
