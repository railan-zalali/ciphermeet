import { Platform, Alert } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker';

type MediaSource = 'camera' | 'gallery';

interface MediaResult {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
}

export const pickMedia = async (source: MediaSource): Promise<MediaResult | null> => {
  const options = {
    mediaType: 'photo' as const,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1920,
    selectionLimit: 1,
  };

  try {
    let response: ImagePickerResponse;

    if (source === 'camera') {
      response = await launchCamera({ ...options, saveToPhotos: false });
    } else {
      response = await launchImageLibrary(options);
    }

    if (response.didCancel) return null;
    
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to pick media');
      return null;
    }

    const asset = response.assets?.[0];
    if (!asset || !asset.uri) return null;

    return {
      uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
      type: asset.type || 'image/jpeg',
      name: asset.fileName || `photo_${Date.now()}.jpg`,
      fileSize: asset.fileSize,
    };

  } catch (error) {
    console.error('Media picker error:', error);
    Alert.alert('Error', 'An unexpected error occurred while picking media');
    return null;
  }
};
