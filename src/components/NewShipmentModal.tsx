import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Shipment, CargoType, Priority } from '../types';

interface NewShipmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (shipment: Partial<Shipment>) => void;
}

export default function NewShipmentModal({
  visible,
  onClose,
  onSubmit,
}: NewShipmentModalProps) {
  const { theme } = useTheme();

  const [pickupCity, setPickupCity] = useState('');
  const [destCity, setDestCity] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('general');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deliveryDeadline, setDeliveryDeadline] = useState('Tomorrow, 18:00');

  const handleCreate = () => {
    if (!pickupCity.trim() || !destCity.trim() || !weightKg.trim()) {
      Alert.alert('Required Fields', 'Please fill in pickup city, destination city, and freight weight.');
      return;
    }

    const rawWeight = parseFloat(weightKg) || 0;
    const weightInKg = rawWeight <= 50 ? Math.round(rawWeight * 1000) : Math.round(rawWeight);

    const newShipment: Partial<Shipment> = {
      id: 'CS-' + Math.floor(100 + Math.random() * 900),
      trackingNumber: 'TRK-' + Date.now().toString().slice(-6),
      shipperId: 'SHP-001',
      pickup: { latitude: 28.6139, longitude: 77.209, city: pickupCity },
      destination: { latitude: 26.9124, longitude: 75.7873, city: destCity },
      weight: weightInKg,
      cargoType,
      priority,
      status: 'pending',
      pickupWindow: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
      },
      deliveryDeadline: new Date(Date.now() + 172800000).toISOString(),
      cost: Math.floor(4500 + (weightInKg / 1000) * 1200),
      createdAt: new Date().toISOString(),
    };

    onSubmit(newShipment);
    onClose();
    // Reset
    setPickupCity('');
    setDestCity('');
    setWeightKg('');
  };

  const cargoTypes: CargoType[] = ['general', 'fragile', 'perishable', 'hazardous', 'liquid'];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="cube-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Create New Consignment
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ padding: 20 }}>
            {/* Pickup Location */}
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Pickup Location (City)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="e.g. Sanjay Gandhi Transport Nagar, Delhi"
              placeholderTextColor={theme.colors.textTertiary}
              value={pickupCity}
              onChangeText={setPickupCity}
            />

            {/* Destination Location */}
            <Text style={[styles.label, { color: theme.colors.textPrimary, marginTop: 14 }]}>Delivery Destination (City)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="e.g. VKIA Industrial Area, Jaipur"
              placeholderTextColor={theme.colors.textTertiary}
              value={destCity}
              onChangeText={setDestCity}
            />

            {/* Weight */}
            <Text style={[styles.label, { color: theme.colors.textPrimary, marginTop: 14 }]}>Weight (Tonnes or kg)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="e.g. 2.4 (Tonnes) or 2400 (kg)"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
              value={weightKg}
              onChangeText={setWeightKg}
            />

            {/* Cargo Type */}
            <Text style={[styles.label, { color: theme.colors.textPrimary, marginTop: 14 }]}>Cargo Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {cargoTypes.map((type) => {
                const selected = cargoType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.primary : theme.colors.background,
                        borderColor: selected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                    onPress={() => setCargoType(type)}
                  >
                    <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : theme.colors.textPrimary }]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Priority */}
            <Text style={[styles.label, { color: theme.colors.textPrimary, marginTop: 14 }]}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => {
                const selected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityChip,
                      {
                        backgroundColor: selected ? theme.colors.primary : theme.colors.background,
                        borderColor: selected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : theme.colors.textPrimary }]}>
                      {p.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Submit */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreate}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Post Consignment to CargoSync</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
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
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  priorityChip: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
