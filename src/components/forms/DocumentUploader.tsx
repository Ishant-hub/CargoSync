import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontFamily, Radius, Spacing, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export interface UploadedFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

interface DocumentUploaderProps {
  label: string;
  hint?: string;
  value?: UploadedFile;
  onChange: (file: UploadedFile | undefined) => void;
  accept?: ('pdf' | 'image')[];
  required?: boolean;
  style?: ViewStyle;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  hint,
  value,
  onChange,
  accept = ['pdf', 'image'],
  required,
  style,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: accept.includes('pdf') && accept.includes('image')
          ? ['application/pdf', 'image/*']
          : accept.includes('pdf')
          ? ['application/pdf']
          : ['image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onChange({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType ?? undefined,
          size: asset.size ?? undefined,
        });
      }
    } catch (e) {
      // User cancelled or error
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => onChange(undefined);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>

      {value ? (
        <View style={styles.filePreview}>
          <View style={styles.fileIconWrap}>
            <MaterialIcons
              name={value.mimeType?.includes('pdf') ? 'picture-as-pdf' : 'image'}
              size={24}
              color={Colors.primaryAmber}
            />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text>
            {value.size && (
              <Text style={styles.fileSize}>{formatSize(value.size)}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="close" size={16} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePick}
          style={styles.uploadBtn}
          activeOpacity={0.7}
          disabled={loading}
        >
          <MaterialIcons
            name="cloud-upload"
            size={24}
            color={loading ? Colors.placeholder : Colors.primaryAmber}
          />
          <Text style={styles.uploadText}>
            {loading ? 'Uploading...' : t.tapToUpload}
          </Text>
          <Text style={styles.uploadHint}>
            {accept.includes('pdf') && accept.includes('image') ? 'PDF or Image' : accept.join(' / ').toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}

      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

// ─── PHOTO PROOF PICKER (for Proof of Delivery) ───────────────────────────────

interface PhotoProofPickerProps {
  label: string;
  value?: string; // URI
  onChange: (uri: string | undefined) => void;
  style?: ViewStyle;
}

export const PhotoProofPicker: React.FC<PhotoProofPickerProps> = ({
  label, value, onChange, style,
}) => {
  const handlePick = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      // Try gallery fallback
      const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPerm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
      });
      if (!result.canceled) onChange(result.assets[0].uri);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.8,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      {value ? (
        <View style={styles.photoPreview}>
          <Image source={{ uri: value }} style={styles.photoImg} resizeMode="cover" />
          <TouchableOpacity
            onPress={() => onChange(undefined)}
            style={styles.photoRemove}
          >
            <MaterialIcons name="close" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handlePick} style={styles.photoBtn} activeOpacity={0.7}>
          <MaterialIcons name="camera-alt" size={28} color={Colors.primaryAmber} />
          <Text style={styles.uploadText}>Take Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.onSurface,
  },
  required: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.error,
  },
  uploadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.xl,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  uploadText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  uploadHint: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  fileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fileInfo: { flex: 1 },
  fileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.onSurface,
  },
  fileSize: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.muted,
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
    flexShrink: 0,
  },
  hint: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },

  // Photo
  photoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.xl,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  photoPreview: {
    position: 'relative',
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: 160,
    borderRadius: Radius.sm,
  },
  photoRemove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

