import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const HERO_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBEA9lPCD_5W7akMXaLxC6ZlQvBqV8Ku62372J9WF2lph9LdSOLkDHiLG-g89B019HDdrh6nu2Kg2iddjBjfumF4JbpITwC1LAbN0ns5Gu_eMkCdW1pSd9SEdqM4ku1eZG4JhGUODasd3IxLFJTk-pii8uc42lagwWDIP8T5y32rsZhGwV-R-3peKLNDco3qq-zssykwSp7O8eG6Yb0Wxtb3LWbbE4OWDYis6iBbZ3Q_G0erPa7GRovH34fJNAuEMXl';

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Utility Bar: Minimalist Logo + Bilingual Toggle */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="local-shipping" size={18} color={Colors.white} />
          </View>
          <View style={styles.brandTitleCol}>
            <Text style={styles.brandTitle}>CargoSync</Text>
            <Text style={styles.brandSub}>FREIGHT HUB</Text>
          </View>
        </View>

        {/* Segmented Multilingual Switcher */}
        <View style={styles.langSegment}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}
            >
              EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
            onPress={() => setLanguage('hi')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.langBtnText, language === 'hi' && styles.langBtnTextActive]}
            >
              हिंदी
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Visual Frame */}
        <View style={styles.heroFrame}>
          <Image
            source={{ uri: HERO_IMAGE_URI }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroVignette} />
        </View>

        {/* Primary Messaging */}
        <View style={styles.headingSection}>
          <Text style={styles.headline}>
            {language === 'hi' ? 'सामान पहुंचाएं। सरलता से।' : 'Move Goods. Simply.'}
          </Text>
          <Text style={styles.subheadline}>
            {language === 'hi'
              ? 'ट्रक खोजें, माल भेजें और डिलीवरी प्रबंधित करें — सब एक ही जगह।'
              : 'Find trucks, move freight and manage deliveries — all in one place.'}
          </Text>
        </View>

        {/* Key Value Props Stack */}
        <View style={styles.propsContainer}>
          {/* Value Prop 1 */}
          <View style={styles.propCard}>
            <View style={styles.propIconBox}>
              <MaterialIcons name="sync-alt" size={24} color={Colors.black} />
            </View>
            <View style={styles.propTextBox}>
              <Text style={styles.propTitle}>
                {language === 'hi' ? 'सही ट्रक खोजें' : 'Find the Right Truck'}
              </Text>
              <Text style={styles.propDesc}>
                {language === 'hi'
                  ? 'अपने शिपमेंट के लिए उपलब्ध ट्रकों से जुड़ें।'
                  : 'Connect with available trucks for your shipment.'}
              </Text>
            </View>
          </View>

          {/* Value Prop 2 */}
          <View style={styles.propCard}>
            <View style={styles.propIconBox}>
              <MaterialIcons name="payments" size={24} color={Colors.black} />
            </View>
            <View style={styles.propTextBox}>
              <Text style={styles.propTitle}>
                {language === 'hi' ? 'स्पष्ट दरें' : 'Clear Pricing'}
              </Text>
              <Text style={styles.propDesc}>
                {language === 'hi'
                  ? 'ट्रक बुक करने से पहले लागत जानें।'
                  : 'Know the cost before booking your truck.'}
              </Text>
            </View>
          </View>

          {/* Value Prop 3 */}
          <View style={styles.propCard}>
            <View style={styles.propIconBox}>
              <MaterialIcons name="pin-drop" size={24} color={Colors.black} />
            </View>
            <View style={styles.propTextBox}>
              <Text style={styles.propTitle}>
                {language === 'hi' ? 'हर ट्रिप ट्रैक करें' : 'Track Every Trip'}
              </Text>
              <Text style={styles.propDesc}>
                {language === 'hi'
                  ? 'पिकअप से डिलीवरी तक अपडेट रहें।'
                  : 'Stay updated from pickup to delivery.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Block */}
        <View style={styles.bottomBlock}>
          <PrimaryButton
            label={language === 'hi' ? 'शुरू करें' : 'Get Started'}
            onPress={() => navigation.navigate('AccountSelection')}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
            style={styles.primaryCta}
          />

          <SecondaryButton
            label={language === 'hi' ? 'पहले से खाता है? लॉग इन करें' : 'Already have an account? Log In'}
            onPress={() => navigation.navigate('Login')}
            size="md"
            style={styles.secondaryCta}
          />

          {/* Legal Compliance */}
          <View style={styles.legalBox}>
            <Text style={styles.legalText}>
              By proceeding, you agree to CargoSync's{' '}
              <Text style={styles.legalLink}>Terms of Service</Text> and acknowledge our{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleCol: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#000000',
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  brandSub: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  langSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  langBtnActive: {
    backgroundColor: '#000000',
  },
  langBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  heroFrame: {
    marginHorizontal: Spacing.margin,
    marginTop: 4,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroVignette: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  headingSection: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headline: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: '#1A1C1C',
    letterSpacing: -0.5,
  },
  subheadline: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#5D5F5F',
    marginTop: 6,
    lineHeight: 20,
  },
  propsContainer: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  propCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  propIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propTextBox: {
    flex: 1,
  },
  propTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#1A1C1C',
    lineHeight: 20,
  },
  propDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    marginTop: 2,
    lineHeight: 18,
  },
  bottomBlock: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    gap: 10,
  },
  primaryCta: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  secondaryCta: {
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
    borderRadius: Radius.xs,
  },
  legalBox: {
    paddingTop: 8,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  legalText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    textAlign: 'center',
    lineHeight: 16,
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontFamily: FontFamily.semiBold,
    color: '#1A1C1C',
  },
});
