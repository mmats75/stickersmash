import { View, StyleSheet, Platform, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useState, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import { type ImageSource } from 'expo-image'
import { captureRef } from 'react-native-view-shot'
// import domtoimage from 'dom-to-image'

import Button from '@/components/Button'
import ImageViewer from '@/components/ImageViewer'
import IconButton from '@/components/IconButton'
import CircleButton from '@/components/CircleButton'
import EmojiPicker from '@/components/EmojiPicker'
import EmojiList from '@/components/EmojiList'
import EmojiSticker from '@/components/EmojiSticker'

const PlaceholderImage = require('@/assets/images/background-image.png')

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined)
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const imageRef = useRef<View>(null)

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert('You did not select any image.')
    }
  }

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  // Conditionally import libraries based on platform
  // const getDependencies = async () => {
  //   if (Platform.OS === 'web') {
  //     // For web browser
  //     return import('dom-to-image')
  //   } else {
  //     // For native (iOS/Android)
  //     return import('react-native-view-shot')
  //   }
  // }

  const onSaveImageAsync = async () => {
    if (!imageRef.current) {
      console.log('Image ref is not valid')
      return
    }

    if (Platform.OS !== 'web') {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for rendering
        // const { captureRef } = await getDependencies()
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
          format: 'png',
        })

        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) {
          alert('Saved!')
        }
      } catch (e) {
        console.log('Failed to capture view:', e)
      }
    } else {
      try {
        // const domtoimage = await getDependencies()
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })

        let link = document.createElement('a')
        link.download = 'sticker-smash.jpeg'
        link.href = dataUrl
        link.click()
      } catch (e) {
        console.log('Failed to save image on web:', e)
      }
    }
  }

  if (status === null) {
    requestPermission()
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        {/* <View ref={imageRef} collapsable={false} style={{ width: 320, height: 440, backgroundColor: 'white' }}>
          <Text>Test</Text>
        </View> */}

        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },

  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
