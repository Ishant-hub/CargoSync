import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { UserRole } from '../types';
import {
  queryAssistant,
  getQuickSuggestionsForRole,
  AssistantMessage,
} from '../services/assistantService';

interface AssistantModalProps {
  visible: boolean;
  onClose: () => void;
  role: UserRole;
  onSelectAction?: (actionType: string, payload: any) => void;
}

export default function AssistantModal({
  visible,
  onClose,
  role,
  onSelectAction,
}: AssistantModalProps) {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `👋 **CargoSync AI Assistant** active for **${
        role === 'driver' ? 'Driver Operations' : role === 'shipper' ? 'Shipper Console' : 'Fleet Dispatch'
      }**.\n\nAsk me about live ETAs, payload capacity, stop manifests, or request dynamic re-routing!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickSuggestions = getQuickSuggestionsForRole(role);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AssistantMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      const response = queryAssistant(role, query);
      setMessages((prev) => [...prev, response]);
    }, 400);
  };

  const handleActionButton = (msg: AssistantMessage) => {
    if (!msg.actionButton) return;
    onClose();
    if (onSelectAction) {
      onSelectAction(msg.actionButton.actionType, msg.actionButton.payload);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <View style={[styles.modalCard, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.aiBadge, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
                  CargoSync AI Assistant
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                  Real-time freight intelligence
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.msgBubbleContainer,
                    isUser ? styles.msgRight : styles.msgLeft,
                  ]}
                >
                  <View
                    style={[
                      styles.msgBubble,
                      isUser
                        ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
                        : [styles.assistantBubble, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        { color: isUser ? '#FFFFFF' : theme.colors.textPrimary },
                      ]}
                    >
                      {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </Text>
                    <Text
                      style={[
                        styles.msgTime,
                        { color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary },
                      ]}
                    >
                      {msg.timestamp}
                    </Text>

                    {/* Optional Action Button inside assistant bubble */}
                    {!isUser && msg.actionButton && (
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => handleActionButton(msg)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>{msg.actionButton.label}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Quick Suggestions Chips */}
          <View style={[styles.suggestionsContainer, { borderTopColor: theme.colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {quickSuggestions.map((sug, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.suggestionChip,
                    { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                  ]}
                  onPress={() => handleSend(sug)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={14} color={theme.colors.primary} />
                  <Text style={[styles.suggestionText, { color: theme.colors.textPrimary }]}>
                    {sug}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Box */}
          <View style={[styles.inputRow, { borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Ask AI assistant..."
              placeholderTextColor={theme.colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputText.trim()
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  msgBubbleContainer: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  msgLeft: {
    alignSelf: 'flex-start',
  },
  msgRight: {
    alignSelf: 'flex-end',
  },
  msgBubble: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    borderColor: 'transparent',
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionsContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
